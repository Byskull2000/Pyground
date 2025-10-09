import { BookOpen, ChevronRight, Users } from "lucide-react";
import type { Curso } from "../interfaces/Curso";

export function CursoCard(
    { curso }: { curso: Curso }
) {
    return <div
        key={curso.id}
        className="group bg-white/5 dark:bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:border-blue-400/50 dark:hover:border-blue-500/50 hover:shadow-2xl hover:-translate-y-1"
    >
        {/* Course Header */}
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

        {/* Course Content */}
        <div className="p-6 space-y-4">
            <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {curso.nombre}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {curso.descripcion}
                </p>
            </div>

            {/* Course Meta */}
            <div className="space-y-2 pt-4 border-t border-white/10 dark:border-gray-700/50">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>Por: <span className="font-medium capitalize">{curso.creado_por}</span></span>
                </div>
            </div>

            {/* Status Badge */}
            <div className="pt-4 border-t border-white/10 dark:border-gray-700/50">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${curso.activo ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    <span className={`text-xs font-semibold uppercase tracking-wider ${curso.activo
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-600 dark:text-gray-400'
                        }`}>
                        {curso.activo ? 'Activo' : 'Inactivo'}
                    </span>
                </div>
            </div>
        </div>

        {/* Action Button */}
        <div className="p-6 pt-0">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg group/btn">
                Explorar Curso
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
        </div>
    </div>
}