import { BookOpen, ArrowRight } from 'lucide-react';

interface Unidad {
    id: number;
    id_curso: number;
    titulo: string;
    descripcion: string;
    orden: number;
    icono: string;
    color: string;
}

interface UnidadesPanelProps {
    unidades: Unidad[];
    cursoId: number;
    edicionId?: number;
    onNavigate?: (path: string) => void;
}

export default function UnidadesPanel({ unidades, cursoId, edicionId, onNavigate }: UnidadesPanelProps) {
    const handleNavigate = () => {
        if (onNavigate && edicionId) {
            onNavigate(`/mis-ediciones/${edicionId}/contenido`);
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-b border-white/10 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                Unidades del Curso
                            </h2>
                            <p className="text-sm text-gray-400">
                                {unidades.length} {unidades.length === 1 ? 'unidad disponible' : 'unidades disponibles'}
                            </p>
                        </div>
                    </div>

                    {onNavigate && edicionId && (
                        <button
                            onClick={handleNavigate}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl hover:bg-purple-500/30 transition-all hover:scale-105"
                        >
                            Gestionar
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="p-6">
                {unidades.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-400 mb-4">No hay unidades creadas aún</p>
                        {onNavigate && edicionId && (
                            <button
                                onClick={handleNavigate}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium"
                            >
                                Crear Primera Unidad
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {unidades.map((unidad) => (
                            <div
                                key={unidad.id}
                                className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all hover:shadow-lg group cursor-pointer"
                                onClick={handleNavigate}
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg"
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
                                        <h3 className="text-lg font-bold text-white mb-1 truncate group-hover:text-purple-300 transition-colors">
                                            {unidad.titulo}
                                        </h3>
                                        <p className="text-gray-400 text-sm line-clamp-2">
                                            {unidad.descripcion}
                                        </p>
                                    </div>

                                    <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}