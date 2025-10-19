import { ChevronRight } from "lucide-react";
import type { Unidad } from "../../interfaces/Edicion";

interface EdicionUnidadesProps {
    unidades: Unidad[];
}

export function EdicionUnidades({ unidades }: EdicionUnidadesProps) {
    const unidadesOrdenadas = [...unidades].sort((a, b) => a.orden - b.orden);

    return (
        <div className="relative bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 p-8 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-600/10 dark:via-purple-600/10 dark:to-pink-600/10"></div>
            
            <div className="relative mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Unidades del Curso
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Explora el contenido organizado por unidades temáticas
                </p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unidadesOrdenadas.map((unidad) => (
                    <div
                        key={unidad.id}
                        className="group relative bg-white/60 dark:bg-white/[0.07] backdrop-blur-2xl rounded-2xl border border-white/40 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent opacity-50"></div>
                        
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 dark:via-white/20 to-transparent"></div>

                        <div 
                            className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500"
                            style={{ backgroundColor: unidad.color }}
                        ></div>

                        <div 
                            className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                            style={{ backgroundColor: unidad.color }}
                        ></div>

                        <div className="relative p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="relative w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg backdrop-blur-sm border border-white/20"
                                        style={{ 
                                            backgroundColor: `${unidad.color}25`,
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                                        <span className="relative z-10">{unidad.icono}</span>
                                    </div>
                                    <span 
                                        className="text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm border shadow-sm"
                                        style={{ 
                                            backgroundColor: `${unidad.color}20`,
                                            color: unidad.color,
                                            borderColor: `${unidad.color}30`
                                        }}
                                    >
                                        Unidad {unidad.orden}
                                    </span>
                                </div>

                                {unidad.estado_publicado && (
                                    <span className="text-xs px-3 py-1.5 bg-green-500/15 backdrop-blur-sm border border-green-500/25 text-green-700 dark:text-green-400 rounded-full font-semibold shadow-sm">
                                        Publicada
                                    </span>
                                )}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                {unidad.titulo}
                            </h3>

                            <p className="text-gray-700 dark:text-gray-300 text-sm mb-6 line-clamp-2 leading-relaxed">
                                {unidad.descripcion}
                            </p>

                            <button
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 backdrop-blur-sm border shadow-md hover:shadow-lg hover:scale-[1.02]"
                                style={{ 
                                    backgroundColor: `${unidad.color}20`,
                                    color: unidad.color,
                                    borderColor: `${unidad.color}30`
                                }}
                            >
                                Ver Unidad
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}