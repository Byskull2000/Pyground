// components/topic/ContentEditable.tsx
'use client';
import React, { useState } from 'react';
import { Edit2, Save, Trash2, X, Video, FileText, Upload, ImageIcon } from 'lucide-react';
import { ContenidoData } from '../../types/content';
import FileUploadModal from '@/components/FileUploadModal';
import Image from 'next/image';

interface ContentEditableProps {
  contenido: ContenidoData;
  index: number;
  editable: boolean;
  onActualizar: (index: number, contenido: ContenidoData) => void;
  onEliminar: (index: number) => void;
}

export default function ContentEditable({
  contenido,
  index,
  editable,
  onActualizar,
  onEliminar,
}: ContentEditableProps) {
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState<ContenidoData>(contenido);
  const [mostrarUpload, setMostrarUpload] = useState(false);


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
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-video">
              {contenido.enlace_archivo && contenido.enlace_archivo.trim() !== '' ? (
                <Image
                  src={contenido.enlace_archivo}
                  alt={contenido.titulo || 'Imagen'}


                  fill
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-gray-600" />
                </div>
              )}

            </div>
          </div>
        );

      case 'VIDEO':
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
            {contenido.tipo === 'IMAGEN' && <ImageIcon className="w-5 h-5" />}
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
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              URL de {valor.tipo === 'IMAGEN' ? 'Imagen' : 'Video'}
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={valor.enlace_archivo || ''}
                onChange={(e) => setValor({ ...valor, enlace_archivo: e.target.value })}
                className="flex-1 bg-black/40 backdrop-blur-xl text-white p-3 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-inner"
                placeholder={valor.tipo === 'VIDEO' ? 'https://youtube.com/watch?v=... o subir archivo' : 'https://... o subir archivo'}
              />
              <button
                type="button"
                onClick={() => setMostrarUpload(true)}
                className="px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Subir
              </button>
            </div>

            {valor.tipo === 'VIDEO' && (
              <p className="text-xs text-gray-400">
                💡 Tip: Puedes usar URLs de YouTube o subir tu propio archivo
              </p>
            )}
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
        <FileUploadModal
          isOpen={mostrarUpload}
          onClose={() => setMostrarUpload(false)}
          onUploadComplete={(url) => {
            setValor({ ...valor, enlace_archivo: url });
            setMostrarUpload(false);
          }}
          type={valor.tipo === 'IMAGEN' ? 'image' : 'video'}
        />
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