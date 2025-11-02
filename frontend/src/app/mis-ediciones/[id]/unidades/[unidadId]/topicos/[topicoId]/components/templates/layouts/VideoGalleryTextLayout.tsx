// components/templates/layouts/VideoGalleryTextLayout.tsx
'use client';
import React from 'react';
import ContentEditable from '../../topic/ContentEditable';
import { TemplateProps, ContenidoData } from '../../../types/content';


export default function VideoGalleryTextLayout({ contenidos, editable, onActualizar, onEliminar }: TemplateProps) {
  const videos = contenidos.filter((c: ContenidoData) => c.tipo === 'VIDEO');
  const imagenes = contenidos.filter((c: ContenidoData) => c.tipo === 'IMAGEN');
  const textos = contenidos.filter((c: ContenidoData) => c.tipo === 'TEXTO');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
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
      <div className="grid md:grid-cols-3 gap-6">
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