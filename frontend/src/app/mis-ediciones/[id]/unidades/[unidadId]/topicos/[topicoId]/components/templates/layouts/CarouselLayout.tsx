// components/templates/layouts/CarouselLayout.tsx
'use client';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ContentEditable from '../../topic/ContentEditable';
import { TemplateProps, ContenidoData } from '../../../types/content';

export default function CarouselLayout({ contenidos, editable, onActualizar, onEliminar }: TemplateProps) {
  const [actual, setActual] = useState(0);
  const imagenes = contenidos.filter((c: ContenidoData) => c.tipo === 'IMAGEN');
  const textos = contenidos.filter((c: ContenidoData) => c.tipo === 'TEXTO');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {imagenes.length > 0 && (
        <div className="relative">
          <ContentEditable
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
                {imagenes.map((_imagen: ContenidoData, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActual(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === actual ? 'w-8 bg-blue-400' : 'w-2 bg-white/30'
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
          <ContentEditable
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