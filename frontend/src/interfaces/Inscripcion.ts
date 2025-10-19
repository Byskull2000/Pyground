import type { Usuario } from "./Usuario";

export interface Inscripcion {
    id: number;
    usuario_id: number;
    usuario: Usuario;
    cargo_id: number;
    cargo: {
        id: number;
        nombre: string;
    };
}
