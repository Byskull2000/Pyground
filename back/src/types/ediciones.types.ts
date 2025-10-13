export interface EdicionCreate {
  id_curso: number;
  nombre_edicion: string;
  descripcion?: string;
  fecha_apertura: Date;
  fecha_cierre: Date;
  creado_por: string;
}

export interface EdicionUpdate {
  nombre_edicion?: string;
  descripcion?: string;
  fecha_apertura?: Date;
  fecha_cierre?: Date;
  activo?: boolean;
  creado_por?: string;
}
