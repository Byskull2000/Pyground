'use client'
import { ArrowLeft, Search, Edit2, Trash2, Calendar, BookOpen, Plus, Users, AlertCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Edicion {
    id: number;
    id_curso: number;
    nombre_edicion: string;
    descripcion?: string;
    fecha_apertura: string;
    fecha_cierre?: string;
    activo: boolean;
}

export default function EdicionesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const cursoId = searchParams.get('curso');
    const [ediciones, setEdiciones] = useState<Edicion[]>([]);
    const [filteredEdiciones, setFilteredEdiciones] = useState<Edicion[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; edicion: Edicion | null }>({
        show: false,
        edicion: null
    });
    const [deleting, setDeleting] = useState(false);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        if (searchTerm) {
            const filtered = ediciones.filter(e =>
                e.nombre_edicion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredEdiciones(filtered);
        } else {
            setFilteredEdiciones(ediciones);
        }
    }, [searchTerm, ediciones]);

    const fetchEdiciones = useCallback(
        async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');

                const url = `${API_URL}/api/ediciones/curso/${cursoId}`;

                const response = await fetch(url, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error('Error al cargar las ediciones');
                }

                const result = await response.json();
                const edicionesData = result.data || [];
                setEdiciones(edicionesData);
                setFilteredEdiciones(edicionesData);
                setError('');
            } catch (err) {
                console.error('Error fetching ediciones:', err);
                setError('Error al cargar las ediciones. Intenta recargar la página.');
            } finally {
                setLoading(false);
            }
        }, [API_URL, cursoId]
    )

    useEffect(() => {
        fetchEdiciones();
    }, [cursoId, fetchEdiciones]);

    const handleDelete = async (edicion: Edicion) => {
        setDeleting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/ediciones/${edicion.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la edición');
            }

            setEdiciones(ediciones.filter(e => e.id !== edicion.id));
            setDeleteModal({ show: false, edicion: null });
        } catch (err) {
            console.error('Error deleting edicion:', err);
            setError('Error al eliminar la edición');
        } finally {
            setDeleting(false);
        }
    };

    const getEstadoBadge = (edicion: Edicion) => {
        const now = new Date();
        const fechaApertura = new Date(edicion.fecha_apertura);
        const fechaCierre = edicion.fecha_cierre ? new Date(edicion.fecha_cierre) : null;

        if (!edicion.activo) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-300 border border-gray-500/30">
                    Inactiva
                </span>
            );
        }

        if (now < fechaApertura) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Próximamente
                </span>
            );
        }

        if (fechaCierre && now > fechaCierre) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    Finalizada
                </span>
            );
        }

        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                En curso
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Cargando ediciones...</p>
                </div>
            </div>
        );
    }

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
                        Gestión de Ediciones
                    </h1>
                    <p className="text-gray-400">
                        Administra todas las ediciones de cursos del sistema
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
                                placeholder="Buscar por nombre de edición o curso..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-white/20"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-400">
                                Total: <span className="text-white font-semibold">{filteredEdiciones.length}</span>
                            </div>
                            <button
                                onClick={() => router.push(`/admin/ediciones/crear?curso=${cursoId}`)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg"
                            >
                                <Plus className="w-4 h-4" />
                                Nueva Edición
                            </button>
                        </div>
                    </div>
                </div>

                {filteredEdiciones.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEdiciones.map((edicion) => (
                            <div
                                key={edicion.id}
                                className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 overflow-hidden hover:border-blue-400/50 transition-all duration-300"
                            >
                                <div className="h-24 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-purple-600/20 border-b border-white/10 flex items-center justify-between px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <BookOpen className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            {getEstadoBadge(edicion)}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">
                                            {edicion.nombre_edicion}
                                        </h3>
                                    </div>

                                    {edicion.descripcion && (
                                        <p className="text-sm text-gray-400 line-clamp-2">
                                            {edicion.descripcion}
                                        </p>
                                    )}

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <Calendar className="w-4 h-4" />
                                            <span>Apertura: {new Date(edicion.fecha_apertura).toLocaleDateString('es-ES')}</span>
                                        </div>
                                        {edicion.fecha_cierre && (
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                <span>Cierre: {new Date(edicion.fecha_cierre).toLocaleDateString('es-ES')}</span>
                                            </div>
                                        )}

                                    </div>

                                    <div className="flex gap-2 pt-4 border-t border-white/10">
                                        <button
                                            onClick={() => router.push(`/admin/ediciones/${edicion.id}/inscripcion`)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-colors"
                                        >
                                            <Users className="w-4 h-4" />
                                            Inscribir
                                        </button>
                                        <button
                                            onClick={() => router.push(`/admin/ediciones/${edicion.id}/editar`)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => setDeleteModal({ show: true, edicion })}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Eliminar
                                        </button>
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
                                {searchTerm ? 'No se encontraron ediciones' : 'No hay ediciones creadas'}
                            </p>
                            <p className="text-gray-500 text-sm mb-6">
                                {searchTerm ? 'Intenta con otro término de búsqueda' : 'Comienza creando tu primera edición'}
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={() => router.push(`/admin/ediciones/crear${cursoId ? `?curso=${cursoId}` : ''}`)}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg"
                                >
                                    <Plus className="w-5 h-5" />
                                    Crear Primera Edición
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {deleteModal.show && deleteModal.edicion && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-2xl shadow-2xl border border-white/10 max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-white mb-4">
                            Confirmar Eliminación
                        </h3>
                        <p className="text-gray-300 mb-6">
                            ¿Estás seguro de que deseas eliminar la edición <strong>{deleteModal.edicion.nombre_edicion}</strong>? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteModal({ show: false, edicion: null })}
                                disabled={deleting}
                                className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => deleteModal.edicion && handleDelete(deleteModal.edicion)}
                                disabled={deleting}
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {deleting ? (
                                    <>
                                        <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                                        Eliminando...
                                    </>
                                ) : (
                                    'Eliminar'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}