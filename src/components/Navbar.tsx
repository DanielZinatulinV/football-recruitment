import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/talent', label: 'Find Talent' },
  { to: '/jobs', label: 'Find Jobs' },
  { to: '/dashboard', label: 'Dashboard' },
];

const authLinks = [
  { to: '/login', label: 'Sign In' },
  { to: '/register', label: 'Sign Up' },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <nav className="bg-black border-b border-gray-800 sticky top-0 z-50 shadow-md">
      <div className=" mx-auto px-8 h-16 flex items-center justify-between">
        {/* Логотип */}
        <Link to="/" className="font-extrabold text-2xl text-yellow-300 tracking-tight no-underline uppercase mr-8" style={{ letterSpacing: 0 }}>
          FootballRecruitment
        </Link>
        {/* Навигация */}
        <div className="hidden md:flex flex-1 items-center justify-between">
          <div className="flex gap-8 items-center">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative font-medium no-underline text-base px-1 transition-colors duration-200 ${location.pathname.startsWith(link.to)
                  ? 'text-yellow-300 font-bold after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-yellow-300 after:rounded'
                  : 'text-white hover:text-yellow-300'}`}
                style={{ letterSpacing: 0 }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-6 items-center ml-8">
            {authLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative font-medium no-underline text-base px-1 transition-colors duration-200 ${location.pathname.startsWith(link.to)
                  ? 'text-yellow-300 font-bold after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-yellow-300 after:rounded'
                  : 'text-white hover:text-yellow-300'}`}
                style={{ letterSpacing: 0 }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        {/* Mobile menu button */}
        <button className="md:hidden text-yellow-300 text-3xl focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800 shadow-md px-4 py-4 flex flex-col gap-2">
          {[...navLinks, ...authLinks].map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`relative font-medium no-underline text-lg py-2 px-1 transition-colors duration-200 ${location.pathname.startsWith(link.to)
                ? 'text-yellow-300 font-bold after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-yellow-300 after:rounded'
                : 'text-white hover:text-yellow-300'}`}
              style={{ letterSpacing: 0 }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
