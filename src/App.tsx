import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import Blog from './pages/Blog';
import Prompts from './pages/Prompts';
import Experimentos from './pages/Experimentos';
import TestingCards from './pages/TestingCards';
import LearningCards from './pages/LearningCards';
import LeccionesAsistente from './pages/LeccionesAsistente';
import Assistant from './pages/Assistant';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="blog" element={<Blog />} />
            <Route path="prompts" element={<Prompts />} />
            <Route path="experimentos" element={<Experimentos />} />
            <Route path="testing-cards" element={<TestingCards />} />
            <Route path="learning-cards" element={<LearningCards />} />
            <Route path="lecciones-asistente" element={<LeccionesAsistente />} />
            <Route path="assistant" element={<Assistant />} />
            <Route path="lecciones/:topicId" element={<LeccionesAsistente />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;