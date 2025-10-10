import { Clock, BookOpen, FileText, Video, Users } from "lucide-react";

export function CursoFutureContent() {
    const features = [
        { icon: BookOpen, label: "Lecciones" },
        { icon: Video, label: "Videos" },
        { icon: FileText, label: "Materiales" },
        { icon: Users, label: "Estudiantes" }
    ];

    return (
        <div className="relative bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 p-8 shadow-2xl overflow-hidden">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-600/10 dark:via-purple-600/10 dark:to-pink-600/10"></div>
            
            {/* Círculos decorativos */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-400/10 dark:bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-400/10 dark:bg-purple-500/20 rounded-full blur-3xl"></div>

            <div className="relative text-center py-12">
                {/* Icono principal con glassmorphism */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-40"></div>
                    <div className="relative w-full h-full bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-600/50 flex items-center justify-center shadow-2xl">
                        <Clock className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                    </div>
                </div>

                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    Más contenido próximamente
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg max-w-2xl mx-auto">
                    Aquí podrás encontrar todo el contenido del curso organizado y listo para aprender
                </p>

                {/* Features grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white/30 dark:bg-white/5 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/50 p-4 shadow-lg"
                            >
                                <Icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    {feature.label}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}