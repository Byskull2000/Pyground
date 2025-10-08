// app/dashboard/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Image from 'next/image';

function DashboardContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-black dark:to-gray-900 transition-colors duration-300">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-white/10 dark:bg-white/5 backdrop-blur-md backdrop-saturate-150 rounded-2xl p-8 mb-8 shadow-2xl border border-white/20 dark:border-white/10 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          <div className="relative flex items-center gap-4">
            {user && (
              <Image
                src={user.avatar_url || '/gatito.png'}
                alt={`${user.nombre} ${user.apellido}`}
                width={80}
                height={80}
                className="rounded-full ring-4 ring-white/30 dark:ring-white/20 shadow-lg"
              />
            )}
            <div className="text-gray-900 dark:text-white">
              <h1 className="text-3xl font-bold mb-1 drop-shadow-sm">
                ¡Hola, {user?.nombre}! 👋
              </h1>
              <p className="text-gray-700 dark:text-gray-300">
                Bienvenido de vuelta a tu espacio de aprendizaje
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 dark:bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/10 dark:border-gray-700/50 transition-colors duration-300 hover:bg-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-blue-400/30">
                <span className="text-2xl">📚</span>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Cursos Activos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">3</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 dark:bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/10 dark:border-gray-700/50 transition-colors duration-300 hover:bg-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-indigo-400/30">
                <span className="text-2xl">🔬</span>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Laboratorios Completados</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 dark:bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/10 dark:border-gray-700/50 transition-colors duration-300 hover:bg-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-green-400/30">
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Progreso Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">68%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - User Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white/5 dark:bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/10 dark:border-gray-700/50 transition-colors duration-300 hover:bg-white/10">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <span className="text-lg">👤</span>
                Información del Usuario
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Nombre Completo</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{user?.nombre} {user?.apellido}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium text-sm break-all">{user?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Proveedor</p>
                  <div className="flex items-center gap-2">
                    {user?.provider === 'google' ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    ) : (
                      <span className="text-blue-600 dark:text-blue-400">📧</span>
                    )}
                    <span className="text-gray-900 dark:text-gray-100 font-medium capitalize">
                      {user?.provider === 'local' ? 'Email' : user?.provider}
                    </span>
                  </div>
                </div>
                {user?.bio && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Bio</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{user.bio}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white/5 dark:bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/10 dark:border-gray-700/50 transition-colors duration-300 hover:bg-white/10">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <span className="text-lg">📊</span>
                Estado de la Cuenta
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Estado</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${user?.activo ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className={`text-sm font-medium ${user?.activo ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {user?.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
                {user?.fecha_registro && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Miembro desde</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {new Date(user.fecha_registro).toLocaleDateString('es-ES', {
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                {user?.ultimo_acceso && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Último acceso</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {new Date(user.ultimo_acceso).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Courses and Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Courses */}
            <div className="bg-white/5 dark:bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/10 dark:border-gray-700/50 transition-colors duration-300 hover:bg-white/10">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-lg">Mis Cursos</h3>
              <div className="space-y-4">
                {/* Course 1 */}
                <div className="border border-white/10 dark:border-gray-700/50 rounded-xl p-4 hover:border-blue-400/50 dark:hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer bg-white/5 dark:bg-white/5 backdrop-blur-sm hover:bg-white/10">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Introducción a Python</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Prof. Juan Pérez</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-500/20 dark:bg-blue-500/20 backdrop-blur-sm text-blue-300 dark:text-blue-300 rounded-full text-xs font-medium border border-blue-400/30">
                      En curso
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Progreso</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">75%</span>
                    </div>
                    <div className="w-full bg-gray-700/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-full h-2 border border-gray-600/20">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full shadow-lg shadow-blue-500/50" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Course 2 */}
                <div className="border border-white/10 dark:border-gray-700/50 rounded-xl p-4 hover:border-blue-400/50 dark:hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer bg-white/5 dark:bg-white/5 backdrop-blur-sm hover:bg-white/10">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Estructuras de Datos</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Prof. María García</p>
                    </div>
                    <span className="px-3 py-1 bg-green-500/20 dark:bg-green-500/20 backdrop-blur-sm text-green-300 dark:text-green-300 rounded-full text-xs font-medium border border-green-400/30">
                      Nuevo
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Progreso</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">20%</span>
                    </div>
                    <div className="w-full bg-gray-700/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-full h-2 border border-gray-600/20">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full shadow-lg shadow-blue-500/50" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Course 3 */}
                <div className="border border-white/10 dark:border-gray-700/50 rounded-xl p-4 hover:border-blue-400/50 dark:hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer bg-white/5 dark:bg-white/5 backdrop-blur-sm hover:bg-white/10">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Algoritmos Avanzados</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Prof. Carlos Ruiz</p>
                    </div>
                    <span className="px-3 py-1 bg-purple-500/20 dark:bg-purple-500/20 backdrop-blur-sm text-purple-300 dark:text-purple-300 rounded-full text-xs font-medium border border-purple-400/30">
                      Próximamente
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Progreso</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">0%</span>
                    </div>
                    <div className="w-full bg-gray-700/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-full h-2 border border-gray-600/20">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full shadow-lg shadow-blue-500/50" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/5 dark:bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/10 dark:border-gray-700/50 transition-colors duration-300 hover:bg-white/10">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-lg">Actividad Reciente</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 border border-green-400/30">
                    <span className="text-sm">✅</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Laboratorio completado</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Listas y Tuplas - hace 2 horas</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 border border-blue-400/30">
                    <span className="text-sm">📝</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Checkpoint superado</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Funciones en Python - hace 5 horas</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 border border-purple-400/30">
                    <span className="text-sm">🎯</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Nuevo tópico iniciado</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Diccionarios - hace 1 día</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}