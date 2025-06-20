import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon, LogIn } from 'lucide-react';
import BubbleBackground from './BubbleBackground';

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="relative h-24 md:h-32 overflow-hidden">
      <BubbleBackground />
      
      <div className="relative z-10 h-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Area */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-purple rounded-full flex items-center justify-center">
            <span className="text-white font-bold">IR</span>
          </div>
          <h1 className="ml-3 text-xl md:text-2xl font-bold">
            <span className="text-primary-purple">Innovative</span>
            <span className="text-primary-yellow">Repository</span>
          </h1>
        </div>

        {/* Right Side - Theme Toggle & Login */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? 
              <Sun className="h-5 w-5 text-primary-yellow" /> : 
              <Moon className="h-5 w-5 text-secondary-purple" />
            }
          </button>

          <button className="flex items-center space-x-2 bg-primary-purple hover:bg-primary-purple/90 text-white px-4 py-2 rounded-lg shadow-md transition-all">
            <LogIn className="h-4 w-4" />
            <span>Login</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;