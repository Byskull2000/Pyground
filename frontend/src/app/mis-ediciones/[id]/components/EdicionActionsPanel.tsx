import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit2, Eye, EyeOff, CheckCircle, FileEdit, Users, ArrowLeft, Loader } from 'lucide-react';

interface EdicionActionsPanelProps {
    edicion: {
        id: number;
        nombre_edicion: string;
        estado_publicado: boolean;
        activo: boolean;
    };
    userRole: number | null;
    onToggleEstado: (nuevoEstado: boolean) => Promise<void>;
    onRefresh: () => void;
}

export default function EdicionActionsPanel({ 
    edicion, 
    userRole, 
    onToggleEstado,
    onRefresh 
}: EdicionActionsPanelProps) {
    const router = useRouter();
    const [toggling, setToggling] = useState(false);

    const handleToggle = async () => {
        setToggling(true);
        try {
            await onToggleEstado(!edicion.estado_publicado);
        } catch (err) {
            console.error('Error al cambiar estado:', err);
        } finally {
            setToggling(false);
        }
    };

    return (
        <div className="sticky top-8 space-y-4">
            {/* Panel de Acciones Principales */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Edit2 className="w-5 h-5" />
                    Acciones
                </h2>

                <div className="space-y-3">
                    {/* Volver */}
                    <button
                        onClick={() => router.push('/mis-ediciones')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-500/20 text-gray-300 border border-gray-500/30 rounded-xl hover:bg-gray-500/30 transition-all hover:scale-105"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver a Mis Ediciones
                    </button>

                    {/* Toggle Estado */}
                    <button
                        onClick={handleToggle}
                        disabled={toggling}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl hover:bg-cyan-500/30 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {toggling ? (
                            <Loader className="w-4 h-4 animate-spin" />
                        ) : edicion.estado_publicado ? (
                            <EyeOff className="w-4 h-4" />
                        ) : (
                            <Eye className="w-4 h-4" />
                        )}
                        {toggling ? 'Actualizando...' : edicion.estado_publicado ? 'Despublicar Edición' : 'Publicar Edición'}
                    </button>

                    {/* Editar Edición */}
                    <button
                        onClick={() => router.push(`/ediciones/${edicion.id}/editar`)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl hover:bg-blue-500/30 transition-all hover:scale-105"
                    >
                        <Edit2 className="w-4 h-4" />
                        Editar Información
                    </button>
                </div>
            </div>

            {/* Panel de Acciones según Rol */}
            {userRole && (
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        {userRole === 1 ? (
                            <>
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                Acciones de Docente
                            </>
                        ) : (
                            <>
                                <FileEdit className="w-5 h-5 text-purple-400" />
                                Acciones de Editor
                            </>
                        )}
                    </h2>

                    <div className="space-y-3">
                        {userRole === 2 && (
                            <>
                                <button
                                    onClick={() => router.push(`/ediciones/${edicion.id}/contenido`)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl hover:bg-purple-500/30 transition-all hover:scale-105"
                                >
                                    <FileEdit className="w-4 h-4" />
                                    Editar Contenido
                                </button>
                                <button
                                    onClick={() => router.push(`/ediciones/${edicion.id}/temas`)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl hover:bg-indigo-500/30 transition-all hover:scale-105"
                                >
                                    <FileEdit className="w-4 h-4" />
                                    Gestionar Temas
                                </button>
                            </>
                        )}

                        {userRole === 1 && (
                            <>
                                <button
                                    onClick={() => router.push(`/ediciones/${edicion.id}/revisar`)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500/20 text-green-300 border border-green-500/30 rounded-xl hover:bg-green-500/30 transition-all hover:scale-105"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Revisar Contenido
                                </button>
                                <button
                                    onClick={() => router.push(`/ediciones/${edicion.id}/estudiantes`)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/30 transition-all hover:scale-105"
                                >
                                    <Users className="w-4 h-4" />
                                    Gestionar Estudiantes
                                </button>
                            </>
                        )}

                        {/* Ambos roles pueden ver estadísticas */}
                        <button
                            onClick={() => router.push(`/ediciones/${edicion.id}/estadisticas`)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl hover:bg-amber-500/30 transition-all hover:scale-105"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Ver Estadísticas
                        </button>
                    </div>
                </div>
            )}

            {/* Información rápida */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Tu Rol
                </h3>
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        userRole === 1 
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                            : 'bg-gradient-to-br from-purple-500 to-pink-600'
                    }`}>
                        {userRole === 1 ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                            <FileEdit className="w-5 h-5 text-white" />
                        )}
                    </div>
                    <div>
                        <p className="text-white font-bold">
                            {userRole === 1 ? 'Docente' : userRole === 2 ? 'Editor' : 'Sin rol asignado'}
                        </p>
                        <p className="text-xs text-gray-400">
                            {userRole === 1 ? 'Puedes revisar y gestionar estudiantes' : userRole === 2 ? 'Puedes editar contenido y temas' : 'No tienes permisos especiales'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}