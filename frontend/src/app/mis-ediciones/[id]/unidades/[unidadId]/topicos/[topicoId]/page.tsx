'use client';
import Header from '@/components/Header';
import React, { useState } from 'react';
import { Edit2, Save, Trash2, X, ChevronDown, ChevronLeft, ChevronRight, Layout, Check, Image, Video, FileText, Eye, Plus } from 'lucide-react';

// ============ INTERFACES ============
interface ContenidoData {
  tipo: 'TEXTO' | 'IMAGEN' | 'VIDEO';
  orden: number;
  titulo?: string;
  descripcion?: string;
  texto?: string;
  enlace_archivo?: string;
}

// ============ MOCK DATA ============
const MOCK_CONTENIDOS: ContenidoData[] = [
  {
    tipo: 'TEXTO',
    orden: 1,
    titulo: 'Introducción al Machine Learning',
    descripcion: 'Conceptos fundamentales y aplicaciones',
    texto: 'El aprendizaje automático es una rama de la inteligencia artificial que permite a las computadoras aprender de datos sin ser programadas explícitamente. Esta tecnología revolucionaria está transformando industrias desde la medicina hasta las finanzas.'
  },
  {
    tipo: 'IMAGEN',
    orden: 2,
    titulo: 'Arquitectura de una Red Neuronal',
    descripcion: 'Diagrama conceptual',
    enlace_archivo: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop'
  },
  {
    tipo: 'TEXTO',
    orden: 3,
    titulo: 'Algoritmos de Clasificación',
    descripcion: 'Métodos supervisados más utilizados',
    texto: 'Los algoritmos de clasificación son fundamentales en ML. Entre los más populares encontramos: Decision Trees, Random Forest, SVM y Redes Neuronales. Cada uno tiene sus ventajas específicas dependiendo del problema a resolver.'
  },
  {
    tipo: 'VIDEO',
    orden: 4,
    titulo: 'Tutorial: Primera Red Neuronal',
    descripcion: 'Implementación práctica paso a paso',
    enlace_archivo: 'https://www.youtube.com/embed/aircAruvnKk'
  },
  {
    tipo: 'IMAGEN',
    orden: 5,
    titulo: 'Matriz de Confusión',
    descripcion: 'Evaluación de modelos',
    enlace_archivo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop'
  }
];

