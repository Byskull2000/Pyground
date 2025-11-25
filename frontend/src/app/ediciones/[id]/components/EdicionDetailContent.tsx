import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Edicion } from "../../interfaces/Edicion";
import { EdicionHeroSection } from "./EdicionHeroSection";
import { EdicionInfoCards } from "./EdicionInfoCards";
import { EdicionLoadingState } from "./EdicionLoadingState";
import { EdicionErrorState } from "./EdicionErrorState";
import { EdicionUnidades } from "./EdicionUnidades";

interface EdicionDetailContentProps {
    edicionId: string;
}

export function EdicionDetailContent({ edicionId }: EdicionDetailContentProps) {
    const router = useRouter();
    const [edicion, setEdicion] = useState<Edicion | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const id = params.id as string;
    
    console.log('EdicionId recibido:', edicionId);
    console.log('ID de parámetros:', id);

    useEffect(() => {
        const fetchEdicion = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5000/api/ediciones/${id}`);

                if (!response.ok) {
                    throw new Error('Error al cargar la edición');
                }

                const data = await response.json();
                setEdicion(data.data);
                setError(null);
            } catch (err: unknown) {
                let message = 'Error desconocido';
                if (err instanceof Error && err.message) {
                    message = err.message;
                } else if (typeof err === 'string' && err.length) {
                    message = err;
                } else if (err && typeof err === 'object') {
                    try {
                        message = JSON.stringify(err);
                    } catch {
                        // ignore JSON stringify errors
                    }
                }
                setError(message);
                setEdicion(null);
            } finally {
                setLoading(false);
            }
        };

        fetchEdicion();
    }, [id]);

    if (loading) {
        return <EdicionLoadingState />;
    }

    if (error || !edicion) {
        return <EdicionErrorState error={error} onBack={() => router.push('/cursos')} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-black dark:to-gray-900 transition-colors duration-300">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Botón de regreso */}
                <button
                    onClick={() => router.push('/cursos')}
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium mb-6 transition-colors duration-200"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a ediciones
                </button>

                {/* Hero Section */}
                <EdicionHeroSection edicion={edicion} />

                {/* Información de la edición */}
                <EdicionInfoCards edicion={edicion} />

                {/* Unidades del curso */}
                {edicion.unidades && edicion.unidades.length > 0 ? (
                    <EdicionUnidades unidades={edicion.unidades} />
                ) : (
                    <div className="relative bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 p-8 shadow-2xl text-center">
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            No hay unidades disponibles para esta edición
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}