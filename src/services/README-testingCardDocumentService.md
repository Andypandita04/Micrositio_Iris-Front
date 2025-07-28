# 📄 Testing Card Document Service

Servicio para gestionar documentos asociados a Testing Cards, incluyendo subida, consulta y eliminación de archivos.

## 🚀 Características

- ✅ **Subida de documentos** con validación de tipo y tamaño
- ✅ **Consulta de documentos** por Testing Card
- ✅ **Eliminación de documentos** individual
- ✅ **Validación de archivos** en cliente
- ✅ **Hook personalizado** para React
- ✅ **Componente UI** completo
- ✅ **TypeScript** completamente tipado

## 📦 Instalación

Los archivos se han creado en la siguiente estructura:

```
src/
├── services/
│   └── testingCardDocumentService.ts     # Servicio principal
├── hooks/
│   └── useDocuments.ts                   # Hook personalizado
└── components/
    └── DocumentManager/
        ├── DocumentManager.tsx           # Componente principal
        ├── DocumentManager.css          # Estilos del componente
        ├── DocumentManagerExample.tsx   # Ejemplo de uso
        └── DocumentManagerExample.css   # Estilos del ejemplo
```

## 🛠 Uso Básico

### 1. Importar el Servicio

```typescript
import { 
  uploadDocument, 
  getDocumentsByTestingCard, 
  deleteDocument,
  validateFile 
} from '../services/testingCardDocumentService';
```

### 2. Subir un Documento