// ============ CONTENIDO EDITABLE ============
function ContenidoEditable({
  contenido,
  index,
  editable,
  onActualizar,
  onEliminar,
}: {
  contenido: ContenidoData;
  index: number;
  editable: boolean;
  onActualizar: (index: number, contenido: ContenidoData) => void;
  onEliminar: (index: number) => void;
}) {
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState<ContenidoData>(contenido);

  const handleGuardar = () => {
    onActualizar(index, valor);
    setEditando(false);
  };

  const renderContenido = () => {
    switch (contenido.tipo) {
      case 'TEXTO':
        return (
          <div className="prose prose-invert max-w-none">
            {contenido.titulo && (
              <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
                {contenido.titulo}
              </h3>
            )}
            {contenido.descripcion && (
              <p className="text-blue-300 mb-4 font-medium">
                {contenido.descripcion}
              </p>
            )}
            <div className="text-gray-200 leading-relaxed text-base whitespace-pre-wrap">
              {contenido.texto || 'Sin contenido de texto...'}
            </div>
          </div>
        );

      case 'IMAGEN':
        return (
          <div>
            {contenido.titulo && (
              <h3 className="text-xl font-bold text-white mb-2">
                {contenido.titulo}
              </h3>
            )}
            {contenido.descripcion && (
              <p className="text-blue-300 mb-4 text-sm">
                {contenido.descripcion}
              </p>
            )}
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              {contenido.enlace_archivo ? (
                <img
                  src={contenido.enlace_archivo}
                  alt={contenido.titulo || 'Imagen'}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <Image className="w-16 h-16 text-gray-600" />
                </div>
              )}
            </div>
          </div>
        );

      case 'VIDEO':
        // Convertir URL de YouTube a formato embed
        let videoUrl = contenido.enlace_archivo || '';
        if (videoUrl.includes('youtube.com/watch?v=')) {
          const videoId = videoUrl.split('v=')[1]?.split('&')[0];
          videoUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (videoUrl.includes('youtu.be/')) {
          const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
          videoUrl = `https://www.youtube.com/embed/${videoId}`;
        }

        return (
          <div>
            {contenido.titulo && (
              <h3 className="text-xl font-bold text-white mb-2">
                {contenido.titulo}
              </h3>
            )}
            {contenido.descripcion && (
              <p className="text-blue-300 mb-4 text-sm">
                {contenido.descripcion}
              </p>
            )}
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10" style={{ aspectRatio: '16/9' }}>
              {videoUrl ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={videoUrl}
                  title={contenido.titulo || 'Video'}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <div className="h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <Video className="w-16 h-16 text-gray-600" />
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (editando && editable) {
    return (
      <div className="relative bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 border-2 border-blue-400/50 rounded-2xl p-6 space-y-4 backdrop-blur-2xl shadow-2xl before:absolute before:inset-0 before:rounded-2xl before:bg-white/5 before:-z-10">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white font-semibold flex items-center gap-2">
            {contenido.tipo === 'TEXTO' && <FileText className="w-5 h-5" />}
            {contenido.tipo === 'IMAGEN' && <Image className="w-5 h-5" />}
            {contenido.tipo === 'VIDEO' && <Video className="w-5 h-5" />}
            Editando {contenido.tipo}
          </h4>
          <button
            onClick={() => setEditando(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition backdrop-blur-sm"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
          <input
            type="text"
            value={valor.titulo || ''}
            onChange={(e) => setValor({ ...valor, titulo: e.target.value })}
            className="w-full bg-black/40 backdrop-blur-xl text-white p-3 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-inner"
            placeholder="Título del contenido"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
          <input
            type="text"
            value={valor.descripcion || ''}
            onChange={(e) => setValor({ ...valor, descripcion: e.target.value })}
            className="w-full bg-black/40 backdrop-blur-xl text-white p-3 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-inner"
            placeholder="Descripción breve"
          />
        </div>

        {valor.tipo === 'TEXTO' ? (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Contenido</label>
            <textarea
              value={valor.texto || ''}
              onChange={(e) => setValor({ ...valor, texto: e.target.value })}
              className="w-full bg-black/40 backdrop-blur-xl text-white p-3 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-inner"
              rows={8}
              placeholder="Escribe el contenido aquí..."
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL de {valor.tipo === 'IMAGEN' ? 'Imagen' : 'Video'}
            </label>
            {valor.tipo === 'VIDEO' && (
              <p className="text-xs text-gray-400 mb-2">
                💡 Tip: Puedes usar URLs de YouTube normales (youtube.com/watch?v=...)
              </p>
            )}
            <input
              type="text"
              value={valor.enlace_archivo || ''}
              onChange={(e) => setValor({ ...valor, enlace_archivo: e.target.value })}
              className="w-full bg-black/40 backdrop-blur-xl text-white p-3 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-inner"
              placeholder={valor.tipo === 'VIDEO' ? 'https://youtube.com/watch?v=...' : 'https://...'}
            />
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleGuardar}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/50 hover:scale-105 transition-all font-medium backdrop-blur-sm"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </button>
          <button
            onClick={() => onEliminar(index)}
            className="px-4 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/50 hover:scale-105 transition-all backdrop-blur-sm"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {renderContenido()}
      {editable && (
        <button
          onClick={() => setEditando(true)}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-lg"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ============ RENDERIZADORES ============
function PlantillaLineal({ contenidos, editable, onActualizar, onEliminar }: any) {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {contenidos.map((cont: ContenidoData, idx: number) => (
        <div key={idx} className="animate-fadeIn">
          <ContenidoEditable
            contenido={cont}
            index={idx}
            editable={editable}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
          />
        </div>
      ))}
    </div>
  );
}

function PlantillaDosColumnas({ contenidos, editable, onActualizar, onEliminar }: any) {
  const textos = contenidos.filter((c: ContenidoData) => c.tipo === 'TEXTO');
  const visuales = contenidos.filter((c: ContenidoData) => c.tipo !== 'TEXTO');

  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      <div className="space-y-8">
        {textos.map((cont: ContenidoData, idx: number) => (
          <ContenidoEditable
            key={idx}
            contenido={cont}
            index={contenidos.indexOf(cont)}
            editable={editable}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
          />
        ))}
      </div>
      <div className="space-y-8 lg:sticky lg:top-8 lg:self-start">
        {visuales.map((cont: ContenidoData, idx: number) => (
          <ContenidoEditable
            key={idx}
            contenido={cont}
            index={contenidos.indexOf(cont)}
            editable={editable}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
          />
        ))}
      </div>
    </div>
  );
}

function PlantillaDosColumnasInversa({ contenidos, editable, onActualizar, onEliminar }: any) {
  const imagenes = contenidos.filter((c: ContenidoData) => c.tipo === 'IMAGEN');
  const otros = contenidos.filter((c: ContenidoData) => c.tipo !== 'IMAGEN');

  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      <div className="space-y-8 lg:sticky lg:top-8 lg:self-start">
        {imagenes.map((cont: ContenidoData, idx: number) => (
          <ContenidoEditable
            key={idx}
            contenido={cont}
            index={contenidos.indexOf(cont)}
            editable={editable}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
          />
        ))}
      </div>
      <div className="space-y-8">
        {otros.map((cont: ContenidoData, idx: number) => (
          <ContenidoEditable
            key={idx}
            contenido={cont}
            index={contenidos.indexOf(cont)}
            editable={editable}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
          />
        ))}
      </div>
    </div>
  );
}

function PlantillaVideoDestacado({ contenidos, editable, onActualizar, onEliminar }: any) {
  const videos = contenidos.filter((c: ContenidoData) => c.tipo === 'VIDEO');
  const textos = contenidos.filter((c: ContenidoData) => c.tipo === 'TEXTO');

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {videos.map((cont: ContenidoData, idx: number) => (
        <ContenidoEditable
          key={idx}
          contenido={cont}
          index={contenidos.indexOf(cont)}
          editable={editable}
          onActualizar={onActualizar}
          onEliminar={onEliminar}
        />
      ))}
      <div className="grid md:grid-cols-2 gap-6">
        {textos.map((cont: ContenidoData, idx: number) => (
          <ContenidoEditable
            key={idx}
            contenido={cont}
            index={contenidos.indexOf(cont)}
            editable={editable}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
          />
        ))}
      </div>
    </div>
  );
}

function PlantillaGaleria3({ contenidos, editable, onActualizar, onEliminar }: any) {
  const textos = contenidos.filter((c: ContenidoData) => c.tipo === 'TEXTO');
  const imagenes = contenidos.filter((c: ContenidoData) => c.tipo === 'IMAGEN');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {textos.slice(0, 1).map((cont: ContenidoData, idx: number) => (
        <ContenidoEditable
          key={idx}
          contenido={cont}
          index={contenidos.indexOf(cont)}
          editable={editable}
          onActualizar={onActualizar}
          onEliminar={onEliminar}
        />
      ))}
      <div className="grid md:grid-cols-3 gap-6">
        {imagenes.map((cont: ContenidoData, idx: number) => (
          <ContenidoEditable
            key={idx}
            contenido={cont}
            index={contenidos.indexOf(cont)}
            editable={editable}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
          />
        ))}
      </div>
    </div>
  );
}

function PlantillaVideoLateral({ contenidos, editable, onActualizar, onEliminar }: any) {
  const textos = contenidos.filter((c: ContenidoData) => c.tipo === 'TEXTO');
  const videos = contenidos.filter((c: ContenidoData) => c.tipo === 'VIDEO');

  return (
    <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      <div className="lg:col-span-2 space-y-8">
        {textos.map((cont: ContenidoData, idx: number) => (
          <ContenidoEditable
            key={idx}
            contenido={cont}
            index={contenidos.indexOf(cont)}
            editable={editable}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
          />
        ))}
      </div>
      <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-8 lg:self-start">
        {videos.map((cont: ContenidoData, idx: number) => (
          <ContenidoEditable
            key={idx}
            contenido={cont}
            index={contenidos.indexOf(cont)}
            editable={editable}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
          />
        ))}
      </div>
    </div>
  );
}

function PlantillaCarrusel({ contenidos, editable, onActualizar, onEliminar }: any) {
  const [actual, setActual] = useState(0);
  const imagenes = contenidos.filter((c: ContenidoData) => c.tipo === 'IMAGEN');
  const textos = contenidos.filter((c: ContenidoData) => c.tipo === 'TEXTO');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {imagenes.length > 0 && (
        <div className="relative">
          <ContenidoEditable
            contenido={imagenes[actual]}
            index={contenidos.indexOf(imagenes[actual])}
            editable={editable}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
          />

          {imagenes.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setActual(Math.max(0, actual - 1))}
                disabled={actual === 0}
                className="p-3 bg-white/10 backdrop-blur-lg text-white rounded-full hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition border border-white/20"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                {imagenes.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActual(idx)}
                    className={`h-2 rounded-full transition-all ${idx === actual ? 'w-8 bg-blue-400' : 'w-2 bg-white/30'
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActual(Math.min(imagenes.length - 1, actual + 1))}
                disabled={actual === imagenes.length - 1}
                className="p-3 bg-white/10 backdrop-blur-lg text-white rounded-full hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition border border-white/20"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {textos.map((cont: ContenidoData, idx: number) => (
          <ContenidoEditable
            key={idx}
            contenido={cont}
            index={contenidos.indexOf(cont)}
            editable={editable}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
          />
        ))}
      </div>
    </div>
  );
}

function Plantilla3Columnas({ contenidos, editable, onActualizar, onEliminar }: any) {
  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {contenidos.slice(0, 6).map((cont: ContenidoData, idx: number) => (
        <ContenidoEditable
          key={idx}
          contenido={cont}
          index={idx}
          editable={editable}
          onActualizar={onActualizar}
          onEliminar={onEliminar}
        />
      ))}
    </div>
  );
}

function PlantillaImagenGrande({ contenidos, editable, onActualizar, onEliminar }: any) {
  const imagenes = contenidos.filter((c: ContenidoData) => c.tipo === 'IMAGEN');
  const textos = contenidos.filter((c: ContenidoData) => c.tipo === 'TEXTO');

  return (
    <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      <div className="lg:col-span-2">
        {imagenes.map((cont: ContenidoData, idx: number) => (
          <ContenidoEditable
            key={idx}
            contenido={cont}
            index={contenidos.indexOf(cont)}
            editable={editable}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
          />
        ))}
      </div>
      <div className="lg:col-span-1 space-y-6">
        {textos.map((cont: ContenidoData, idx: number) => (
          <ContenidoEditable
            key={idx}
            contenido={cont}
            index={contenidos.indexOf(cont)}
            editable={editable}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
          />
        ))}
      </div>
    </div>
  );
}

function PlantillaVideoGaleriaTexto({ contenidos, editable, onActualizar, onEliminar }: any) {
  const videos = contenidos.filter((c: ContenidoData) => c.tipo === 'VIDEO');
  const imagenes = contenidos.filter((c: ContenidoData) => c.tipo === 'IMAGEN');
  const textos = contenidos.filter((c: ContenidoData) => c.tipo === 'TEXTO');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {videos.map((cont: ContenidoData, idx: number) => (
        <ContenidoEditable
          key={idx}
          contenido={cont}
          index={contenidos.indexOf(cont)}
          editable={editable}
          onActualizar={onActualizar}
          onEliminar={onEliminar}
        />
      ))}
      <div className="grid md:grid-cols-3 gap-6">
        {imagenes.map((cont: ContenidoData, idx: number) => (
          <ContenidoEditable
            key={idx}
            contenido={cont}
            index={contenidos.indexOf(cont)}
            editable={editable}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
          />
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {textos.map((cont: ContenidoData, idx: number) => (
          <ContenidoEditable
            key={idx}
            contenido={cont}
            index={contenidos.indexOf(cont)}
            editable={editable}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
          />
        ))}
      </div>
    </div>
  );
}

function PlantillaAccordion({ contenidos, editable, onActualizar, onEliminar }: any) {
  const [expandido, setExpandido] = useState(0);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {contenidos.map((cont: ContenidoData, idx: number) => (
        <div
          key={idx}
          className="border border-white/20 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-lg hover:border-white/30 transition"
        >
          <button
            onClick={() => setExpandido(expandido === idx ? -1 : idx)}
            className="w-full p-6 hover:bg-white/10 text-white font-semibold flex items-center justify-between transition"
          >
            <span className="text-lg">
              {cont.titulo || `Sección ${idx + 1}`}
            </span>
            <ChevronDown
              className={`w-5 h-5 transform transition ${expandido === idx ? 'rotate-180' : ''
                }`}
            />
          </button>
          {expandido === idx && (
            <div className="p-6 border-t border-white/20 bg-black/20">
              <ContenidoEditable
                contenido={cont}
                index={idx}
                editable={editable}
                onActualizar={onActualizar}
                onEliminar={onEliminar}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PlantillaComparativa({ contenidos, editable, onActualizar, onEliminar }: any) {
  const mitad = Math.ceil(contenidos.length / 2);

  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl p-8 border border-blue-500/30 backdrop-blur-lg space-y-6">
        <h3 className="text-white font-bold text-xl uppercase tracking-wider border-b border-blue-500/30 pb-4">
          Concepto A
        </h3>
        {contenidos.slice(0, mitad).map((cont: ContenidoData, idx: number) => (
          <ContenidoEditable
            key={idx}
            contenido={cont}
            index={idx}
            editable={editable}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
          />
        ))}
      </div>
      <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-2xl p-8 border border-purple-500/30 backdrop-blur-lg space-y-6">
        <h3 className="text-white font-bold text-xl uppercase tracking-wider border-b border-purple-500/30 pb-4">
          Concepto B
        </h3>
        {contenidos.slice(mitad).map((cont: ContenidoData, idx: number) => (
          <ContenidoEditable
            key={idx}
            contenido={cont}
            index={mitad + idx}
            editable={editable}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
          />
        ))}
      </div>
    </div>
  );
}

// ============ SELECTOR DE PLANTILLAS ============
function SelectorPlantillas({ plantillaActual, onSeleccionar, onCerrar }: any) {
  const [seleccionada, setSeleccionada] = useState(plantillaActual);

  const plantillas = [
    { id: 1, nombre: 'Clásica Lineal', desc: 'Contenido vertical continuo', icon: '📄' },
    { id: 2, nombre: 'Dos Columnas', desc: 'Texto y multimedia lado a lado', icon: '📱' },
    { id: 3, nombre: 'Dos Columnas Inversa', desc: 'Visual izquierda, texto derecha', icon: '🔄' },
    { id: 4, nombre: 'Video Destacado', desc: 'Video principal con transcripción', icon: '🎥' },
    { id: 5, nombre: 'Galería 3 Columnas', desc: 'Grid de imágenes organizadas', icon: '🖼️' },
    { id: 6, nombre: 'Video Lateral', desc: 'Texto amplio con video al costado', icon: '📹' },
    { id: 7, nombre: 'Carrusel', desc: 'Galería deslizable con descripción', icon: '🎠' },
    { id: 8, nombre: '3 Columnas Mixto', desc: 'Contenido en tres columnas', icon: '📊' },
    { id: 9, nombre: 'Imagen Grande', desc: 'Imagen destacada con puntos clave', icon: '🌄' },
    { id: 10, nombre: 'Video + Galería + Texto', desc: 'Multimedia completo', icon: '🎬' },
    { id: 11, nombre: 'Accordion', desc: 'Secciones expandibles', icon: '📋' },
    { id: 12, nombre: 'Comparativa', desc: 'Dos conceptos lado a lado', icon: '⚖️' },
  ];

  return (

    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-3xl shadow-2xl border border-white/20 max-w-6xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-2xl before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-purple-500/10 before:via-blue-500/10 before:to-pink-500/10 before:-z-10">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600/40 via-blue-600/40 to-pink-600/40 backdrop-blur-2xl border-b border-white/20 p-8 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Cambiar Plantilla
              </h2>
              <p className="text-gray-300">
                Elige cómo se mostrará el contenido a tus estudiantes
              </p>
            </div>
            <button
              onClick={onCerrar}
              className="p-3 hover:bg-white/10 rounded-xl transition backdrop-blur-sm"
            >
              <X className="w-6 h-6 text-gray-300" />
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {plantillas.map((p) => (
              <button
                key={p.id}
                onClick={() => setSeleccionada(p.id)}
                className={`relative p-6 rounded-2xl border-2 transition-all text-left backdrop-blur-xl ${seleccionada === p.id
                  ? 'border-blue-400 bg-gradient-to-br from-blue-500/30 to-purple-500/30 shadow-xl shadow-blue-500/20 scale-105'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
              >
                {seleccionada === p.id && (
                  <div className="absolute top-3 right-3 w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="text-base font-bold text-white mb-1">
                  {p.nombre}
                </h3>
                <p className="text-xs text-gray-400">
                  {p.desc}
                </p>
              </button>
            ))}
          </div>

          <div className="mt-8 relative p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
            <div className="relative z-10">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Vista Previa
              </h3>
              <p className="text-white text-lg font-bold">
                {plantillas.find((p) => p.id === seleccionada)?.nombre}
              </p>
              <p className="text-gray-300 text-sm mt-1">
                {plantillas.find((p) => p.id === seleccionada)?.desc}
              </p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-xl p-8 flex gap-4 border-t border-white/10">
          <button
            onClick={onCerrar}
            className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition font-medium border border-white/20"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onSeleccionar(seleccionada);
              onCerrar();
            }}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition font-medium"
          >
            Aplicar Plantilla #{seleccionada}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ DEMO PRINCIPAL ============
export default function TopicoDemo() {
  const [contenidos, setContenidos] = useState(MOCK_CONTENIDOS);
  const [vista, setVista] = useState<'preview' | 'editar'>('preview');
  const [plantilla, setPlantilla] = useState(1);
  const [mostrarSelector, setMostrarSelector] = useState(false);

  const RENDERIZADORES: Record<number, any> = {
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

  const Renderizador = RENDERIZADORES[plantilla] || PlantillaLineal;

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
                <span className="text-white font-medium">Machine Learning Básico</span>
              </div>
              <h1 className="text-3xl font-semibold text-white tracking-tight">
                Introducción al Machine Learning
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
            {/* Efecto líquido / reflejo */}
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
        <div className="relative bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-black/80 backdrop-blur-2xl rounded-3xl border border-white/20 p-12 shadow-2xl before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-blue-500/5 before:via-purple-500/5 before:to-pink-500/5 before:-z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_50%)] rounded-3xl"></div>
          <div className="relative z-10">
            <Renderizador
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
      </div>

      {mostrarSelector && (
        <SelectorPlantillas
          plantillaActual={plantilla}
          onSeleccionar={setPlantilla}
          onCerrar={() => setMostrarSelector(false)}
        />
      )}
    </div>
  );
}