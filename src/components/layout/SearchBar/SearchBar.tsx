import React, { useState } from 'react';
import { Search, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './SearchBar.module.css';

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Buscando:', searchQuery);
  };

  return (
    <div className={styles['search-container']}>
      <div className={styles['search-content']}>
        <form 
          onSubmit={handleSearch} 
          className={styles['search-form']}
        >
          <div className={styles['search-input-container']}>
            <div className={styles['search-icon']}>
              <Search />
            </div>
            <input
              type="search"
              className={styles['search-input']}
              placeholder="Buscar recursos, lecciones, prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              required
            />
            <button
              type="submit"
              className={styles['search-button']}
            >
              Buscar
            </button>
          </div>
        </form>
        
        <Link
          to="/assistant"
          className={styles['assistant-button']}
        >
          <Bot className={styles['assistant-icon']} />
          <span>Asistente</span>
        </Link>
      </div>
    </div>
  );
};

export default SearchBar;