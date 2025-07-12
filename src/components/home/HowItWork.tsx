
export default function HowItWorksHorizontal() {
  return (
    <section className="py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

      <div className="flex flex-col md:flex-row justify-center gap-8 max-w-6xl mx-auto">
        {/* Étape 1 */}
        <div className="flex-1 flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold mb-4 text-blue-600">1</div>
          <h3 className="text-xl font-bold mb-3">Hold $BALL Tokens</h3>
          <p className="text-gray-600">
            Every 10,000 $BALL tokens you hold = 1 raffle entry
          </p>
        </div>

        {/* Étape 2 */}
        <div className="flex-1 flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold mb-4 text-blue-600">2</div>
          <h3 className="text-xl font-bold mb-3">More Entries = Better Odds</h3>
          <p className="text-gray-600">
            50,000 tokens = 5 entries, 100,000 tokens = 10 entries
          </p>
        </div>

        {/* Étape 3 */}
        <div className="flex-1 flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold mb-4 text-blue-600">3</div>
          <h3 className="text-xl font-bold mb-3">Hourly Draws</h3>
          <p className="text-gray-600">
            VRF selects a random ticket every hour, winner gets paid automatically
          </p>
        </div>
      </div>
    </section>
  );
}