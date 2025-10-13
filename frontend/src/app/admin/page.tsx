'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Users, Shield, Activity, ChevronRight } from 'lucide-react';

export default function AdminPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    usuariosActivos: 0,
    admins: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      const esAdmin = user?.rol === 'ADMIN';
      if (!esAdmin) {
        router.push('/dashboard');
        return;
      }

      fetchStats();
    }
  }, [loading, isAuthenticated, user, router]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/usuarios`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        const usuarios = result.data || [];

        setStats({
          totalUsuarios: usuarios.length,
          usuariosActivos: usuarios.filter((u: any) => u.activo).length,
          admins: usuarios.filter((u: any) => u.rol === 'ADMIN').length,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading || loadingStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  const adminCards = [
    {
      title: 'Gestión de Usuarios',
      description: 'Administra usuarios y asigna roles',
      icon: Users,
      color: 'from-blue-600 to-indigo-600',
      route: '/admin/usuarios',
      stat: `${stats.totalUsuarios} usuarios`,
    },
    {
      title: 'Administradores',
      description: 'Ver y gestionar administradores',
      icon: Shield,
      color: 'from-purple-600 to-pink-600',
      route: '/admin/administradores',
      stat: `${stats.admins} admins`,
    },
    {
      title: 'Actividad del Sistema',
      description: 'Monitorea la actividad de usuarios',
      icon: Activity,
      color: 'from-green-600 to-teal-600',
      route: '/admin/actividad',
      stat: `${stats.usuariosActivos} activos`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-400">
            Bienvenido, {user?.nombre} {user?.apellido}
          </p>
        </div>

        {/* Información del Admin */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-blue-600/20 border-b border-white/10 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Tu Información
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-400">Nombre</p>
                <p className="mt-1 text-sm text-white">
                  {user?.nombre} {user?.apellido}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Email</p>
                <p className="mt-1 text-sm text-white">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Rol</p>
                <p className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    ADMIN
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Miembro desde
                </p>
                <p className="mt-1 text-sm text-white">
                  {user?.fecha_registro
                    ? new Date(user.fecha_registro).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                    : 'No disponible'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Gestión */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminCards.map((card, index) => (
            <div
              key={index}
              className="group bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 overflow-hidden transition-all duration-300 hover:border-blue-400/50 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push(card.route)}
            >
              {/* Header con icono */}
              <div className={`h-32 bg-gradient-to-br ${card.color}/20 border-b border-white/10 flex items-center justify-center p-6`}>
                <div className="text-center">
                  <div className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                    <card.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {card.stat}
                  </p>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Botón */}
              <div className="p-6 pt-0">
                <button
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r ${card.color} text-white font-semibold rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg group/btn`}
                >
                  Acceder
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}