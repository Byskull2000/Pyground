// app/topic/[id]/page.tsx
'use client';
import Header from '@/components/Header';
import React, { useEffect, useState } from 'react';
import { Edit2, ChevronRight, Layout, Eye, FileText, Image, Video, Save, Loader } from 'lucide-react';
import { ContenidoData } from './types/content';
import TemplateRenderer from './components/templates/TemplateRenderer';
import TemplateSelectorModal from './components/templates/TemplateSelectorModal';
import { API_URL } from '@/app/config/config';
import { useParams } from 'next/navigation';

export default function TopicEditorPage() {
  const [contenidos, setContenidos] = useState<ContenidoData[]>([]);
  const [vista, setVista] = useState<'preview' | 'editar'>('editar');
  const [plantilla, setPlantilla] = useState(1);
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [loading, setLoading] = useState(false);

  const { topicoId } = useParams()


  useEffect(() => {
    fetchContenidos()
  }, [])
  const handleActualizar = (index: number, contenido: ContenidoData) => {
    const nuevos = [...contenidos];
    nuevos[index] = contenido;
    setContenidos(nuevos);
  };

  const handleEliminar = (index: number) => {
    if (confirm('¿Estás seguro de eliminar este contenido?')) {
      setContenidos(contenidos.filter((_, i) => i !== index));
    }
  };

  const handleAgregarContenido = (tipo: 'TEXTO' | 'IMAGEN' | 'VIDEO') => {
    const nuevoContenido: ContenidoData = {
      tipo,
      orden: contenidos.length + 1,
      titulo: `Nuevo ${tipo}`,
      descripcion: 'Descripción del contenido',
      texto: tipo === 'TEXTO' ? 'Escribe aquí el contenido...' : undefined,
      enlace_archivo: tipo !== 'TEXTO' ? '' : undefined
    };
    setContenidos([...contenidos, nuevoContenido]);
  };
  const fetchContenidos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Obtener datos de la unidad de la edición
      const response = await fetch(`${API_URL}/contenidos/topico/${topicoId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Error al cargar topico');
      }

      const result = await response.json();
      setContenidos(result.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 mx-auto animate-spin" />
          <p className="mt-4 text-gray-400">Cargando contenidos del topico...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Header con gradiente */}
      <div className="flex justify-center mt-8">
        <div className="relative w-[90%] max-w-5xl rounded-2xl overflow-hidden backdrop-blur-2xl bg-white/5 border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.2)]">
          <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/10 via-blue-500/5 to-purple-600/10 blur-2xl"></div>
          <div className="relative px-8 py-6 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-300/70 mb-3">
                <span>Curso</span>
                <ChevronRight className="w-4 h-4 opacity-60" />
                <span>Unidad 1</span>
                <ChevronRight className="w-4 h-4 opacity-60" />
                <span className="text-white font-medium">Nuevo Tópico</span>
              </div>
              <h1 className="text-3xl font-semibold text-white tracking-tight">
                Editor de Contenido
              </h1>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setVista(vista === 'preview' ? 'editar' : 'preview')}
                className={`group relative px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 overflow-hidden ${vista === 'editar'
                  ? 'bg-gradient-to-r from-blue-500/80 to-indigo-600/80 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10 backdrop-blur-sm'
                  }`}
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                {vista === 'editar' ? (
                  <Eye className="w-4 h-4 relative z-10" />
                ) : (
                  <Edit2 className="w-4 h-4 relative z-10" />
                )}
                <span className="relative z-10">
                  {vista === 'editar' ? 'Vista Previa' : 'Editar'}
                </span>
              </button>

              <button
                onClick={() => setMostrarSelector(true)}
                className="group relative px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10 backdrop-blur-sm overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                <Layout className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Cambiar Plantilla</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Botones para agregar contenido en modo edición */}
      {vista === 'editar' && (
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="relative bg-white/10 border border-white/20 rounded-2xl p-8 backdrop-blur-3xl shadow-[0_0_40px_rgba(0,0,0,0.15)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-purple-500/10 to-blue-600/20 opacity-70 rounded-2xl blur-2xl"></div>
            <div className="absolute -top-10 -left-10 w-60 h-60 bg-gradient-to-br from-blue-500/40 to-transparent rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tr from-fuchsia-500/30 to-transparent rounded-full blur-3xl animate-pulse"></div>

            <h3 className="text-white font-semibold mb-6 text-lg flex items-center gap-2 relative z-10">
              Agregar Nuevo Contenido
            </h3>

            <div className="flex gap-4 flex-wrap relative z-10">
              <button
                onClick={() => handleAgregarContenido('TEXTO')}
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/80 to-indigo-600/80 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/40 hover:scale-[1.05] transition-all font-medium backdrop-blur-md relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all"></div>
                <FileText className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Agregar Texto</span>
              </button>

              <button
                onClick={() => handleAgregarContenido('IMAGEN')}
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-fuchsia-500/80 to-pink-600/80 text-white rounded-xl hover:shadow-lg hover:shadow-pink-500/40 hover:scale-[1.05] transition-all font-medium backdrop-blur-md relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all"></div>
                <Image className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Agregar Imagen</span>
              </button>

              <button
                onClick={() => handleAgregarContenido('VIDEO')}
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500/80 to-teal-600/80 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/40 hover:scale-[1.05] transition-all font-medium backdrop-blur-md relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all"></div>
                <Video className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Agregar Video</span>
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {contenidos.length === 0 ? (
          <div className="relative bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-black/80 backdrop-blur-2xl rounded-3xl border border-white/20 p-24 shadow-2xl text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_50%)] rounded-3xl"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-6">📝</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Comienza a crear contenido
              </h2>
              <p className="text-gray-400">
                Agrega texto, imágenes o videos para empezar a construir tu tópico
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="relative bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-black/80 backdrop-blur-2xl rounded-3xl border border-white/20 p-12 shadow-2xl before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-blue-500/5 before:via-purple-500/5 before:to-pink-500/5 before:-z-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_50%)] rounded-3xl"></div>
              <div className="relative z-10">
                <TemplateRenderer
                  templateId={plantilla}
                  contenidos={contenidos}
                  editable={vista === 'editar'}
                  onActualizar={handleActualizar}
                  onEliminar={handleEliminar}
                />
              </div>
            </div>

            {/* Info de la plantilla */}
            <div className="mt-8 relative bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/20 p-6 shadow-xl before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/5 before:to-transparent before:-z-10">
              <div className="grid md:grid-cols-3 gap-6 text-sm relative z-10">
                <div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-gray-400 mb-1 font-medium">Plantilla Actual</p>
                  <p className="text-white font-bold text-lg">Plantilla #{plantilla}</p>
                </div>
                <div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-gray-400 mb-1 font-medium">Contenidos</p>
                  <p className="text-white font-bold text-lg">{contenidos.length} elementos</p>
                </div>
                <div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-gray-400 mb-1 font-medium">Modo</p>
                  <p className="text-white font-bold text-lg">{vista === 'editar' ? 'Edición' : 'Visualización'}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {mostrarSelector && (
        <TemplateSelectorModal
          plantillaActual={plantilla}
          onSeleccionar={setPlantilla}
          onCerrar={() => setMostrarSelector(false)}
        />
      )}
    </div>
  );
}