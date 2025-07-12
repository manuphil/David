const TOKEN_MINT_ADDRESS = "7qi1pPouJhaQiVoNmnAnGmTaJbs5rXRFZXbQAmPZYehd"; // Remplace par ton adresse de mint

const StillHaveQuestionsSection = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Still Have Questions?
        </h2>

        {/* Subtitle */}
        <p className="text-gray-600 mb-8">
          Can't find what you're looking for? Feel free to reach out to our community for help.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={`https://raydium.io/swap/?inputMint=sol&outputMint=${TOKEN_MINT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold py-3 px-6 rounded shadow transition"
          >
            Buy $BALL Tokens
          </a>

          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
            Back to Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default StillHaveQuestionsSection;
