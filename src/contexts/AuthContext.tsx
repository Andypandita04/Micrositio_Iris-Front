import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Interfaz para definir un usuario
 * @interface User
 */
interface User {
  /** ID único del usuario */
  id: string;
  /** Nombre completo del usuario */
  name: string;
  /** Email del usuario */
  email: string;
  /** URL del avatar del usuario */
  avatar?: string;
  /** Lista de proyectos del usuario */
  projects: string[];
  /** Fecha de registro */
  joinDate: string;
  /** Rol del usuario */
  role?: string;
}

/**
 * Interfaz para el contexto de autenticación
 * @interface AuthContextType
 */
interface AuthContextType {
  /** Usuario actualmente autenticado */
  user: User | null;
  /** Si está en proceso de autenticación */
  isLoading: boolean;
  /** Función para iniciar sesión */
  login: (email: string, password: string) => Promise<boolean>;
  /** Función para cerrar sesión */
  logout: () => void;
  /** Función para actualizar datos del usuario */
  updateUser: (userData: Partial<User>) => void;
}

/**
 * Props para el proveedor de autenticación
 * @interface AuthProviderProps
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Usuario de prueba para desarrollo
 * @constant testUser
 */
const testUser: User = {
  id: 'test-user-1',
  name: 'Usuario Demo',
  email: 'tester@bolt.ai',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  projects: ['Proyecto Alpha', 'Proyecto Beta', 'Sistema de Gestión de Inventario'],
  joinDate: '2024-01-15',
  role: 'Product Manager'
};

// @context: Crear contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Proveedor de contexto de autenticación
 * 
 * @component AuthProvider
 * @description Proveedor que maneja el estado global de autenticación,
 * incluyendo login, logout y persistencia de sesión en localStorage.
 * 
 * Características principales:
 * - Persistencia de sesión en localStorage
 * - Usuario de prueba para desarrollo
 * - Validación de credenciales
 * - Estados de carga
 * - Actualización de datos de usuario
 * 
 * @example
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 * 
 * @param {AuthProviderProps} props - Props del componente
 * @returns {JSX.Element} Proveedor de autenticación
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // @state: Usuario actual
  const [user, setUser] = useState<User | null>(null);
  
  // @state: Estado de carga
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Efecto para cargar usuario desde localStorage al inicializar
   * @function useEffect
   */
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('auth_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        localStorage.removeItem('auth_user');
      } finally {
        setIsLoading(false);
      }
    };

    // @simulation: Simular delay de carga inicial
    setTimeout(loadUserFromStorage, 500);
  }, []);

  /**
   * Función para iniciar sesión
   * @function login
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<boolean>} true si el login es exitoso
   * 
   * @description Valida credenciales contra usuario de prueba y
   * guarda la sesión en localStorage si es exitosa.
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // @simulation: Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // @validation: Verificar credenciales del usuario de prueba
      if (email === testUser.email && password === 'Test1234') {
        setUser(testUser);
        localStorage.setItem('auth_user', JSON.stringify(testUser));
        return true;
      }

      // @error: Credenciales inválidas
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Función para cerrar sesión
   * @function logout
   * @description Limpia el estado del usuario y remueve datos de localStorage
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  /**
   * Función para actualizar datos del usuario
   * @function updateUser
   * @param {Partial<User>} userData - Datos parciales del usuario a actualizar
   * @description Actualiza el usuario en estado y localStorage
   */
  const updateUser = (userData: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para usar el contexto de autenticación
 * @function useAuth
 * @returns {AuthContextType} Contexto de autenticación
 * @throws {Error} Si se usa fuera del AuthProvider
 * 
 * @example
 * ```tsx
 * const { user, login, logout } = useAuth();
 * ```
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};