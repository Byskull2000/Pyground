'use client';

import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, LogOut, User, Settings } from 'lucide-react';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
  };

  const navigationLinks = [
    ...(isAuthenticated
      ? [
        {
          label: 'Dashboard',
          href: user?.rol === 'ADMIN' ? '/admin' : '/dashboard',
        },
      ]
      : []),
    ...(isAuthenticated && user?.rol === 'USUARIO'
      ? [
        {
          label: 'Cursos',
          href: '/cursos',
        },
      ]
      : []),
    ...(isAuthenticated && user?.rol === 'ADMIN'
      ? [
        {
          label: 'Usuarios',
          href: '/admin/usuarios',
        },
        {
          label: 'Administradores',
          href: '/admin/administradores',
        },
        {
          label: 'Cursos',
          href: '/admin/cursos',
        },
      ]
      : []),

    ...(isAuthenticated && user?.rol === 'ACADEMICO' ? [
      {
        label: 'Mis Ediciones',
        href: '/mis-ediciones',
      },
    ] : [])
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 dark:border-gray-800/50 bg-white/80 dark:bg-black/40 backdrop-blur-2xl shadow-lg dark:shadow-2xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-opacity hover:opacity-80"
            aria-label="PyGround Home"
          >
            <div className="relative w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white font-bold text-lg">Py</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              PyGround
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-300 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-4 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:w-[calc(100%-2rem)] rounded-full" />
              </Link>
            ))}
          </div>

          {/* Right Section - Auth & Profile */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Profile Dropdown - Desktop */}
                <div className="hidden sm:block relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                    aria-label="Profile menu"
                    aria-expanded={profileMenuOpen}
                  >
                    {user && (
                      <>
                        <Image
                          src={user.avatar_url || '/gatito.png'}
                          alt={`${user.nombre} ${user.apellido}`}
                          width={40}
                          height={40}
                          className="rounded-full ring-2 ring-blue-400/30 dark:ring-blue-500/30 shadow-md"
                        />
                        <div className="hidden sm:block text-left">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {user?.nombre}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {user?.nombre} {user?.apellido}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
                          {user?.email}
                        </p>
                        {user?.rol && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300">
                              {user.rol === 'ADMIN' ? '👑 Administrador' : '👤 Usuario'}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-2">
                        <button
                          onClick={() => router.push('/dashboard')}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Ver Perfil
                        </button>
                        <button
                          onClick={() => router.push('/settings')}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Configuración
                        </button>
                      </div>

                      <div className="p-2 border-t border-gray-200 dark:border-gray-800">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Profile Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="sm:hidden p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6 text-gray-900 dark:text-white" />
                  ) : (
                    <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform duration-200"
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isAuthenticated && mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 dark:border-gray-800/50 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* User Info Mobile */}
            <div className="px-4 py-4 border-b border-white/10 dark:border-gray-800/50">
              <div className="flex items-center gap-3 mb-3">
                {user && (
                  <Image
                    src={user.avatar_url || '/gatito.png'}
                    alt={`${user.nombre} ${user.apellido}`}
                    width={40}
                    height={40}
                    className="rounded-full ring-2 ring-blue-400/30"
                  />
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user?.nombre} {user?.apellido}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-1 px-2 py-3">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="space-y-1 px-2 py-3 border-t border-white/10 dark:border-gray-800/50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}