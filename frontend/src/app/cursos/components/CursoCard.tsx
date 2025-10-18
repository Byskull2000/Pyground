import { BookOpen, ChevronRight, Users } from "lucide-react";
import type { Curso } from "../interfaces/Curso";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function CursoCard({ curso }: { curso: Curso }) {
    const router = useRouter();

    return (
        <div
            key={curso.id}
            className="group bg-white/5 dark:bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:border-blue-400/50 dark:hover:border-blue-500/50 hover:shadow-2xl hover:-translate-y-1"
        >
            {/* Encabezado del curso */}
            <div className="h-32 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-purple-600/20 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 border-b border-white/10 dark:border-gray-700/50 flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {curso.codigo_curso}
                    </p>
                </div>
            </div>

            {/* Contenido del curso */}
            <div className="p-6 space-y-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {curso.nombre}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                        {curso.descripcion}
                    </p>
                </div>

                {/* Información del creador */}
                <div className="space-y-2 pt-4 border-t border-white/10 dark:border-gray-700/50">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>
                            Por:{" "}
                            <span className="font-medium capitalize">
                                {curso.creado_por}
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Botón de acción */}
            <div className="p-6 pt-0">
                <Link href={'/ediciones'}>
                    <button
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg group/btn"
                    >
                        Explorar Ediciones del Curso
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </Link>
            </div>
        </div>
    );
}