```typescript
const handleFileUpload = async (file: File, testingCardId: number) => {
  try {
    // Validar archivo primero
    const validation = validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Subir documento
    const document = await uploadDocument(testingCardId, file);
    console.log('Documento subido:', document);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### 3. Obtener Documentos

```typescript
const loadDocuments = async (testingCardId: number) => {
  try {
    const documents = await getDocumentsByTestingCard(testingCardId);
    console.log('Documentos:', documents);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### 4. Eliminar Documento

```typescript
const handleDelete = async (documentId: string) => {
  try {
    await deleteDocument(documentId);
    console.log('Documento eliminado');
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

## 🎣 Hook Personalizado

### Uso del Hook `useDocuments`

```typescript
import { useDocuments } from '../hooks/useDocuments';

const MyComponent = ({ testingCardId }) => {
  const {
    documents,           // Lista de documentos
    loading,             // Estado de carga
    error,               // Error actual
    uploading,           // Estado de subida
    deleting,            // Estado de eliminación
    uploadDocument,      // Función para subir
    deleteDocument,      // Función para eliminar
    validateFile,        // Función de validación
    refetch,             // Recargar documentos
    clearError           // Limpiar error
  } = useDocuments(testingCardId);

  // Usar el estado y funciones...
};
```

## 🎨 Componente DocumentManager

### Uso Básico

```typescript
import { DocumentManager } from '../components/DocumentManager/DocumentManager';

const TestingCardPage = () => {
  const testingCardId = 123;

  return (
    <div>
      <h1>Testing Card #{testingCardId}</h1>
      <DocumentManager 
        testingCardId={testingCardId}
        className="my-custom-class"
      />
    </div>
  );
};
```

### Props del Componente

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `testingCardId` | `number` | ✅ | ID de la Testing Card |
| `className` | `string` | ❌ | Clase CSS adicional |

## 📋 Tipos de Documentos Soportados

### Tipos de Archivo Permitidos

- **Imágenes**: JPG, PNG, GIF, WebP, SVG
- **Documentos**: PDF, DOC, DOCX, TXT, CSV  
- **Hojas de Cálculo**: XLS, XLSX
- **Presentaciones**: PPT, PPTX
- **Videos**: MP4, MPEG, QuickTime, AVI, WebM
- **Audio**: MP3, WAV, OGG

### Restricciones

- **Tamaño máximo**: 50MB por archivo
- **Archivos simultáneos**: 1 por subida
- **Longitud del nombre**: Máximo 255 caracteres

## 🔧 Funciones Auxiliares

### Validación de Archivos

```typescript
import { validateFile } from '../services/testingCardDocumentService';

const validation = validateFile(file);
if (!validation.valid) {
  console.error(validation.error);
}
```

### Utilidades de Formato

```typescript
import { 
  formatFileSize,     // Formatear tamaño: "1.5 MB"
  getFileExtension,   // Obtener extensión: "pdf"
  getDocumentType,    // Obtener tipo: "document"
  getDocumentIcon,    // Obtener clase CSS: "fas fa-file-pdf"
  isImage,            // Verificar si es imagen
  isVideo,            // Verificar si es video
  isAudio             // Verificar si es audio
} from '../services/testingCardDocumentService';

// Ejemplos de uso
const size = formatFileSize(1048576);        // "1 MB"
const ext = getFileExtension("document.pdf"); // "pdf"
const type = getDocumentType("application/pdf"); // "pdf"
const icon = getDocumentIcon("application/pdf"); // "fas fa-file-pdf"
```

## 🚨 Manejo de Errores

### Errores Comunes

```typescript
try {
  await uploadDocument(testingCardId, file);
} catch (error) {
  if (error.message.includes('50MB')) {
    // Archivo muy grande
    showError('El archivo excede los 50MB permitidos');
  } else if (error.message.includes('no permitido')) {
    // Tipo no permitido
    showError('Tipo de archivo no soportado');
  } else if (error.message.includes('Testing Card')) {
    // Testing Card no existe
    showError('Testing Card no encontrada');
  } else {
    // Error genérico
    showError('Error al subir documento');
  }
}
```

### Estados de Error en el Hook

```typescript
const { error, clearError } = useDocuments(testingCardId);

useEffect(() => {
  if (error) {
    // Mostrar error al usuario
    toast.error(error);
    
    // Limpiar error después de mostrarlo
    setTimeout(clearError, 5000);
  }
}, [error, clearError]);
```

## 🎯 Ejemplos Avanzados

### Drag & Drop

```typescript
const handleDrop = async (event: React.DragEvent) => {
  event.preventDefault();
  const files = Array.from(event.dataTransfer.files);
  
  for (const file of files) {
    try {
      await uploadDocument(file);
    } catch (error) {
      console.error(`Error subiendo ${file.name}:`, error);
    }
  }
};
```

### Progress Bar

```typescript
const [uploadProgress, setUploadProgress] = useState(0);

const uploadWithProgress = async (file: File) => {
  try {
    setUploadProgress(0);
    
    // Simular progreso (en implementación real usar axios onUploadProgress)
    const interval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 100);
    
    await uploadDocument(testingCardId, file);
    
    clearInterval(interval);
    setUploadProgress(100);
    
    setTimeout(() => setUploadProgress(0), 1000);
  } catch (error) {
    setUploadProgress(0);
    throw error;
  }
};
```

### Filtros de Documentos

```typescript
const [filter, setFilter] = useState('all');

const filteredDocuments = useMemo(() => {
  if (filter === 'all') return documents;
  
  return documents.filter(doc => {
    switch (filter) {
      case 'images': return isImage(doc.document_type);
      case 'videos': return isVideo(doc.document_type);
      case 'documents': return getDocumentType(doc.document_type) === 'pdf';
      default: return true;
    }
  });
}, [documents, filter]);
```

## 🔒 Consideraciones de Seguridad

- ✅ Validación de tipos MIME en cliente y servidor
- ✅ Límites de tamaño de archivo
- ✅ Sanitización de nombres de archivo
- ⚠️ Los archivos son públicos una vez subidos
- ⚠️ No hay autenticación implementada

## 🚀 Próximas Mejoras

- [ ] Autenticación de usuarios
- [ ] Permisos granulares por documento
- [ ] Versionado de documentos
- [ ] Preview de documentos
- [ ] Compresión automática de imágenes
- [ ] Escaneo de virus
- [ ] Metadatos de archivos

## 📞 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/testing-card/{id}/documents` | Subir documento |
| `GET` | `/testing-card/{id}/documents` | Obtener documentos |
| `DELETE` | `/documents/{id}` | Eliminar documento |

Consulta el informe técnico completo para más detalles sobre los endpoints y respuestas de la API.

---

**Fecha de Implementación**: 25 de Julio, 2025  
**Versión**: 1.0.0  
**Compatibilidad**: React 18+, TypeScript 4.5+
