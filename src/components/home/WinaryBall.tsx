import { useEffect, useState } from 'react';
import { Clock, Trophy, Users, Ticket, AlertCircle } from 'lucide-react';
import { api } from '../../services/Api';
import type { DashboardAPI, JackpotPoolAPI, LotteryAPI, LotteryStateAPI } from '../../services/Api';

interface JackpotData {
  hourlyJackpot: number;
  dailyJackpot: number;
  nextHourlyDraw: string;
  nextDailyDraw: string;
  totalParticipants: number;
  totalTickets: number;
  lastUpdated: string;
  isSystemHealthy: boolean;
}

export default function WinaryBall() {
  const [jackpotData, setJackpotData] = useState<JackpotData>({
    hourlyJackpot: 0,
    dailyJackpot: 0,
    nextHourlyDraw: '',
    nextDailyDraw: '',
    totalParticipants: 0,
    totalTickets: 0,
    lastUpdated: '',
    isSystemHealthy: true
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [solPrice, setSolPrice] = useState(100);

  // 🔹 FONCTION POUR CALCULER LA PROCHAINE HEURE (basée sur l'heure actuelle)
  const getNextHourlyDraw = (): string => {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1, 0, 0, 0);
    return nextHour.toISOString();
  };

  // 🔹 FONCTION POUR CALCULER LE PROCHAIN TIRAGE QUOTIDIEN (12h NY comme dans tasks.py)
  const getNextDailyDraw = (): string => {
    const now = new Date();
    // Convertir vers NY timezone pour calculer correctement
    const nyTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
    const nextDay = new Date(nyTime);
    
    // Si on est avant 12h NY aujourd'hui, le prochain tirage est à 12h NY aujourd'hui
    if (nyTime.getHours() < 12) {
      nextDay.setHours(12, 0, 0, 0);
    } else {
      // Sinon, c'est demain à 12h NY
      nextDay.setDate(nyTime.getDate() + 1);
      nextDay.setHours(12, 0, 0, 0);
    }
    
    return nextDay.toISOString();
  };

  // 🔹 FONCTION POUR FORMATER L'HEURE EN NEW YORK TIME
  const formatTimeInNY = (isoString: string): string => {
    if (!isoString) return 'Loading...';
    
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      timeZone: "America/New_York",
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // 🔹 FONCTION POUR FORMATER LA DATE EN NEW YORK TIME
  const formatDateInNY = (isoString: string): string => {
    if (!isoString) return 'Tomorrow at 12:00 PM ET';
    
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      timeZone: "America/New_York",
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }) + ' ET';
  };

  // 🔹 RÉCUPÉRER LE PRIX SOL
  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        const data = await response.json();
        setSolPrice(data.solana.usd);
      } catch (error) {
        console.error('Error fetching SOL price:', error);
      }
    };
    fetchSolPrice();
    const priceInterval = setInterval(fetchSolPrice, 5 * 60 * 1000);
    return () => clearInterval(priceInterval);
  }, []);

  // 🔹 FONCTION PRINCIPALE POUR RÉCUPÉRER LES DONNÉES
  const fetchJackpotData = async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
      }
      setError(null);

      // ✅ Récupérer les données depuis les endpoints disponibles
      const [dashboardData, jackpotPools, upcomingLotteries, lotteryState] = await Promise.all([
        api.getDashboard().catch(() => null),
        api.getCurrentPools().catch(() => []),
        api.getUpcomingLotteries().catch(() => []),
        api.getLotteryState().catch(() => null)
      ]);

      console.log('🔹 Dashboard data:', dashboardData);
      console.log('🔹 Jackpot pools:', jackpotPools);
      console.log('🔹 Lottery state:', lotteryState);

      // ✅ Traiter les données
      const dashboard: DashboardAPI | null = dashboardData;
      const pools: JackpotPoolAPI[] = Array.isArray(jackpotPools) ? jackpotPools : [];
      const lotteries: LotteryAPI[] = Array.isArray(upcomingLotteries) ? upcomingLotteries : [];
      const state: LotteryStateAPI | null = lotteryState;

      // ✅ Récupérer les pools par type
      const hourlyPool = pools.find((pool: JackpotPoolAPI) => pool.lottery_type === 'hourly');
      const dailyPool = pools.find((pool: JackpotPoolAPI) => pool.lottery_type === 'daily');

      // ✅ Récupérer les prochains tirages
      const nextHourlyLottery = lotteries.find((lottery: LotteryAPI) =>
        lottery.lottery_type === 'hourly' && lottery.status === 'pending'
      );
      const nextDailyLottery = lotteries.find((lottery: LotteryAPI) =>
        lottery.lottery_type === 'daily' && lottery.status === 'pending'
      );

      // ✅ Utiliser les données de l'état blockchain si disponible, sinon les pools
      const hourlyJackpot = state?.hourly_jackpot_sol 
        ? parseFloat(state.hourly_jackpot_sol)
        : parseFloat(hourlyPool?.current_amount_sol || '0');
        
      const dailyJackpot = state?.daily_jackpot_sol
        ? parseFloat(state.daily_jackpot_sol)
        : parseFloat(dailyPool?.current_amount_sol || '0');

      const totalParticipants = state?.total_participants 
        || dashboard?.stats?.total_participants 
        || 0;
        
      const totalTickets = state?.total_tickets 
        || dashboard?.stats?.active_tickets 
        || 0;

      // ✅ Calculer les prochains tirages basés sur l'heure actuelle
      const nextHourlyTime = nextHourlyLottery?.scheduled_time || getNextHourlyDraw();
      const nextDailyTime = nextDailyLottery?.scheduled_time || getNextDailyDraw();

      // ✅ Vérifier la santé du système
      const isSystemHealthy = state ? (!state.is_paused && !state.emergency_stop) : true;

      setJackpotData({
        hourlyJackpot,
        dailyJackpot,
        nextHourlyDraw: nextHourlyTime,
        nextDailyDraw: nextDailyTime,
        totalParticipants,
        totalTickets,
        lastUpdated: new Date().toISOString(),
        isSystemHealthy
      });

    } catch (error) {
      console.error('🔹 Error fetching jackpot data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch jackpot data');
      
      // ✅ En cas d'erreur, utiliser des valeurs par défaut
      setJackpotData(prev => ({
        ...prev,
        nextHourlyDraw: prev.nextHourlyDraw || getNextHourlyDraw(),
        nextDailyDraw: prev.nextDailyDraw || getNextDailyDraw(),
        lastUpdated: new Date().toISOString(),
        isSystemHealthy: false
      }));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Charger les données au montage et toutes les 30 secondes
  useEffect(() => {
    fetchJackpotData();
    
    // Synchroniser avec les tâches Celery (30 secondes)
    const interval = setInterval(() => fetchJackpotData(true), 30000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Countdown en temps réel
  useEffect(() => {
    const updateCountdown = () => {
      const targetTime = jackpotData.nextHourlyDraw || getNextHourlyDraw();
      
      const now = new Date().getTime();
      const drawTime = new Date(targetTime).getTime();
      const difference = drawTime - now;

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ hours, minutes, seconds });
      } else {
        // Si le temps est écoulé, calculer la prochaine heure
        const nextHour = getNextHourlyDraw();
        setJackpotData(prev => ({ ...prev, nextHourlyDraw: nextHour }));
        
        // Déclencher une mise à jour des données
        fetchJackpotData(true);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [jackpotData.nextHourlyDraw]);

  // ✅ Fonction de rafraîchissement manuel
  const handleRefresh = () => {
    fetchJackpotData(true);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-white/20 rounded mb-8 w-96 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/10 rounded-xl p-6 h-64"></div>
              <div className="bg-white/10 rounded-xl p-6 h-64"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-semibold text-red-200">Error Loading Jackpot Data</h3>
            </div>
            <p className="text-red-300 text-sm mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
            🎰 Winary Ball Lottery
          </h1>
          
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Two chances to win every day! Hourly draws for quick wins, daily draws for bigger prizes.
          </p>
          
          {/* System Status */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              jackpotData.isSystemHealthy 
                ? 'bg-green-500/20 text-green-300' 
                : 'bg-red-500/20 text-red-300'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                jackpotData.isSystemHealthy ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
              {jackpotData.isSystemHealthy ? 'System Online' : 'System Issues'}
            </div>
            
            <p className="text-sm text-blue-300">
              All times in Eastern Time (ET) • SOL: ${solPrice.toFixed(2)}
            </p>
          </div>
          
          {jackpotData.lastUpdated && (
            <p className="text-xs text-blue-400 mt-2">
              Last updated: {formatTimeInNY(jackpotData.lastUpdated)} ET
            </p>
          )}
        </div>

        {/* Jackpot Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                   {/* Hourly Jackpot */}
                   <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-yellow-400" />
              <h2 className="text-2xl font-bold">Hourly Draw</h2>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-blue-200 mb-2">Current Jackpot</p>
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {jackpotData.hourlyJackpot.toFixed(4)} SOL
              </div>
              <p className="text-sm text-blue-200">
                ≈ ${(jackpotData.hourlyJackpot * solPrice).toFixed(2)} USD
              </p>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-200 mb-2">Next Draw In:</p>
              <div className="flex gap-2 text-2xl font-mono font-bold justify-center">
                <span className="bg-white/20 px-3 py-2 rounded">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </span>
                <span className="flex items-center">:</span>
                <span className="bg-white/20 px-3 py-2 rounded">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </span>
                <span className="flex items-center">:</span>
                <span className="bg-white/20 px-3 py-2 rounded">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-2 text-center">
                Hours : Minutes : Seconds
              </p>
              
              <div className="mt-2 text-xs text-blue-300 text-center">
                Next draw: {formatTimeInNY(jackpotData.nextHourlyDraw)} ET
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-blue-200">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{jackpotData.totalParticipants.toLocaleString()} Players</span>
              </div>
              <div className="flex items-center gap-1">
                <Ticket className="w-4 h-4" />
                <span>{jackpotData.totalTickets.toLocaleString()} Tickets</span>
              </div>
            </div>
          </div>

          {/* Daily Jackpot */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-orange-400" />
              <h2 className="text-2xl font-bold">Daily Draw</h2>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-blue-200 mb-2">Current Jackpot</p>
              <div className="text-4xl font-bold text-orange-400 mb-2">
                {jackpotData.dailyJackpot.toFixed(4)} SOL
              </div>
              <p className="text-sm text-blue-200">
                ≈ ${(jackpotData.dailyJackpot * solPrice).toFixed(2)} USD
              </p>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-200 mb-2">Next Draw:</p>
              <div className="text-lg font-semibold text-center">
                {formatDateInNY(jackpotData.nextDailyDraw)}
              </div>
              <p className="text-xs text-blue-200 mt-1 text-center">
                Bigger prizes, daily excitement!
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-blue-200">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{jackpotData.totalParticipants.toLocaleString()} Players</span>
              </div>
              <div className="flex items-center gap-1">
                <Ticket className="w-4 h-4" />
                <span>{jackpotData.totalTickets.toLocaleString()} Tickets</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
          <h3 className="text-xl font-bold mb-4 text-center">Live Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {(jackpotData.hourlyJackpot + jackpotData.dailyJackpot).toFixed(4)}
              </div>
              <div className="text-sm text-blue-200">Total Jackpot (SOL)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {jackpotData.totalParticipants.toLocaleString()}
              </div>
              <div className="text-sm text-blue-200">Active Players</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {jackpotData.totalTickets.toLocaleString()}
              </div>
              <div className="text-sm text-blue-200">Total Tickets</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {jackpotData.totalTickets > 0 
                  ? ((jackpotData.hourlyJackpot + jackpotData.dailyJackpot) / jackpotData.totalTickets * 1000).toFixed(3)
                  : '0.000'
                }
              </div>
              <div className="text-sm text-blue-200">SOL per 1K Tickets</div>
            </div>
          </div>
        </div>

        {/* How to Play */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
          <h3 className="text-xl font-bold mb-4 text-center">How to Play</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-2 text-black font-bold">
                1
              </div>
              <p>Hold $BALL tokens in your wallet</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-2 text-black font-bold">
                2
              </div>
              <p>10,000 $BALL = 1 lottery ticket</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-2 text-black font-bold">
                3
              </div>
              <p>Win SOL prizes automatically!</p>
            </div>
          </div>
        </div>

        {/* Live Updates */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold mb-4 text-center">🔥 Live Updates (Eastern Time)</h3>
          <div className="text-center text-blue-200 space-y-2">
            <p>Next hourly draw: {formatTimeInNY(jackpotData.nextHourlyDraw)}</p>
            <p>Next daily draw: {formatDateInNY(jackpotData.nextDailyDraw)}</p>
            
            {/* Auto-refresh Status */}
            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs">
                Auto-updating every 30 seconds
              </span>
              <button
                onClick={handleRefresh}
                className="ml-2 text-xs text-blue-300 hover:text-blue-100 underline"
              >
                Refresh Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
