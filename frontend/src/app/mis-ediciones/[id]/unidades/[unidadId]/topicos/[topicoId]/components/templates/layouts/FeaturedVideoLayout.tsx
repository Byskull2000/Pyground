// components/templates/layouts/FeaturedVideoLayout.tsx
'use client';
import React from 'react';
import ContentEditable from '../../topic/ContentEditable';
import { TemplateProps, ContenidoData } from '../../../types/content';

export default function FeaturedVideoLayout({ contenidos, editable, onActualizar, onEliminar }: TemplateProps) {
  const videos = contenidos.filter((c: ContenidoData) => c.tipo === 'VIDEO');
  const textos = contenidos.filter((c: ContenidoData) => c.tipo === 'TEXTO');

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {videos.map((cont: ContenidoData, idx: number) => (
        <ContentEditable
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