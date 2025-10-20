export interface TopicoCreate {
  id_unidad: number;               
  id_topico_plantilla?: number;    
  titulo: string;                  
  descripcion?: string;
  duracion_estimada: number;
  orden: number;
  publicado?: boolean;             
  objetivos_aprendizaje?: string;
  activo?: boolean;               
}

export interface TopicoUpdate {
  titulo?: string;
  descripcion?: string;
  duracion_estimada?: number;
  orden?: number;
  publicado?: boolean;
  objetivos_aprendizaje?: string;
  fecha_actualizacion?: Date;
  activo?: boolean;
}
