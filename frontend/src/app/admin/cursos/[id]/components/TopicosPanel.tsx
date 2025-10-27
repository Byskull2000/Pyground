'use client'
import { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, AlertCircle, Loader, Save, Clock, Target } from 'lucide-react';

interface Topico {
    id: number;
    id_unidad: number;
    id_topico_plantilla?: number;
    titulo: string;
    descripcion: string;
    duracion_estimada: number;
    orden: number;
    publicado: boolean;
    objetivos_aprendizaje: string;
    fecha_creacion: string;
    fecha_actualizacion?: string;
    activo: boolean;
}

interface TopicosPanelProps {
    unidadId: number;
    unidadTitulo: string;
}

export default function TopicosPanel({ unidadId, unidadTitulo }: TopicosPanelProps) {
    const [topicos, setTopicos] = useState<Topico[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        duracion_estimada: 30,
        objetivos_aprendizaje: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; topico: Topico | null }>({
        show: false,
        topico: null
    });
    const [deleting, setDeleting] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchTopicos();
    }, [unidadId]);

    const fetchTopicos = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/topicos/unidad/${unidadId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Error al cargar tópicos');

            const result = await response.json();
            setTopicos(result.data || []);
            setError('');
        } catch (err) {
            console.error('Error:', err);
            setError('Error al cargar los tópicos');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.titulo || !formData.descripcion || !formData.objetivos_aprendizaje) {
            setError('Por favor completa todos los campos requeridos');
            return;
        }

        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const url = editingId
                ? `${API_URL}/api/topicos/${editingId}`
                : `${API_URL}/api/topicos/unidad/${unidadId}`;

            const method = editingId ? 'PUT' : 'POST';
            const body = editingId
                ? formData
                : { ...formData, orden: topicos.length + 1 };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) throw new Error('Error al guardar tópico');

            await fetchTopicos();
            setShowForm(false);
            setEditingId(null);
            setFormData({
                titulo: '',
                descripcion: '',
                duracion_estimada: 30,
                objetivos_aprendizaje: ''
            });
            setError('');
        } catch (err) {
            console.error('Error:', err);
            setError('Error al guardar el tópico');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (topico: Topico) => {
        setFormData({
            titulo: topico.titulo,
            descripcion: topico.descripcion,
            duracion_estimada: topico.duracion_estimada,
            objetivos_aprendizaje: topico.objetivos_aprendizaje
        });
        setEditingId(topico.id);
        setShowForm(true);
    };

    const handleDelete = async () => {
        if (!deleteModal.topico) return;

        setDeleting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/topicos/${deleteModal.topico.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Error al eliminar');

            setTopicos(topicos.filter(t => t.id !== deleteModal.topico!.id));
            setDeleteModal({ show: false, topico: null });
        } catch (err) {
            console.error('Error:', err);
            setError('Error al eliminar el tópico');
        } finally {
            setDeleting(false);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            titulo: '',
            descripcion: '',
            duracion_estimada: 30,
            objetivos_aprendizaje: ''
        });
    };

    if (loading) {
        return (
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 p-8">
                <div className="flex items-center justify-center gap-3">
                    <Loader className="w-5 h-5 text-blue-400 animate-spin" />
                    <p className="text-gray-400">Cargando tópicos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="border-b border-white/10 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Tópicos</h3>
                        <p className="text-sm text-gray-400">{unidadTitulo}</p>
                    </div>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo Tópico
                    </button>
                )}
            </div>

            {error && (
                <div className="p-4 bg-red-500/20 border-b border-red-500/30 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-300 text-sm">{error}</p>
                </div>
            )}

            {/* Form */}
            {showForm && (
                <div className="border-b border-white/10 p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Título *</label>
                        <input
                            type="text"
                            value={formData.titulo}
                            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Ingresa el título del tópico"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Descripción *</label>
                        <textarea
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            rows={3}
                            placeholder="Describe el contenido del tópico"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Duración (minutos) *</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.duracion_estimada}
                                onChange={(e) => setFormData({ ...formData, duracion_estimada: parseInt(e.target.value) || 30 })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Objetivos de Aprendizaje *</label>
                            <input
                                type="text"
                                value={formData.objetivos_aprendizaje}
                                onChange={(e) => setFormData({ ...formData, objetivos_aprendizaje: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Ej: Comprender conceptos básicos"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4" />
                            {submitting ? 'Guardando...' : 'Guardar Tópico'}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Topicos List */}
            <div className="p-6">
                {topicos.length === 0 ? (
                    <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No hay tópicos creados aún</p>
                        <p className="text-sm text-gray-500">Crea el primer tópico para esta unidad</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {topicos.map((topico) => (
                            <div
                                key={topico.id}
                                className="bg-gray-800/50 border border-white/10 rounded-lg p-4 hover:border-purple-400/50 transition-all"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-white mb-1">{topico.titulo}</h4>
                                        <p className="text-sm text-gray-400 mb-2">{topico.descripcion}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                                            <span className="flex items-center gap-2 text-gray-400">
                                                <Clock className="w-4 h-4" />
                                                <span>{topico.duracion_estimada} min</span>
                                            </span>
                                            {topico.objetivos_aprendizaje && (
                                                <span
                                                    className="flex items-center gap-2 text-gray-400 max-w-[40ch] truncate"
                                                    title={topico.objetivos_aprendizaje}
                                                >
                                                    <Target className="w-4 h-4" />
                                                    <span>{topico.objetivos_aprendizaje}</span>
                                                </span>
                                            )}
                                            {topico.publicado && (
                                                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">
                                                    Publicado
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleEdit(topico)}
                                            className="p-2 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition-colors"
                                            title="Editar"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteModal({ show: true, topico })}
                                            className="p-2 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {deleteModal.show && deleteModal.topico && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-2xl shadow-2xl border border-white/10 max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Confirmar Eliminación</h3>
                        <p className="text-gray-300 mb-6">
                            ¿Estás seguro de que deseas eliminar el tópico <strong>{deleteModal.topico.titulo}</strong>? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteModal({ show: false, topico: null })}
                                disabled={deleting}
                                className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {deleting ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
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