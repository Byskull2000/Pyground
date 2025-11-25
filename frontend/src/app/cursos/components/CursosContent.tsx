import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import type { Curso } from "../interfaces/Curso";
import { CursoCard } from "./CursoCard";

export function CursosContent() {
    const { isAuthenticated } = useAuth();
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/cursos');

                if (!response.ok) {
                    throw new Error('Error al cargar los cursos');
                }

                const data = await response.json();
                setCursos(data.data || []);
                setError(null);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : String(err);
                setError(message || 'Error desconocido');
                setCursos([]);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchCursos();
        }
    }, [isAuthenticated]);



    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-black dark:to-gray-900 transition-colors duration-300">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Cursos
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Explora y elige tus cursos de programación
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
                            <p className="text-gray-600 dark:text-gray-400 font-medium">Cargando cursos...</p>
                        </div>
                    </div>
                ) :  (
                    /* Courses Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cursos.map((curso, i) => (
                            <CursoCard key={i} curso={curso} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}