import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { obtenerEmpleadoPorId, Empleado } from '../../services/empleadosService';
import { 
  User, 
  Mail, 
  Camera, 
  Briefcase,
  Phone
} from 'lucide-react';
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
  const { user } = useAuth();
  
  // @state: Datos del empleado
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [loadingEmpleado, setLoadingEmpleado] = useState(true);

  /**
   * Cargar datos del empleado cuando el usuario esté disponible
   */
  useEffect(() => {
    const cargarDatosEmpleado = async () => {
      if (user && user.id_empleado && user.id_empleado > 0) {
        try {
          setLoadingEmpleado(true);
          console.log('Usuario completo:', user);
          console.log('ID empleado a buscar:', user.id_empleado);
          console.log('Tipo de ID empleado:', typeof user.id_empleado);
          
          const datosEmpleado = await obtenerEmpleadoPorId(user.id_empleado);
          console.log('Datos empleado obtenidos:', datosEmpleado);
          setEmpleado(datosEmpleado);
        } catch (error) {
          console.error('Error cargando datos del empleado:', error);
        } finally {
          setLoadingEmpleado(false);
        }
      } else {
        console.log('Usuario sin id_empleado válido:', user);
        setLoadingEmpleado(false);
      }
    };

    if (user) {
      cargarDatosEmpleado();
    }
  }, [user]);

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
   * Obtiene el nombre completo para mostrar
   * @returns {string} Nombre completo del empleado o usuario
   */
  const getNombreCompleto = (): string => {
    if (empleado) {
      return `${empleado.nombre_pila} ${empleado.apellido_paterno} ${empleado.apellido_materno || ''}`.trim();
    }
    return user?.name || 'Usuario';
  };

  /**
   * Obtiene el email para mostrar
   * @returns {string} Email del empleado o usuario
   */
  const getEmail = (): string => {
    if (empleado) {
      return empleado.correo;
    }
    return user?.email || '';
  };

  /**
   * Obtiene información adicional del empleado
   * @returns {string} Información adicional como rol del usuario
   */
  const getInfoAdicional = (): string => {
    return user?.role || 'Empleado';
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

  // @guard: Mostrar estado de carga si aún se están cargando los datos del empleado
  if (loadingEmpleado) {
    return (
      <div className={styles['perfil-container']}>
        <div className={styles['perfil-content']}>
          <div className={styles['loading-state']}>
            <h1>Cargando perfil...</h1>
            <p>Obteniendo información del empleado.</p>
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
              {loadingEmpleado ? (
                <div>Cargando información del empleado...</div>
              ) : (
                <>
                  <h1 className={styles['user-name']}>{getNombreCompleto()}</h1>
                  <p className={styles['user-email']}>{getEmail()}</p>
                  {getInfoAdicional() && (
                    <p className={styles['user-role']}>
                      <Briefcase size={16} />
                      {getInfoAdicional()}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* @section: Información Personal - Solo visualización */}
        <div className={styles['perfil-info-section']}>
          <div className={styles['section-header']}>
            <h2 className={styles['section-title']}>
              <User size={20} />
              Información Personal
            </h2>
            <p className={styles['section-description']}>
              Información del empleado registrada en el sistema
            </p>
          </div>

          <div className={styles['info-grid']}>
            {/* @section: Información básica */}
            <div className={styles['info-row']}>
              <div className={styles['info-field']}>
                <div className={styles['field-label']}>
                  <User size={16} />
                  Nombre Completo
                </div>
                <div className={styles['field-value']}>
                  {getNombreCompleto()}
                </div>
              </div>

              <div className={styles['info-field']}>
                <div className={styles['field-label']}>
                  <Mail size={16} />
                  Correo Electrónico
                </div>
                <div className={styles['field-value']}>
                  {getEmail() || 'No disponible'}
                </div>
              </div>
            </div>

            {/* @section: Información adicional del empleado */}
            {empleado && empleado.celular && (
              <div className={styles['info-row']}>
                <div className={styles['info-field']}>
                  <div className={styles['field-label']}>
                    <Phone size={16} />
                    Teléfono de Contacto
                  </div>
                  <div className={styles['field-value']}>
                    {empleado.celular}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;