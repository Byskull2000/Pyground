'use client';

import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter();
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href={'/'} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">Py</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            PyGround
          </span>
        </Link>
        {
          isAuthenticated ?
            <div className="flex items-center gap-4">
              {user && (
                <Image
                  src={user.avatar_url || '/gatito.png'}
                  alt={`${user.nombre} ${user.apellido}`}
                  width={40}
                  height={40}
                  className="rounded-full ring-2 ring-blue-100"
                />
              )}
              <div className="hidden sm:block text-sm text-right">
                <p className="font-semibold text-gray-900">
                  {user?.nombre} {user?.apellido}
                </p>
                <p className="text-gray-500 text-xs">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg"
              >
                Cerrar Sesión
              </button>
            </div> : <button
              onClick={() => router.push('/login')}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium"
            >
              Iniciar Sesión
            </button>}
      </nav >
    </header >
  );
}