// components/templates/layouts/TwoColumnsLayout.tsx
'use client';
import React from 'react';
import ContentEditable from '../../topic/ContentEditable';
import { TemplateProps, ContenidoData } from '../../../types/content';

export default function TwoColumnsLayout({ contenidos, editable, onActualizar, onEliminar }: TemplateProps) {
  const textos = contenidos.filter((c: ContenidoData) => c.tipo === 'TEXTO');
  const visuales = contenidos.filter((c: ContenidoData) => c.tipo !== 'TEXTO');

  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      <div className="space-y-8">
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
      <div className="space-y-8 lg:sticky lg:top-8 lg:self-start">
        {visuales.map((cont: ContenidoData, idx: number) => (
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