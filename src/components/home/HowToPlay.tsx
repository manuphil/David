import { CheckCircle } from 'lucide-react';

export default function HowToPlayComponent() {
  return (
    <div className="bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* How To Play Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-6">How To Play</h2>
          
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle className="w-5 h-5 text-green-500 fill-current" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Buy $BALL Tokens</h3>
                <p className="text-blue-600 text-sm">
                  Purchase $BALL tokens from supported Solana DEXs to participate in the hourly sweepstakes.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle className="w-5 h-5 text-green-500 fill-current" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Wait for the Drawing</h3>
                <p className="text-blue-600 text-sm">
                  Drawings occur every hour on the hour. Check results to see if you've won!
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle className="w-5 h-5 text-green-500 fill-current" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Claim Your Prize</h3>
                <p className="text-blue-600 text-sm">
                  Winners automatically receive their prize!
                </p>
              </div>
            </div>
          </div>
        </div>

       

       
      </div>
    </div>
  );
}