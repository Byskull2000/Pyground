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
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const userData = {
          ...data.user,
          avatar_url: data.user.avatar_url || '/gatito.png',
          provider: data.user.provider || 'email'
        };
        setUser(userData);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login con Google
  const login = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  // Login con credenciales (email y contraseña)
  const loginWithCredentials = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email });

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('Login response:', { status: response.status, data });

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

      // Guardar el token
      localStorage.setItem('token', responseData.token);

      // Establecer el usuario con avatar por defecto si es null
      const userData = {
        ...responseData.user,
        avatar_url: responseData.user.avatar_url || '/gatito.png',
        provider: responseData.user.provider || 'email'
      };

      setUser(userData);

      // Redireccionar al dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
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
      console.error('Error logging out:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      router.push('/');
    }
  };

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