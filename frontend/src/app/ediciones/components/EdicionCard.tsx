import { BookOpen, Calendar, ChevronRight, Users } from "lucide-react";
import type { Edicion } from "../../ediciones/interfaces/Edicion";
import { useRouter } from "next/navigation";

export function EdicionCard({ edicion }: { edicion: Edicion }) {
    const router = useRouter();

    const handleRedirect = () => {
        router.push(`/ediciones/${edicion.id}`);
    };

    // Formatear fechas
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div
            className="group bg-white/5 dark:bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:border-blue-400/50 dark:hover:border-blue-500/50 hover:shadow-2xl hover:-translate-y-1"
        >
            {/* Encabezado de la edición */}
            <div className="h-32 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-purple-600/20 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 border-b border-white/10 dark:border-gray-700/50 flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        {edicion.activo && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                                Activa
                            </span>
                        )}
                        {edicion.estado_publicado && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">
                                Publicada
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Contenido de la edición */}
            <div className="p-6 space-y-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {edicion.nombre_edicion}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                        {edicion.descripcion}
                    </p>
                </div>

                {/* Información de fechas */}
                <div className="space-y-2 pt-4 border-t border-white/10 dark:border-gray-700/50">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                            Apertura: <span className="font-medium">{formatDate(edicion.fecha_apertura)}</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                            Cierre: <span className="font-medium">{formatDate(edicion.fecha_cierre)}</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>
                            Por: <span className="font-medium capitalize">{edicion.creado_por}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Botón de acción */}
            <div className="p-6 pt-0">
                <button
                    onClick={handleRedirect}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg group/btn"
                >
                    Explorar Edición
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}