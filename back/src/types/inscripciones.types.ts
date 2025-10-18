export interface InscripcionCreate {
  usuario_id: number;
  edicion_id: number;
  cargo_id: number;
  fecha_inscripcion?: Date;
  fecha_terminacion?: Date | null;
}

export interface InscripcionUpdate {
  cargo_id?: number;
  fecha_terminacion?: Date | null;
  activo?: boolean;
}
