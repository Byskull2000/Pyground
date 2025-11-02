// components/templates/layouts/AccordionLayout.tsx
'use client';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ContentEditable from '../../topic/ContentEditable';
import { TemplateProps, ContenidoData } from '../../../types/content';


export default function AccordionLayout({ contenidos, editable, onActualizar, onEliminar }: TemplateProps) {
  const [expandido, setExpandido] = useState(0);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {contenidos.map((cont: ContenidoData, idx: number) => (
        <div
          key={idx}
          className="border border-white/20 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-lg hover:border-white/30 transition"
        >
          <button
            onClick={() => setExpandido(expandido === idx ? -1 : idx)}
            className="w-full p-6 hover:bg-white/10 text-white font-semibold flex items-center justify-between transition"
          >
            <span className="text-lg">
              {cont.titulo || `Sección ${idx + 1}`}
            </span>
            <ChevronDown
              className={`w-5 h-5 transform transition ${
                expandido === idx ? 'rotate-180' : ''
              }`}
            />
          </button>
          {expandido === idx && (
            <div className="p-6 border-t border-white/20 bg-black/20">
              <ContentEditable
                contenido={cont}
                index={idx}
                editable={editable}
                onActualizar={onActualizar}
                onEliminar={onEliminar}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}