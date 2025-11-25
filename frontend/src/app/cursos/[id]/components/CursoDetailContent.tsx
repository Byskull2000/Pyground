import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Curso } from "../../interfaces/Curso";
import { CursoHeroSection } from "./CursoHeroSection";
import { CursoInfoCards } from "./CursoInfoCards";
import { CursoLoadingState } from "./CursoLoadingState";
import { CursoErrorState } from "./CursoErrorState";
import { CursoFutureContent } from "./CursoFutureContent";

interface CursoDetailContentProps {
    cursoId: string;
}

export function CursoDetailContent({ cursoId }: CursoDetailContentProps) {
    const router = useRouter();
    const [curso, setCurso] = useState<Curso | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const id = params.id as string;
    console.log('CursoId recibido:', cursoId);
    console.log('ID de parámetros:', id);

    useEffect(() => {
        const fetchCurso = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5000/api/cursos/${id}`);

                if (!response.ok) {
                    throw new Error('Error al cargar el curso');
                }

                const data = await response.json();
                setCurso(data.data);
                setError(null);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message || 'Error desconocido');
                } else {
                    setError(String(err) || 'Error desconocido');
                } 
                setCurso(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCurso();
    }, [id]);

    if (loading) {
        return <CursoLoadingState />;
    }

    if (error || !curso) {
        return <CursoErrorState error={error} onBack={() => router.push('/cursos')} />;
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
                    Volver a cursos
                </button>

                {/* Hero Section */}
                <CursoHeroSection curso={curso} />

                {/* Información del curso */}
                <CursoInfoCards curso={curso} />

                {/* Sección de contenido futuro */}
                <CursoFutureContent />
            </main>
        </div>
    );
}