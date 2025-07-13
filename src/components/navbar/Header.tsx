import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ExternalLink } from 'lucide-react';

const BALL_TOKEN_MINT = "7qi1pPouJhaQiVoNmnAnGmTaJbs5rXRFZXbQAmPZYehd";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const raydiumUrl = `https://raydium.io/swap/?inputMint=sol&outputMint=${BALL_TOKEN_MINT}`;

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        {/* Logo + Menu mobile */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link to="/" className="flex items-center">
            {['W', 'I', 'N', 'A', 'R', 'Y'].map((letter, i) => (
              <div
                key={i}
                className="w-7 h-7 md:w-11 md:h-11 bg-gradient-to-b from-blue-100 to-blue-300 rounded-full flex items-center justify-center text-black font-bold text-xs md:text-sm mx-0.5 shadow"
              >
                {letter}
              </div>
            ))}
            <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm mx-0.5 shadow">
              BALL
            </div>
          </Link>

          {/* Menu button (mobile only) */}
          <div className="md:hidden ml-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
              className="focus:outline-none"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-gray-800" />
              ) : (
                <Menu className="w-6 h-6 text-gray-800" />
              )}
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center text-gray-800 font-semibold text-sm md:text-base">
          <Link to="/results" className="hover:text-blue-500 transition-colors">
            RESULTS
          </Link>
          <Link to="/how-to-play" className="hover:text-blue-500 transition-colors">
            HOW TO PLAY
          </Link>
          <Link to="/faq" className="hover:text-blue-500 transition-colors">
            FAQ
          </Link>
        </nav>

        {/* Right section (Buy Button) */}
        <div className="hidden md:flex items-center gap-2 md:gap-4">
          <a
            href={raydiumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold py-2 px-4 rounded-md flex items-center gap-2 transition-all duration-200 hover:scale-105 shadow-md"
          >
            <ExternalLink className="w-4 h-4" />
            Buy $BALL
          </a>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white px-6 py-4 border-t border-gray-200 shadow-md">
          <nav className="flex flex-col space-y-4 text-gray-800 font-semibold text-base">
            <Link 
              to="/results" 
              onClick={() => setIsOpen(false)}
              className="hover:text-blue-500 transition-colors"
            >
              RESULTS
            </Link>
            <Link 
              to="/how-to-play" 
              onClick={() => setIsOpen(false)}
              className="hover:text-blue-500 transition-colors"
            >
              HOW TO PLAY
            </Link>
            <Link 
              to="/faq" 
              onClick={() => setIsOpen(false)}
              className="hover:text-blue-500 transition-colors"
            >
              FAQ
            </Link>

            <a
              href={raydiumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold py-3 px-4 rounded-md flex items-center gap-2 transition-all duration-200 mt-4 justify-center"
              onClick={() => setIsOpen(false)}
            >
              <ExternalLink className="w-4 h-4" />
              Buy $BALL on Raydium
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
