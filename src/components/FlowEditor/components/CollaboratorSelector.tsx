import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Users, ChevronDown } from 'lucide-react';
import './CollaboratorSelector.css';

/**
 * Interfaz para definir un colaborador
 * @interface Collaborator
 */
interface Collaborator {
  /** ID único del colaborador */
  id: string;
  /** Nombre completo del colaborador */
  name: string;
  /** Email del colaborador */
  email: string;
  /** URL del avatar del colaborador */
  avatar?: string;
  /** Rol del colaborador en el proyecto */
  role?: string;
}

/**
 * Props para el componente CollaboratorSelector
 * @interface CollaboratorSelectorProps
 */
interface CollaboratorSelectorProps {
  /** Lista de colaboradores disponibles para seleccionar */
  availableCollaborators: Collaborator[];
  /** Lista de colaboradores actualmente seleccionados */
  selectedCollaborators: Collaborator[];
  /** Función callback cuando cambia la selección de colaboradores */
  onSelectionChange: (collaborators: Collaborator[]) => void;
  /** Placeholder para el campo de búsqueda */
  placeholder?: string;
  /** Número máximo de chips visibles antes de mostrar contador */
  maxVisibleChips?: number;
  /** Si el selector está deshabilitado */
  disabled?: boolean;
}

/**
 * Componente CollaboratorSelector
 * 
 * @component CollaboratorSelector
 * @description Selector de colaboradores con búsqueda typeahead, selección múltiple
 * y visualización en chips. Incluye dropdown con filtrado en tiempo real y
 * gestión inteligente del espacio visual.
 * 
 * Características principales:
 * - Búsqueda typeahead con filtrado instantáneo
 * - Selección múltiple con chips visuales
 * - Contador de elementos adicionales (+N)
 * - Tooltip con lista completa de seleccionados
 * - Responsive y accesible
 * - Integración con sistema de diseño existente
 * 
 * @param {CollaboratorSelectorProps} props - Props del componente
 * @returns {JSX.Element} Selector de colaboradores
 */
