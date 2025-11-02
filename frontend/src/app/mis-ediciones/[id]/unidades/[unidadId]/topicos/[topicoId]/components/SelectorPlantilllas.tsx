import { useState } from 'react';
import { Layout, Columns, Grid3x3, X, Check } from 'lucide-react';

interface PlantillaOption {
  id: number;
  nombre: string;
  descripcion: string;
}

const PLANTILLAS_OPCIONES: PlantillaOption[] = [
  {
    id: 1,
    nombre: 'Clásica Lineal',
    descripcion: 'Contenido apilado verticalmente',
  },
  {
    id: 2,
    nombre: 'Dos Columnas',
    descripcion: 'Texto izq, contenido visual derecha',
  },
  {
    id: 3,
    nombre: 'Dos Columnas Inversa',
    descripcion: 'Visual izq, texto derecha',
  },
  {
    id: 4,
    nombre: 'Video Destacado',
    descripcion: 'Video + transcripción',
  },
  {
    id: 5,
    nombre: 'Galería 3 Columnas',
    descripcion: 'Título + 3 imágenes',
  },
  {
    id: 6,
    nombre: 'Video Lateral',
    descripcion: 'Texto ancho + video pequeño',
  },
  {
    id: 7,
    nombre: 'Carrusel',
    descripcion: 'Galería deslizable + descripción',
  },
  {
    id: 8,
    nombre: '3 Columnas Mixto',
    descripcion: 'Múltiples elementos lado a lado',
  },
  {
    id: 9,
    nombre: 'Imagen Grande',
    descripcion: 'Imagen grande + puntos clave',
  },
  {
    id: 10,
    nombre: 'Video + Galería + Texto',
    descripcion: 'Multimedia completo',
  },
  {
    id: 11,
    nombre: 'Accordion',
    descripcion: 'Secciones expandibles',
  },
  {
    id: 12,
    nombre: 'Comparativa',
    descripcion: 'Dos conceptos lado a lado',
  },
];

interface SelectorPlantillasProps {
  plantillaActual: number;
  onSeleccionar: (plantillaId: number) => void;
  onCerrar: () => void;
}

export function SelectorPlantillas({
  plantillaActual,
  onSeleccionar,
  onCerrar,
}: SelectorPlantillasProps) {
  const [seleccionada, setSeleccionada] = useState(plantillaActual);

  const handleConfirmar = () => {
    onSeleccionar(seleccionada);
    onCerrar();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Seleccionar Plantilla
              </h2>
              <p className="text-gray-400 text-sm">
                Elige cómo se visualizará el contenido de este tópico
              </p>
            </div>
            <button
              onClick={onCerrar}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Plantillas Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLANTILLAS_OPCIONES.map((plantilla) => (
              <button
                key={plantilla.id}
                onClick={() => setSeleccionada(plantilla.id)}
                className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                  seleccionada === plantilla.id
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                {/* Check icon */}
                {seleccionada === plantilla.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Info */}
                <h3 className="text-lg font-bold text-white mb-2">
                  {plantilla.nombre}
                </h3>
                <p className="text-sm text-gray-400">
                  {plantilla.descripcion}
                </p>
              </button>
            ))}
          </div>

          {/* Vista previa textual */}
          <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Plantilla #{seleccionada} -
              {PLANTILLAS_OPCIONES.find((p) => p.id === seleccionada)?.nombre}
            </h3>
            <p className="text-gray-300 text-sm">
              {
                PLANTILLAS_OPCIONES.find((p) => p.id === seleccionada)
                  ?.descripcion
              }
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-white/10 p-6 flex gap-3">
          <button
            onClick={onCerrar}
            className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium"
          >
            Aplicar Plantilla #{seleccionada}
          </button>
        </div>
      </div>
    </div>
  );
}