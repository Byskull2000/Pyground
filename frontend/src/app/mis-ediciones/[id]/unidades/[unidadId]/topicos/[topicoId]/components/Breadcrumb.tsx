import type { Curso } from "@/app/cursos/interfaces/Curso";
import type { Edicion } from "@/interfaces/Edicion";
import type { Topico } from "@/interfaces/Topico";
import type { Unidad } from "@/interfaces/Unidad";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface BreadcrumbProps {
  topico: Topico;
  unidad: Unidad | null;
  edicion: Edicion | null;
  curso: Curso | null;
}

export function Breadcrumb({ topico, unidad, edicion, curso }: BreadcrumbProps) {
  const router = useRouter();

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6 overflow-x-auto pb-2">
      <button
        onClick={() => router.push('/dashboard')}
        className="text-gray-400 hover:text-white transition-colors whitespace-nowrap"
      >
        Inicio
      </button>

      {curso && (
        <>
          <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
          <button
            onClick={() => router.push(`/cursos/${curso.id}`)}
            className="text-gray-400 hover:text-white transition-colors whitespace-nowrap"
          >
            {curso.nombre}
          </button>
        </>
      )}

      {edicion && (
        <>
          <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
          <button
            onClick={() => router.push(`/mis-ediciones/${edicion.id}`)}
            className="text-gray-400 hover:text-white transition-colors whitespace-nowrap"
          >
            {edicion.nombre_edicion}
          </button>
        </>
      )}

      {unidad && (
        <>
          <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
          <button
            onClick={() => router.push(`/mis-ediciones/${unidad.id_edicion}/unidades/${unidad.id}`)}
            className="text-gray-400 hover:text-white transition-colors whitespace-nowrap"
          >
            {unidad.titulo}
          </button>
        </>
      )}

      <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
      <span className="text-white font-medium whitespace-nowrap">{topico.titulo}</span>
    </nav>
  );
}