const CollaboratorSelector: React.FC<CollaboratorSelectorProps> = ({
  availableCollaborators,
  selectedCollaborators,
  onSelectionChange,
  placeholder = "Buscar colaboradores...",
  maxVisibleChips = 3,
  disabled = false
}) => {
  // @state: Control del dropdown
  const [isOpen, setIsOpen] = useState(false);
  
  // @state: Término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  
  // @state: Control del tooltip
  const [showTooltip, setShowTooltip] = useState(false);
  
  // @ref: Referencia al contenedor para detectar clics fuera
  const containerRef = useRef<HTMLDivElement>(null);
  
  // @ref: Referencia al input de búsqueda
  const searchInputRef = useRef<HTMLInputElement>(null);

  /**
   * Filtra colaboradores basado en el término de búsqueda
   * @function filteredCollaborators
   * @returns {Collaborator[]} Lista filtrada de colaboradores
   */
  const filteredCollaborators = availableCollaborators.filter(collaborator => {
    const searchLower = searchTerm.toLowerCase();
    return (
      collaborator.name.toLowerCase().includes(searchLower) ||
      collaborator.email.toLowerCase().includes(searchLower) ||
      (collaborator.role && collaborator.role.toLowerCase().includes(searchLower))
    );
  });

  /**
   * Colaboradores disponibles para seleccionar (no seleccionados)
   * @function availableForSelection
   * @returns {Collaborator[]} Colaboradores no seleccionados
   */
  const availableForSelection = filteredCollaborators.filter(
    collaborator => !selectedCollaborators.find(selected => selected.id === collaborator.id)
  );

  /**
   * Efecto para cerrar dropdown al hacer clic fuera
   * @function useEffect
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Efecto para enfocar el input cuando se abre el dropdown
   * @function useEffect
   */
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  /**
   * Maneja la selección de un colaborador
   * @function handleCollaboratorSelect
   * @param {Collaborator} collaborator - Colaborador a seleccionar
   */
  const handleCollaboratorSelect = (collaborator: Collaborator) => {
    const newSelection = [...selectedCollaborators, collaborator];
    onSelectionChange(newSelection);
    setSearchTerm('');
  };

  /**
   * Maneja la eliminación de un colaborador seleccionado
   * @function handleCollaboratorRemove
   * @param {string} collaboratorId - ID del colaborador a eliminar
   */
  const handleCollaboratorRemove = (collaboratorId: string) => {
    const newSelection = selectedCollaborators.filter(c => c.id !== collaboratorId);
    onSelectionChange(newSelection);
  };

  /**
   * Abre/cierra el dropdown
   * @function toggleDropdown
   */
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  /**
   * Colaboradores visibles en chips
   * @function visibleCollaborators
   * @returns {Collaborator[]} Colaboradores a mostrar como chips
   */
  const visibleCollaborators = selectedCollaborators.slice(0, maxVisibleChips);
  
  /**
   * Número de colaboradores adicionales
   * @function additionalCount
   * @returns {number} Cantidad de colaboradores no visibles
   */
  const additionalCount = Math.max(0, selectedCollaborators.length - maxVisibleChips);

  /**
   * Genera las iniciales de un nombre
   * @function getInitials
   * @param {string} name - Nombre completo
   * @returns {string} Iniciales del nombre
   */
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="collaborator-selector" ref={containerRef}>
      {/* @section: Campo principal con chips y botón de apertura */}
      <div 
        className={`collaborator-selector-field ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={toggleDropdown}
      >
        <div className="collaborator-selector-content">
          {/* @section: Chips de colaboradores seleccionados */}
          {selectedCollaborators.length > 0 ? (
            <div className="collaborator-chips">
              {visibleCollaborators.map((collaborator) => (
                <div key={collaborator.id} className="collaborator-chip">
                  {collaborator.avatar ? (
                    <img 
                      src={collaborator.avatar} 
                      alt={collaborator.name}
                      className="collaborator-chip-avatar"
                    />
                  ) : (
                    <div className="collaborator-chip-avatar-placeholder">
                      {getInitials(collaborator.name)}
                    </div>
                  )}
                  <span className="collaborator-chip-name">{collaborator.name}</span>
                  <button
                    type="button"
                    className="collaborator-chip-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCollaboratorRemove(collaborator.id);
                    }}
                    disabled={disabled}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              
              {/* @component: Contador de elementos adicionales */}
              {additionalCount > 0 && (
                <div 
                  className="collaborator-chip-counter"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  +{additionalCount}
                  
                  {/* @component: Tooltip con lista completa */}
                  {showTooltip && (
                    <div className="collaborator-tooltip">
                      <div className="collaborator-tooltip-content">
                        <h4>Todos los colaboradores:</h4>
                        {selectedCollaborators.map((collaborator) => (
                          <div key={collaborator.id} className="collaborator-tooltip-item">
                            {collaborator.avatar ? (
                              <img 
                                src={collaborator.avatar} 
                                alt={collaborator.name}
                                className="collaborator-tooltip-avatar"
                              />
                            ) : (
                              <div className="collaborator-tooltip-avatar-placeholder">
                                {getInitials(collaborator.name)}
                              </div>
                            )}
                            <div className="collaborator-tooltip-info">
                              <span className="collaborator-tooltip-name">{collaborator.name}</span>
                              <span className="collaborator-tooltip-email">{collaborator.email}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <span className="collaborator-selector-placeholder">
              <Users size={16} />
              Seleccionar colaboradores
            </span>
          )}
        </div>
        
        {/* @component: Icono de dropdown */}
        <ChevronDown 
          size={16} 
          className={`collaborator-selector-icon ${isOpen ? 'open' : ''}`}
        />
      </div>

      {/* @section: Dropdown con búsqueda y opciones */}
      {isOpen && (
        <div className="collaborator-dropdown">
          {/* @section: Campo de búsqueda */}
          <div className="collaborator-search">
            <Search size={16} className="collaborator-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={placeholder}
              className="collaborator-search-input"
            />
          </div>

          {/* @section: Lista de colaboradores disponibles */}
          <div className="collaborator-options">
            {availableForSelection.length > 0 ? (
              availableForSelection.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="collaborator-option"
                  onClick={() => handleCollaboratorSelect(collaborator)}
                >
                  {collaborator.avatar ? (
                    <img 
                      src={collaborator.avatar} 
                      alt={collaborator.name}
                      className="collaborator-option-avatar"
                    />
                  ) : (
                    <div className="collaborator-option-avatar-placeholder">
                      {getInitials(collaborator.name)}
                    </div>
                  )}
                  <div className="collaborator-option-info">
                    <span className="collaborator-option-name">{collaborator.name}</span>
                    <span className="collaborator-option-email">{collaborator.email}</span>
                    {collaborator.role && (
                      <span className="collaborator-option-role">{collaborator.role}</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="collaborator-no-results">
                {searchTerm ? 'No se encontraron colaboradores' : 'Todos los colaboradores están seleccionados'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaboratorSelector;