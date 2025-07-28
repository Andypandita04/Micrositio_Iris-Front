// Exportaciones del servicio de documentos de Testing Cards
export * from './testingCardDocumentService';
export * from '../hooks/useDocuments';
export { DocumentManager } from '../components/DocumentManager/DocumentManager';
export { TestingCardDocumentsExample } from '../components/DocumentManager/DocumentManagerExample';

// Re-exportar tipos principales para facilitar el uso
export type {
  TestingCardDocument,
  DocumentUploadResponse,
  DocumentListResponse,
  DocumentDeleteResponse,
  FileValidationResult
} from './testingCardDocumentService';
