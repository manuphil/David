import { useEffect, useState } from 'react';
import { Wallet, X, Copy, Check, AlertCircle, Sparkles } from 'lucide-react';
import { getWalletInfo } from '../../services/Api';

const TOKEN_MINT_ADDRESS = "7qi1pPouJhaQiVoNmnAnGmTaJbs5rXRFZXbQAmPZYehd";

const RPC_ENDPOINT = "https://api.testnet.solana.com";
const MIN_ELIGIBLE_BALANCE = 10000;

declare global {
  interface Window {
    solana?: {
      isPhantom: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      publicKey: { toString: () => string } | null;
      isConnected: boolean;
    };
  }
}

export default function Hero() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [apiBalance, setApiBalance] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isEligible, setIsEligible] = useState(false);

  const connectWallet = async () => {
    const provider = window.solana;
    if (!provider?.isPhantom) {
      alert("Phantom wallet not found. Please install it.");
      return;
    }
    try {
      setConnecting(true);
      const res = await provider.connect();
      if (!res.publicKey) throw new Error("No public key from wallet");

      const address = res.publicKey.toString();
      setWalletAddress(address);
      setShowModal(false);

      await Promise.all([
        fetchSolanaBalance(address),
        fetchBackendInfo(address)
      ]);
    } catch (err) {
      console.error("Connection error:", err);
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await window.solana?.disconnect();
    } catch (err) {
      console.error("Disconnect error:", err);
    } finally {
      setWalletAddress(null);
      setBalance(0);
      setApiBalance(0);
      setIsEligible(false);
    }
  };
  const fetchSolanaBalance = async (address: string) => {
    try {
      const res = await fetch(RPC_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getTokenAccountsByOwner", // ✅ méthode correcte
          params: [
            address,
            { mint: TOKEN_MINT_ADDRESS },
            { encoding: "jsonParsed" }
          ]
        }),
      });
  
      const data = await res.json();
  
      const tokenAccounts = data?.result?.value;
      if (!tokenAccounts || tokenAccounts.length === 0) {
        console.warn("⚠️ Aucun compte token trouvé pour cette adresse.");
        setBalance(0);
        setIsEligible(false);
        return;
      }
  
      const tokenInfo = tokenAccounts[0]?.account?.data?.parsed?.info?.tokenAmount;
  
      const rawAmount = tokenInfo?.amount || "0";
      const decimals = tokenInfo?.decimals || 0;
      const amount = parseFloat(rawAmount) / Math.pow(10, decimals);
  
      setBalance(amount);
      setIsEligible(amount >= MIN_ELIGIBLE_BALANCE);
  
      console.log("✅ Solana token balance récupérée:", amount);
    } catch (err) {
      console.error("❌ Échec de récupération du solde Solana:", err);
      setBalance(0);
      setIsEligible(false);
    }
  };
  

  const fetchBackendInfo = async (address: string) => {
    try {
      const info = await getWalletInfo(address);
      const backendBalance = parseFloat(info.current_balance);
      setApiBalance(backendBalance);
      setIsEligible(info.is_eligible);
      console.log(`Backend info: ${info.tickets_count} tickets, ${backendBalance} balance`);
    } catch (err) {
      console.error("Backend balance fetch failed:", err);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      const provider = window.solana;
      if (provider?.isConnected && provider.publicKey) {
        const addr = provider.publicKey.toString();
        setWalletAddress(addr);
        await Promise.all([
          fetchSolanaBalance(addr),
          fetchBackendInfo(addr)
        ]);
      }
    };
    checkConnection();
  }, []);

  const truncate = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <section className="bg-blue-900 text-white py-20 px-6 text-center relative">
        <h1 className="text-4xl font-bold mb-4">Powerball on Solana</h1>
        <p className="text-lg mb-6 max-w-xl mx-auto">
          Play the first hourly raffle built on the Solana blockchain. Connect your wallet and win!
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href={`https://raydium.io/swap/?inputMint=sol&outputMint=${TOKEN_MINT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold py-3 px-6 rounded shadow transition"
          >
            Buy $BALL
          </a>

          {!walletAddress ? (
            <button
              onClick={() => setShowModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded shadow transition flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </button>
          ) : (
            <div className="bg-white text-blue-900 font-semibold py-2 px-4 rounded shadow flex items-center gap-3 text-sm">
              <Wallet className="w-4 h-4 text-green-600" />
              {truncate(walletAddress)}
              <span className="text-yellow-600">{balance.toFixed(2)} BALL</span>
              {apiBalance > 0 && (
                <span className="text-green-600">({apiBalance.toFixed(2)} API)</span>
              )}
              <button onClick={() => copy(walletAddress)} title="Copy">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <button onClick={disconnectWallet} title="Disconnect">
                <X className="w-4 h-4 text-red-500 hover:text-red-700" />
              </button>
            </div>
          )}
        </div>

        {walletAddress && (
          <div className="mt-6">
            {isEligible ? (
              <div className="flex items-center justify-center gap-2 text-green-300 font-medium animate-pulse">
                <Sparkles className="w-5 h-5" />
                You are eligible to play the lottery! 🎉
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-red-300 font-medium">
                <AlertCircle className="w-5 h-5" />
                You need at least {MIN_ELIGIBLE_BALANCE.toLocaleString()} BALL to play.
              </div>
            )}
          </div>
        )}
      </section>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <Wallet className="w-12 h-12 mx-auto text-purple-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Connect Your Wallet</h2>
              <p className="text-gray-600 mb-4">
                Connect your Phantom wallet to play and manage your $BALL tokens.
              </p>

              <button
                onClick={connectWallet}
                disabled={connecting}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold py-3 rounded transition flex items-center justify-center gap-2"
              >
                {connecting ? (
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                ) : (
                  <>
                    <Wallet className="w-5 h-5" />
                    Connect with Phantom
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 mt-4">
                Powered by Solana Devnet · Token Mint: {truncate(TOKEN_MINT_ADDRESS)}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
