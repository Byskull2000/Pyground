import { TipoContenidoEnum } from '@prisma/client';

export interface ContenidoCreate {
  tipo: TipoContenidoEnum;
  orden: number;
  titulo?: string;
  descripcion?: string;
  texto?: string;
  enlace_archivo?: string;
}

export interface ContenidoUpdate {
  tipo?: TipoContenidoEnum;
  orden?: number;
  titulo?: string;
  descripcion?: string;
  texto?: string;
  enlace_archivo?: string;
  activo?: boolean;
}

export interface ContenidosCreate {
  id_topico: number;
  contenidos: ContenidoCreate[];
}

export interface ContenidoReorganize {
  id: number;
  orden: number;
}