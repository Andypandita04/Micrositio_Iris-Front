import React from 'react';
import { useTheme } from '../../../hooks/useTheme';
import { Sun, Moon, LogIn } from 'lucide-react';
import BubbleBackground from '../BubbleBackground/BubbleBackground';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <BubbleBackground />
      
      <div className={styles['header-content']}>
        <div className={styles['logo-area']}>
          <div className={styles['logo-icon']}>
            <span className={styles['logo-text']}>IR</span>
          </div>
          <h1 className={styles['logo-title']}>
            <span className={styles['logo-innovative']}>Innovative</span>
            <span className={styles['logo-repository']}>Repository</span>
          </h1>
        </div>

        <div className={styles['header-actions']}>
          <button 
            onClick={toggleTheme}
            className={styles['theme-toggle']}
            aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {isDarkMode ? 
              <Sun className={styles['theme-icon-sun']} /> : 
              <Moon className={styles['theme-icon-moon']} />
            }
          </button>

          <button className={styles['login-button']}>
            <LogIn className={styles['login-icon']} />
            <span>Login</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;