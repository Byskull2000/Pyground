'use client'
import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Loader, AlertCircle, Check, X } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import type { Usuario } from '@/interfaces/Usuario';
import type { Inscripcion } from '@/interfaces/Inscripcion';
import type { Edicion } from '@/interfaces/Edicion';

export const CARGOS = [
    { id: 1, nombre: 'Docente' },
    { id: 2, nombre: 'Editor' },
    { id: 3, nombre: 'Estudiante' }
];

export default function InscripcionPage() {
    const router = useRouter();
    const params = useParams();
    const edicionId = params.id as string;

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
    const [edicion, setEdicion] = useState<Edicion | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [userRole, setUserRole] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        usuario_id: '',
        cargo_id: '1'
    });

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchData();
        getCurrentUser();
    }, [edicionId]);

    const getCurrentUser = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setUserRole(user.rol?.toUpperCase());
                setCurrentUserId(user.id);

                if (user.rol?.toUpperCase() === 'ACADEMICO') {
                    setFormData(prev => ({
                        ...prev,
                        usuario_id: user.id.toString()
                    }));
                }
            }
        } catch (err) {
            console.error('Error getting current user:', err);
        }
    };

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');

            const [edicionRes, usuariosRes, inscripcionesRes] = await Promise.all([
                fetch(`${API_URL}/api/ediciones/${edicionId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_URL}/api/usuarios`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_URL}/api/inscripciones/edicion/${edicionId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            if (!edicionRes.ok || !usuariosRes.ok) {
                throw new Error('Error al cargar los datos');
            }

            const [edicionData, usuariosData, inscripcionesData] = await Promise.all([
                edicionRes.json(),
                usuariosRes.json(),
                inscripcionesRes.ok ? inscripcionesRes.json() : { data: [] }
            ]);

            const usuarios: Usuario[] = usuariosData.data || [];

            setEdicion(edicionData.data);
            setUsuarios(usuarios.filter(usuario => usuario.rol !== 'ADMIN'));
            setInscripciones(inscripcionesData.data || []);
            setError('');
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error al cargar los datos. Intenta recargar la página.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.usuario_id) {
            setError('Selecciona un usuario');
            return;
        }

        setError('');
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');

            const payload = {
                usuario_id: parseInt(formData.usuario_id),
                edicion_id: parseInt(edicionId),
                cargo_id: parseInt(formData.cargo_id)
            };

            const response = await fetch(`${API_URL}/api/inscripciones`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || result.error || 'Error al asignar usuario');
            }

            setSuccess(`${result.data.usuario.nombre} asignado como ${CARGOS.find(c => c.id === parseInt(formData.cargo_id))?.nombre}`);
            setFormData({ usuario_id: userRole === 'ACADEMICO' ? currentUserId?.toString() || '' : '', cargo_id: '1' });

            setTimeout(() => {
                fetchData();
            }, 1000);
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Error al asignar usuario';
            console.error('Error:', error);
            setError(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleRemove = async (inscripcionId: number) => {
        if (!window.confirm('¿Estás seguro de que deseas remover esta asignación?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/api/inscripciones/${inscripcionId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Error al remover');
            }

            setSuccess('Asignación removida correctamente');
            fetchData();
        } catch (error) {
            setError('Error al remover la asignación');
            console.error('Error:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Cargando datos...</p>
                </div>
            </div>
        );
    }

    const docentesEditores = inscripciones.filter(i => [1, 2].includes(i.cargo_id));

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Asignar Docente/Editor
                    </h1>
                    <p className="text-gray-400">
                        {edicion?.nombre_edicion}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <p className="text-red-300 font-medium">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center gap-3">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <p className="text-emerald-300 font-medium">{success}</p>
                    </div>
                )}

                {/* Formulario de asignación */}
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-white mb-4">
                        Asignar {userRole === 'ACADEMICO' ? 'Docente' : 'Docente o Editor'}
                    </h2>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Usuario *
                                </label>
                                <select
                                    name="usuario_id"
                                    value={formData.usuario_id}
                                    onChange={handleChange}
                                    disabled={userRole === 'ACADEMICO'}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-white/20 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <option value="">Selecciona un usuario</option>
                                    {usuarios.map(usuario => (
                                        <option key={usuario.id} value={usuario.id}>
                                            {usuario.nombre} {usuario.apellido} ({usuario.email})
                                        </option>
                                    ))}
                                </select>
                                {userRole === 'ACADEMICO' && (
                                    <p className="text-xs text-gray-500 mt-1">Tu usuario fue pre-seleccionado</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Cargo *
                                </label>
                                <select
                                    name="cargo_id"
                                    value={formData.cargo_id}
                                    onChange={handleChange}
                                    disabled={userRole === 'ACADEMICO'}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-white/20 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {userRole === 'ACADEMICO' ? (
                                        <option value="1">Docente</option>
                                    ) : (
                                        <>
                                            <option value="1">Docente</option>
                                            <option value="2">Editor</option>
                                            <option value="3">Estudiante</option>
                                        </>
                                    )}
                                </select>

                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={submitting || !formData.usuario_id}
                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                            {submitting && <Loader className="w-4 h-4 animate-spin" />}
                            {submitting ? 'Asignando...' : 'Asignar'}
                        </button>
                    </div>
                </div>

                {/* Lista de asignaciones */}
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Docentes y Editores Asignados ({docentesEditores.length})
                        </h2>
                    </div>

                    {docentesEditores.length > 0 ? (
                        <div className="divide-y divide-white/10">
                            {docentesEditores.map(inscripcion => (
                                <div key={inscripcion.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        {inscripcion.usuario.avatar_url ? (
                                            <img
                                                src={inscripcion.usuario.avatar_url}
                                                alt={inscripcion.usuario.nombre}
                                                className="w-12 h-12 rounded-full object-cover border border-white/20"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                                                {inscripcion.usuario.nombre[0]}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-white font-semibold">
                                                {inscripcion.usuario.nombre} {inscripcion.usuario.apellido}
                                            </p>
                                            <p className="text-sm text-gray-400">{inscripcion.usuario.email}</p>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 mt-1">
                                                {inscripcion.cargo.nombre}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleRemove(inscripcion.id)}
                                        className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                        title="Remover asignación"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-400">No hay docentes ni editores asignados</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}