import { FaTwitter } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-[#0d111c] text-white py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-sm md:text-base">
        {/* Colonne 1 : À propos */}
        <div>
          <h3 className="font-bold text-lg mb-2">Powerball $BALL</h3>
          <p className="text-gray-400">
            The first hourly sweepstakes on the Solana blockchain. Every hour brings a new chance to win prizes!
          </p>
          <div className="mt-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white text-xl">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Colonne 2 : Résultats */}
        <div>
          <h3 className="font-bold text-lg mb-2">Results & Winners</h3>
          <ul>
            <li>
              <a href="/results" className="text-gray-400 hover:text-white">Latest Results</a>
            </li>
          </ul>
        </div>

        {/* Colonne 3 : Ressources */}
        <div>
          <h3 className="font-bold text-lg mb-2">Resources</h3>
          <ul>
            <li><a href="/how-to-play" className="text-gray-400 hover:text-white">How to Play</a></li>
            <li><a href="/faq" className="text-gray-400 hover:text-white">FAQ</a></li>
            <li><a href="https://solana.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">Contract ↗</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
        <p>© 2025 Powerball $BALL. All rights reserved.</p>

        <p className="text-yellow-400 font-semibold mt-4">IMPORTANT LEGAL DISCLAIMER</p>
        <p className="mt-2 text-gray-400">
          This platform is not a government-sponsored or state-regulated game. Powerball $BALL is a <span className="font-bold">memecoin project</span> and entertainment platform built on the Solana blockchain. It is not affiliated with, endorsed by, or connected to any official Powerball game or government-sponsored drawing.
        </p>
        <p className="mt-2 text-gray-400">
          This platform operates as a cryptocurrency token giveaway for entertainment purposes only. Participants should only engage with funds they can afford to lose. This is not gambling or an investment vehicle.
        </p>
        <p className="mt-2 text-gray-400">
          By using this platform, you acknowledge that you understand the risks associated with cryptocurrency trading and blockchain technology. You are solely responsible for compliance with your local laws and regulations.
        </p>
        <p className="mt-2 text-gray-400 italic">
          For entertainment purposes only. Please gamble responsibly and only participate if it is legal in your jurisdiction.
        </p>
      </div>
    </footer>
  )
}
