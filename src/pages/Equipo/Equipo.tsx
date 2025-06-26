import React from 'react';
import styles from './Equipo.module.css';

const Equipo: React.FC = () => {
  return (
    <div className={styles['equipo-container']}>
      <div className={styles['equipo-content']}>
        <h1 className={styles['equipo-title']}>Equipo</h1>
        <p className={styles['equipo-description']}>
          Sección de Equipo en desarrollo. Aquí se mostrará información sobre los miembros del equipo.
        </p>
      </div>
    </div>
  );
};

export default Equipo;