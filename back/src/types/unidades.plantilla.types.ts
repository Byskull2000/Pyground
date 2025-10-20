export interface UnidadPlantillaCreate {
  id_curso: number;
  titulo: string;
  descripcion?: string;
  orden: number;
  version?: number;
  icono?: string;
  color?: string;
  activo?: boolean; 
}

export interface UnidadPlantillaUpdate {
  titulo?: string;
  descripcion?: string;
  orden?: number;
  version?: number;
  icono?: string;
  color?: string;
  activo?: boolean;
}
