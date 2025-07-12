import { useEffect, useState } from 'react';
import { Flame, Ticket } from 'lucide-react';
import { api } from '../../services/Api';

interface BurnedTokensData {
  burned_tokens: string;
  burned_tickets: number;
}

export default function BurnedTokensComponent() {
  const [burnedData, setBurnedData] = useState<BurnedTokensData>({
    burned_tokens: '6041535.60',
    burned_tickets: 604
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBurnedData = async () => {
      try {
        // Utilisation de getDashboardStats qui contient les données de tokens brûlés
        const statsResponse = await api.getDashboardStats();
        setBurnedData({
          burned_tokens: statsResponse.burned_tokens || '0',
          burned_tickets: statsResponse.burned_tickets || 0
        });
      } catch (error) {
        console.error('Error fetching burned tokens data:', error);
        // Valeurs par défaut conservées
      } finally {
        setLoading(false);
      }
    };

    fetchBurnedData();
    const interval = setInterval(fetchBurnedData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-6 w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
              <div className="bg-red-500 rounded-lg shadow-sm p-6">
                <div className="h-20 bg-red-400 rounded"></div>
              </div>
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
        <div className="flex items-center gap-2 mb-6">
          <Flame className="w-6 h-6 text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-800">Total Burned Tokens</h1>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tickets Burned Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Ticket className="w-5 h-5 text-red-500" />
              <h2 className="text-sm font-medium text-gray-600">Tickets Burned</h2>
            </div>
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Total Entries Removed</p>
              <div className="text-4xl font-bold text-red-500 mb-1">
                {burnedData.burned_tickets.toLocaleString()}
              </div>
              <p className="text-xs font-medium text-gray-600">TICKETS</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Flame className="w-3 h-3 text-orange-400" />
              <span>Making remaining tickets more valuable</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Based on 10,000 $BALL = 1 Ticket</p>
          </div>

          {/* Total Burned Tokens Card */}
          <div className="bg-red-500 rounded-lg shadow-sm p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-white" />
              <h2 className="text-sm font-medium">Total Burned Tokens</h2>
            </div>
            <div className="mb-4">
              <p className="text-xs text-red-100 mb-1">TOTAL $BALL BURNED</p>
              <div className="text-4xl font-bold mb-1">
                {parseFloat(burnedData.burned_tokens).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
              <p className="text-xs font-medium text-red-100">$BALL TOKENS</p>
            </div>
            <p className="text-xs text-red-100">Permanently removed from circulation</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Token burning reduces total supply, potentially increasing the value of remaining tokens</span>
          </div>
        </div>
      </div>
    </div>
  );
}
