export interface UnidadCreate {
  id_edicion: number;           
  id_unidad_plantilla?: number; 
  titulo: string;               
  descripcion?: string;
  orden: number;               
  icono?: string;
  color?: string;
  publicado?: boolean;          
  activo?: boolean;             
}

export interface UnidadUpdate {
  titulo?: string;
  descripcion?: string;
  orden?: number;
  icono?: string;
  color?: string;
  publicado?: boolean;
  fecha_actualizacion?: Date;
  activo?: boolean;
}
