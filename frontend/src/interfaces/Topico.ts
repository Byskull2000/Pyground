
export interface Topico {
  id: number;
  id_unidad: number;
  titulo: string;
  descripcion?: string;
  id_plantilla: number;
  orden: number;
  estado_publicado: boolean;
}