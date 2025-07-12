import { useEffect, useState } from 'react';
import { Trophy, Calendar, Clock, Users, Ticket, ExternalLink, Copy, Check, Filter, RefreshCw } from 'lucide-react';
import { api, type WinnerAPI, type LotteryAPI } from '../../services/Api';

interface DrawResultWithLottery extends WinnerAPI {
  lottery_details?: LotteryAPI;
}

export default function DrawResultsVerification() {
  const [results, setResults] = useState<DrawResultWithLottery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'hourly' | 'daily'>('all');
  const [solPrice, setSolPrice] = useState(100);
  const [refreshing, setRefreshing] = useState(false);

  // Récupérer le prix SOL depuis CoinGecko
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

  useEffect(() => {
    fetchResults();
  }, [currentPage, filterType]);

  // Auto-refresh toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchResults(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentPage, filterType, loading]);

  const fetchResults = async (isAutoRefresh = false) => {
    if (!isAutoRefresh) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    setError(null);

    try {
      // ✅ Utiliser l'endpoint winners avec filtrage côté backend
      const filters: any = {
        page: currentPage,
        page_size: 10
      };

      // ✅ Ajouter le filtre par type de loterie si nécessaire
      if (filterType !== 'all') {
        filters.lottery_type = filterType;
      }

      console.log('Fetching winners with filters:', filters);

      // ✅ Utiliser la méthode searchWinners qui gère les filtres
      const response = await api.searchWinners(filters);
      
      console.log('Winners response:', response);

      // ✅ Les données du serializer incluent déjà lottery_type et lottery_date
      // Pas besoin de faire des appels supplémentaires pour les détails de loterie
      const enrichedResults: DrawResultWithLottery[] = response.results.map(winner => ({
        ...winner,
        // ✅ Utiliser les données déjà présentes dans le serializer
        lottery_details: winner.lottery_id ? {
          id: winner.lottery_id,
          lottery_type: winner.lottery_type || 'unknown',
          executed_time: winner.lottery_date,
          status: 'completed', // Les winners n'existent que pour les loteries complétées
          jackpot_amount_sol: winner.winning_amount_sol, // Approximation
          total_participants: 0, // Non disponible dans le serializer Winner
          total_tickets: 0, // Non disponible dans le serializer Winner
          scheduled_time: winner.lottery_date,
          created_at: winner.created_at,
          draw_id: winner.lottery_id,
          transaction_signature: undefined
        } as LotteryAPI : undefined
      }));

      setResults(enrichedResults);
      setTotalCount(response.count);
      setTotalPages(Math.ceil(response.count / 10));

    } catch (error) {
      console.error('Error fetching draw results:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch draw results');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const truncateWallet = (address: string, chars: number = 4): string => {
    if (!address) return '';
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const estimateUSDPrice = (solAmount: number): number => {
    return solAmount * solPrice;
  };

  const handleRefresh = () => {
    fetchResults();
  };

  const handleFilterChange = (newFilter: 'all' | 'hourly' | 'daily') => {
    setFilterType(newFilter);
    setCurrentPage(1);
  };

  // ✅ Fonction pour obtenir la date d'exécution avec fallback
  const getExecutionDate = (result: DrawResultWithLottery) => {
    return result.lottery_date || result.created_at;
  };

  // ✅ Fonction pour obtenir le type de loterie avec fallback
  const getLotteryType = (result: DrawResultWithLottery) => {
    return result.lottery_type || 'unknown';
  };

  // ✅ Fonction pour obtenir l'ID de la loterie
  const getLotteryId = (result: DrawResultWithLottery) => {
    return result.lottery_id || 'N/A';
  };

  if (loading) {
    return (
      <div className="bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-6 w-64"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-red-800">Error Loading Results</h3>
            </div>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={() => fetchResults()}
              className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h1 className="text-2xl font-bold text-gray-800">Draw Results & Verification</h1>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {totalCount} Total Results
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* SOL Price Display */}
            <div className="bg-white px-3 py-1 rounded-lg border text-sm">
              <span className="text-gray-600">SOL: </span>
              <span className="font-semibold text-green-600">${solPrice.toFixed(2)}</span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          All lottery draws are conducted on-chain and fully verifiable on the Solana blockchain.
          Each result includes transaction signatures and block information for complete transparency.
        </p>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">Filter by type:</span>
          </div>
          <div className="flex gap-2">
            {(['all', 'hourly', 'daily'] as const).map((type) => (
              <button
                key={type}
                onClick={() => handleFilterChange(type)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  filterType === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Trophy className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Results Yet</h3>
            <p className="text-gray-500">
              {filterType === 'all'
                ? 'Check back soon for the latest draw results!'
                : `No ${filterType} draw results found. Try changing the filter.`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {results.map((result) => {
              const lotteryType = getLotteryType(result);
              const executionDate = getExecutionDate(result);
              const lotteryId = getLotteryId(result);

              return (
                <div key={result.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                      {/* Draw Info */}
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          lotteryType === 'hourly'
                            ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                            : lotteryType === 'daily'
                            ? 'bg-gradient-to-br from-purple-400 to-purple-600'
                            : 'bg-gradient-to-br from-gray-400 to-gray-600'
                        }`}>
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {lotteryType === 'hourly' ? 'Hourly' :
                             lotteryType === 'daily' ? 'Daily' : 'Unknown'} Draw #{lotteryId}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(executionDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(executionDate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Prize Amount */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {result.winning_amount_formatted || `${parseFloat(result.winning_amount_sol).toFixed(4)} SOL`}
                        </div>
                        <div className="text-sm text-gray-500">
                          ≈ ${estimateUSDPrice(parseFloat(result.winning_amount_sol)).toFixed(2)} USD
                        </div>
                      </div>
                    </div>

                    {/* Winner Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-600">Winner</span>
                        </div>
                        <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-gray-800">
                            {result.wallet_short || truncateWallet(result.wallet_address, 6)}
                          </span>
                          <button
                            onClick={() => copyToClipboard(result.wallet_address)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="Copy address"
                          >
                            {copiedAddress === result.wallet_address ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Ticket className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-600">Tickets Held</span>
                        </div>
                        <div className="text-lg font-semibold text-gray-800">
                          {result.tickets_held?.toLocaleString() || 'N/A'}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium text-gray-600">Win Date</span>
                        </div>
                        <div className="text-sm font-semibold text-gray-800">
                          {formatDate(executionDate)}
                        </div>
                      </div>
                    </div>

                    {/* Payout Status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          result.payout_status === 'completed' ? 'bg-green-500' :
                          result.payout_status === 'pending' ? 'bg-yellow-500' : 
                          result.payout_status === 'processing' ? 'bg-blue-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-600">
                          Payout Status:
                          <span className={`ml-1 font-semibold ${
                            result.payout_status === 'completed' ? 'text-green-600' :
                            result.payout_status === 'pending' ? 'text-yellow-600' : 
                            result.payout_status === 'processing' ? 'text-blue-600' : 'text-red-600'
                          }`}>
                            {result.payout_status.charAt(0).toUpperCase() + result.payout_status.slice(1)}
                          </span>
                        </span>
                      </div>

                      {/* Blockchain Verification */}
                      {result.payout_transaction_signature && (
                        <a
                          href={`https://explorer.solana.com/tx/${result.payout_transaction_signature}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Verify on Solana Explorer
                        </a>
                      )}
                    </div>

                    {/* Transaction Details */}
                    {result.payout_transaction_signature && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Payout Transaction</h4>
                        <div className="font-mono text-xs text-gray-600 bg-white p-2 rounded border break-all">
                          {result.payout_transaction_signature}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          {result.payout_time && (
                            <span>Paid: {formatDate(result.payout_time)} at {formatTime(result.payout_time)}</span>
                          )}
                          <a
                            href={`https://solscan.io/tx/${result.payout_transaction_signature}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View on Solscan
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Additional Winner Info */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-blue-800 mb-2">Winner Details</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-blue-600 font-medium">Lottery Type:</span>
                          <div className={`inline-block ml-2 px-2 py-1 rounded text-xs font-medium ${
                            lotteryType === 'hourly' ? 'bg-blue-100 text-blue-800' :
                            lotteryType === 'daily' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {lotteryType.toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <span className="text-blue-600 font-medium">Prize:</span>
                          <div className="text-blue-800 font-semibold">
                            {parseFloat(result.winning_amount_sol).toFixed(6)} SOL
                          </div>
                        </div>
                        <div>
                          <span className="text-blue-600 font-medium">USD Value:</span>
                          <div className="text-blue-800 font-semibold">
                            ${result.winning_amount_usd || estimateUSDPrice(parseFloat(result.winning_amount_sol)).toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <span className="text-blue-600 font-medium">Winner ID:</span>
                          <div className="text-blue-800 font-mono text-xs">
                            #{result.id}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex gap-1">
              {(() => {
                const maxVisiblePages = 5;
                const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                const pages = [];
                
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(i);
                }
                
                return pages.map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === pageNum
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ));
              })()}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Enhanced Stats Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-sm text-gray-600">Total Results</div>
            <div className="text-2xl font-bold text-gray-800">{totalCount.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">Across all pages</div>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-sm text-gray-600">Current Page Winnings</div>
            <div className="text-2xl font-bold text-green-600">
              {results.reduce((sum, result) => sum + parseFloat(result.winning_amount_sol), 0).toFixed(4)} SOL
            </div>
            <div className="text-xs text-gray-500 mt-1">
              ≈ ${results.reduce((sum, result) => sum + estimateUSDPrice(parseFloat(result.winning_amount_sol)), 0).toFixed(2)} USD
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-sm text-gray-600">Average Win</div>
            <div className="text-2xl font-bold text-blue-600">
              {results.length > 0 
                ? (results.reduce((sum, result) => sum + parseFloat(result.winning_amount_sol), 0) / results.length).toFixed(4)
                : '0.0000'
              } SOL
            </div>
            <div className="text-xs text-gray-500 mt-1">Per winner</div>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <div className="text-sm text-gray-600">Page Info</div>
            <div className="text-2xl font-bold text-purple-600">
              {currentPage} / {totalPages}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Showing {results.length} of {totalCount}
            </div>
          </div>
        </div>

        {/* Filter Stats */}
        {filterType !== 'all' && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-800">
              <strong>Filter Active:</strong> Showing only {filterType} lottery results
              {totalCount > 0 && (
                <span className="ml-2">
                  ({totalCount} {filterType} {totalCount === 1 ? 'result' : 'results'} found)
                </span>
              )}
            </div>
          </div>
        )}

        {/* Verification Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">🔒 Blockchain Verification</h3>
          <div className="text-sm text-blue-700 space-y-2">
            <p>• All draws are executed on-chain using verifiable random functions (VRF)</p>
            <p>• Winners are selected automatically based on their ticket holdings at draw time</p>
            <p>• Every transaction is recorded on the Solana blockchain for full transparency</p>
            <p>• Click "Verify on Solana Explorer" to view the complete transaction details</p>
            <p>• SOL prices are updated in real-time from CoinGecko API</p>
            <p>• Lottery execution and payout transactions are separate for security</p>
          </div>
        </div>

        {/* Network Status */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>
            Connected to Solana Devnet • 
            Last updated: {new Date().toLocaleTimeString()} • 
            SOL Price: ${solPrice.toFixed(2)} USD
            {refreshing && <span className="ml-2 text-blue-500">• Refreshing...</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
