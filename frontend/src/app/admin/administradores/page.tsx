'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { CambiarRolModal } from './components/CambiarRolModal';

interface Usuario {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    avatar_url?: string;
    rol: string;
    fecha_registro: string;
    activo: boolean;
}

export default function AdminUsuariosPage() {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingUsuarios, setLoadingUsuarios] = useState(true);
    const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.push('/login');
                return;
            }

            const esAdmin = user?.rol === 'admin' || user?.rol === 'ADMIN';

            if (!esAdmin) {
                router.push('/dashboard');
                return;
            }

            fetchUsuarios();
        }
    }, [loading, isAuthenticated, user, router]);

    useEffect(() => {
        if (searchTerm) {
            const filtered = usuarios.filter(u =>
                u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsuarios(filtered);
        } else {
            setFilteredUsuarios(usuarios);
        }
    }, [searchTerm, usuarios]);

    const fetchUsuarios = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/usuarios`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const result = await response.json();
                const usuariosData: Usuario[] = result.data || [];
                const administradores = usuariosData.filter((u: Usuario) => u.rol.toLowerCase() === 'admin');
                setUsuarios(administradores);
                setFilteredUsuarios(administradores);
            }

        } catch (error) {
            console.error('Error fetching usuarios:', error);
        } finally {
            setLoadingUsuarios(false);
        }
    };


    if (loading || loadingUsuarios) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Cargando usuarios...</p>
                </div>
            </div>
        );
    }
    const handleRolChanged = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => router.push('/admin')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al Dashboard
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Gestión de Usuarios
                    </h1>
                    <p className="text-gray-400">
                        Administra los usuarios del sistema y asigna roles
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="relative flex-1 w-full md:max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="text-sm text-gray-400">
                            Total de usuarios: <span className="text-white font-semibold">{filteredUsuarios.length}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/10">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rol</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Registro</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {filteredUsuarios.map((usuario) => (
                                    <tr key={usuario.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img
                                                        className="h-10 w-10 rounded-full object-cover border-2 border-white/20"
                                                        src={usuario.avatar_url || '/gatito.png'}
                                                        alt={`${usuario.nombre} ${usuario.apellido}`}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-white">
                                                        {usuario.nombre} {usuario.apellido}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-300">{usuario.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${usuario.rol?.toLowerCase() === 'admin'
                                                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                                    : usuario.rol?.toLowerCase() === 'usuario'
                                                        ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                                        : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                                                    }`}
                                            >
                                                {usuario.rol || 'USUARIO'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${usuario.activo
                                                    ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                                    : 'bg-red-500/20 text-red-300 border-red-500/30'
                                                    }`}
                                            >
                                                {usuario.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                            {new Date(usuario.fecha_registro).toLocaleDateString('es-ES')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => {
                                                    setSelectedUsuario(usuario);
                                                    setIsModalOpen(true);
                                                }}
                                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                            >
                                                Cambiar Rol
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredUsuarios.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-400 text-sm">
                                    {searchTerm ? 'No se encontraron usuarios con ese criterio' : 'No hay usuarios registrados en el sistema'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedUsuario && (
                <CambiarRolModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    usuario={selectedUsuario}
                    onSuccess={handleRolChanged}
                />
            )}

        </div>
    );
}
