import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import MainLayout from './layouts/MainLayout/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import Proyectos from './pages/Proyectos/Proyectos';
import ProyectoDetalle from './pages/ProyectoDetalle/ProyectoDetalle';
import Agentes from './pages/Agentes/Agentes';
import Licencias from './pages/Licencias/Licencias';
import Equipo from './pages/Equipo/Equipo';
import Assistant from './pages/Assistant';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="proyectos" element={<Proyectos />} />
            <Route path="proyecto-:proyectoId" element={<ProyectoDetalle />} />
            <Route path="agentes" element={<Agentes />} />
            <Route path="licencias" element={<Licencias />} />
            <Route path="equipo" element={<Equipo />} />
            <Route path="assistant" element={<Assistant />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;