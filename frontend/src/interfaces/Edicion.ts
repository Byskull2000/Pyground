import type { Curso } from "@/app/cursos/interfaces/Curso";

export interface Edicion {
  id: number;
  nombre_edicion: string;
  curso?: Curso;
  fecha_apertura: string;
  fecha_cierre: string | null;
}