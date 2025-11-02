// components/templates/layouts/VideoSidebarLayout.tsx
'use client';
import React from 'react';
import ContentEditable from '../../topic/ContentEditable';
import { TemplateProps, ContenidoData } from '../../../types/content';


export default function VideoSidebarLayout({ contenidos, editable, onActualizar, onEliminar }: TemplateProps) {
  const textos = contenidos.filter((c: ContenidoData) => c.tipo === 'TEXTO');
  const videos = contenidos.filter((c: ContenidoData) => c.tipo === 'VIDEO');

  return (
    <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      <div className="lg:col-span-2 space-y-8">
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
      <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-8 lg:self-start">
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
      </div>
    </div>
  );
}