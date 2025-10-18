'use client'
import { useState, useEffect } from 'react';
import { ArrowLeft, Search, BookOpen, Plus, AlertCircle, Loader } from 'lucide-react';
import Link from 'next/link';

interface Curso {
    id: number;
    nombre: string;
    codigo_curso: string;
    descripcion?: string;
    activo: boolean;
    _count?: {
        ediciones: number;
    };
}

export default function AdminCursosPage() {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [filteredCursos, setFilteredCursos] = useState<Curso[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchCursos();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = cursos.filter(c =>
                c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.codigo_curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCursos(filtered);
        } else {
            setFilteredCursos(cursos);
        }
    }, [searchTerm, cursos]);

    const fetchCursos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/cursos`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });

            if (!response.ok) {
                throw new Error('Error al cargar los cursos');
            }

            const result = await response.json();
            const cursosData = result.data || [];
            setCursos(cursosData);
            setFilteredCursos(cursosData);
            setError('');
        } catch (err) {
            console.error('Error fetching cursos:', err);
            setError('Error al cargar los cursos. Intenta recargar la página.');
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Cargando cursos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => window.location.href = '/admin'}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al Dashboard
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Gestión de Cursos
                    </h1>
                    <p className="text-gray-400">
                        Visualiza los cursos y sus ediciones
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <p className="text-red-300 font-medium">{error}</p>
                    </div>
                )}

                <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="relative flex-1 w-full md:max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o código..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-white/20"
                            />
                        </div>
                        <div className="text-sm text-gray-400">
                            Total: <span className="text-white font-semibold">{filteredCursos.length}</span>
                        </div>
                    </div>
                </div>

                {filteredCursos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCursos.map((curso) => (
                            <div
                                key={curso.id}
                                className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 overflow-hidden hover:border-blue-400/50 transition-all duration-300"
                            >
                                <div className="h-24 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-purple-600/20 border-b border-white/10 flex items-center px-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">
                                            {curso.nombre}
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                            Código: {curso.codigo_curso}
                                        </p>
                                    </div>

                                    {curso.descripcion && (
                                        <p className="text-sm text-gray-400 line-clamp-2">
                                            {curso.descripcion}
                                        </p>
                                    )}

                                    <div className="space-y-2 pt-4 border-t border-white/10">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-400">Estado:</span>
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${curso.activo
                                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                    : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                                                    }`}
                                            >
                                                {curso.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-400">Ediciones:</span>
                                            <span className="text-sm font-semibold text-white">
                                                {curso._count?.ediciones || 0}
                                            </span>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/admin/ediciones?curso=${curso.id}`}
                                        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
                                    >
                                        <BookOpen className="w-4 h-4" />
                                        Ver Ediciones
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 p-12">
                        <div className="text-center">
                            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg mb-2">
                                {searchTerm ? 'No se encontraron cursos' : 'No hay cursos disponibles'}
                            </p>
                            <p className="text-gray-500 text-sm">
                                {searchTerm ? 'Intenta con otro término de búsqueda' : 'Contacta al administrador para crear cursos'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}