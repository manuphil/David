import React from 'react';

const StepByStepGuide: React.FC = () => {
  return (
    <div className="bg-gray-50 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Step-by-Step Guide
          </h2>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Set Up Your Solana Wallet
              </h3>
              <p className="text-gray-700 mb-4">
                You'll need a Solana wallet like Phantom, Solflare, or any compatible wallet to participate. Make sure you have some SOL for transaction costs.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <span className="font-semibold">Recommended wallets:</span> Phantom, Solflare, Backpack
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Buy $BALL Tokens for Raffle Entries
              </h3>
              <p className="text-gray-700 mb-4">
                In this raffle-style sweepstakes, every 10,000 $BALL tokens you hold count as 1 raffle entry. The more tokens you hold, the more entries you get, and the better your odds of winning!
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 text-sm">
                  <span className="font-semibold">$BALL Contract:</span> 
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-blue-800 font-semibold text-sm mb-2">Raffle Entry System:</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• 10,000 tokens = 1 entry</li>
                  <li>• 20,000 tokens = 2 entries</li>
                  <li>• 100,000 tokens = 10 entries</li>
                  <li>• More entries = better odds!</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Wait for the Hourly Raffle Draw
              </h3>
              <p className="text-gray-700 mb-4">
                Every hour, the system takes a snapshot of all eligible $BALL holders and their token amounts. Each 10,000 tokens becomes a raffle ticket. A random ticket is then selected using verifiable random functions (VRF) to ensure complete fairness.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  <span className="font-semibold">Example:</span> If you hold 50,000 tokens, you get 5 raffle tickets in each draw!
                </p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                4
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Check Results & Claim Winnings
              </h3>
              <p className="text-gray-700">
                Winners are automatically paid out to their wallet! Check the results page to see if you won. Prizes are distributed automatically after each draw.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepByStepGuide;