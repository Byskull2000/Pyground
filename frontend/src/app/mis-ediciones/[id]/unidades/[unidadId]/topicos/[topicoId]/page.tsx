// app/topic/[id]/page.tsx
'use client';
import Header from '@/components/Header';
import React, { useEffect, useState } from 'react';
import { Edit2, ChevronRight, Layout, Eye, FileText, Image as ImageIcon, Video, Loader } from 'lucide-react';
import { ContenidoData } from './types/content';
import TemplateRenderer from './components/templates/TemplateRenderer';
import TemplateSelectorModal from './components/templates/TemplateSelectorModal';
import { useParams } from 'next/navigation';
import { useContenidos } from '@/hooks/useContenidos';
import { useConfirmDialog } from '@/components/ConfirmDialog';
import TopicCommentsSection from './components/TopicCommentsSection';
import { useAuth } from '@/contexts/AuthContext';

export default function TopicEditorPage() {
  const { topicoId } = useParams();
  const { user } = useAuth();
  const [vista, setVista] = useState<'preview' | 'editar'>('editar');
  const [plantilla, setPlantilla] = useState(1);
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const { showConfirm, ConfirmDialogComponent } = useConfirmDialog();
  const {
    contenidos,
    loading,
    error,
    fetchContenidos,
    createContenidos,
    updateContenido,
    deleteContenido,
    setContenidos
  } = useContenidos();

  // ✅ Los useEffect también van aquí, DESPUÉS de todos los useState pero sin condicionales
  useEffect(() => {
    if (topicoId) {
      fetchContenidos(Number(topicoId));
    }
  }, [topicoId, fetchContenidos]);

  // ✅ AHORA SÍ podemos retornar si faltan datos
  if (!topicoId || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 mx-auto animate-spin" />
          <p className="mt-4 text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  const handleActualizar = async (index: number, contenidoActualizado: ContenidoData) => {
    const contenido = contenidos[index];

    if (contenido.id && typeof contenido.id === 'number') {
      try {
        await updateContenido(contenido.id, contenidoActualizado);
      } catch (err) {
        console.error('Error al actualizar:', err);
      }
    } else {
      const nuevos = [...contenidos];
      nuevos[index] = contenidoActualizado;
      setContenidos(nuevos);
    }
  };

  const handleEliminar = async (index: number) => {
    const contenido = contenidos[index];

    showConfirm({
      title: 'Eliminar Contenido',
      message: `¿Estás seguro de que deseas eliminar "${contenido.titulo || 'este contenido'}"? Esta acción no se puede deshacer.`,
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      type: 'danger',
      onConfirm: async () => {
        if (contenido.id && typeof contenido.id === 'number') {
          try {
            await deleteContenido(contenido.id);
          } catch (err) {
            console.error('Error al eliminar:', err);
          }
        } else {
          setContenidos(contenidos.filter((_, i) => i !== index));
        }
      }
    });
  };

  const handleAgregarContenido = (tipo: 'TEXTO' | 'IMAGEN' | 'VIDEO') => {
    const nuevoContenido: ContenidoData = {
      id: `temp-${Date.now()}`,
      tipo,
      orden: contenidos.length + 1,
      titulo: `Nuevo ${tipo}`,
      descripcion: 'Descripción del contenido',
      texto: tipo === 'TEXTO' ? 'Escribe aquí el contenido...' : undefined,
      enlace_archivo: tipo !== 'TEXTO' ? '' : undefined
    };
    setContenidos([...contenidos, nuevoContenido]);
  };

  const handleGuardarTodo = async () => {
    const contenidosNuevos = contenidos.filter(c =>
      !c.id || typeof c.id !== 'number'
    );

    if (contenidosNuevos.length === 0) {
      alert('No hay cambios pendientes');
      return;
    }

    try {
      setGuardando(true);
      const contenidosParaCrear = contenidosNuevos.map(({  ...rest }) => rest);

      await createContenidos(Number(topicoId), contenidosParaCrear);
      alert('Contenidos guardados exitosamente');
      await fetchContenidos(Number(topicoId));
    } catch (err) {
      console.error('Error:', err);
      alert('Error al guardar contenidos');
    } finally {
      setGuardando(false);
    }
  };

  if (loading && contenidos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 mx-auto animate-spin" />
          <p className="mt-4 text-gray-400">Cargando contenidos del tópico...</p>
        </div>
      </div>
    );
  }

  const hayContenidosNuevos = contenidos.some(c => !c.id || typeof c.id !== 'number');

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
                <span className="text-white font-medium">Tópico #{topicoId}</span>
              </div>
              <h1 className="text-3xl font-semibold text-white tracking-tight">
                Editor de Contenido
              </h1>
              {error && (
                <p className="text-red-400 text-sm mt-2">⚠️ {error}</p>
              )}
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
                <span className="relative z-10">Plantilla #{plantilla}</span>
              </button>

              {hayContenidosNuevos && vista === 'editar' && (
                <button
                  onClick={handleGuardarTodo}
                  disabled={guardando}
                  className="group relative px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 bg-gradient-to-r from-green-500/80 to-emerald-600/80 text-white shadow-lg shadow-green-500/30 overflow-hidden disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                  {guardando ? (
                    <Loader className="w-4 h-4 animate-spin relative z-10" />
                  ) : (
                    <FileText className="w-4 h-4 relative z-10" />
                  )}
                  <span className="relative z-10">
                    {guardando ? 'Guardando...' : 'Guardar Todo'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Botones para agregar contenido en modo edición */}
      {vista === 'editar' && (
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="relative bg-white/10 border border-white/20 rounded-2xl p-8 backdrop-blur-3xl shadow-[0_0_40px_rgba(0,0,0,0.15)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-purple-500/10 to-blue-600/20 opacity-70 rounded-2xl blur-2xl"></div>

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
                <ImageIcon 
                 className="w-5 h-5 relative z-10" 
                 />
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
          </>
        )}
        <div className='mt-8'></div>
        <TopicCommentsSection
          topicoId={Number(topicoId as string)}
          currentUserId={user.id}
          currentUserName={user.nombre}
          currentUserAvatar={user.avatar_url || ''}
        />
      </div>

      <ConfirmDialogComponent />

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