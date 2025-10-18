export interface Unidad {
    id: number;
    id_edicion: number;
    id_unidad_plantilla: number;
    titulo: string;
    descripcion: string;
    orden: number;
    icono: string;
    color: string;
    estado_publicado: boolean;
    fecha_creacion: string;
    fecha_actualizacion: string | null;
    activo: boolean;
}

export interface CursoInfo {
    id: number;
    nombre: string;
    descripcion: string;
    codigo_curso: string;
    activo: boolean;
    fecha_creacion: string;
    creado_por: string;
    estado_publicado: boolean;
}

export interface Edicion {
    id: number;
    id_curso: number;
    nombre_edicion: string;
    descripcion: string;
    fecha_apertura: string;
    fecha_cierre: string;
    activo: boolean;
    fecha_creacion: string;
    creado_por: string;
    estado_publicado: boolean;
    unidades?: Unidad[];
    curso?: CursoInfo;
}