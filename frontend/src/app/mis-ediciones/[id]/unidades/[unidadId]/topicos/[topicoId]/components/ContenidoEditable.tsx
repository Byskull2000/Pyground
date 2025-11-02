import React, { useState } from 'react';
import { Edit2, Save, Trash2, X } from 'lucide-react';

export interface ContenidoData {
  tipo: 'TEXTO' | 'IMAGEN' | 'VIDEO';
  orden: number;
  titulo?: string;
  descripcion?: string;
  texto?: string;
  enlace_archivo?: string;
}

interface ContenidoEditableProps {
  contenido: ContenidoData;
  index: number;
  editable: boolean;
  onActualizar: (index: number, contenido: ContenidoData) => void;
  onEliminar: (index: number) => void;
}

export function ContenidoEditable({
  contenido,
  index,
  editable,
  onActualizar,
  onEliminar,
}: ContenidoEditableProps) {
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
          <div>
            {contenido.titulo && (
              <h3 className="text-lg font-bold text-white mb-2">
                {contenido.titulo}
              </h3>
            )}
            {contenido.descripcion && (
              <p className="text-sm text-gray-400 mb-3 italic">
                {contenido.descripcion}
              </p>
            )}
            <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
              {contenido.texto || 'Sin contenido de texto...'}
            </p>
          </div>
        );

      case 'IMAGEN':
        return (
          <div>
            {contenido.titulo && (
              <h3 className="text-lg font-bold text-white mb-2">
                {contenido.titulo}
              </h3>
            )}
            {contenido.descripcion && (
              <p className="text-sm text-gray-400 mb-3 italic">
                {contenido.descripcion}
              </p>
            )}
            <div className="w-full bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg overflow-hidden border border-white/10">
              {contenido.enlace_archivo ? (
                <img
                  src={contenido.enlace_archivo}
                  alt={contenido.titulo || 'Imagen'}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-gray-400 text-xs">Sin imagen</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'VIDEO':
        return (
          <div>
            {contenido.titulo && (
              <h3 className="text-lg font-bold text-white mb-2">
                {contenido.titulo}
              </h3>
            )}
            {contenido.descripcion && (
              <p className="text-sm text-gray-400 mb-3 italic">
                {contenido.descripcion}
              </p>
            )}
            <div
              className="w-full bg-black rounded-lg overflow-hidden"
              style={{ aspectRatio: '16/9' }}
            >
              {contenido.enlace_archivo ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={contenido.enlace_archivo}
                  title={contenido.titulo || 'Video'}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-400 text-xs">Sin video</p>
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
      <div className="bg-blue-500/10 border-2 border-blue-500/50 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white font-semibold">Editando {contenido.tipo}</h4>
          <button
            onClick={() => setEditando(false)}
            className="p-2 hover:bg-white/10 rounded-lg"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Título</label>
          <input
            type="text"
            value={valor.titulo || ''}
            onChange={(e) => setValor({ ...valor, titulo: e.target.value })}
            className="w-full bg-white/5 text-white p-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Título del contenido"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Descripción</label>
          <input
            type="text"
            value={valor.descripcion || ''}
            onChange={(e) => setValor({ ...valor, descripcion: e.target.value })}
            className="w-full bg-white/5 text-white p-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Descripción breve"
          />
        </div>

        {valor.tipo === 'TEXTO' ? (
          <div>
            <label className="block text-sm text-gray-400 mb-2">Contenido</label>
            <textarea
              value={valor.texto || ''}
              onChange={(e) => setValor({ ...valor, texto: e.target.value })}
              className="w-full bg-white/5 text-white p-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              rows={6}
              placeholder="Escribe el contenido aquí..."
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              URL de {valor.tipo === 'IMAGEN' ? 'Imagen' : 'Video'}
            </label>
            <input
              type="text"
              value={valor.enlace_archivo || ''}
              onChange={(e) =>
                setValor({ ...valor, enlace_archivo: e.target.value })
              }
              className="w-full bg-white/5 text-white p-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder={`URL de ${valor.tipo.toLowerCase()}`}
            />
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t border-white/10">
          <button
            onClick={handleGuardar}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 border border-green-500/30"
          >
            <Save className="w-4 h-4" />
            Guardar
          </button>
          <button
            onClick={() => onEliminar(index)}
            className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 border border-red-500/30"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition border border-white/10 hover:border-white/20">
      {renderContenido()}
      {editable && (
        <button
          onClick={() => setEditando(true)}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all border border-blue-500/30"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}