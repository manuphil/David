import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      {/* Logo WINNARY BALL */}
      <div className="flex items-center">
        {['P', 'O', 'W', 'E', 'R'].map((letter, index) => (
          <div
            key={index}
            className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-b from-gray-100 to-gray-300 rounded-full flex items-center justify-center text-black font-bold text-sm mx-1 shadow-md"
          >
            {letter}
          </div>
        ))}
        <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-b from-red-400 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm mx-1 shadow-md">
          BALL
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex gap-6 text-sm md:text-base text-gray-800 font-medium">
        <Link to="/results" className="hover:text-red-600">RESULTS</Link>
        <Link to="/how-to-play" className="hover:text-red-600">HOW TO PLAY</Link>
        <Link to="/faq" className="hover:text-red-600">FAQ</Link>
      </nav>
    </header>
  )
}
