import React from 'react';
import styles from './Agentes.module.css';

const Agentes: React.FC = () => {
  return (
    <div className={styles['agentes-container']}>
      <div className={styles['agentes-content']}>
        <h1 className={styles['agentes-title']}>Agentes</h1>
        <p className={styles['agentes-description']}>
          Sección de Agentes en desarrollo. Aquí se mostrarán los agentes de IA disponibles.
        </p>
      </div>
    </div>
  );
};

export default Agentes;