'use client';

import { useParams } from 'next/navigation';
import { ArrowLeft, Loader, AlertCircle, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TopicosPanel from '@/app/admin/cursos/[id]/components/TopicosPanel';

interface Unidad {
    id: number;
    id_edicion: number;
    id_unidad_plantilla?: number;
    titulo: string;
    descripcion: string;
    orden: number;
    icono: string;
    color: string;
    estado_publicado: boolean;
}

export default function EdicionUnidadDetailPage() {
    const router = useRouter();
    const params = useParams();
    const edicionId = params?.id as string;
    const unidadId = params?.unidadId as string;

    const [unidad, setUnidad] = useState<Unidad | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        if (unidadId) {
            fetchUnidad();
        }
    }, [unidadId]);

    const fetchUnidad = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            // Obtener datos de la unidad de la edición
            const response = await fetch(`${API_URL}/api/unidades/${unidadId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Error al cargar la unidad');
            }

            const result = await response.json();
            setUnidad(result.data);
            setError('');
        } catch (err) {
            console.error('Error:', err);
            setError('Error al cargar los datos de la unidad');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-blue-500 mx-auto animate-spin" />
                    <p className="mt-4 text-gray-400">Cargando unidad...</p>
                </div>
            </div>
        );
    }

    if (!unidad) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <p className="text-gray-400">No se pudo cargar la unidad</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                    </button>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <p className="text-red-300">{error}</p>
                        </div>
                    )}

                    {/* Información de la unidad */}
                    <div className="bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-8">
                        <div className="flex items-start gap-4 mb-4">
                            <div
                                className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-4xl shadow-lg"
                                style={{ backgroundColor: unidad.color + '33' }}
                            >
                                {unidad.icono}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Unidad {unidad.orden}
                                    </span>
                                    {unidad.estado_publicado ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                            Publicada
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30">
                                            Borrador
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    {unidad.titulo}
                                </h1>
                                <p className="text-gray-300">
                                    {unidad.descripcion}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* TopicosPanel */}
                    <TopicosPanel
                        unidadId={parseInt(unidadId)}
                        unidadTitulo={unidad.titulo}
                    />
                </div>
            </div>
        </>
    );
}