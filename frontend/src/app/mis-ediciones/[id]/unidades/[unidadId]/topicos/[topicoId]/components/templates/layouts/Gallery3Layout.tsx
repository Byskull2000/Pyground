// components/templates/layouts/Gallery3Layout.tsx
'use client';
import React from 'react';
import ContentEditable from '../../topic/ContentEditable';
import { TemplateProps, ContenidoData } from '../../../types/content';


export default function Gallery3Layout({ contenidos, editable, onActualizar, onEliminar }: TemplateProps) {
  const textos = contenidos.filter((c: ContenidoData) => c.tipo === 'TEXTO');
  const imagenes = contenidos.filter((c: ContenidoData) => c.tipo === 'IMAGEN');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {textos.slice(0, 1).map((cont: ContenidoData, idx: number) => (
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
    </div>
  );
}