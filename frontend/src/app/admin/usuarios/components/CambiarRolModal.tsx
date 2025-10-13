'use client';

import { useState } from 'react';
import { X, Shield, CheckCircle } from 'lucide-react';

interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
}

interface CambiarRolModalProps {
  usuario: Usuario;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ROLES = [
  { value: 'USUARIO', label: 'Usuario', color: 'green' },
  { value: 'ACADEMICO', label: 'Académico', color: 'blue' },
  { value: 'ADMIN', label: 'Administrador', color: 'purple' },
];


export function CambiarRolModal({ usuario, isOpen, onClose, onSuccess }: CambiarRolModalProps) {
  const [selectedRol, setSelectedRol] = useState(usuario.rol);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/usuarios/${usuario.id}/rol`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rol: selectedRol })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cambiar el rol');
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      setSuccess(false);
      setSelectedRol(usuario.rol);
      onClose();
    }
  };

  const getRolColor = (rol: string) => {
    const roleConfig = ROLES.find(r => r.value === rol);
    return roleConfig?.color || 'gray';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-white/10 max-w-md w-full overflow-hidden">
        <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Cambiar Rol</h3>
              <p className="text-sm text-gray-400">{usuario.nombre} {usuario.apellido}</p>
            </div>
          </div>
          <button onClick={handleClose} disabled={loading} className="text-gray-400 hover:text-white transition-colors disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-sm text-gray-400 mb-1">Email</p>
            <p className="text-white">{usuario.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rol Actual</label>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                getRolColor(usuario.rol) === 'purple'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : getRolColor(usuario.rol) === 'blue'
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  : 'bg-green-500/20 text-green-300 border-green-500/30'
              }`}>{usuario.rol}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nuevo Rol</label>
            <select
              value={selectedRol}
              onChange={(e) => setSelectedRol(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {ROLES.map((rol) => (
                <option key={rol.value} value={rol.value} className="bg-gray-800">{rol.label}</option>
              ))}
            </select>
          </div>

          {selectedRol !== usuario.rol && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-blue-300 mb-2">El rol cambiará a:</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                getRolColor(selectedRol) === 'purple'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : getRolColor(selectedRol) === 'blue'
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  : 'bg-green-500/20 text-green-300 border-green-500/30'
              }`}>{selectedRol}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <p className="text-sm text-green-300">¡Rol actualizado correctamente!</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || selectedRol === usuario.rol || success}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Actualizando...
                </span>
              ) : success ? 'Completado' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
