import { useState, useEffect, useCallback } from 'react';
import { 
  TestingCardDocument, 
  uploadDocument, 
  getDocumentsByTestingCard, 
  deleteDocument,
  validateFile,
  FileValidationResult 
} from '../services/testingCardDocumentService';

/**
 * Estados del hook de documentos.
 */
interface UseDocumentsState {
  documents: TestingCardDocument[];
  loading: boolean;
  error: string | null;
  uploading: boolean;
  deleting: boolean;
}

/**
 * Valor de retorno del hook useDocuments.
 */
interface UseDocumentsReturn extends UseDocumentsState {
  uploadDocument: (file: File) => Promise<TestingCardDocument>;
  deleteDocument: (documentId: string) => Promise<void>;
  validateFile: (file: File) => FileValidationResult;
  refetch: () => Promise<void>;
  clearError: () => void;
}

/**
 * Hook personalizado para gestionar documentos de Testing Cards.
 * @param {number} testingCardId - ID de la Testing Card.
 * @returns {UseDocumentsReturn} Estado y funciones para gestionar documentos.
 */
export const useDocuments = (testingCardId: number): UseDocumentsReturn => {
  const [state, setState] = useState<UseDocumentsState>({
    documents: [],
    loading: false,
    error: null,
    uploading: false,
    deleting: false,
  });

  /**
   * Actualiza el estado parcialmente.
   */
  const updateState = useCallback((updates: Partial<UseDocumentsState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Limpia el error actual.
   */
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  /**
   * Carga los documentos desde el servidor.
   */
  const loadDocuments = useCallback(async () => {
    if (!testingCardId) return;

    updateState({ loading: true, error: null });
    try {
      const docs = await getDocumentsByTestingCard(testingCardId);
      updateState({ 
        documents: docs, 
        loading: false 
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar documentos';
      updateState({ 
        error: errorMessage, 
        loading: false 
      });
    }
  }, [testingCardId, updateState]);

  /**
   * Sube un nuevo documento.
   */
  const handleUploadDocument = useCallback(async (file: File): Promise<TestingCardDocument> => {
    if (!testingCardId) {
      throw new Error('No se ha especificado un Testing Card ID');
    }

    updateState({ uploading: true, error: null });
    try {
      const newDocument = await uploadDocument(testingCardId, file);
      
      // Actualizar la lista de documentos localmente
      setState(prev => ({
        ...prev,
        documents: [...prev.documents, newDocument],
        uploading: false
      }));

      return newDocument;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al subir documento';
      updateState({ 
        error: errorMessage, 
        uploading: false 
      });
      throw err;
    }
  }, [testingCardId, updateState]);

  /**
   * Elimina un documento.
   */
  const handleDeleteDocument = useCallback(async (documentId: string): Promise<void> => {
    updateState({ deleting: true, error: null });
    try {
      await deleteDocument(documentId);
      
      // Actualizar la lista de documentos localmente
      setState(prev => ({
        ...prev,
        documents: prev.documents.filter((doc: TestingCardDocument) => doc.id !== documentId),
        deleting: false
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar documento';
      updateState({ 
        error: errorMessage, 
        deleting: false 
      });
      throw err;
    }
  }, [updateState]);

  /**
   * Refresca la lista de documentos.
   */
  const refetch = useCallback(async () => {
    await loadDocuments();
  }, [loadDocuments]);

  // Cargar documentos cuando cambie el testingCardId
  useEffect(() => {
    if (testingCardId) {
      loadDocuments();
    } else {
      // Limpiar documentos si no hay testingCardId
      updateState({ documents: [], error: null });
    }
  }, [testingCardId, loadDocuments, updateState]);

  return {
    documents: state.documents,
    loading: state.loading,
    error: state.error,
    uploading: state.uploading,
    deleting: state.deleting,
    uploadDocument: handleUploadDocument,
    deleteDocument: handleDeleteDocument,
    validateFile,
    refetch,
    clearError,
  };
};

/**
 * Hook simplificado para validación de archivos.
 * @returns {Function} Función de validación.
 */
export const useFileValidation = () => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const validate = useCallback((file: File): boolean => {
    const result = validateFile(file);
    if (!result.valid) {
      setValidationError(result.error || 'Archivo no válido');
      return false;
    }
    setValidationError(null);
    return true;
  }, []);

  const clearValidationError = useCallback(() => {
    setValidationError(null);
  }, []);

  return {
    validate,
    validationError,
    clearValidationError,
  };
};
