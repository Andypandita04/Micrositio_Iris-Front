import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import Proyectos from './pages/Proyectos/Proyectos';
import ProyectoDetalle from './pages/ProyectoDetalle/ProyectoDetalle';
import Agentes from './pages/Agentes/Agentes';
import Licencias from './pages/Licencias/Licencias';
import Equipo from './pages/Equipo/Equipo';
import Perfil from './pages/Perfil/Perfil';
import Assistant from './pages/Assistant';

/**
 * Componente principal de la aplicación
 * 
 * @component App
 * @description Componente raíz que configura el enrutamiento, proveedores de contexto
 * y la estructura general de la aplicación. Incluye el sistema de autenticación
 * y gestión de temas.
 * 
 * Características principales:
 * - Configuración de React Router para navegación
 * - Proveedores de contexto para tema y autenticación
 * - Rutas protegidas y públicas
 * - Layout principal compartido
 * - Redirección automática para rutas no encontradas
 * 
 * Estructura de rutas:
 * - / : Página de inicio
 * - /proyectos : Lista de proyectos
 * - /proyectos/:id : Detalle de proyecto específico
 * - /perfil : Página de perfil de usuario
 * - /equipo : Página del equipo
 * - /agentes : Página de agentes
 * - /licencias : Página de licencias
 * - /assistant : Asistente interactivo
 * 
 * @returns {JSX.Element} Aplicación completa
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="proyectos" element={<Proyectos />} />
              <Route path="proyectos/:proyectoId" element={<ProyectoDetalle />} />
              <Route path="perfil" element={<Perfil />} />
              <Route path="equipo" element={<Equipo />} />
              <Route path="agentes" element={<Agentes />} />
              <Route path="licencias" element={<Licencias />} />
              <Route path="assistant" element={<Assistant />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;