import { Dog, Menu, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false); // State to manage mobile menu visibility
  const navigate = useNavigate();
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const [profile, setProfile] = useState(null);
  const role = localStorage.getItem('user');
  const isLoggedIn = localStorage.getItem('user') && localStorage.getItem('token');
  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setProfile(data.user);
      
      } else {
        toast.error(data.message || "Failed to fetch profile.");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching profile.");
    } 
  };
  useEffect(() => {
    if(isLoggedIn){
    fetchProfile();
  }
  }, []);
  const handleLogout = () => {
    navigate('/');
    toast.success('Logout Successfully');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('auth-token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localstorage.removeItem('userDetails');
    localstorage.removeItem('id');
    localStorage.removeItem('favoriteSitters');
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-gradient-to-r from-blue-800 via-indigo-800 to-blue-900 backdrop-blur-lg bg-opacity-95 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Section with Icon */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors duration-300">
              <Dog size={28} className="text-blue-100" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
              PetCare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {isLoggedIn ? (
              <>
                {role === 'owner' ? (
                  <>
                    <Link to="/petslist" className="px-4 py-2 text-sm font-medium text-blue-100 hover:bg-white/10 rounded-lg transition-colors duration-300">
                      Pets
                    </Link>
                    <Link to="/sitterlistU" className="px-4 py-2 text-sm font-medium text-blue-100 hover:bg-white/10 rounded-lg transition-colors duration-300">
                      Sitters
                    </Link>
                    <Link to="/booklist" className="px-4 py-2 text-sm font-medium text-blue-100 hover:bg-white/10 rounded-lg transition-colors duration-300">
                      Bookings
                    </Link>
                    <Link to="/favourites" className="px-4 py-2 text-sm font-medium text-blue-100 hover:bg-white/10 rounded-lg transition-colors duration-300 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      Favorites
                    </Link>

                  </>
                ) : (
                  <>
                    <Link to="/sitterlist" className="px-4 py-2 text-sm font-medium text-blue-100 hover:bg-white/10 rounded-lg transition-colors duration-300">
                      Sitters
                    </Link>
                    <Link to="/sitter-bookings" className="px-4 py-2 text-sm font-medium text-blue-100 hover:bg-white/10 rounded-lg transition-colors duration-300">
                      Bookings
                    </Link>
                    <Link to="/ownersList" className="px-4 py-2 text-sm font-medium text-blue-100 hover:bg-white/10 rounded-lg transition-colors duration-300">
                      Owners
                    </Link>
                  </>
                )}
                <Link to="/chatbot" className="px-4 py-2 text-sm font-medium text-blue-100 hover:bg-white/10 rounded-lg transition-colors duration-300">
                  Chatbot
                </Link>
                <div className="pl-4 flex items-center space-x-4 border-l border-white/10">
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
                  >
                    Logout
                  </button>
                  <div className="relative group">
                    <img
                      src={profile?.profile}
                      alt="Profile"
                      className="w-10 h-10 rounded-full ring-2 ring-white/20 hover:ring-white/40 cursor-pointer transition-all duration-300"
                      onClick={() => navigate('/profile')}
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-blue-900"></div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-blue-100 hover:bg-white/10 rounded-lg transition-colors duration-300">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-500/20 transition-all duration-300">
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button and Profile */}
          <div className="md:hidden flex items-center space-x-4">
            {isLoggedIn && (
              <div className="relative group">
                <img
                  src={profile?.profile}
                  alt="Profile"
                  className="w-10 h-10 rounded-full ring-2 ring-white/20 hover:ring-white/40 cursor-pointer transition-all duration-300"
                  onClick={() => navigate('/profile')}
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-blue-900"></div>
              </div>
            )}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-300 focus:outline-none"
              aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {menuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu with Glass Effect */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gradient-to-b from-blue-900/95 to-indigo-900/95 backdrop-blur-lg border-t border-white/10 shadow-xl">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {isLoggedIn ? (
              <>
                {role === 'owner' ? (
                  <>
                    <Link to="/petslist" className="block px-4 py-3 text-sm font-medium text-blue-100 hover:bg-white/10 rounded-lg transition-colors duration-300 hover:translate-x-2 transform">
                      Pets
                    </Link>
                    <Link to="/sitterlistU" className="block px-4 py-3 text-sm font-medium text-blue-100 hover:bg-white/10 rounded-lg transition-colors duration-300 hover:translate-x-2 transform">
                      Sitters
                    </Link>
                    <Link to="/favourites" className="px-4 py-2 text-sm font-medium text-blue-100 hover:bg-white/10 rounded-lg transition-colors duration-300 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>

                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/sitterlist" className="block px-4 py-3 text-sm font-medium text-blue-100 hover:bg-white/10 rounded-lg transition-colors duration-300 hover:translate-x-2 transform">
                      Sitters
                    </Link>
                    <Link to="/ownersList" className="block px-4 py-3 text-sm font-medium text-blue-100 hover:bg-white/10 rounded-lg transition-colors duration-300 hover:translate-x-2 transform">
                      Owners
                    </Link>
                  </>
                )}
                <Link to="/booklist" className="block px-4 py-3 text-sm font-medium text-blue-100 hover:bg-white/10 rounded-lg transition-colors duration-300 hover:translate-x-2 transform">
                  Bookings
                </Link>
                <Link to="/chatbot" className="block px-4 py-3 text-sm font-medium text-blue-100 hover:bg-white/10 rounded-lg transition-colors duration-300 hover:translate-x-2 transform">
                  Chatbot
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full mt-4 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <Link to="/login" className="block px-4 py-3 text-sm font-medium text-blue-100 hover:bg-white/10 rounded-lg transition-colors duration-300 hover:translate-x-2 transform">
                  Login
                </Link>
                <Link to="/register" className="block px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
