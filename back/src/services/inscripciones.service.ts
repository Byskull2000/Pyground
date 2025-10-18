import * as inscripcionRepo from '../repositories/inscripciones.repository';
import * as usuarioRepo from '../repositories/usuarios.repository';
import * as edicionRepo from '../repositories/ediciones.repository';
import * as cargoRepo from '../repositories/cargos.repository';
import { InscripcionCreate, InscripcionUpdate } from '../types/inscripciones.types';


export const getInscripcionesByEdicion = (id_edicion: number) => {
  return inscripcionRepo.getInscripcionesByEdicion(id_edicion);
};


export const getInscripcion = async (id: number) => {
  const inscripcion = await inscripcionRepo.getInscripcionById(id);
  if (!inscripcion) throw { status: 404, message: 'Inscripción no encontrada' };
  return inscripcion;
};


export const createInscripcion = async (data: InscripcionCreate) => {
  if (!data.usuario_id) throw { status: 400, message: 'El usuario es obligatorio' };
  if (!data.edicion_id) throw { status: 400, message: 'La edición es obligatoria' };
  if (!data.cargo_id) throw { status: 400, message: 'El cargo es obligatorio' };

  const usuario = await usuarioRepo.getUsuarioById(data.usuario_id);
  if (!usuario) throw { status: 404, message: 'Usuario no encontrado o inactivo' };

  const edicion = await edicionRepo.getEdicionById(data.edicion_id);
  if (!edicion || !edicion.activo ) throw { status: 404, message: 'Edición no encontrada o inactiva' };
  if (!edicion.estado_publicado ) throw { status: 409, message: 'La edición no esta abierta a inscripciones' };

  const cargo = await cargoRepo.getCargoById(data.cargo_id);
  if (!cargo) throw { status: 404, message: 'Cargo no encontrado' };

  const existentes = await inscripcionRepo.getInscripcionesByEdicion(data.edicion_id);
  const duplicada = existentes.find(i => i.usuario_id === data.usuario_id);
  if (duplicada)
    throw { status: 409, message: 'El usuario ya está inscrito en esta edición' };

  try {
    const nueva = await inscripcionRepo.createInscripcion(data);
    return inscripcionRepo.getInscripcionById(nueva.id);
  } catch {
    throw { status: 500, message: 'Error al registrar la inscripción' };
  }
};


export const updateInscripcion = async (id: number, data: InscripcionUpdate) => {
  const inscripcion = await inscripcionRepo.getInscripcionById(id);
  if (!inscripcion) throw { status: 404, message: 'Inscripción no encontrada' };

  return inscripcionRepo.updateInscripcion(id, data);
};


export const deleteInscripcion = async (id: number) => {
  const inscripcion = await inscripcionRepo.getInscripcionById(id);
  if (!inscripcion) throw { status: 404, message: 'Inscripción no encontrada' };

  return inscripcionRepo.deleteInscripcion(id);
};
