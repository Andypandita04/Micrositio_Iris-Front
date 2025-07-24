# UrlLearningCard Service

Este servicio permite gestionar URLs asociadas a Learning Cards en el frontend de Micrositio Iris.

## Características

- **CRUD Completo**: Crear, leer, actualizar y eliminar URLs
- **Tipado TypeScript**: Completamente tipado para mejor experiencia de desarrollo
- **Integración con Learning Cards**: Conecta URLs directamente con Learning Cards específicas
- **Manejo de Errores**: Gestión robusta de errores con mensajes descriptivos

## Interfaz UrlLearningCard

```typescript
interface UrlLearningCard {
  id_url_lc: number;
  id_learning_card: number;
  url: string;
  created_at?: string;
  updated_at?: string;
}
```

## API Endpoints

El servicio se conecta con los siguientes endpoints del backend:

- `GET /url_learning_card/` - Obtener todas las URLs
- `GET /url_learning_card/l?id_learning_card={id}` - Obtener URLs por Learning Card
- `GET /url_learning_card/u?id_url_lc={id}` - Obtener URL por ID
- `POST /url_learning_card/` - Crear nueva URL
- `PATCH /url_learning_card/` - Actualizar URL existente
- `DELETE /url_learning_card/` - Eliminar URL

## Funciones Disponibles

### obtenerTodas()
Obtiene todas las URLs de Learning Cards.

```typescript
import { obtenerTodas } from '../services/urlLearningCardService';

const urls = await obtenerTodas();
console.log(urls); // Array de UrlLearningCard
```

### obtenerPorId(id_url_lc)
Obtiene una URL específica por su ID.

```typescript
import { obtenerPorId } from '../services/urlLearningCardService';

const url = await obtenerPorId(123);
console.log(url); // UrlLearningCard object
```

### obtenerPorLearningCard(id_learning_card)
Obtiene todas las URLs asociadas a una Learning Card específica.

```typescript
import { obtenerPorLearningCard } from '../services/urlLearningCardService';

const urls = await obtenerPorLearningCard(456);
console.log(urls); // Array de UrlLearningCard para la Learning Card 456
```

### crear(data)
Crea una nueva URL asociada a una Learning Card.

```typescript
import { crear } from '../services/urlLearningCardService';

const nuevaUrl = await crear({
  id_learning_card: 456,
  url: 'https://ejemplo.com/documentacion'
});
console.log(nuevaUrl); // UrlLearningCard creada
```

### actualizar(id_url_lc, data)
Actualiza una URL existente.

```typescript
import { actualizar } from '../services/urlLearningCardService';

const urlActualizada = await actualizar(123, {
  url: 'https://nuevo-url.com/documentacion'
});
console.log(urlActualizada); // UrlLearningCard actualizada
```

### eliminar(id_url_lc)
Elimina una URL por su ID.

```typescript
import { eliminar } from '../services/urlLearningCardService';

await eliminar(123); // URL eliminada
```

## Integración en LearningCardEditModal

El servicio está completamente integrado en el componente `LearningCardEditModal`. Cuando se abre la sección de documentación:

1. **Carga automática**: Las URLs se cargan automáticamente desde la base de datos
2. **Agregar URLs**: Se pueden agregar nuevas URLs que se guardan inmediatamente
3. **Eliminar URLs**: Se pueden eliminar URLs con confirmación
4. **Estados de carga**: Indicadores visuales durante las operaciones
5. **Manejo de errores**: Mensajes de error y éxito apropiados

### Características del Modal

- **Carga perezosa**: Las URLs solo se cargan cuando se abre la sección
- **Estados vacíos**: Mensaje apropiado cuando no hay URLs
- **Feedback visual**: Loading spinners y mensajes de estado
- **Validación**: Previene URLs duplicadas
- **Persistencia**: Todas las operaciones se reflejan inmediatamente en la BD

## Manejo de Errores

Todas las funciones del servicio incluyen manejo de errores robusto:

```typescript
try {
  const urls = await obtenerPorLearningCard(456);
  // Procesar URLs exitosamente
} catch (error) {
  console.error('Error al cargar URLs:', error);
  // Manejar error apropiadamente
}
```

## Configuración

El servicio utiliza la configuración de `apiClient` existente:

- **Base URL**: `http://localhost:3000`
- **Headers**: `Content-Type: application/json`
- **Axios**: Cliente HTTP configurado

## Notas de Implementación

1. **Tipado estricto**: Todas las funciones están completamente tipadas
2. **Consistencia**: Sigue los mismos patrones que otros servicios del proyecto
3. **Reutilización**: Utiliza la misma configuración de API que el resto del proyecto
4. **Escalabilidad**: Fácil de extender con nuevas funcionalidades

## Ejemplo de Uso Completo

```typescript
import React, { useState, useEffect } from 'react';
import { 
  obtenerPorLearningCard, 
  crear, 
  eliminar 
} from '../services/urlLearningCardService';

const UrlManager = ({ learningCardId }) => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarUrls();
  }, [learningCardId]);

  const cargarUrls = async () => {
    try {
      setLoading(true);
      const urlsData = await obtenerPorLearningCard(learningCardId);
      setUrls(urlsData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const agregarUrl = async (nuevaUrl) => {
    try {
      const urlCreada = await crear({
        id_learning_card: learningCardId,
        url: nuevaUrl
      });
      setUrls([...urls, urlCreada]);
    } catch (error) {
      console.error('Error al crear URL:', error);
    }
  };

  const eliminarUrl = async (id) => {
    try {
      await eliminar(id);
      setUrls(urls.filter(url => url.id_url_lc !== id));
    } catch (error) {
      console.error('Error al eliminar URL:', error);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      {urls.map(url => (
        <div key={url.id_url_lc}>
          <a href={url.url} target="_blank" rel="noopener noreferrer">
            {url.url}
          </a>
          <button onClick={() => eliminarUrl(url.id_url_lc)}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
};
```

Este servicio proporciona una interfaz completa y robusta para manejar URLs de Learning Cards en la aplicación.
