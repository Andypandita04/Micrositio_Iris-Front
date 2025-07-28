import React from 'react';
import { DocumentManager } from '../../components/DocumentManager/DocumentManager';
import './DocumentManagerExample.css';

/**
 * Ejemplo de página que utiliza el DocumentManager.
 * Este componente muestra cómo integrar la gestión de documentos
 * en una página de Testing Card.
 */
export const TestingCardDocumentsExample: React.FC = () => {
  // En un caso real, obtendrías este ID desde los parámetros de la ruta
  // o desde el contexto de la aplicación
  const testingCardId = 123;

  return (
    <div className="testing-card-documents-page">
      <div className="container">
        <div className="page-header">
          <h1>Testing Card #{testingCardId}</h1>
          <p>Gestiona los documentos asociados a esta Testing Card</p>
        </div>

        <div className="page-content">
          {/* Otros componentes de la Testing Card */}
          <div className="testing-card-info">
            <h2>Información de la Testing Card</h2>
            <p>Aquí iría la información básica de la Testing Card...</p>
          </div>

          {/* Gestión de documentos */}
          <div className="documents-section">
            <DocumentManager 
              testingCardId={testingCardId}
              className="testing-card-documents"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestingCardDocumentsExample;
