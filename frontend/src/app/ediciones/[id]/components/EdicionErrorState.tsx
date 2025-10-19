import Header from "@/components/Header";
import { XCircle, ArrowLeft } from "lucide-react";

interface EdicionErrorStateProps {
    error: string | null;
    onBack: () => void;
}

export function EdicionErrorState({ error, onBack }: EdicionErrorStateProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-black dark:to-gray-900 transition-colors duration-300">
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="relative bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-red-500/30 dark:border-red-500/50 p-8 text-center shadow-2xl overflow-hidden">
                    {/* Fondo decorativo */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 dark:from-red-600/20 dark:to-orange-600/20"></div>
                    
                    <div className="relative">
                        {/* Icono de error con glassmorphism */}
                        <div className="relative w-20 h-20 mx-auto mb-6">
                            <div className="absolute inset-0 bg-red-500/30 rounded-full blur-xl"></div>
                            <div className="relative w-full h-full bg-red-500/20 dark:bg-red-500/30 backdrop-blur-sm rounded-full border border-red-500/40 flex items-center justify-center">
                                <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-red-700 dark:text-red-400 mb-3">
                            Error al cargar la edición
                        </h2>
                        <p className="text-red-600 dark:text-red-500 mb-8 text-lg">
                            {error || 'No se pudo encontrar la edición'}
                        </p>
                        <button
                            onClick={onBack}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Volver a ediciones
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}