// components/templates/layouts/ThreeColumnsLayout.tsx
'use client';
import React from 'react';
import ContentEditable from '../../topic/ContentEditable';
import { TemplateProps, ContenidoData } from '../../../types/content';


export default function ThreeColumnsLayout({ contenidos, editable, onActualizar, onEliminar }: TemplateProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {contenidos.slice(0, 6).map((cont: ContenidoData, idx: number) => (
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
  );
}