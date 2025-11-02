// components/templates/TemplateSelectorModal.tsx
'use client';
import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { TemplateInfo } from '../../types/content';

interface TemplateSelectorModalProps {
  plantillaActual: number;
  onSeleccionar: (id: number) => void;
  onCerrar: () => void;
}

const PLANTILLAS: TemplateInfo[] = [
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

export default function TemplateSelectorModal({ 
  plantillaActual, 
  onSeleccionar, 
  onCerrar 
}: TemplateSelectorModalProps) {
  const [seleccionada, setSeleccionada] = useState(plantillaActual);

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
            {PLANTILLAS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSeleccionada(p.id)}
                className={`relative p-6 rounded-2xl border-2 transition-all text-left backdrop-blur-xl ${
                  seleccionada === p.id
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
                {PLANTILLAS.find((p) => p.id === seleccionada)?.nombre}
              </p>
              <p className="text-gray-300 text-sm mt-1">
                {PLANTILLAS.find((p) => p.id === seleccionada)?.desc}
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