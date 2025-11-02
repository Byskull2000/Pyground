// components/templates/layouts/TwoColumnsInverseLayout.tsx
'use client';
import React from 'react';
import ContentEditable from '../../topic/ContentEditable';
import { TemplateProps, ContenidoData } from '../../../types/content';

export default function TwoColumnsInverseLayout({ contenidos, editable, onActualizar, onEliminar }: TemplateProps) {
  const imagenes = contenidos.filter((c: ContenidoData) => c.tipo === 'IMAGEN');
  const otros = contenidos.filter((c: ContenidoData) => c.tipo !== 'IMAGEN');

  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      <div className="space-y-8 lg:sticky lg:top-8 lg:self-start">
        {imagenes.map((cont: ContenidoData, idx: number) => (
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
      <div className="space-y-8">
        {otros.map((cont: ContenidoData, idx: number) => (
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