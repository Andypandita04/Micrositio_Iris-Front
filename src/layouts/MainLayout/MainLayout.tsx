import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/layout/Header/Header';
import Footer from '../../components/layout/Footer/Footer';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import SearchBar from '../../components/layout/SearchBar/SearchBar';
import styles from './MainLayout.module.css';

const MainLayout: React.FC = () => {
  return (
    <div className={styles['main-layout']}>
      <Header />
      <SearchBar />
      
      <div className={styles['content-wrapper']}>
        <Sidebar />
        <main className={styles['main-content']}>
          <Outlet />
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default MainLayout;