'use client'
import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, BookOpen, Loader, AlertCircle } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

interface Edicion {
    id: number;
    id_curso: number;
    nombre_edicion: string;
    descripcion?: string;
    fecha_apertura: string;
    fecha_cierre?: string;
    activo: boolean;
}

interface Curso {
    id: number;
    nombre: string;
    codigo_curso: string;
    activo: boolean;
}

export default function EditarEdicionPage() {
    const router = useRouter();
    const params = useParams();
    const edicionId = params.id as string;

    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [edicion, setEdicion] = useState<Edicion | null>(null);
    const [formData, setFormData] = useState({
        id_curso: '',
        nombre_edicion: '',
        descripcion: '',
        fecha_apertura: '',
        fecha_cierre: '',
    });

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchEdicionAndCursos();
    }, [edicionId]);

    const fetchEdicionAndCursos = async () => {
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
            setEdicion(edicionActual);

            // Cargar cursos y pre-seleccionar el actual
            const cursosActivos = (cursosData.data || []).filter((c: Curso) => c.activo);
            setCursos(cursosActivos);

            setFormData({
                id_curso: edicionActual.id_curso.toString(),
                nombre_edicion: edicionActual.nombre_edicion,
                descripcion: edicionActual.descripcion || '',
                fecha_apertura: edicionActual.fecha_apertura.slice(0, 16),
                fecha_cierre: edicionActual.fecha_cierre ? edicionActual.fecha_cierre.slice(0, 16) : '',
            });

            setError('');
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error al cargar la edición. Intenta recargar la página.');
        } finally {
            setLoading(false);
        }
    };

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
                router.push(`/admin/ediciones?curso=${formData.id_curso}`);
            }, 1500);
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Error al actualizar la edición';
            console.error('Error updating edicion:', error);
            setError(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Cargando edición...</p>
                </div>
            </div>
        );
    }

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
                        Actualiza los detalles de la edición
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 p-8">
                    {success && (
                        <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-sm font-bold">✓</span>
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
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-white/20"
                            >
                                <option value="">Selecciona un curso</option>
                                {cursos.map(curso => (
                                    <option key={curso.id} value={curso.id}>
                                        {curso.nombre} ({curso.codigo_curso})
                                    </option>
                                ))}
                            </select>
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
                                required
                                maxLength={100}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-white/20"
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
                                rows={4}
                                maxLength={500}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none hover:border-white/20"
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
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-white/20"
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
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-white/20"
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
                                disabled={submitting || !formData.id_curso || !formData.nombre_edicion}
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