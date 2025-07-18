import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/store';
import { clearUser } from '../redux/slices/auth.slice';

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
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const unreadMessagesCount = useAppSelector(state => state.auth.unreadMessagesCount);

  const handleLogout = () => {
    localStorage.clear();
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    dispatch(clearUser());
    navigate('/login');
  };

  // Определяем ссылку для роли
  let mainNavLink = null;
  if (user?.role === 'candidate') {
    mainNavLink = <Link to="/jobs" className={`relative font-medium no-underline text-base px-1 transition-colors duration-200 ${location.pathname.startsWith('/jobs') ? 'text-yellow-300 font-bold after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-yellow-300 after:rounded' : 'text-white hover:text-yellow-300'}`} style={{ letterSpacing: 0 }}>Find Jobs</Link>;
  } else if (user?.role === 'team') {
    mainNavLink = <Link to="/talent" className={`relative font-medium no-underline text-base px-1 transition-colors duration-200 ${location.pathname.startsWith('/talent') ? 'text-yellow-300 font-bold after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-yellow-300 after:rounded' : 'text-white hover:text-yellow-300'}`} style={{ letterSpacing: 0 }}>Find Talent</Link>;
  }

  // Клик по логотипу
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="bg-black border-b border-gray-800 sticky top-0 z-50 shadow-md">
      <div className=" mx-auto px-8 h-16 flex items-center justify-between">
        {/* Логотип */}
        <a href={user ? "/dashboard" : "/"} onClick={handleLogoClick} className="font-extrabold text-2xl text-yellow-300 tracking-tight no-underline uppercase mr-8" style={{ letterSpacing: 0 }}>
          Footy
        </a>
        {/* Навигация */}
        <div className="hidden md:flex flex-1 items-center justify-between">
          <div className="flex gap-8 items-center">
            {mainNavLink}
            {user && (
              <Link
                to="/dashboard"
                className={`relative font-medium no-underline text-base px-1 transition-colors duration-200 ${location.pathname.startsWith('/dashboard') ? 'text-yellow-300 font-bold after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-yellow-300 after:rounded' : 'text-white hover:text-yellow-300'}`}
                style={{ letterSpacing: 0 }}
              >
                Dashboard
              </Link>
            )}
          </div>
          <div className="flex gap-6 items-center ml-8">
            {user ? (
              <>
                <span className="text-yellow-300 font-bold text-base mr-2">{user.first_name || user.email}</span>
                {/* Иконка чата */}
                <button
                  onClick={() => navigate('/inbox')}
                  className="p-2 rounded-full hover:bg-yellow-100 transition focus:outline-none relative"
                  title="Чат"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-yellow-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v7.5A2.25 2.25 0 0 1 19.5 16.5h-7.818a.75.75 0 0 0-.53.22l-3.53 3.53a.75.75 0 0 1-1.28-.53V16.5A2.25 2.25 0 0 1 2.25 14.25v-7.5A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25Z" />
                  </svg>
                  {unreadMessagesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center shadow">
                      {unreadMessagesCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="rounded px-4 py-2 bg-yellow-300 text-black font-bold hover:bg-yellow-400 transition text-base"
                >
                  Logout
                </button>
              </>
            ) : (
              authLinks.map(link => (
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
              ))
            )}
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
          {[...navLinks, ...(user ? [] : authLinks)].map(link => (
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
          {user && (
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-yellow-300 font-bold text-base">{user.first_name || user.email}</span>
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="rounded px-4 py-2 bg-yellow-300 text-black font-bold hover:bg-yellow-400 transition text-base"
            >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
