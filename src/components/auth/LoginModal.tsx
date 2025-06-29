import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button/Button';
import styles from './LoginModal.module.css';

/**
 * Props para el componente LoginModal
 * @interface LoginModalProps
 */
interface LoginModalProps {
  /** Controla si el modal está visible */
  isOpen: boolean;
  /** Función para cerrar el modal */
  onClose: () => void;
}

/**
 * Modal de inicio de sesión con validación completa
 * 
 * @component LoginModal
 * @description Modal de autenticación que permite a los usuarios iniciar sesión
 * con email y contraseña. Incluye validación en tiempo real, manejo de errores
 * y estados de carga.
 * 
 * Características principales:
 * - Validación de email en tiempo real
 * - Validación de contraseña (mínimo 8 caracteres)
 * - Toggle de visibilidad de contraseña
 * - Estados de carga durante autenticación
 * - Manejo de errores de login
 * - Cierre con tecla ESC
 * - Prevención de scroll del body
 * - Enfoque automático en campos
 * 
 * Credenciales de prueba:
 * - Email: tester@bolt.ai
 * - Contraseña: Test1234
 * 
 * @example
 * ```tsx
 * <LoginModal
 *   isOpen={showLoginModal}
 *   onClose={() => setShowLoginModal(false)}
 * />
 * ```
 * 
 * @param {LoginModalProps} props - Props del componente
 * @returns {JSX.Element} Modal de login
 */
const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  // @context: Contexto de autenticación
  const { login, isLoading } = useAuth();
  
  // @state: Datos del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // @state: Errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // @state: Control de visibilidad de contraseña
  const [showPassword, setShowPassword] = useState(false);
  
  // @state: Error de autenticación
  const [authError, setAuthError] = useState('');

  /**
   * Efecto para manejar el cierre con ESC y prevenir scroll
   * @function useEffect
   */
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isLoading]);

  /**
   * Efecto para limpiar formulario al abrir/cerrar modal
   * @function useEffect
   */
  useEffect(() => {
    if (isOpen) {
      // @reset: Limpiar formulario al abrir
      setFormData({ email: '', password: '' });
      setErrors({});
      setAuthError('');
      setShowPassword(false);
    }
  }, [isOpen]);

  /**
   * Valida el email en tiempo real
   * @function validateEmail
   * @param {string} email - Email a validar
   * @returns {string} Mensaje de error o cadena vacía si es válido
   */
  const validateEmail = (email: string): string => {
    if (!email.trim()) {
      return 'El email es requerido';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Ingresa un email válido';
    }
    
    return '';
  };

  /**
   * Valida la contraseña en tiempo real
   * @function validatePassword
   * @param {string} password - Contraseña a validar
   * @returns {string} Mensaje de error o cadena vacía si es válida
   */
  const validatePassword = (password: string): string => {
    if (!password) {
      return 'La contraseña es requerida';
    }
    
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    
    return '';
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
    
    // @validation: Limpiar error de autenticación
    if (authError) {
      setAuthError('');
    }
  };

  /**
   * Valida todo el formulario
   * @function validateForm
   * @returns {boolean} true si el formulario es válido
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario
   * @function handleSubmit
   * @param {React.FormEvent} e - Evento del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        onClose();
      } else {
        setAuthError('Email o contraseña incorrectos. Intenta con: tester@bolt.ai / Test1234');
      }
    } catch (error) {
      setAuthError('Error de conexión. Intenta nuevamente.');
    }
  };

  /**
   * Maneja el clic en el backdrop para cerrar el modal
   * @function handleBackdropClick
   * @param {React.MouseEvent} e - Evento de clic
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  /**
   * Verifica si el formulario es válido para habilitar el botón
   * @function isFormValid
   * @returns {boolean} true si el formulario es válido
   */
  const isFormValid = (): boolean => {
    return formData.email.trim() !== '' && 
           formData.password.length >= 8 && 
           validateEmail(formData.email) === '' && 
           validatePassword(formData.password) === '';
  };

  // @render: No renderizar si el modal no está abierto
  if (!isOpen) return null;

  return (
    <div className={styles['modal-backdrop']} onClick={handleBackdropClick}>
      <div className={styles['modal-container']}>
        {/* @section: Header del modal */}
        <div className={styles['modal-header']}>
          <div className={styles['modal-icon']}>
            <LogIn size={24} />
          </div>
          <h2 className={styles['modal-title']}>Iniciar Sesión</h2>
          <button
            onClick={onClose}
            className={styles['modal-close-button']}
            disabled={isLoading}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* @section: Cuerpo del modal con formulario */}
        <div className={styles['modal-body']}>
          <p className={styles['modal-description']}>
            Ingresa tus credenciales para acceder a tu cuenta
          </p>

          {/* @component: Error de autenticación */}
          {authError && (
            <div className={styles['auth-error']}>
              <AlertCircle size={16} />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles['login-form']}>
            {/* @section: Campo de email */}
            <div className={styles['form-group']}>
              <label htmlFor="email" className={styles['form-label']}>
                <Mail size={16} className={styles['form-label-icon']} />
                Email
              </label>
              <div className={styles['input-container']}>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`${styles['form-input']} ${errors.email ? styles['input-error'] : ''}`}
                  placeholder="tu@email.com"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <span className={styles['error-text']}>
                  <AlertCircle size={14} />
                  {errors.email}
                </span>
              )}
            </div>

            {/* @section: Campo de contraseña */}
            <div className={styles['form-group']}>
              <label htmlFor="password" className={styles['form-label']}>
                <Lock size={16} className={styles['form-label-icon']} />
                Contraseña
              </label>
              <div className={styles['input-container']}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`${styles['form-input']} ${styles['password-input']} ${errors.password ? styles['input-error'] : ''}`}
                  placeholder="Mínimo 8 caracteres"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles['password-toggle']}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <span className={styles['error-text']}>
                  <AlertCircle size={14} />
                  {errors.password}
                </span>
              )}
            </div>

            {/* @section: Información de credenciales de prueba */}
            <div className={styles['demo-credentials']}>
              <h4>Credenciales de prueba:</h4>
              <p><strong>Email:</strong> tester@bolt.ai</p>
              <p><strong>Contraseña:</strong> Test1234</p>
            </div>

            {/* @section: Botón de envío */}
            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={!isFormValid() || isLoading}
              icon={<LogIn size={16} />}
              className={styles['submit-button']}
            >
              {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;