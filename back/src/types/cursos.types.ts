
export interface CursoResponse {
  id: number;
  nombre: string;
  descripcion?: string | null;
  codigo_curso: string;
  activo: boolean;
  fecha_creacion: Date;
  creado_por?: string | null;
  estado_publicado: boolean;
}
