'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import EdicionInfoPanel from './components/EdicionInfoPanel';
import EdicionActionsPanel from './components/EdicionActionsPanel';
import InscritosPanel from './components/InscritosPanel';
import { AlertCircle, Loader } from 'lucide-react';

interface Edicion {
    id: number;
    id_curso: number;
    nombre_edicion: string;
    descripcion: string;
    fecha_apertura: string;
    fecha_cierre?: string;
    activo: boolean;
    estado_publicado: boolean;
    fecha_creacion: string;
    creado_por: string;
}

interface Inscripcion {
    id: number;
    usuario_id: number;
    edicion_id: number;
    cargo_id: number;
    fecha_inscripcion: string;
    activo: boolean;
    usuario: {
        id: number;
        email: string;
        nombre: string;
        apellido: string;
        rol: string;
        avatar_url?: string;
    };
    cargo: {
        id: number;
        nombre: string;
    };
}

export default function EdicionDetailPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const edicionId = params?.id;

    const [edicion, setEdicion] = useState<Edicion | null>(null);
    const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
    const [userRole, setUserRole] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        if (!authLoading && user && edicionId) {
            fetchEdicionData();
        }
    }, [user, authLoading, edicionId]);

    const fetchEdicionData = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Fetch edición details
            const edicionResponse = await fetch(`${API_URL}/api/ediciones/${edicionId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!edicionResponse.ok) {
                throw new Error('Error al cargar la edición');
            }

            const edicionData = await edicionResponse.json();
            setEdicion(edicionData.data);

            // Fetch inscripciones
            const inscripcionesResponse = await fetch(`${API_URL}/api/inscripciones/edicion/${edicionId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!inscripcionesResponse.ok) {
                throw new Error('Error al cargar inscritos');
            }

            const inscripcionesData = await inscripcionesResponse.json();
            setInscripciones(inscripcionesData.data || []);

            // Determinar rol del usuario en esta edición
            const userInscripcion = inscripcionesData.data?.find(
                (i: Inscripcion) => i.usuario_id === user?.id
            );
            setUserRole(userInscripcion?.cargo_id || null);

            setError('');
        } catch (err) {
            console.error('Error:', err);
            setError('Error al cargar los datos de la edición');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleEstado = async (nuevoEstado: boolean) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/ediciones/${edicionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ estado_publicado: nuevoEstado })
            });

            if (!response.ok) {
                throw new Error('Error al cambiar estado');
            }

            setEdicion(prev => prev ? { ...prev, estado_publicado: nuevoEstado } : null);
        } catch (err) {
            console.error('Error:', err);
            throw err;
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-blue-500 mx-auto animate-spin" />
                    <p className="mt-4 text-gray-400">Cargando edición...</p>
                </div>
            </div>
        );
    }

    if (!user || !edicion) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <p className="text-gray-400">No se pudo cargar la edición</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-lg border border-red-500/30 rounded-xl flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <p className="text-red-300 font-medium">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Panel Principal - Info de la Edición */}
                        <div className="lg:col-span-2 space-y-6">
                            <EdicionInfoPanel edicion={edicion} />
                            
                            {/* Panel de Inscritos */}
                            <InscritosPanel inscripciones={inscripciones} />
                        </div>

                        {/* Panel Lateral - Acciones */}
                        <div className="lg:col-span-1">
                            <EdicionActionsPanel 
                                edicion={edicion}
                                userRole={userRole}
                                onToggleEstado={handleToggleEstado}
                                onRefresh={fetchEdicionData}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}