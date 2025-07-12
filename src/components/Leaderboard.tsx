import { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Users, Ticket, DollarSign, RefreshCw } from 'lucide-react';
import { api, type TokenHoldingAPI } from '../services/Api';

type LeaderboardType = 'balance' | 'tickets' | 'winnings';

interface LeaderboardEntry extends TokenHoldingAPI {
  rank: number;
  total_winnings?: string;
}

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<LeaderboardType>('balance');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let data: TokenHoldingAPI[] = [];
        
        // ✅ Utiliser les endpoints corrects selon votre API
        if (activeTab === 'balance' || activeTab === 'tickets') {
          // Utiliser getWalletLeaderboard pour balance et tickets
          const response = await api.getWalletLeaderboard(activeTab, 50);
          data = response.results;
        } else if (activeTab === 'winnings') {
          // Pour les winnings, utiliser getLeaderboard et enrichir avec les données de gains
          const holdings = await api.getLeaderboard();
          
          // Enrichir avec les données de gains pour chaque wallet
          const enrichedData = await Promise.all(
            holdings.slice(0, 50).map(async (holding) => {
              try {
                const wins = await api.getMyWins(holding.wallet_address);
                const totalWinnings = wins.reduce((sum, win) => 
                  sum + parseFloat(win.winning_amount_sol || '0'), 0
                );
                return {
                  ...holding,
                  total_winnings: totalWinnings.toString()
                };
              } catch {
                return {
                  ...holding,
                  total_winnings: '0'
                };
              }
            })
          );
          
          // Trier par gains décroissants
          data = enrichedData.sort((a, b) => 
            parseFloat(b.total_winnings || '0') - parseFloat(a.total_winnings || '0')
          );
        }
        
        // ✅ Ajouter le rang à chaque entrée
        const rankedData: LeaderboardEntry[] = data.map((entry, index) => ({
          ...entry,
          rank: index + 1
        }));
        
        setLeaderboardData(rankedData);
        
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [activeTab]);

  // ✅ Fonction de rafraîchissement
  const handleRefresh = async () => {
    setRefreshing(true);
    
    try {
      // Déclencher une synchronisation des wallets si nécessaire
      if (activeTab === 'winnings') {
        await api.syncAllWallets();
        // Attendre un peu pour que la sync se propage
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Recharger les données
      const event = new Event('refresh');
      window.dispatchEvent(event);
      
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">
            #{rank}
          </span>
        );
    }
  };

  const getDisplayValue = (entry: LeaderboardEntry) => {
    switch (activeTab) {
      case 'balance':
        return `${parseFloat(entry.balance).toLocaleString('en-US', { 
          maximumFractionDigits: 0 
        })} BALL`;
      case 'tickets':
        return `${entry.tickets_count.toLocaleString()} tickets`;
      case 'winnings':
        return `${parseFloat(entry.total_winnings || '0').toFixed(4)} SOL`;
      default:
        return '';
    }
  };

  const getSecondaryValue = (entry: LeaderboardEntry) => {
    switch (activeTab) {
      case 'balance':
        return `${entry.tickets_count} tickets`;
      case 'tickets':
        return `${parseFloat(entry.balance).toLocaleString()} BALL`;
      case 'winnings':
        return `${entry.tickets_count} tickets`;
      default:
        return '';
    }
  };

  const truncateWallet = (address: string, chars = 6) => {
    if (!address) return '';
    return `${address.slice(0, chars)}...${address.slice(-4)}`;
  };

  const tabs = [
    { id: 'balance' as LeaderboardType, label: 'Top Holders', icon: DollarSign },
    { id: 'tickets' as LeaderboardType, label: 'Most Tickets', icon: Ticket },
    { id: 'winnings' as LeaderboardType, label: 'Biggest Winners', icon: Trophy },
  ];

  if (error) {
    return (
      <div className="bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-red-800">Error Loading Leaderboard</h3>
            </div>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <div className="flex gap-2">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Retry
              </button>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {refreshing ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-800">Leaderboard</h1>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id} // ✅ Clé unique ajoutée
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={`loading-${i}`} className="flex items-center gap-4"> {/* ✅ Clé unique */}
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : leaderboardData.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No data available for this leaderboard.</p>
              <button
                onClick={handleRefresh}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Try Refreshing
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {leaderboardData.map((entry) => (
                <div
                  key={`${entry.wallet_address}-${activeTab}`} // ✅ Clé unique composée
                  className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                    entry.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                  }`}
                >
                  {/* Rank */}
                  <div className="flex-shrink-0">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Wallet Address */}
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm text-gray-800 truncate">
                      {truncateWallet(entry.wallet_address, 6)}
                    </div>
                    {entry.is_eligible && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Eligible</span>
                      </div>
                    )}
                  </div>

                  {/* Primary Value */}
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">
                      {getDisplayValue(entry)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getSecondaryValue(entry)}
                    </div>
                  </div>

                  {/* Last Activity */}
                  <div className="text-xs text-gray-400 text-right min-w-0">
                    <div>Last seen</div>
                    <div>{new Date(entry.last_updated).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Leaderboard updates automatically • Only eligible wallets with 10,000+ BALL tokens can participate
          </p>
          {activeTab === 'winnings' && (
            <p className="mt-1 text-xs text-amber-600">
              ⚠️ Winnings data may take longer to load as it fetches individual wallet histories
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
