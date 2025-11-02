// components/templates/layouts/LinearLayout.tsx
'use client';
import React from 'react';
import ContentEditable from '../../topic/ContentEditable';
import { TemplateProps, ContenidoData } from '../../../types/content';

export default function LinearLayout({ contenidos, editable, onActualizar, onEliminar }: TemplateProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {contenidos.map((cont: ContenidoData, idx: number) => (
        <div key={idx} className="animate-fadeIn">
          <ContentEditable
            contenido={cont}
            index={idx}
            editable={editable}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
          />
        </div>
      ))}
    </div>
  );
}