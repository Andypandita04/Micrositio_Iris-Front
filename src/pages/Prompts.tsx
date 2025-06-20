import React from 'react';

const Prompts: React.FC = () => {
  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Prompts</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Biblioteca de prompts en desarrollo. Aquí se mostrarán prompts categorizados por caso de uso.
        </p>
      </div>
    </div>
  );
};

export default Prompts;