import Header from "@/components/Header";

export function CursoLoadingState() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-black dark:to-gray-900 transition-colors duration-300">
            <Header />
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    {/* Spinner con glassmorphism */}
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 bg-white/40 dark:bg-white/10 backdrop-blur-xl rounded-full border border-white/20 dark:border-gray-700/50 shadow-2xl"></div>
                        <div className="absolute inset-2 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
                        <div className="absolute inset-4 border-4 border-transparent border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">
                        Cargando información del curso...
                    </p>
                </div>
            </div>
        </div>
    );
}