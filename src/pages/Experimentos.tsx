import React from 'react';
import FlowEditor from '../components/FlowEditor/FlowEditor';


const Experimentos: React.FC = () => {
  return (
    <div className="home-container">
      {/* Header de navegación */}
      <header className="home-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="header-title">Editor de Flujo</h1>
          </div>
          
        </div>
      </header>

      {/* Contenido principal */}
      <main className="home-main">
        <div className="main-content">
          <div className="content-header">
            <h2 className="content-title">Espacio de Trabajo</h2>
            <p className="content-subtitle">
              Haz doble clic en el canvas para crear nodos, o usa los botones en cada nodo para editarlos y crear conexiones
            </p>
          </div>
          
          {/* Componente del editor de flujo */}
          <div className="flow-container">
            <FlowEditor />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Experimentos;