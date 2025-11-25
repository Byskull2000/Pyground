'use client'
import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Calendar, BookOpen, Loader, AlertCircle, Check, Eye, EyeOff } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';


interface Curso {
    id: number;
    nombre: string;
    codigo_curso: string;
    activo: boolean;
}

interface EditarEdicionProps {
    modo?: 'admin' | 'academico' | 'editor';
    redirigirA?: string;
}

export default function EditarEdicionPage({
    modo = 'admin',
    redirigirA = '/admin/ediciones'
}: EditarEdicionProps) {
    const router = useRouter();
    const params = useParams();
    const edicionId = params.id as string;
    const { user, loading: authLoading } = useAuth();

    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        id_curso: '',
        nombre_edicion: '',
        descripcion: '',
        fecha_apertura: '',
        fecha_cierre: '',
        estado_publicado: false
    });

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const fetchEdicionAndCursos = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');

            const [edicionRes, cursosRes] = await Promise.all([
                fetch(`${API_URL}/api/ediciones/${edicionId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_URL}/api/cursos`, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                })
            ]);

            if (!edicionRes.ok || !cursosRes.ok) {
                throw new Error('Error al cargar los datos');
            }

            const [edicionData, cursosData] = await Promise.all([
                edicionRes.json(),
                cursosRes.json()
            ]);

            const edicionActual = edicionData.data;

            const cursosActivos = (cursosData.data || []).filter((c: Curso) => c.activo);
            setCursos(cursosActivos);

            setFormData({
                id_curso: edicionActual.id_curso.toString(),
                nombre_edicion: edicionActual.nombre_edicion,
                descripcion: edicionActual.descripcion || '',
                fecha_apertura: edicionActual.fecha_apertura.slice(0, 16),
                fecha_cierre: edicionActual.fecha_cierre ? edicionActual.fecha_cierre.slice(0, 16) : '',
                estado_publicado: edicionActual.estado_publicado || false
            });

            setError('');
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error al cargar la edición. Intenta recargar la página.');
        } finally {
            setLoading(false);
        }
    }, [API_URL, edicionId]);

    useEffect(() => {
        if (!authLoading && user) {
            fetchEdicionAndCursos();
        }
    }, [edicionId, user, authLoading, fetchEdicionAndCursos]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const validateForm = () => {
        if (!formData.id_curso) {
            setError('Selecciona un curso');
            return false;
        }

        if (!formData.nombre_edicion.trim()) {
            setError('Ingresa un nombre para la edición');
            return false;
        }

        if (formData.nombre_edicion.trim().length < 3) {
            setError('El nombre de la edición debe tener al menos 3 caracteres');
            return false;
        }

        if (!formData.fecha_apertura) {
            setError('Selecciona una fecha de apertura');
            return false;
        }

        const fechaApertura = new Date(formData.fecha_apertura);

        if (isNaN(fechaApertura.getTime())) {
            setError('La fecha de apertura es inválida');
            return false;
        }

        if (formData.fecha_cierre) {
            const fechaCierre = new Date(formData.fecha_cierre);

            if (isNaN(fechaCierre.getTime())) {
                setError('La fecha de cierre es inválida');
                return false;
            }

            if (fechaCierre <= fechaApertura) {
                setError('La fecha de cierre debe ser posterior a la fecha de apertura');
                return false;
            }

            const diffTime = fechaCierre.getTime() - fechaApertura.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            if (diffDays > 1460) {
                setError('La duración de la edición no puede exceder 4 años');
                return false;
            }

            if (diffDays < 1) {
                setError('La edición debe durar al menos 1 día');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setError('');
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('No hay sesión activa. Por favor, inicia sesión nuevamente.');
                return;
            }

            const payload = {
                id_curso: parseInt(formData.id_curso),
                nombre_edicion: formData.nombre_edicion.trim(),
                descripcion: formData.descripcion.trim(),
                fecha_apertura: new Date(formData.fecha_apertura).toISOString(),
                fecha_cierre: formData.fecha_cierre
                    ? new Date(formData.fecha_cierre).toISOString()
                    : null,
                estado_publicado: formData.estado_publicado
            };

            const response = await fetch(`${API_URL}/api/ediciones/${edicionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || result.error || 'Error al actualizar la edición');
            }

            setSuccess(true);

            setTimeout(() => {
                if (modo === 'admin') {
                    router.push(`/admin/ediciones?curso=${formData.id_curso}`);
                } else if (modo === 'academico' || modo === 'editor') {
                    router.push('/mis-ediciones');
                } else if (redirigirA) {
                    router.push(redirigirA);
                } else {
                    router.back();
                }
            }, 1500);
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Error al actualizar la edición';
            console.error('Error updating edicion:', error);
            setError(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Cargando edición...</p>
                </div>
            </div>
        );
    }

    const canEditCourse = modo === 'admin';
    const canEditFields = modo === 'admin' || modo === 'academico' || modo === 'editor';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Editar Edición
                    </h1>
                    <p className="text-gray-400">
                        {modo === 'admin'
                            ? 'Actualiza los detalles de la edición'
                            : modo === 'academico'
                                ? 'Como docente, puedes editar la información de la edición'
                                : 'Como editor, puedes editar la información de la edición'}
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 p-8">
                    {success && (
                        <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                            <p className="text-emerald-300 font-medium">Edición actualizada correctamente. Redirigiendo...</p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <p className="text-red-300 font-medium">{error}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-3">
                                <BookOpen className="inline w-4 h-4 mr-2" />
                                Curso *
                            </label>
                            <select
                                name="id_curso"
                                value={formData.id_curso}
                                onChange={handleChange}
                                disabled={!canEditCourse}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-white/20 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <option value="">Selecciona un curso</option>
                                {cursos.map(curso => (
                                    <option key={curso.id} value={curso.id}>
                                        {curso.nombre} ({curso.codigo_curso})
                                    </option>
                                ))}
                            </select>
                            {!canEditCourse && (
                                <p className="text-xs text-gray-500 mt-1">Solo admin puede cambiar el curso</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-3">
                                Nombre de la Edición *
                            </label>
                            <input
                                type="text"
                                name="nombre_edicion"
                                value={formData.nombre_edicion}
                                onChange={handleChange}
                                placeholder="ej: Python 2025-2"
                                disabled={!canEditFields}
                                required
                                maxLength={100}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-white/20 disabled:opacity-60 disabled:cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">{formData.nombre_edicion.length}/100</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-3">
                                Descripción
                            </label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                placeholder="Describe esta edición del curso..."
                                disabled={!canEditFields}
                                rows={4}
                                maxLength={500}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none hover:border-white/20 disabled:opacity-60 disabled:cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">{formData.descripcion.length}/500</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    <Calendar className="inline w-4 h-4 mr-2" />
                                    Fecha de Apertura *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="fecha_apertura"
                                    value={formData.fecha_apertura}
                                    onChange={handleChange}
                                    disabled={!canEditFields}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-white/20 disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Fecha de inicio de la edición
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    <Calendar className="inline w-4 h-4 mr-2" />
                                    Fecha de Cierre (Opcional)
                                </label>
                                <input
                                    type="datetime-local"
                                    name="fecha_cierre"
                                    value={formData.fecha_cierre}
                                    onChange={handleChange}
                                    disabled={!canEditFields}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-white/20 disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                                {formData.fecha_apertura && formData.fecha_cierre && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Duración: {Math.ceil(
                                            (new Date(formData.fecha_cierre).getTime() - new Date(formData.fecha_apertura).getTime())
                                            / (1000 * 60 * 60 * 24)
                                        )} días
                                    </p>
                                )}
                                {!formData.fecha_cierre && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Dejar vacío para edición sin fecha de cierre
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Toggle Estado Publicado */}
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-300 mb-1">
                                        Estado de Publicación
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {formData.estado_publicado
                                            ? 'La edición es visible para los estudiantes'
                                            : 'La edición está en borrador, no es visible'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({
                                        ...prev,
                                        estado_publicado: !prev.estado_publicado
                                    }))}
                                    disabled={!canEditFields}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${formData.estado_publicado
                                        ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
                                        : 'bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {formData.estado_publicado ? (
                                        <>
                                            <Eye className="w-4 h-4" />
                                            Publicada
                                        </>
                                    ) : (
                                        <>
                                            <EyeOff className="w-4 h-4" />
                                            Borrador
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-6 border-t border-white/10">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={submitting || !formData.id_curso || !formData.nombre_edicion || !canEditFields}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                {submitting && <Loader className="w-4 h-4 animate-spin" />}
                                {submitting ? 'Actualizando...' : 'Actualizar Edición'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}