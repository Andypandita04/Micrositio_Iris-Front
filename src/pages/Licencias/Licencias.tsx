import React from 'react';
import styles from './Licencias.module.css';

const Licencias: React.FC = () => {
  return (
    <div className={styles['licencias-container']}>
      <div className={styles['licencias-content']}>
        <h1 className={styles['licencias-title']}>Licencias</h1>
        <p className={styles['licencias-description']}>
          Sección de Licencias en desarrollo. Aquí se mostrarán las licencias de software y herramientas.
        </p>
      </div>
    </div>
  );
};

export default Licencias;