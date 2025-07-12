import React, { Suspense, useEffect, useState } from 'react';
import { Ticket, Users, Trophy, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { api, type TokenHoldingAPI, type JackpotPoolAPI } from '../../services/Api';
import Hero from '../../components/home/Hero';

const HowItWorks = React.lazy(() => import('../../components/home/HowItWork'));
const WinaryBall = React.lazy(() => import('../../components/home/WinaryBall'));
const BurnedTokens = React.lazy(() => import('../../components/home/BurnedTokens'));
const Leaderboard = React.lazy(() => import('../../components/Leaderboard'));
const HowToPlay = React.lazy(() => import('../../components/home/HowToPlay'));
const Verification = React.lazy(() => import('../../components/home/Verification'));

// Nouveau composant pour afficher les informations des tickets
function MyTicketsInfo() {
  const [userHolding, setUserHolding] = useState<TokenHoldingAPI | null>(null);
  const [jackpots, setJackpots] = useState<JackpotPoolAPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [solPrice, setSolPrice] = useState(100); // Prix SOL par défaut

  // Récupérer le prix SOL
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
    // Écouter les changements de wallet depuis le localStorage ou window events
    const checkWallet = () => {
      if (window.solana?.publicKey) {
        setWalletAddress(window.solana.publicKey.toString());
      }
    };

    checkWallet();
    window.addEventListener('wallet-connected', checkWallet);
    return () => window.removeEventListener('wallet-connected', checkWallet);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      fetchUserData();
    }
  }, [walletAddress]);

  const fetchUserData = async () => {
    if (!walletAddress) return;

    try {
      setLoading(true);
      setError(null);

      // ✅ Utiliser les endpoints corrects
      const [holding, jackpotPools] = await Promise.all([
        api.getMyHoldings(walletAddress), // ✅ Endpoint correct
        api.getCurrentPools() // ✅ Endpoint correct
      ]);

      setUserHolding(holding);
      setJackpots(jackpotPools);

    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const syncWallet = async () => {
    if (!walletAddress) return;

    try {
      setLoading(true);
      setError(null);

      // ✅ Synchroniser le wallet avec Solana
      const syncedHolding = await api.syncWallet(walletAddress);
      setUserHolding(syncedHolding);

      // Récupérer les jackpots mis à jour
      const jackpotPools = await api.getCurrentPools();
      setJackpots(jackpotPools);

    } catch (error) {
      console.error('Error syncing wallet:', error);
      setError(error instanceof Error ? error.message : 'Failed to sync wallet');
    } finally {
      setLoading(false);
    }
  };

  if (!walletAddress) {
    return (
      <div className="bg-blue-50 rounded-lg p-6 text-center">
        <Ticket className="w-12 h-12 text-blue-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Connect Your Wallet</h3>
        <p className="text-blue-600">Connect your wallet above to view your tickets and eligibility status.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-20 bg-gray-300 rounded"></div>
          <div className="h-20 bg-gray-300 rounded"></div>
          <div className="h-20 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-red-800">Error Loading Ticket Data</h3>
          </div>
          <p className="text-red-600 text-sm">{error}</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={fetchUserData}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={syncWallet}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Sync Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Ticket className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-gray-800">My Lottery Tickets</h2>
        </div>
        <button
          onClick={syncWallet}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Sync
        </button>
      </div>

      {userHolding ? (
        <div className="space-y-6">
          {/* Ticket Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {parseFloat(userHolding.balance).toLocaleString()}
              </div>
              <div className="text-sm text-blue-700">$BALL Balance</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {userHolding.tickets_count.toLocaleString()}
              </div>
              <div className="text-sm text-green-700">Active Tickets</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {userHolding.is_eligible ? 'YES' : 'NO'}
              </div>
              <div className="text-sm text-purple-700">Eligible to Win</div>
            </div>
          </div>

          {/* Eligibility Status */}
          <div className={`rounded-lg p-4 ${
            userHolding.is_eligible
              ? 'bg-green-100 border border-green-200'
              : 'bg-red-100 border border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {userHolding.is_eligible ? (
                <Trophy className="w-5 h-5 text-green-600" />
              ) : (
                <Clock className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-semibold ${
                userHolding.is_eligible ? 'text-green-800' : 'text-red-800'
              }`}>
                {userHolding.is_eligible ? 'You are eligible!' : 'Not eligible yet'}
              </span>
            </div>
            <p className={`text-sm ${
              userHolding.is_eligible ? 'text-green-700' : 'text-red-700'
            }`}>
              {userHolding.is_eligible
                ? `You have ${userHolding.tickets_count.toLocaleString()} tickets and can participate in all draws.`
                : 'You need at least 10,000 $BALL tokens to get 1 ticket and participate.'
              }
            </p>
          </div>

          {/* Current Jackpots */}
          {jackpots.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Jackpots You Can Win</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jackpots.map((jackpot) => (
                  <div 
                    key={jackpot.lottery_type} 
                    className={`rounded-lg p-4 text-white ${
                      jackpot.lottery_type === 'hourly'
                        ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                        : 'bg-gradient-to-r from-purple-400 to-purple-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-5 h-5" />
                      <span className="font-semibold capitalize">
                        {jackpot.lottery_type} Draw
                      </span>
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      {parseFloat(jackpot.current_amount_sol).toFixed(4)} SOL
                    </div>
                    <div className="text-sm opacity-90">
                      ≈ ${(parseFloat(jackpot.current_amount_sol) * solPrice).toFixed(2)} USD
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wallet Statistics */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Wallet Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-gray-700">
                  {userHolding.tickets_count}
                </div>
                <div className="text-xs text-gray-500">Current Tickets</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-700">
                  {parseFloat(userHolding.balance).toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">$BALL Balance</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-700">
                  {userHolding.is_eligible ? 'Eligible' : 'Not Eligible'}
                </div>
                <div className="text-xs text-gray-500">Status</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-700">
                  {userHolding.last_updated 
                    ? new Date(userHolding.last_updated).toLocaleDateString() 
                    : 'Never'
                  }
                </div>
                <div className="text-xs text-gray-500">Last Updated</div>
              </div>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Connected Wallet</h4>
            <div className="font-mono text-sm text-blue-700 bg-white p-2 rounded border break-all">
              {walletAddress}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://raydium.io/swap/?inputMint=sol&outputMint=7qi1pPouJhaQiVoNmnAnGmTaJbs5rXRFZXbQAmPZYehd"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition text-center"
            >
              Buy More $BALL
            </a>
            <button
              onClick={syncWallet}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Syncing...' : 'Sync with Blockchain'}
            </button>
            <button
              onClick={fetchUserData}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Refresh Data
            </button>
          </div>
        </div>
      ) : (
        
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Ticket Data Found</h3>
          <p className="text-gray-500 mb-4">
            We couldn't find any $BALL tokens in your wallet. This could mean:
          </p>
          <ul className="text-sm text-gray-500 mb-6 text-left max-w-md mx-auto space-y-1">
            <li>• You don't have any $BALL tokens yet</li>
            <li>• Your wallet hasn't been synced with our system</li>
            <li>• The blockchain data is still updating</li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://raydium.io/swap/?inputMint=sol&outputMint=7qi1pPouJhaQiVoNmnAnGmTaJbs5rXRFZXbQAmPZYehd"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition inline-block"
            >
              Get $BALL Tokens
            </a>
            <button
              onClick={syncWallet}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Syncing...' : 'Sync Wallet'}
            </button>
          </div>
        </div>
      )}

      {/* Network Status */}
      <div className="mt-6 text-center text-xs text-gray-500 border-t pt-4">
        <p>
          Connected to Solana Devnet • 
          SOL Price: ${solPrice.toFixed(2)} USD • 
          Last updated: {new Date().toLocaleTimeString()}
          {loading && <span className="ml-2 text-blue-500">• Syncing...</span>}
        </p>
      </div>
    </div>
  );
}

export default function Tickets() {
  return (
    <div>
      <main className="pt-20">
        {/* Section Hero toujours chargée immédiatement */}
        <Hero />

        {/* Section My Tickets */}
        <section className="w-full py-12 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-12 transition duration-500 hover:shadow-xl">
            <MyTicketsInfo />
          </div>
        </section>

        {/* Sections suivantes avec lazy loading */}
        <Suspense fallback={<LoadingCard />}>
          <SectionCard>
            <HowItWorks />
          </SectionCard>
        </Suspense>

        <Suspense fallback={<LoadingCard />}>
          <SectionCard>
            <WinaryBall />
          </SectionCard>
        </Suspense>

        <Suspense fallback={<LoadingCard />}>
          <SectionCard>
            <BurnedTokens />
          </SectionCard>
        </Suspense>

        <Suspense fallback={<LoadingCard />}>
          <SectionCard>
            <Leaderboard />
          </SectionCard>
        </Suspense>

        <Suspense fallback={<LoadingCard />}>
          <SectionCard>
            <HowToPlay />
          </SectionCard>
        </Suspense>

        <Suspense fallback={<LoadingCard />}>
          <SectionCard>
            <Verification />
          </SectionCard>
        </Suspense>
      </main>
    </div>
  );
}

// Composant de chargement temporaire
function LoadingCard() {
  return (
    <div className="w-full max-w-6xl mx-auto my-8 p-6 bg-white shadow-lg rounded-xl animate-pulse text-center text-gray-400">
      <div className="h-8 bg-gray-300 rounded mb-4 w-1/3 mx-auto"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  );
}

// Composant d'encapsulation de style (card full width)
function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full py-12 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-12 transition duration-500 hover:shadow-xl">
        {children}
      </div>
    </section>
  );
}
