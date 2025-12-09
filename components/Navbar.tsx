import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Scissors, User as UserIcon } from 'lucide-react';
import { useAuth } from '../AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isHome = location.pathname === '/';

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-white p-1.5 rounded-lg group-hover:scale-110 transition-transform">
              <Scissors size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">
              Luxe<span className="text-primary">Book</span>
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
             {!isHome && (
                <Link to="/" className="hidden md:block text-sm font-medium text-gray-500 hover:text-primary transition-colors">
                  Find Salons
                </Link>
             )}
             
             {user ? (
               <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-full transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                      <UserIcon size={16} />
                  </div>
                  <span className="text-sm font-medium text-gray-900 hidden sm:block">{user.name.split(' ')[0]}</span>
               </Link>
             ) : (
               <div className="flex gap-2">
                 <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-black px-3 py-2">
                   Log in
                 </Link>
                 <Link to="/signup" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                   Sign up
                 </Link>
               </div>
             )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
