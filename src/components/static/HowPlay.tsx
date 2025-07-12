import React from 'react';
import { Clock, Calendar, Trophy, Shield } from 'lucide-react';

const HowToPlayPowerball: React.FC = () => {
  return (
    <div className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How to Play Powerball $BALL
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The first hourly raffle-style sweepstakes on Solana. More tokens = more 
            entries = better odds!
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Hourly Draws */}
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
                <Clock className="w-10 h-10 text-blue-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Hourly Draws</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              New winner every hour
            </p>
          </div>

          {/* Raffle Entries */}
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
                <Calendar className="w-10 h-10 text-blue-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Raffle Entries</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              10,000 tokens = 1 entry
            </p>
          </div>

          {/* Better Odds */}
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
                <Trophy className="w-10 h-10 text-blue-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Better Odds</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              More tokens = more chances
            </p>
          </div>

          {/* VRF Verified */}
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
                <Shield className="w-10 h-10 text-blue-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">VRF Verified</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Verifiable on-chain
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToPlayPowerball;