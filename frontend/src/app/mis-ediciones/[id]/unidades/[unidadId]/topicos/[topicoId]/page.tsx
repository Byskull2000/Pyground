'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Eye,
  Edit2,
  CheckCircle,
  Loader,
  AlertCircle,
  Plus,
  Lock,
  Unlock,
  ChevronRight,
  Save,
  X,
  ArrowLeft,
  Layout
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import type { Topico } from '@/interfaces/Topico';
import type { Unidad } from '@/interfaces/Unidad';
import type { Edicion } from '@/interfaces/Edicion';
import type { Curso } from '@/app/cursos/interfaces/Curso';
import { Breadcrumb } from './components/Breadcrumb';
import { ContenidoEditable, type ContenidoData } from './components/ContenidoEditable';
import { SelectorPlantillas } from './components/SelectorPlantilllas';
import { Plantilla3Columnas, PlantillaAccordion, PlantillaCarrusel, PlantillaComparativa, PlantillaDosColumnas, PlantillaDosColumnasInversa, PlantillaGaleria3, PlantillaImagenGrande, PlantillaLineal, PlantillaVideoDestacado, PlantillaVideoGaleriaTexto, PlantillaVideoLateral } from './components/Renderizadores';

// ============ INTERFACES ============

interface Inscripcion {
  id: number;
  usuario_id: number;
  edicion_id: number;
  cargo_id: number;
  fecha_inscripcion: string;
  activo: boolean;
}


interface UserRole {
  cargo_id: number; // 1: Docente, 2: Editor, 3: Estudiante
}

// ============ MOCK DATA ============
const MOCK_CONTENIDOS: ContenidoData[] = [
  {
    tipo: 'TEXTO',
    orden: 1,
    titulo: 'Introducción al tema',
    descripcion: 'Breve resumen de los objetivos y contexto del tópico.',
    texto: 'En este apartado exploraremos los conceptos fundamentales del aprendizaje automático supervisado y cómo se aplican en problemas reales de clasificación y predicción.'
  },
  {
    tipo: 'TEXTO',
    orden: 2,
    titulo: 'Desarrollo del contenido',
    descripcion: 'Explicación detallada del tema principal.',
    texto: 'El algoritmo de regresión lineal busca una función que minimice el error cuadrático medio entre las predicciones y los valores reales. Esta técnica es fundamental en el análisis de datos.'
  },
  {
    tipo: 'IMAGEN',
    orden: 3,
    titulo: 'Gráfico explicativo',
    descripcion: 'Representación visual del modelo de regresión.',
    enlace_archivo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop'
  },
  {
    tipo: 'VIDEO',
    orden: 4,
    titulo: 'Tutorial práctico',
    descripcion: 'Demostración paso a paso del concepto.',
    enlace_archivo: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  }
];

const RENDERIZADORES: Record<number, React.FC<{
  contenidos: ContenidoData[];
  editable: boolean;
  onActualizar: (index: number, contenido: ContenidoData) => void;
  onEliminar: (index: number) => void;
}>> = {
  1: PlantillaLineal,
  2: PlantillaDosColumnas,
  3: PlantillaDosColumnasInversa,
  4: PlantillaVideoDestacado,
  5: PlantillaGaleria3,
  6: PlantillaVideoLateral,
  7: PlantillaCarrusel,
  8: Plantilla3Columnas,
  9: PlantillaImagenGrande,
  10: PlantillaVideoGaleriaTexto,
  11: PlantillaAccordion,
  12: PlantillaComparativa,
};
// ============ PÁGINA PRINCIPAL ============
export default function TopicoContenidosPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const topicoId = params?.topicoId as string;
  const unidadId = params?.unidadId as string;
  const edicionId = params?.id as string;

  const [topico, setTopico] = useState<Topico | null>(null);
  const [unidad, setUnidad] = useState<Unidad | null>(null);
  const [edicion, setEdicion] = useState<Edicion | null>(null);
  const [curso, setCurso] = useState<Curso | null>(null);
  const [contenidos, setContenidos] = useState<ContenidoData[]>(MOCK_CONTENIDOS);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [vista, setVista] = useState<'preview' | 'editar'>('preview');
  const [guardando, setGuardando] = useState(false);
  const [mostrarSelectorPlantillas, setMostrarSelectorPlantillas] = useState(false);


  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!authLoading && user && topicoId) {
      fetchTopicoData();
    }
  }, [user, authLoading, topicoId]);
  const handleCambiarPlantilla = async (nuevaPlantillaId: number) => {
    if (!topico) return;

    try {
      const token = localStorage.getItem('token');
      // const response = await fetch(`${API_URL}/api/topicos/${topicoId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({ id_plantilla: nuevaPlantillaId }),
      // });

      // if (!response.ok) throw new Error('Error al cambiar plantilla');

      setTopico({ ...topico, id_plantilla: nuevaPlantillaId });
      setError('');
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cambiar la plantilla');
    }
  }; 
  const fetchTopicoData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Obtener tópico
      const topicoRes = await fetch(`${API_URL}/api/topicos/${topicoId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!topicoRes.ok) throw new Error('Error al cargar tópico');

      const topicoData = await topicoRes.json();
      setTopico(topicoData.data);

      // Obtener unidad
      const unidadRes = await fetch(`${API_URL}/api/unidades/${topicoData.data.id_unidad}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (unidadRes.ok) {
        const unidadData = await unidadRes.json();
        setUnidad(unidadData.data);

        // Obtener edición
        const edicionRes = await fetch(`${API_URL}/api/ediciones/${unidadData.data.id_edicion}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (edicionRes.ok) {
          const edicionData = await edicionRes.json();
          setEdicion(edicionData.data);

          // Obtener curso
          const cursoRes = await fetch(`${API_URL}/api/cursos/${edicionData.data.id_curso}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (cursoRes.ok) {
            const cursoData = await cursoRes.json();
            setCurso(cursoData.data);
          }
        }

        // Obtener rol del usuario
        const inscripcionRes = await fetch(`${API_URL}/api/inscripciones/edicion/${unidadData.data.id_edicion}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (inscripcionRes.ok) {
          const inscripcionData = await inscripcionRes.json();
          const userInscripcion = inscripcionData.data?.find(
            (i: Inscripcion) => i.usuario_id === user?.id
          );
          if (userInscripcion) {
            setUserRole({ cargo_id: userInscripcion.cargo_id });
          } else if (user?.rol === 'ACADEMICO' || user?.rol === 'ADMIN') {
            // Si el usuario es ACADEMICO o ADMIN del sistema, darle permisos de editor
            setUserRole({ cargo_id: 2 });
          }
        }
      }

      setError('');
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar el tópico');
    } finally {
      setLoading(false);
    }
  };

  const handleActualizarContenido = (index: number, nuevoContenido: ContenidoData) => {
    const nuevosContenidos = [...contenidos];
    nuevosContenidos[index] = nuevoContenido;
    setContenidos(nuevosContenidos);
  };

  const handleEliminarContenido = (index: number) => {
    if (confirm('¿Estás seguro de eliminar este contenido?')) {
      setContenidos(contenidos.filter((_, i) => i !== index));
    }
  };

  const handleAgregarContenido = (tipo: 'TEXTO' | 'IMAGEN' | 'VIDEO') => {
    const nuevoContenido: ContenidoData = {
      tipo,
      orden: contenidos.length + 1,
      titulo: `Nuevo ${tipo}`,
      descripcion: '',
      texto: tipo === 'TEXTO' ? '' : undefined,
      enlace_archivo: tipo !== 'TEXTO' ? '' : undefined
    };
    setContenidos([...contenidos, nuevoContenido]);
  };

  const handleTogglePublicado = async () => {
    if (!topico) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/topicos/${topicoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado_publicado: !topico.estado_publicado })
      });
      setTopico({ ...topico, estado_publicado: !topico.estado_publicado });
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cambiar el estado de publicación');
    }
  };

  const handleGuardarContenidos = async () => {
    setGuardando(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Contenidos guardados exitosamente (mock)');
    } catch (err) {
      console.error('Error:', err);
      setError('Error al guardar contenidos');
    } finally {
      setGuardando(false);
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
            <p className="mt-4 text-gray-400">Cargando tópico...</p>
          </div>
        </div>
      </>
    );
  }

  console.log("topico", topico)
  console.log(user, user)

  if (!topico || !userRole) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-6">No se pudo cargar el tópico o no tienes permisos</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </>
    );
  }

  const isEditor = userRole.cargo_id === 2;
  const isDocente = userRole.cargo_id === 1;
  const canEdit = isEditor || isDocente;
  const canTogglePublish = isEditor || isDocente;

  const Renderizador = RENDERIZADORES[topico.id_plantilla] || RENDERIZADORES[1];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push(`/mis-ediciones/${edicionId}/unidades/${unidadId}`)}
            className="mb-4 flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-lg text-gray-300 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la Unidad
          </button>

          <Breadcrumb topico={topico} unidad={unidad} edicion={edicion} curso={curso} />

          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{topico.titulo}</h1>
              <p className="text-gray-400">{topico.descripcion}</p>
            </div>

            <div className="flex items-center gap-3">
              {topico.estado_publicado ? (
                <span className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-sm border border-green-500/30">
                  <CheckCircle className="w-4 h-4" />
                  Publicado
                </span>
              ) : (
                <span className="flex items-center gap-2 px-3 py-1 bg-orange-500/20 text-orange-300 rounded-lg text-sm border border-orange-500/30">
                  <Lock className="w-4 h-4" />
                  Borrador
                </span>
              )}
            </div>
          </div>

          <div className="mb-8 flex gap-4 items-center flex-wrap">
            <button
              onClick={() => setVista('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all text-sm border ${vista === 'preview'
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                }`}
            >
              <Eye className="w-4 h-4" />
              Vista Previa
            </button>
            {canEdit && (
              <button
                onClick={() => setMostrarSelectorPlantillas(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all text-sm border bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
              >
                <Layout className="w-4 h-4" />
                Cambiar Plantilla
              </button>
            )}
            {canEdit && (
              <button
                onClick={() => setVista('editar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all text-sm border ${vista === 'editar'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                  }`}
              >
                <Edit2 className="w-4 h-4" />
                Editar Contenido
              </button>
            )}

            {canTogglePublish && (
              <button
                onClick={handleTogglePublicado}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all text-sm border ${topico.estado_publicado
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/30 hover:bg-orange-500/30'
                  : 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30'
                  }`}
              >
                {topico.estado_publicado ? (
                  <>
                    <Lock className="w-4 h-4" />
                    Despublicar
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    Publicar
                  </>
                )}
              </button>
            )}

            {vista === 'editar' && canEdit && (
              <button
                onClick={handleGuardarContenidos}
                disabled={guardando}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-xl font-medium transition-all text-sm border border-green-500/30 hover:bg-green-500/30 disabled:opacity-50"
              >
                {guardando ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {guardando ? 'Guardando...' : 'Guardar Todo'}
              </button>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {vista === 'editar' && canEdit && (
            <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleAgregarContenido('TEXTO')}
                  className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-300 rounded-lg text-sm border border-green-500/30 hover:bg-green-500/30"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Texto
                </button>
                <button
                  onClick={() => handleAgregarContenido('IMAGEN')}
                  className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-300 rounded-lg text-sm border border-green-500/30 hover:bg-green-500/30"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Imagen
                </button>
                <button
                  onClick={() => handleAgregarContenido('VIDEO')}
                  className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-300 rounded-lg text-sm border border-green-500/30 hover:bg-green-500/30"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Video
                </button>
              </div>
            </div>
          )}

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8">
            <Renderizador
              contenidos={contenidos}
              editable={vista === 'editar' && canEdit}
              onActualizar={handleActualizarContenido}
              onEliminar={handleEliminarContenido}
            />
          </div>

          <div className="mt-8 p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1"><strong>Rol:</strong></p>
                <p className="text-white font-semibold">
                  {isEditor ? '✏️ Editor' : isDocente ? '👨‍🏫 Docente' : '📚 Estudiante'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1"><strong>Permisos:</strong></p>
                <p className="text-white font-semibold">
                  {canEdit ? 'Edición completa' : 'Solo lectura'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1"><strong>Plantilla:</strong></p>
                <p className="text-white font-semibold">
                  Plantilla #{topico.id_plantilla}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1"><strong>Contenidos:</strong></p>
                <p className="text-white font-semibold">{contenidos.length} elementos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {mostrarSelectorPlantillas && (
        <SelectorPlantillas
          plantillaActual={topico.id_plantilla || 1}
          onSeleccionar={handleCambiarPlantilla}
          onCerrar={() => setMostrarSelectorPlantillas(false)}
        />
      )}
    </>
  );
}