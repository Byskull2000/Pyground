'use client'
import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Loader, ArrowLeft, Eye, EyeOff, } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import UnidadesPanel from './components/UnidadesPanel'
import type { Curso } from '@/app/cursos/interfaces/Curso';

interface Unidad {
  id: number;
  id_curso: number;
  titulo: string;
  descripcion: string;
  orden: number;
  icono: string;
  color: string;
}


export default function CursoDetailPage() {
  const [curso, setCurso] = useState<Curso | null>(null);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [publishing, setPublishing] = useState(false);
  const router = useRouter();

  const API_URL = 'http://localhost:5000';
  const { id } = useParams();

  const fetchCursoYUnidades = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const cursoResponse = await fetch(`${API_URL}/api/cursos/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!cursoResponse.ok) throw new Error('Error al cargar el curso');
      const cursoData = await cursoResponse.json();
      setCurso(cursoData.data);

      // Obtener unidades del curso
      const unidadesResponse = await fetch(`${API_URL}/api/unidades-plantilla/curso/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (unidadesResponse.ok) {
        const unidadesData = await unidadesResponse.json();
        setUnidades(unidadesData.data || []);
      }

      setError('');
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar los datos del curso');
    } finally {
      setLoading(false);
    }
  }, [id]);


  useEffect(() => {
    fetchCursoYUnidades();
  }, [id, fetchCursoYUnidades]);

  const handleTogglePublicacion = async () => {
    if (!curso) return;

    setPublishing(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = curso.estado_publicado
        ? `${API_URL}/api/cursos/desactivar/${curso.id}`
        : `${API_URL}/api/cursos/publicar/${curso.id}`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cambiar el estado de publicación');
      }

      // Actualizar el estado localmente sin necesidad de la respuesta
      setCurso({
        ...curso,
        estado_publicado: !curso.estado_publicado
      });
      setError('');
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cambiar el estado de publicación');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 mx-auto animate-spin" />
          <p className="mt-4 text-gray-400">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-400">No se pudo cargar la información del curso</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-lg border border-red-500/30 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300 font-medium">{error}</p>
          </div>
        )}

        {/* Información del curso */}
        <div className="bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-8 border border-white/10 mb-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-white">{curso.nombre}</h1>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${curso.estado_publicado
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                  }`}>
                  {curso.estado_publicado ? (
                    <>
                      <Eye className="w-3 h-3" />
                      Publicado
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3" />
                      Borrador
                    </>
                  )}
                </span>
              </div>
              <p className="text-gray-300 text-lg mb-3">{curso.descripcion}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>Código: <span className="font-semibold text-white">{curso.codigo_curso}</span></span>
                <span>Por: <span className="font-semibold text-white capitalize">{curso.creado_por}</span></span>
              </div>
            </div>

            <button
              onClick={handleTogglePublicacion}
              disabled={publishing}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${curso.estado_publicado
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                } ${publishing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {publishing ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Actualizando...
                </>
              ) : curso.estado_publicado ? (
                <>
                  <EyeOff className="w-5 h-5" />
                  Despublicar Curso
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5" />
                  Publicar Curso
                </>
              )}
            </button>

          </div>


        </div>

        {/* Unidades del curso */}
        <UnidadesPanel
          unidades={unidades}
          cursoId={curso.id}
        />
      </div>
    </div>
  );
}