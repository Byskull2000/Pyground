import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import type { Edicion } from "../../ediciones/interfaces/Edicion";
import { EdicionCard } from "./EdicionCard";

export function EdicionesContent() {
    const { isAuthenticated } = useAuth();
    const [ediciones, setEdiciones] = useState<Edicion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEdiciones = async () => {
            try {
                setLoading(true);
                // Obteniendo ediciones del curso 1
                const response = await fetch('http://localhost:5000/api/ediciones/curso/1');

                if (!response.ok) {
                    throw new Error('Error al cargar las ediciones');
                }

                const data = await response.json();
                setEdiciones(data.data || []);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Error desconocido');
                setEdiciones([]);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchEdiciones();
        }
    }, [isAuthenticated]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-black dark:to-gray-900 transition-colors duration-300">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Ediciones Disponibles
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Selecciona la edición del curso en la que deseas participar
                    </p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-8">
                        <p className="text-red-700 dark:text-red-400 font-medium">Error: {error}</p>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">Cargando ediciones...</p>
                        </div>
                    </div>
                ) : ediciones.length === 0 ? (
                    /* Empty State */
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400 font-medium">
                                No hay ediciones disponibles en este momento
                            </p>
                        </div>
                    </div>
                ) : (
                    /* Ediciones Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ediciones.map((edicion) => (
                            <EdicionCard key={edicion.id} edicion={edicion} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}