// components/templates/layouts/ComparativeLayout.tsx
'use client';
import React from 'react';
import ContentEditable from '../../topic/ContentEditable';
import { TemplateProps, ContenidoData } from '../../../types/content';

export default function ComparativeLayout({ contenidos, editable, onActualizar, onEliminar }: TemplateProps) {
  const mitad = Math.ceil(contenidos.length / 2);

  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl p-8 border border-blue-500/30 backdrop-blur-lg space-y-6">
        <h3 className="text-white font-bold text-xl uppercase tracking-wider border-b border-blue-500/30 pb-4">
          Concepto A
        </h3>
        {contenidos.slice(0, mitad).map((cont: ContenidoData, idx: number) => (
          <ContentEditable
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
          <ContentEditable
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