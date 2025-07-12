import { ChevronRight } from 'lucide-react';

const BallTokenComponent = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        
        {/* Where to Buy Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Where to Buy $BALL
          </h2>
          
          <div className="space-y-4">
            <a
              href="https://raydium.io/swap/?inputMint=sol&outputMint=7qi1pPouJhaQiVoNmnAnGmTaJbs5rXRFZXbQAmPZYehd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <ChevronRight className="w-5 h-5 text-blue-500" />
                <span className="text-gray-800 font-medium">Raydium DEX</span>
                <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  (Recommended)
                </span>
              </div>
            </a>
            
            <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <ChevronRight className="w-5 h-5 text-blue-500" />
              <span className="text-gray-800 font-medium">Jupiter Exchange</span>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <ChevronRight className="w-5 h-5 text-blue-500" />
              <span className="text-gray-800 font-medium">Orca Exchange</span>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <ChevronRight className="w-5 h-5 text-blue-500" />
              <span className="text-gray-800 font-medium">Any Solana DEX</span>
            </div>
          </div>
        </div>

        {/* Key Features Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Key Features
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 border-l-4 border-blue-500 bg-blue-50">
              <ChevronRight className="w-5 h-5 text-blue-500" />
              <span className="text-gray-800 font-medium">Raffle-style: 10,000 tokens = 1 entry</span>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border-l-4 border-blue-500 bg-blue-50">
              <ChevronRight className="w-5 h-5 text-blue-500" />
              <span className="text-gray-800 font-medium">More tokens = better odds</span>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border-l-4 border-blue-500 bg-blue-50">
              <ChevronRight className="w-5 h-5 text-blue-500" />
              <span className="text-gray-800 font-medium">VRF verified draws</span>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border-l-4 border-blue-500 bg-blue-50">
              <ChevronRight className="w-5 h-5 text-blue-500" />
              <span className="text-gray-800 font-medium">Automatic payouts</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-xl p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Play?</h2>
        <p className="text-xl mb-8 text-blue-100">
          Get your $BALL tokens and join the next hourly draw!
        </p>
        
        <a
          href="https://raydium.io/swap/?inputMint=sol&outputMint=7qi1pPouJhaQiVoNmnAnGmTaJbs5rXRFZXbQAmPZYehd"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-blue-600 font-bold py-4 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Buy $BALL on Raydium
        </a>
      </div>

      {/* Additional Info */}
      <div className="mt-8 text-center text-gray-600">
        <p className="text-sm">
          Join thousands of players in the most exciting crypto lottery on Solana
        </p>
      </div>
    </div>
  );
};

export default BallTokenComponent;
