import { BookOpen, CheckCircle, XCircle } from "lucide-react";
import type { Edicion } from "../../interfaces/Edicion";

interface EdicionHeroSectionProps {
    edicion: Edicion;
}

export function EdicionHeroSection({ edicion }: EdicionHeroSectionProps) {
    return (
        <div className="relative bg-white/70 dark:bg-gray-900/40 backdrop-blur-2xl rounded-3xl border border-white/60 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-8 md:p-12 mb-8 overflow-hidden">
            {/* Efecto de fondo glassmorphism mejorado */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 dark:from-blue-400/10 dark:via-indigo-400/10 dark:to-purple-400/10"></div>
            
            {/* Círculos decorativos de fondo con efecto glass */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-indigo-400/30 dark:from-blue-500/20 dark:to-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 dark:from-purple-500/20 dark:to-pink-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            {/* Brillo superior glass effect */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 dark:via-white/20 to-transparent"></div>

            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Icono de la edición con glassmorphism mejorado */}
                <div className="relative w-20 h-20 flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/80 to-indigo-600/80 rounded-2xl blur-lg"></div>
                    <div className="relative w-full h-full bg-gradient-to-br from-blue-500/90 to-indigo-600/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-2xl"></div>
                        <BookOpen className="w-10 h-10 text-white relative z-10" />
                    </div>
                </div>

                <div className="flex-1">
                    {/* Información del curso base */}
                    {edicion.curso && (
                        <div className="mb-3">
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 dark:bg-indigo-500/20 backdrop-blur-md border border-indigo-500/20 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-full">
                                {edicion.curso.codigo_curso} - {edicion.curso.nombre}
                            </span>
                        </div>
                    )}

                    {/* Badges con efecto glass */}
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                        {edicion.activo ? (
                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-500/10 dark:bg-green-500/20 backdrop-blur-md border border-green-500/20 dark:border-green-500/30 text-green-700 dark:text-green-300 text-sm font-semibold rounded-full shadow-lg">
                                <CheckCircle className="w-4 h-4" />
                                Activa
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gray-500/10 dark:bg-gray-500/20 backdrop-blur-md border border-gray-500/20 dark:border-gray-500/30 text-gray-700 dark:text-gray-400 text-sm font-semibold rounded-full shadow-lg">
                                <XCircle className="w-4 h-4" />
                                Inactiva
                            </span>
                        )}
                        
                        {edicion.estado_publicado && (
                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-500/10 dark:bg-blue-500/20 backdrop-blur-md border border-blue-500/20 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-full shadow-lg">
                                <CheckCircle className="w-4 h-4" />
                                Publicada
                            </span>
                        )}
                    </div>

                    {/* Título */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text">
                        {edicion.nombre_edicion}
                    </h1>

                    {/* Descripción */}
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                        {edicion.descripcion}
                    </p>
                </div>
            </div>
        </div>
    );
}   