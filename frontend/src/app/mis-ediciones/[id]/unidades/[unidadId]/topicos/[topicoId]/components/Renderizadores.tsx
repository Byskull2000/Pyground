// renderizadores.tsx
'use client';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ContenidoEditable } from './ContenidoEditable';
import type { ContenidoData } from './ContenidoEditable';

interface RenderizadorProps {
  contenidos: ContenidoData[];
  editable: boolean;
  onActualizar: (index: number, contenido: ContenidoData) => void;
  onEliminar: (index: number) => void;
}

// Plantilla 1: Clásica Lineal
export const PlantillaLineal: React.FC<RenderizadorProps> = ({
  contenidos,
  editable,
  onActualizar,
  onEliminar,
}) => (
  <div className="space-y-6 max-w-4xl mx-auto">
    {contenidos.map((cont, idx) => (
      <ContenidoEditable
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

// Plantilla 2: Dos Columnas
export const PlantillaDosColumnas: React.FC<RenderizadorProps> = ({
  contenidos,
  editable,
  onActualizar,
  onEliminar,
}) => (
  <div className="grid grid-cols-2 gap-6 max-w-5xl mx-auto items-start">
    <div className="space-y-4">
      {contenidos
        .filter((c) => c.tipo === 'TEXTO')
        .map((cont, idx) => (
          <ContenidoEditable
            key={idx}
            contenido={cont}
            index={contenidos.indexOf(cont)}
            editable={editable}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
          />
        ))}
    </div>
    <div className="space-y-4">
      {contenidos
        .filter((c) => c.tipo !== 'TEXTO')
        .map((cont, idx) => (
          <ContenidoEditable
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

// Plantilla 3: Dos Columnas Inversa
export const PlantillaDosColumnasInversa: React.FC<RenderizadorProps> = ({
  contenidos,
  editable,
  onActualizar,
  onEliminar,
}) => (
  <div className="grid grid-cols-2 gap-6 max-w-5xl mx-auto items-start">
    <div className="space-y-4">
      {contenidos
        .filter((c) => c.tipo === 'IMAGEN')
        .map((cont, idx) => (
          <ContenidoEditable
            key={idx}
            contenido={cont}
            index={contenidos.indexOf(cont)}
            editable={editable}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
          />
        ))}
    </div>
    <div className="space-y-4">
      {contenidos
        .filter((c) => c.tipo !== 'IMAGEN')
        .map((cont, idx) => (
          <ContenidoEditable
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

// Plantilla 4: Video Destacado
export const PlantillaVideoDestacado: React.FC<RenderizadorProps> = ({
  contenidos,
  editable,
  onActualizar,
  onEliminar,
}) => (
  <div className="space-y-6 max-w-4xl mx-auto">
    {contenidos
      .filter((c) => c.tipo === 'VIDEO')
      .map((cont, idx) => (
        <ContenidoEditable
          key={idx}
          contenido={cont}
          index={contenidos.indexOf(cont)}
          editable={editable}
          onActualizar={onActualizar}
          onEliminar={onEliminar}
        />
      ))}
    {contenidos
      .filter((c) => c.tipo === 'TEXTO')
      .map((cont, idx) => (
        <ContenidoEditable
          key={idx}
          contenido={cont}
          index={contenidos.indexOf(cont)}
          editable={editable}
          onActualizar={onActualizar}
          onEliminar={onEliminar}
        />
      ))}
  </div>
);

// Plantilla 5: Galería 3 Columnas
export const PlantillaGaleria3: React.FC<RenderizadorProps> = ({
  contenidos,
  editable,
  onActualizar,
  onEliminar,
}) => (
  <div className="max-w-5xl mx-auto space-y-6">
    {contenidos
      .filter((c) => c.tipo === 'TEXTO')
      .slice(0, 1)
      .map((cont, idx) => (
        <ContenidoEditable
          key={idx}
          contenido={cont}
          index={contenidos.indexOf(cont)}
          editable={editable}
          onActualizar={onActualizar}
          onEliminar={onEliminar}
        />
      ))}
    <div className="grid grid-cols-3 gap-4">
      {contenidos
        .filter((c) => c.tipo === 'IMAGEN')
        .map((cont, idx) => (
          <div key={idx}>
            <ContenidoEditable
              contenido={cont}
              index={contenidos.indexOf(cont)}
              editable={editable}
              onActualizar={onActualizar}
              onEliminar={onEliminar}
            />
          </div>
        ))}
    </div>
  </div>
);

// Plantilla 6: Video Lateral
export const PlantillaVideoLateral: React.FC<RenderizadorProps> = ({
  contenidos,
  editable,
  onActualizar,
  onEliminar,
}) => (
  <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
    <div className="col-span-2 space-y-4">
      {contenidos
        .filter((c) => c.tipo === 'TEXTO')
        .map((cont, idx) => (
          <ContenidoEditable
            key={idx}
            contenido={cont}
            index={contenidos.indexOf(cont)}
            editable={editable}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
          />
        ))}
    </div>
    <div className="col-span-1">
      {contenidos
        .filter((c) => c.tipo === 'VIDEO')
        .map((cont, idx) => (
          <ContenidoEditable
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

// Plantilla 7: Carrusel
export const PlantillaCarrusel: React.FC<RenderizadorProps> = ({
  contenidos,
  editable,
  onActualizar,
  onEliminar,
}) => {
  const [imagenActual, setImagenActual] = useState(0);
  const imagenes = contenidos.filter((c) => c.tipo === 'IMAGEN');

  if (imagenes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">No hay imágenes</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <ContenidoEditable
        contenido={imagenes[imagenActual]}
        index={contenidos.indexOf(imagenes[imagenActual])}
        editable={editable}
        onActualizar={onActualizar}
        onEliminar={onEliminar}
      />
      {imagenes.length > 1 && (
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => setImagenActual(Math.max(0, imagenActual - 1))}
            disabled={imagenActual === 0}
            className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg text-sm hover:bg-blue-500/30 border border-blue-500/30 disabled:opacity-50"
          >
            ← Anterior
          </button>
          <span className="text-gray-400 text-sm px-4 font-semibold">
            {imagenActual + 1} / {imagenes.length}
          </span>
          <button
            onClick={() => setImagenActual(Math.min(imagenes.length - 1, imagenActual + 1))}
            disabled={imagenActual === imagenes.length - 1}
            className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg text-sm hover:bg-blue-500/30 border border-blue-500/30 disabled:opacity-50"
          >
            Siguiente →
          </button>
        </div>
      )}
      <div className="space-y-4">
        {contenidos
          .filter((c) => c.tipo === 'TEXTO')
          .map((cont, idx) => (
            <ContenidoEditable
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
};

// Plantilla 8: 3 Columnas Mixto
export const Plantilla3Columnas: React.FC<RenderizadorProps> = ({
  contenidos,
  editable,
  onActualizar,
  onEliminar,
}) => (
  <div className="grid grid-cols-3 gap-4 max-w-5xl mx-auto">
    {contenidos.slice(0, 3).map((cont, idx) => (
      <div key={idx}>
        <ContenidoEditable
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

// Plantilla 9: Imagen Grande
export const PlantillaImagenGrande: React.FC<RenderizadorProps> = ({
  contenidos,
  editable,
  onActualizar,
  onEliminar,
}) => (
  <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
    <div className="col-span-2">
      {contenidos
        .filter((c) => c.tipo === 'IMAGEN')
        .map((cont, idx) => (
          <ContenidoEditable
            key={idx}
            contenido={cont}
            index={contenidos.indexOf(cont)}
            editable={editable}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
          />
        ))}
    </div>
    <div className="col-span-1 space-y-3">
      {contenidos
        .filter((c) => c.tipo === 'TEXTO')
        .map((cont, idx) => (
          <ContenidoEditable
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

// Plantilla 10: Video + Galería + Texto
export const PlantillaVideoGaleriaTexto: React.FC<RenderizadorProps> = ({
  contenidos,
  editable,
  onActualizar,
  onEliminar,
}) => (
  <div className="space-y-6 max-w-5xl mx-auto">
    {contenidos
      .filter((c) => c.tipo === 'VIDEO')
      .map((cont, idx) => (
        <ContenidoEditable
          key={idx}
          contenido={cont}
          index={contenidos.indexOf(cont)}
          editable={editable}
          onActualizar={onActualizar}
          onEliminar={onEliminar}
        />
      ))}
    <div className="grid grid-cols-3 gap-4">
      {contenidos
        .filter((c) => c.tipo === 'IMAGEN')
        .map((cont, idx) => (
          <div key={idx}>
            <ContenidoEditable
              contenido={cont}
              index={contenidos.indexOf(cont)}
              editable={editable}
              onActualizar={onActualizar}
              onEliminar={onEliminar}
            />
          </div>
        ))}
    </div>
    {contenidos
      .filter((c) => c.tipo === 'TEXTO')
      .map((cont, idx) => (
        <ContenidoEditable
          key={idx}
          contenido={cont}
          index={contenidos.indexOf(cont)}
          editable={editable}
          onActualizar={onActualizar}
          onEliminar={onEliminar}
        />
      ))}
  </div>
);

// Plantilla 11: Accordion
export const PlantillaAccordion: React.FC<RenderizadorProps> = ({
  contenidos,
  editable,
  onActualizar,
  onEliminar,
}) => {
  const [expandido, setExpandido] = useState(0);

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {contenidos.map((cont, idx) => (
        <div
          key={idx}
          className="border border-white/10 rounded-xl overflow-hidden bg-white/5 backdrop-blur-lg hover:border-white/20 transition"
        >
          <button
            onClick={() => setExpandido(expandido === idx ? -1 : idx)}
            className="w-full p-4 hover:bg-white/10 text-white font-semibold flex items-center justify-between text-sm transition"
          >
            <span>
              Sección {idx + 1} - {cont.tipo}
            </span>
            <ChevronDown
              className={`w-4 h-4 transform transition ${
                expandido === idx ? 'rotate-180' : ''
              }`}
            />
          </button>
          {expandido === idx && (
            <div className="p-4 border-t border-white/10 bg-white/5">
              <ContenidoEditable
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
};

// Plantilla 12: Comparativa
export const PlantillaComparativa: React.FC<RenderizadorProps> = ({
  contenidos,
  editable,
  onActualizar,
  onEliminar,
}) => (
  <div className="grid grid-cols-2 gap-6 max-w-5xl mx-auto">
    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-6 border border-blue-500/20 backdrop-blur-lg space-y-4">
      <h3 className="text-white font-bold text-sm uppercase tracking-wider">
        Concepto A
      </h3>
      {contenidos
        .slice(0, Math.ceil(contenidos.length / 2))
        .map((cont, idx) => (
          <ContenidoEditable
            key={idx}
            contenido={cont}
            index={contenidos.indexOf(cont)}
            editable={editable}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
          />
        ))}
    </div>
    <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-6 border border-purple-500/20 backdrop-blur-lg space-y-4">
      <h3 className="text-white font-bold text-sm uppercase tracking-wider">
        Concepto B
      </h3>
      {contenidos
        .slice(Math.ceil(contenidos.length / 2))
        .map((cont, idx) => (
          <ContenidoEditable
            key={idx}
            contenido={cont}
            index={
              contenidos.indexOf(
                contenidos[Math.ceil(contenidos.length / 2) + idx]
              )
            }
            editable={editable}
            onActualizar={onActualizar}
            onEliminar={onEliminar}
          />
        ))}
    </div>
  </div>
);