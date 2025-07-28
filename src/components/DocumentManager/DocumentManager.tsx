import React, { useRef } from 'react';
import { useDocuments, useFileValidation } from '../../hooks/useDocuments';
import { 
  TestingCardDocument, 
  getDocumentIcon, 
  getFileExtension, 
  isImage 
} from '../../services/testingCardDocumentService';
import './DocumentManager.css';

interface DocumentManagerProps {
  testingCardId: number;
  className?: string;
}

/**
 * Componente para gestionar documentos de Testing Cards.
 */
export const DocumentManager: React.FC<DocumentManagerProps> = ({ 
  testingCardId, 
  className = '' 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    documents,
    loading,
    error,
    uploading,
    deleting,
    uploadDocument,
    deleteDocument,
    clearError
  } = useDocuments(testingCardId);

  const { validate, validationError, clearValidationError } = useFileValidation();

  /**
   * Maneja la selección de archivos.
   */
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    clearValidationError();
    clearError();

    // Validar archivo
    if (!validate(file)) {
      return;
    }

    try {
      await uploadDocument(file);
      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error al subir documento:', err);
    }
  };

  /**
   * Maneja la eliminación de un documento.
   */
  const handleDeleteDocument = async (documentId: string, documentName: string) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar "${documentName}"?`)) {
      return;
    }

    try {
      await deleteDocument(documentId);
    } catch (err) {
      console.error('Error al eliminar documento:', err);
    }
  };

  /**
   * Abre el selector de archivos.
   */
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  /**
   * Renderiza un documento individual.
   */
  const renderDocument = (document: TestingCardDocument) => {
    const extension = getFileExtension(document.document_name);
    const iconClass = getDocumentIcon(document.document_type);
    const isImageFile = isImage(document.document_type);

    return (
      <div key={document.id} className="document-item">
        <div className="document-info">
          <div className="document-icon">
            {isImageFile ? (
              <img 
                src={document.document_url} 
                alt={document.document_name}
                className="document-thumbnail"
              />
            ) : (
              <i className={iconClass}></i>
            )}
          </div>
          <div className="document-details">
            <h4 className="document-name" title={document.document_name}>
              {document.document_name}
            </h4>
            <p className="document-metadata">
              <span className="document-type">{extension.toUpperCase()}</span>
              <span className="document-date">
                {new Date(document.created_at).toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>
        <div className="document-actions">
          <a 
            href={document.document_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline"
            title="Ver documento"
          >
            <i className="fas fa-eye"></i>
          </a>
          <a 
            href={document.document_url} 
            download={document.document_name}
            className="btn btn-sm btn-outline"
            title="Descargar documento"
          >
            <i className="fas fa-download"></i>
          </a>
          <button
            onClick={() => handleDeleteDocument(document.id, document.document_name)}
            className="btn btn-sm btn-danger"
            disabled={deleting}
            title="Eliminar documento"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    );
  };

  /**
   * Renderiza el estado de carga.
   */
  const renderLoading = () => (
    <div className="document-loading">
      <i className="fas fa-spinner fa-spin"></i>
      <span>Cargando documentos...</span>
    </div>
  );

  /**
   * Renderiza el estado de subida.
   */
  const renderUploading = () => (
    <div className="document-uploading">
      <i className="fas fa-cloud-upload-alt fa-spin"></i>
      <span>Subiendo documento...</span>
    </div>
  );

  /**
   * Renderiza el mensaje de error.
   */
  const renderError = (errorMessage: string) => (
    <div className="document-error">
      <i className="fas fa-exclamation-circle"></i>
      <span>{errorMessage}</span>
      <button onClick={clearError} className="btn-close">
        <i className="fas fa-times"></i>
      </button>
    </div>
  );

  /**
   * Renderiza el estado vacío.
   */
  const renderEmptyState = () => (
    <div className="document-empty">
      <i className="fas fa-file-alt"></i>
      <h3>No hay documentos</h3>
      <p>Sube el primer documento para esta Testing Card</p>
    </div>
  );

  return (
    <div className={`document-manager ${className}`}>
      <div className="document-header">
        <h3>Documentos</h3>
        <button 
          onClick={openFileSelector}
          className="btn btn-primary"
          disabled={uploading || loading}
        >
          <i className="fas fa-plus"></i>
          Subir Documento
        </button>
      </div>

      {/* Input oculto para selección de archivos */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.mp4,.mpeg,.mov,.avi,.webm,.mp3,.wav,.ogg"
      />

      {/* Errores de validación */}
      {validationError && renderError(validationError)}
      
      {/* Errores de API */}
      {error && renderError(error)}

      {/* Estado de subida */}
      {uploading && renderUploading()}

      {/* Contenido principal */}
      <div className="document-content">
        {loading ? (
          renderLoading()
        ) : documents.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="document-list">
            {documents.map(renderDocument)}
          </div>
        )}
      </div>

      {/* Información adicional */}
      {documents.length > 0 && (
        <div className="document-footer">
          <p className="document-count">
            {documents.length} documento{documents.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};
