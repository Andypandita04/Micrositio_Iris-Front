import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Calendar, 
  Save, 
  Camera, 
  FolderOpen,
  ChevronDown,
  ChevronUp,
  Briefcase,
  MapPin,
  Phone
} from 'lucide-react';
import Button from '../../components/ui/Button/Button';
import styles from './Perfil.module.css';

/**
 * Componente Perfil de Usuario
 * 
 * @component Perfil
 * @description Página de perfil que permite a los usuarios ver y editar
 * su información personal, así como visualizar sus proyectos colaborativos.
 * 
 * Características principales:
 * - Formulario de edición de datos personales
 * - Sección de proyectos colaborativos colapsable
 * - Subida de avatar (simulada)
 * - Validación de campos
 * - Estados de carga
 * - Diseño responsive
 * - Información adicional del perfil
 * 
 * Funcionalidades:
 * - Editar nombre, email y información adicional
 * - Cambiar avatar del usuario
 * - Ver lista de proyectos en los que colabora
 * - Guardar cambios con validación
 * 
 * @returns {JSX.Element} Página de perfil del usuario
 */
const Perfil: React.FC = () => {
  // @context: Contexto de autenticación
  const { user, updateUser } = useAuth();
  
  // @state: Datos del formulario
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    phone: '',
    location: '',
    bio: ''
  });
  
  // @state: Errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // @state: Estado de guardado
  const [isSaving, setIsSaving] = useState(false);
  
  // @state: Control de sección de proyectos
  const [showProjects, setShowProjects] = useState(false);
  
  // @state: Mensaje de éxito
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Valida los campos del formulario
   * @function validateForm
   * @returns {boolean} true si el formulario es válido
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Ingresa un email válido';
      }
    }
    
    if (formData.phone && formData.phone.length > 0) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Ingresa un teléfono válido';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el cambio en los campos del formulario
   * @function handleInputChange
   * @param {string} field - Campo que cambió
   * @param {string} value - Nuevo valor
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // @validation: Limpiar errores al escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // @cleanup: Limpiar mensaje de éxito
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  /**
   * Maneja el envío del formulario
   * @function handleSubmit
   * @param {React.FormEvent} e - Evento del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSaving(true);
    
    try {
      // @simulation: Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // @action: Actualizar usuario en contexto
      updateUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role.trim()
      });
      
      setSuccessMessage('Perfil actualizado correctamente');
      
      // @cleanup: Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ general: 'Error al actualizar el perfil. Intenta nuevamente.' });
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Maneja el cambio de avatar (simulado)
   * @function handleAvatarChange
   */
  const handleAvatarChange = () => {
    // @simulation: Simular cambio de avatar
    console.log('Cambiar avatar - funcionalidad pendiente');
    // @todo: Implementar subida real de avatar
  };

  /**
   * Formatea la fecha de registro
   * @function formatJoinDate
   * @returns {string} Fecha formateada
   */
  const formatJoinDate = (): string => {
    if (!user?.joinDate) return 'Fecha no disponible';
    
    return new Date(user.joinDate).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // @guard: Verificar que el usuario esté autenticado
  if (!user) {
    return (
      <div className={styles['perfil-container']}>
        <div className={styles['perfil-content']}>
          <div className={styles['error-state']}>
            <h1>Acceso Denegado</h1>
            <p>Debes iniciar sesión para ver tu perfil.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['perfil-container']}>
      <div className={styles['perfil-content']}>
        {/* @section: Header del perfil */}
        <div className={styles['perfil-header']}>
          <div className={styles['header-background']}></div>
          <div className={styles['header-content']}>
            <div className={styles['avatar-section']}>
              <div className={styles['avatar-container']}>
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className={styles['avatar-image']}
                  />
                ) : (
                  <div className={styles['avatar-placeholder']}>
                    <User size={32} />
                  </div>
                )}
                <button 
                  onClick={handleAvatarChange}
                  className={styles['avatar-edit']}
                  title="Cambiar avatar"
                >
                  <Camera size={16} />
                </button>
              </div>
            </div>
            
            <div className={styles['user-info']}>
              <h1 className={styles['user-name']}>{user.name}</h1>
              <p className={styles['user-email']}>{user.email}</p>
              {user.role && (
                <p className={styles['user-role']}>
                  <Briefcase size={16} />
                  {user.role}
                </p>
              )}
              <p className={styles['join-date']}>
                <Calendar size={16} />
                Miembro desde {formatJoinDate()}
              </p>
            </div>
          </div>
        </div>

        {/* @section: Formulario de edición */}
        <div className={styles['perfil-form-section']}>
          <div className={styles['section-header']}>
            <h2 className={styles['section-title']}>
              <User size={20} />
              Información Personal
            </h2>
            <p className={styles['section-description']}>
              Actualiza tu información personal y preferencias
            </p>
          </div>

          {/* @component: Mensaje de éxito */}
          {successMessage && (
            <div className={styles['success-message']}>
              <Save size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* @component: Error general */}
          {errors.general && (
            <div className={styles['error-message']}>
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles['perfil-form']}>
            {/* @section: Información básica */}
            <div className={styles['form-row']}>
              <div className={styles['form-group']}>
                <label htmlFor="name" className={styles['form-label']}>
                  <User size={16} />
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`${styles['form-input']} ${errors.name ? styles['input-error'] : ''}`}
                  placeholder="Tu nombre completo"
                  disabled={isSaving}
                />
                {errors.name && (
                  <span className={styles['error-text']}>{errors.name}</span>
                )}
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="email" className={styles['form-label']}>
                  <Mail size={16} />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`${styles['form-input']} ${errors.email ? styles['input-error'] : ''}`}
                  placeholder="tu@email.com"
                  disabled={isSaving}
                />
                {errors.email && (
                  <span className={styles['error-text']}>{errors.email}</span>
                )}
              </div>
            </div>

            {/* @section: Información adicional */}
            <div className={styles['form-row']}>
              <div className={styles['form-group']}>
                <label htmlFor="role" className={styles['form-label']}>
                  <Briefcase size={16} />
                  Cargo/Rol
                </label>
                <input
                  type="text"
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className={styles['form-input']}
                  placeholder="Tu cargo o rol"
                  disabled={isSaving}
                />
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="phone" className={styles['form-label']}>
                  <Phone size={16} />
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`${styles['form-input']} ${errors.phone ? styles['input-error'] : ''}`}
                  placeholder="+1 234 567 8900"
                  disabled={isSaving}
                />
                {errors.phone && (
                  <span className={styles['error-text']}>{errors.phone}</span>
                )}
              </div>
            </div>

            <div className={styles['form-group']}>
              <label htmlFor="location" className={styles['form-label']}>
                <MapPin size={16} />
                Ubicación
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={styles['form-input']}
                placeholder="Ciudad, País"
                disabled={isSaving}
              />
            </div>

            <div className={styles['form-group']}>
              <label htmlFor="bio" className={styles['form-label']}>
                <User size={16} />
                Biografía
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className={`${styles['form-input']} ${styles['form-textarea']}`}
                placeholder="Cuéntanos un poco sobre ti..."
                rows={3}
                disabled={isSaving}
              />
            </div>

            {/* @section: Botón de guardar */}
            <div className={styles['form-actions']}>
              <Button
                type="submit"
                variant="primary"
                size="large"
                disabled={isSaving}
                icon={<Save size={16} />}
                className={styles['save-button']}
              >
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </div>

        {/* @section: Proyectos colaborativos */}
        <div className={styles['projects-section']}>
          <button
            onClick={() => setShowProjects(!showProjects)}
            className={styles['projects-toggle']}
          >
            <div className={styles['toggle-header']}>
              <FolderOpen size={20} />
              <span>Mis Proyectos ({user.projects.length})</span>
            </div>
            {showProjects ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {showProjects && (
            <div className={styles['projects-content']}>
              <p className={styles['projects-description']}>
                Proyectos en los que colaboras actualmente
              </p>
              
              <div className={styles['projects-list']}>
                {user.projects.map((project, index) => (
                  <div key={index} className={styles['project-item']}>
                    <div className={styles['project-icon']}>
                      <FolderOpen size={16} />
                    </div>
                    <div className={styles['project-info']}>
                      <h4 className={styles['project-name']}>{project}</h4>
                      <p className={styles['project-status']}>Activo</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;