'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { 
    BookOpen, 
    Plus, 
    Edit2, 
    Trash2, 
    ArrowLeft, 
    Loader, 
    AlertCircle,
    GripVertical,
    Save,
    X
} from 'lucide-react';

interface Unidad {
    id: number;
    id_curso: number;
    titulo: string;
    descripcion: string;
    orden: number;
    icono: string;
    color: string;
    fecha_creacion?: string;
}

export default function UnidadesPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const cursoId = params?.id ? parseInt(params.id as string) : null;

    const [unidades, setUnidades] = useState<Unidad[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUnidad, setEditingUnidad] = useState<Unidad | null>(null);
    const [cursoTitulo, setCursoTitulo] = useState('');

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        orden: 1,
        icono: '📘',
        color: '#4B8BBE'
    });

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    const iconos = ['📘', '📗', '📙', '📕', '📚', '🎓', '💡', '🔬', '🎨', '🎭', '🎪', '🎯', '🚀', '⚡', '🌟', '💻', '🔧', '📊', '🎵', '🏆'];
    
    const colores = [
        { name: 'Azul', value: '#4B8BBE' },
        { name: 'Verde', value: '#48BB78' },
        { name: 'Rojo', value: '#F56565' },
        { name: 'Morado', value: '#9F7AEA' },
        { name: 'Naranja', value: '#ED8936' },
        { name: 'Rosa', value: '#ED64A6' },
        { name: 'Cyan', value: '#4FD1C5' },
        { name: 'Amarillo', value: '#ECC94B' }
    ];

    useEffect(() => {
        if (!authLoading && user && cursoId) {
            fetchCursoAndUnidades();
        }
    }, [user, authLoading, cursoId]);

    const fetchCursoAndUnidades = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Obtener información del curso
            const cursoResponse = await fetch(`${API_URL}/api/cursos/${cursoId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!cursoResponse.ok) {
                throw new Error('Error al cargar el curso');
            }

            const cursoData = await cursoResponse.json();
            setCursoTitulo(cursoData.data.titulo);

            // Obtener unidades del curso
            const unidadesResponse = await fetch(`${API_URL}/api/unidades-plantilla/curso/${cursoId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!unidadesResponse.ok) {
                throw new Error('Error al cargar unidades');
            }

            const unidadesData = await unidadesResponse.json();
            setUnidades(unidadesData.data || []);
            setError('');
        } catch (err) {
            console.error('Error:', err);
            setError('Error al cargar las unidades');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!cursoId) {
            setError('No se pudo obtener el ID del curso');
            return;
        }

        if (!formData.titulo.trim() || !formData.descripcion.trim()) {
            setError('Por favor completa todos los campos requeridos');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const url = editingUnidad 
                ? `${API_URL}/api/unidades-plantilla/${editingUnidad.id}`
                : `${API_URL}/api/unidades-plantilla`;
            
            const method = editingUnidad ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_curso: cursoId,
                    ...formData
                })
            });

            if (!response.ok) {
                throw new Error(editingUnidad ? 'Error al actualizar unidad' : 'Error al crear unidad');
            }

            await fetchCursoAndUnidades();
            handleCloseModal();
            setError('');
        } catch (err) {
            console.error('Error:', err);
            setError(editingUnidad ? 'Error al actualizar la unidad' : 'Error al crear la unidad');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta unidad?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/unidades-plantilla/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar unidad');
            }

            await fetchCursoAndUnidades();
            setError('');
        } catch (err) {
            console.error('Error:', err);
            setError('Error al eliminar la unidad');
        }
    };

    const handleEdit = (unidad: Unidad) => {
        setEditingUnidad(unidad);
        setFormData({
            titulo: unidad.titulo,
            descripcion: unidad.descripcion,
            orden: unidad.orden,
            icono: unidad.icono,
            color: unidad.color
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUnidad(null);
        setFormData({
            titulo: '',
            descripcion: '',
            orden: unidades.length + 1,
            icono: '📘',
            color: '#4B8BBE'
        });
    };

    const handleOpenModal = () => {
        setFormData({
            titulo: '',
            descripcion: '',
            orden: unidades.length + 1,
            icono: '📘',
            color: '#4B8BBE'
        });
        setShowModal(true);
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-blue-500 mx-auto animate-spin" />
                    <p className="mt-4 text-gray-400">Cargando unidades...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <button
                        onClick={() => router.push(`/admin/cursos/${cursoId}`)}
                        className="mb-4 flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-lg text-gray-300 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al Curso
                    </button>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">
                                    Unidades del Curso
                                </h1>
                                <p className="text-gray-400">
                                    {cursoTitulo && `${cursoTitulo} • `}
                                    {unidades.length} {unidades.length === 1 ? 'unidad' : 'unidades'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleOpenModal}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            Nueva Unidad
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-lg border border-red-500/30 rounded-xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <p className="text-red-300 font-medium">{error}</p>
                    </div>
                )}

                <div className="space-y-4">
                    {unidades.length === 0 ? (
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-12 text-center">
                            <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">No hay unidades</h3>
                            <p className="text-gray-400 mb-6">Comienza agregando tu primera unidad al curso</p>
                            <button
                                onClick={handleOpenModal}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium"
                            >
                                <Plus className="w-5 h-5" />
                                Crear Primera Unidad
                            </button>
                        </div>
                    ) : (
                        unidades.map((unidad) => (
                            <div
                                key={unidad.id}
                                className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 hover:border-white/20 transition-all group"
                            >
                                <div className="p-6 flex items-center gap-4">
                                    <div className="flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity cursor-move">
                                        <GripVertical className="w-5 h-5 text-gray-400" />
                                    </div>

                                    <div
                                        className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-lg"
                                        style={{ backgroundColor: unidad.color + '33' }}
                                    >
                                        {unidad.icono}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                Unidad {unidad.orden}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1 truncate">
                                            {unidad.titulo}
                                        </h3>
                                        <p className="text-gray-400 text-sm line-clamp-2">
                                            {unidad.descripcion}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(unidad)}
                                            className="p-3 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl hover:bg-blue-500/30 transition-all hover:scale-105"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(unidad.id)}
                                            className="p-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all hover:scale-105"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-900 rounded-2xl shadow-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-b border-white/10 p-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-white">
                                        {editingUnidad ? 'Editar Unidad' : 'Nueva Unidad'}
                                    </h2>
                                    <button
                                        onClick={handleCloseModal}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <X className="w-6 h-6 text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                        Título de la Unidad *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.titulo}
                                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Ej: Introducción a la Programación"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                        Descripción *
                                    </label>
                                    <textarea
                                        value={formData.descripcion}
                                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                        placeholder="Describe el contenido de esta unidad..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                        Orden *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.orden}
                                        onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) || 1 })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                        Icono
                                    </label>
                                    <div className="grid grid-cols-10 gap-2">
                                        {iconos.map((icono) => (
                                            <button
                                                key={icono}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, icono })}
                                                className={`p-3 text-2xl rounded-xl transition-all ${
                                                    formData.icono === icono
                                                        ? 'bg-purple-500/30 border-2 border-purple-500 scale-110'
                                                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                                }`}
                                            >
                                                {icono}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                        Color
                                    </label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {colores.map((color) => (
                                            <button
                                                key={color.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, color: color.value })}
                                                className={`p-4 rounded-xl transition-all ${
                                                    formData.color === color.value
                                                        ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-105'
                                                        : 'hover:scale-105'
                                                }`}
                                                style={{ backgroundColor: color.value }}
                                            >
                                                <span className="text-white font-medium text-sm">
                                                    {color.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                        Vista Previa
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-lg"
                                            style={{ backgroundColor: formData.color + '33' }}
                                        >
                                            {formData.icono}
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                Unidad {formData.orden}
                                            </p>
                                            <p className="text-xl font-bold text-white">
                                                {formData.titulo || 'Título de la unidad'}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {formData.descripcion || 'Descripción de la unidad'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 px-6 py-3 bg-gray-500/20 text-gray-300 border border-gray-500/30 rounded-xl hover:bg-gray-500/30 transition-all font-medium"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium"
                                    >
                                        <Save className="w-5 h-5" />
                                        {editingUnidad ? 'Guardar Cambios' : 'Crear Unidad'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}