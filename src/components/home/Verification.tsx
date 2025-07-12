import { useEffect, useState } from 'react';
import { Shield, ExternalLink, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../../services/Api';

interface LotteryStateAPI {
  is_paused: boolean;
  emergency_stop: boolean;
  admin: string;
  ball_token_mint: string;
  total_participants: number;
  total_tickets: number;
  hourly_draw_count: number;
  daily_draw_count: number;
  last_hourly_draw: number;
  last_daily_draw: number;
  hourly_jackpot_sol?: number;
  daily_jackpot_sol?: number;
  connection_status?: string;
  error_message?: string;
}

export default function Verification() {
  const [lotteryState, setLotteryState] = useState<LotteryStateAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLotteryState = async () => {
    try {
      setError(null);
      const state = await api.getLotteryState();
      setLotteryState(state);
      setLastUpdated(new Date());
      
      // Log pour debug
      console.log('Lottery state fetched:', state);
      
    } catch (err) {
      console.error('Error fetching lottery state:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch lottery state');
      
      // Définir un état par défaut en cas d'erreur
      setLotteryState({
        is_paused: true,
        emergency_stop: false,
        admin: 'Unavailable',
        ball_token_mint: 'Unavailable',
        total_participants: 0,
        total_tickets: 0,
        hourly_draw_count: 0,
        daily_draw_count: 0,
        last_hourly_draw: 0,
        last_daily_draw: 0,
        connection_status: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLotteryState();
    
    // Rafraîchissement automatique toutes les 30 secondes
    const interval = setInterval(fetchLotteryState, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchLotteryState();
  };

  if (loading) {
    return (
      <div className="bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 h-48"></div>
            <div className="bg-white rounded-lg p-6 h-48"></div>
          </div>
        </div>
      </div>
    );
  }

  const isOffline = lotteryState?.connection_status === 'error' || lotteryState?.connection_status === 'offline';

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-green-500" />
            <h1 className="text-2xl font-bold text-gray-800">Blockchain Verification</h1>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <p className="text-gray-600 mb-8">
          Our lottery system operates entirely on the Solana blockchain, ensuring complete transparency
          and verifiability. Every draw, winner selection, and payout is recorded on-chain.
        </p>

        {/* Connection Status Warning */}
        {isOffline && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <div>
                <div className="font-medium text-yellow-800">Connection Issue</div>
                <div className="text-sm text-yellow-700">
                  Unable to connect to Solana network. Displaying cached data.
                  {lotteryState?.error_message && (
                    <div className="mt-1 text-xs">Error: {lotteryState.error_message}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Program Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-semibold text-gray-800">Program Status</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Program State:</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    lotteryState?.is_paused ? 'bg-red-500' : 'bg-green-500'
                  }`} />
                  <span className={`font-medium ${
                    lotteryState?.is_paused ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {lotteryState?.is_paused ? 'Paused' : 'Active'}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Emergency Stop:</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    lotteryState?.emergency_stop ? 'bg-red-500' : 'bg-green-500'
                  }`} />
                  <span className={`font-medium ${
                    lotteryState?.emergency_stop ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {lotteryState?.emergency_stop ? 'Activated' : 'Normal'}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Participants:</span>
                <span className="font-medium text-gray-800">
                  {lotteryState?.total_participants?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Tickets:</span>
                <span className="font-medium text-gray-800">
                  {lotteryState?.total_tickets?.toLocaleString() || '0'}
                </span>
              </div>
              {lotteryState?.hourly_jackpot_sol !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Hourly Jackpot:</span>
                  <span className="font-medium text-gray-800">
                    {lotteryState.hourly_jackpot_sol.toFixed(4)} SOL
                  </span>
                </div>
              )}
              {lotteryState?.daily_jackpot_sol !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Daily Jackpot:</span>
                  <span className="font-medium text-gray-800">
                    {lotteryState.daily_jackpot_sol.toFixed(4)} SOL
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-800">Draw Statistics</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Hourly Draws:</span>
                <span className="font-medium text-gray-800">
                  {lotteryState?.hourly_draw_count?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Daily Draws:</span>
                <span className="font-medium text-gray-800">
                  {lotteryState?.daily_draw_count?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Hourly Draw:</span>
                <span className="font-medium text-gray-800">
                  {lotteryState?.last_hourly_draw && lotteryState.last_hourly_draw > 0
                    ? new Date(lotteryState.last_hourly_draw * 1000).toLocaleDateString()
                    : 'Never'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Daily Draw:</span>
                <span className="font-medium text-gray-800">
                  {lotteryState?.last_daily_draw && lotteryState.last_daily_draw > 0
                    ? new Date(lotteryState.last_daily_draw * 1000).toLocaleDateString()
                    : 'Never'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Program Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold text-gray-800">Smart Contract Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <div className="text-gray-600 mb-1">Program ID:</div>
              <div className="font-mono text-xs bg-gray-50 p-2 rounded break-all">
                2wqFWNXDYT2Q71ToNFBqKpV4scKSi1cjMuqVcT2jgruV
              </div>
            </div>
            <div>
              <div className="text-gray-600 mb-1">Admin Authority:</div>
              <div className="font-mono text-xs bg-gray-50 p-2 rounded break-all">
                {lotteryState?.admin || 'Loading...'}
              </div>
            </div>
            <div>
              <div className="text-gray-600 mb-1">BALL Token Mint:</div>
              <div className="font-mono text-xs bg-gray-50 p-2 rounded break-all">
               {/*comment {lotteryState?.ball_token_mint || 'Loading...'}*/}7qi1pPouJhaQiVoNmnAnGmTaJbs5rXRFZXbQAmPZYehd
              </div>
            </div>
            <div>
              <div className="text-gray-600 mb-1">Network:</div>
              <div className="text-sm font-medium text-gray-800">Solana Devnet</div>
            </div>
          </div>
        </div>

        {/* Verification Links */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">🔍 Verify On-Chain</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://explorer.solana.com/address/2wqFWNXDYT2Q71ToNFBqKpV4scKSi1cjMuqVcT2jgruV?cluster=devnet"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">View Program on Solana Explorer</span>
            </a>
            {lotteryState?.ball_token_mint && lotteryState.ball_token_mint !== 'Loading...' && lotteryState.ball_token_mint !== 'Unavailable' && (
              <a
                href={`https://explorer.solana.com/address/${lotteryState.ball_token_mint}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">View BALL Token on Explorer</span>
              </a>
            )}
          </div>
        </div>

        {/* Security Features */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4">🛡️ Security Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Verifiable Random Function (VRF)</div>
                <div>Provably fair winner selection using on-chain randomness</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Immutable Smart Contract</div>
                <div>Code deployed on Solana blockchain cannot be altered</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Automatic Payouts</div>
                <div>Winners receive SOL directly to their wallets</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Emergency Controls</div>
                <div>Admin can pause system in case of emergencies</div>
              </div>
            </div>
          </div>
        </div>

        {/* System Warnings */}
        {(lotteryState?.is_paused || lotteryState?.emergency_stop) && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <div className="font-medium text-red-800">System Notice</div>
                <div className="text-sm text-red-700">
                  {lotteryState.emergency_stop
                    ? 'The lottery system is currently under emergency stop. All operations are suspended.'
                    : 'The lottery system is currently paused. New draws are temporarily suspended.'
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <div className="font-medium text-red-800">Connection Error</div>
                <div className="text-sm text-red-700">{error}</div>
                <button
                  onClick={handleRefresh}
                  className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
