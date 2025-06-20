import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 py-6 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-10 h-10 bg-primary-purple rounded-full flex items-center justify-center">
              <span className="text-white font-bold">IR</span>
            </div>
            <h2 className="ml-3 text-lg font-bold">
              <span className="text-primary-purple">Innovative</span>
              <span className="text-primary-yellow">Repository</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-4">
                Recursos
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Información para ser completada posteriormente sobre recursos disponibles
                en nuestra plataforma.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-4">
                Soporte
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Información para ser completada posteriormente sobre opciones de
                soporte y contacto.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Innovative Repository. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;