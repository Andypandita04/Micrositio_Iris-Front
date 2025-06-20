import React from 'react';

const Blog: React.FC = () => {
  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Blog</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Contenido del blog en desarrollo. Aquí se mostrarán artículos, tutoriales y recursos.
        </p>
      </div>
    </div>
  );
};

export default Blog;