// src/contexts/AuthContext.tsx
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


interface User {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  avatar_url?: string;
  provider?: string;
  bio?: string;
  activo?: boolean;
  rol?: string; 
  fecha_registro?: Date;
  ultimo_acceso?: Date;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Verificar token al cargar
  useEffect(() => {
    console.log('🔄 AuthContext: useEffect ejecutándose');
    checkAuth();
  }, []);

  const checkAuth = async () => {
    console.log('🔍 AuthContext: Iniciando checkAuth');
    try {
      const token = localStorage.getItem('token');
      console.log('🔑 AuthContext: Token encontrado:', token ? 'Sí (primeros 20 chars): ' + token.substring(0, 20) + '...' : 'No');

      if (!token) {
        console.log('❌ AuthContext: No hay token, estableciendo loading=false');
        setLoading(false);
        return;
      }

      // Primero verificamos el token con /api/auth/me
      console.log('📡 AuthContext: Haciendo fetch a /api/auth/me');
      const authResponse = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📥 AuthContext: Respuesta recibida, status:', authResponse.status);

      if (!authResponse.ok) {
        console.log('❌ AuthContext: Respuesta no OK, eliminando token');
        localStorage.removeItem('token');
        setUser(null);
        setLoading(false);
        return;
      }

      const authData = await authResponse.json();
      const userId = authData.user.id;
      console.log('✅ AuthContext: Usuario ID obtenido:', userId);

      // Ahora obtenemos los datos completos incluyendo el rol desde /api/usuarios/:id
      console.log('📡 AuthContext: Obteniendo datos completos desde /api/usuarios/' + userId);
      const userResponse = await fetch(`${API_URL}/api/usuarios/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('✅ AuthContext: Datos completos recibidos:', userData.data);
        
        const fullUserData = {
          ...userData.data,
          avatar_url: userData.data.avatar_url || '/gatito.png',
          provider: userData.data.provider || 'email',
        };
        
        console.log('👤 AuthContext: Usuario procesado con rol:', fullUserData.rol);
        setUser(fullUserData);
      } else {
        console.log('❌ AuthContext: Error al obtener datos del usuario');
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('💥 AuthContext: Error en checkAuth:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      console.log('🏁 AuthContext: checkAuth finalizado, estableciendo loading=false');
      setLoading(false);
    }
  };

  // Login con Google
  const login = () => {
    console.log('🔐 AuthContext: Iniciando login con Google');
    window.location.href = `${API_URL}/api/auth/google`;
  };

  // Login con credenciales (email y contraseña)
  const loginWithCredentials = async (email: string, password: string) => {
    try {
      console.log('🔐 AuthContext: Attempting login with:', { email });

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('📥 AuthContext: Login response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
      }

      // La respuesta viene en data.data
      const responseData = data.data || data;
      
      // Verificar que tenemos el token y el usuario
      if (!responseData.token) {
        throw new Error('No se recibió token del servidor');
      }

      if (!responseData.user) {
        throw new Error('No se recibieron datos del usuario');
      }

      localStorage.setItem('token', responseData.token);
      const userData = {
        ...responseData.user,
        avatar_url: responseData.user.avatar_url || '/gatito.png',
        provider: responseData.user.provider || 'email',
        rol: responseData.user.rol || 'USER' 
      };

      console.log('✅ AuthContext: Setting user with rol:', userData.rol); 

      setUser(userData);

      // Redireccionar según el rol
      if (userData.rol === 'ADMIN') {
        console.log('🔐 AuthContext: Usuario es ADMIN, redirigiendo a /admin');
        router.push('/admin');
      } else {
        console.log('👤 AuthContext: Usuario normal, redirigiendo a /dashboard');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('💥 AuthContext: Error logging in:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('👋 AuthContext: Iniciando logout');
      const token = localStorage.getItem('token');

      if (token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('💥 AuthContext: Error logging out:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      console.log('✅ AuthContext: Logout completado');
      router.push('/');
    }
  };

  // Log cuando cambia el estado del usuario
  useEffect(() => {
    console.log('🔄 AuthContext: Estado de usuario cambió:', {
      isAuthenticated: !!user,
      rol: user?.rol,
      loading
    });
  }, [user, loading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithCredentials,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};