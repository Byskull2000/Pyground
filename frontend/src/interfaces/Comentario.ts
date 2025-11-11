// interfaces/Comentario.ts

export interface ComentarioCreate {
  id_topico: number;
  id_usuario: number;
  texto: string;
}

export interface ComentarioResponse {
  id?: number;
  id_topico: number;
  id_usuario: number;
  texto: string;
  visto: boolean;
  fecha_publicacion: string;
}

export interface ComentarioRequest {
  id_topico: number;
  id_usuario: number;
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  avatar_url: string;
}

export interface ComentarioWithUser extends ComentarioResponse {
  id: number;
  usuario: Usuario;
  respuestas?: ComentarioWithUser[];
  likes?: number;
  hasLiked?: boolean;
  comentarioPadreId?: number;
  readReceipts?: ReadReceipt[];
}

export interface ComentarioWithReplies extends ComentarioWithUser {
  respuestas: ComentarioWithUser[];
  likes: number;
  hasLiked: boolean;
}

export interface ReadReceipt {
  userId: number;
  userName: string;
  userAvatar: string;
  readAt: string;
}

export interface ComentarioFormData {
  id_topico: number;
  id_usuario: number;
  texto: string;
  comentarioPadreId?: number;
}

export interface ComentarioUpdateRequest {
  texto?: string;
  visto?: boolean;
}

export interface ComentarioDeleteRequest {
  id: number;
}

export interface ComentariosListResponse {
  data: ComentarioWithReplies[];
  total: number;
  page?: number;
  limit?: number;
}

export interface ComentarioLikeRequest {
  id_comentario: number;
  id_usuario: number;
}

export interface ComentarioLikeResponse {
  id_comentario: number;
  likes: number;
  hasLiked: boolean;
}

export interface MarcarComoLeidoRequest {
  id_topico: number;
  id_usuario: number;
}

export interface ComentarioError {
  error: string;
  message: string;
  statusCode: number;
}

export interface AvatarProps {
  src: string;
  alt: string;
  size?: 'md' | 'sm' | 'lg';
}