export interface ComentarioCreate {
  id_topico: number;               
  id_usuario: number;               
  texto: string;                                
}

export interface ComentarioResponse {
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
