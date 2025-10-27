'use client'
import { useState, useEffect } from 'react';
import { BookOpen, Lock, Edit2, CheckCircle, AlertCircle, Plus, Eye, EyeOff, Loader } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Link from 'next/link';

interface Inscripcion {
    id: number;
    usuario_id: number;
    edicion_id: number;
    cargo_id: number;
    fecha_inscripcion: string;
    activo: boolean;
    edicion: {
        id: number;
        nombre_edicion: string;
        descripcion: string;
        fecha_apertura: string;
        fecha_cierre?: string;
        activo: boolean;
        estado_publicado: boolean;
    };
    cargo: {
        id: number;
        nombre: string;
    };
}

export default function MisEdicionesPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/login'); 
        }
        if (!authLoading && user) {
            fetchInscripciones();
        }
    }, [authLoading, user, router]);

    const fetchInscripciones = async () => {
        try {
            if (!user?.id) {
                setError('No hay usuario autenticado');
                setLoading(false);
                return;
            }

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/inscripciones/usuario/${user.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Error al cargar inscripciones');
            }

            const result = await response.json();
            const allInscripciones = result.data || [];

            const docentesEditores = allInscripciones.filter((i: Inscripcion) =>
                [1, 2].includes(i.cargo_id) && i.activo
            );

            setInscripciones(docentesEditores);
            setError('');
        } catch (err) {
            console.error('Error:', err);
            setError('Error al cargar tus ediciones');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getCargoColor = (cargoId: number) => {
        if (cargoId === 1) return 'from-blue-500 to-indigo-600';
        if (cargoId === 2) return 'from-purple-500 to-pink-600';
        return 'from-gray-500 to-gray-600';
    };

    const getCargoLabel = (cargoId: number) => {
        if (cargoId === 1) return 'Docente';
        if (cargoId === 2) return 'Editor';
        return 'Unknown';
    };

    const handleCardClick = (edicionId: number) => {
        router.push(`/mis-ediciones/${edicionId}`);
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Cargando tus ediciones...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <p className="text-gray-400">No hay sesión activa. Redirigiendo...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Mis Ediciones
                            </h1>
                            <p className="text-gray-400">
                                Gestiona tus ediciones asignadas
                            </p>
                        </div>

                        <Link
                            href={'/ediciones/crear'}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg"
                        >
                            <Plus className="w-4 h-4" />
                            Crear Edición
                        </Link>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <p className="text-red-300 font-medium">{error}</p>
                        </div>
                    )}

                    {inscripciones.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {inscripciones.map((inscripcion) => (
                                <div
                                    key={inscripcion.id}
                                    onClick={() => handleCardClick(inscripcion.edicion.id)}
                                    className="group bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 overflow-hidden hover:border-blue-400/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
                                >
                                    {/* Header */}
                                    <div className={`h-24 bg-gradient-to-br ${getCargoColor(inscripcion.cargo_id)}/20 border-b border-white/10 flex items-center justify-between px-6`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 bg-gradient-to-br ${getCargoColor(inscripcion.cargo_id)} rounded-xl flex items-center justify-center shadow-lg`}>
                                                <BookOpen className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                                {getCargoLabel(inscripcion.cargo_id)}
                                            </span>
                                        </div>

                                        <div>
                                            {inscripcion.edicion.estado_publicado ? (
                                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                                            ) : (
                                                <Lock className="w-5 h-5 text-orange-400" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Contenido */}
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                                                {inscripcion.edicion.nombre_edicion}
                                            </h3>
                                            <p className="text-sm text-gray-400 line-clamp-2">
                                                {inscripcion.edicion.descripcion}
                                            </p>
                                        </div>

                                        {/* Badges */}
                                        <div className="flex gap-2 flex-wrap">
                                            {inscripcion.edicion.activo ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                    Activa
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-300 border border-gray-500/30">
                                                    Inactiva
                                                </span>
                                            )}

                                            {inscripcion.edicion.estado_publicado ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                                    Publicada
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30">
                                                    Borrador
                                                </span>
                                            )}
                                        </div>

                                        {/* Fechas */}
                                        <div className="space-y-1 text-sm text-gray-400 pt-4 border-t border-white/10">
                                            <div>
                                                <span className="font-medium">Apertura:</span> {formatDate(inscripcion.edicion.fecha_apertura)}
                                            </div>
                                            {inscripcion.edicion.fecha_cierre && (
                                                <div>
                                                    <span className="font-medium">Cierre:</span> {formatDate(inscripcion.edicion.fecha_cierre)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Indicador de clic */}
                                        <div className="pt-4 border-t border-white/10">
                                            <p className="text-xs text-center text-gray-500 group-hover:text-blue-400 transition-colors">
                                                Clic para ver detalles →
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 p-12">
                            <div className="text-center">
                                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-400 text-lg mb-2">
                                    No tienes ediciones asignadas
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Las ediciones donde seas docente o editor aparecerán aquí
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}