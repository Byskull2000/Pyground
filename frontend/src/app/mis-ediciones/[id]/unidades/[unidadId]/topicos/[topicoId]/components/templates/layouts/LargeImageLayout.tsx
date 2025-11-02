// components/templates/layouts/LargeImageLayout.tsx
'use client';
import React from 'react';
import ContentEditable from '../../topic/ContentEditable';
import { TemplateProps, ContenidoData } from '../../../types/content';


export default function LargeImageLayout({ contenidos, editable, onActualizar, onEliminar }: TemplateProps) {
  const imagenes = contenidos.filter((c: ContenidoData) => c.tipo === 'IMAGEN');
  const textos = contenidos.filter((c: ContenidoData) => c.tipo === 'TEXTO');

  return (
    <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      <div className="lg:col-span-2">
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
      <div className="lg:col-span-1 space-y-6">
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