// types/content.ts

export interface ContenidoData {
  id?: number | string;
  tipo: 'TEXTO' | 'IMAGEN' | 'VIDEO';
  orden: number;
  titulo?: string;
  descripcion?: string;
  texto?: string;
  enlace_archivo?: string;
}

export interface TemplateProps {
  contenidos: ContenidoData[];
  editable: boolean;
  onActualizar: (index: number, contenido: ContenidoData) => void;
  onEliminar: (index: number) => void;
}

export interface TemplateInfo {
  id: number;
  nombre: string;
  desc: string;
  icon: string;
  color?: string;
}