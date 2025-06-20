import React, { useState } from 'react';
import { Search, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here
    console.log('Searching for:', searchQuery);
    // This would connect to a search API or function
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-3 px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <form 
          onSubmit={handleSearch} 
          className="flex-1 flex w-full"
        >
          <div className="relative flex-1 max-w-2xl">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="search"
              className="block w-full p-2.5 pl-10 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-purple dark:focus:ring-primary-yellow focus:border-primary-purple dark:focus:border-primary-yellow"
              placeholder="Buscar recursos, lecciones, prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              required
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 bg-primary-purple dark:bg-primary-yellow text-white dark:text-gray-900 rounded-r-lg hover:bg-primary-purple/90 dark:hover:bg-primary-yellow/90 transition-colors"
            >
              Buscar
            </button>
          </div>
        </form>
        
        <Link
          to="/assistant"
          className="flex items-center justify-center gap-2 bg-secondary-purple hover:bg-secondary-purple/90 text-white py-2.5 px-4 rounded-lg transition-colors whitespace-nowrap"
        >
          <Bot className="w-5 h-5" />
          <span>Asistente</span>
        </Link>
      </div>
    </div>
  );
};

export default SearchBar;