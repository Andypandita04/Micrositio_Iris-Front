import React from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import './Filters.css';

const Filters: React.FC = () => {
  const { theme, filters, setFilters } = useApp();

  const tipoOptionsDescubrimiento = [
    'Exploración',
    'Análisis de Datos',
    'Descubrimiento de interés',
    'Prototipos de interacción',
    'Preferencia y priorización',
    'Llamado a la acción',
    'Prototipos de discusión'
  ];

  const tipoOptionsValidacion = [
    'Prototipos de interacción',
    'Llamado a la acción'
  ];

  const getTipoOptions = () => {
    return filters.campo === 'Descubrimiento' ? tipoOptionsDescubrimiento : tipoOptionsValidacion;
  };

  const handleCampoChange = (campo: string) => {
    setFilters({ campo, tipo: '' });
  };

  const handleTipoChange = (tipo: string) => {
    setFilters({ ...filters, tipo });
  };

  const handleClearFilters = () => {
    setFilters({ campo: 'Descubrimiento', tipo: '' });
  };

  return (
    <div className={`filters ${theme}`}>
      <div className="filter-group">
        <label className="filter-label">Campo:</label>
        <select 
          className={`filter-select ${theme}`}
          value={filters.campo}
          onChange={(e) => handleCampoChange(e.target.value)}
        >
          <option value="Descubrimiento">Descubrimiento</option>
          <option value="Validación">Validación</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Tipo:</label>
        <select 
          className={`filter-select ${theme}`}
          value={filters.tipo}
          onChange={(e) => handleTipoChange(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          {getTipoOptions().map((tipo) => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <button 
          className={`clear-filters-button ${theme}`}
          onClick={handleClearFilters}
          title="Limpiar filtros"
        >
          <X size={16} />
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default Filters;
