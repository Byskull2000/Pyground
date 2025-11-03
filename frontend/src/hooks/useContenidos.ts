// hooks/useContenidos.ts
import type { ContenidoData } from '@/app/mis-ediciones/[id]/unidades/[unidadId]/topicos/[topicoId]/types/content';
import { useState, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface UseContenidosReturn {
  contenidos: ContenidoData[];
  loading: boolean;
  error: string | null;
  fetchContenidos: (topicoId: number) => Promise<void>;
  createContenidos: (topicoId: number, contenidos: Omit<ContenidoData, 'id'>[]) => Promise<void>;
  updateContenido: (id: number, contenido: Partial<ContenidoData>) => Promise<void>;
  deleteContenido: (id: number) => Promise<void>;
  reorderContenidos: (reordenamiento: { id: number; orden: number }[]) => Promise<void>;
  setContenidos: (contenidos: ContenidoData[]) => void;
}

export function useContenidos(): UseContenidosReturn {
  const [contenidos, setContenidos] = useState<ContenidoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => localStorage.getItem('token');

  // GET /api/contenidos/topico/:topicoId
  const fetchContenidos = useCallback(async (topicoId: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/contenidos/topico/${topicoId}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });

      if (!response.ok) {
        throw new Error('Error al cargar contenidos');
      }

      const result = await response.json();
      
      // Asegurar que cada contenido tenga un id
      const contenidosConId = result.data.map((c: ContenidoData, idx: number) => ({
        ...c,
        id: c.id || `temp-${idx}`
      }));
      
      setContenidos(contenidosConId);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setContenidos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // POST /api/contenidos
  const createContenidos = useCallback(async (topicoId: number, nuevosContenidos: Omit<ContenidoData, 'id'>[]) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/contenidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          id_topico: topicoId,
          contenidos: nuevosContenidos
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear contenidos');
      }

      // Recargar contenidos después de crear
      await fetchContenidos(topicoId);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchContenidos]);

  // PUT /api/contenidos/:id
  const updateContenido = useCallback(async (id: number, contenidoActualizado: Partial<ContenidoData>) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/contenidos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(contenidoActualizado)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar contenido');
      }

      const result = await response.json();

      // Actualizar localmente
      setContenidos(prev => 
        prev.map(c => c.id === id ? { ...c, ...result.data } : c)
      );
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // DELETE /api/contenidos/:id
  const deleteContenido = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/contenidos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar contenido');
      }

      // Actualizar localmente
      setContenidos(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // PUT /api/contenidos/reordenar
  const reorderContenidos = useCallback(async (reordenamiento: { id: number; orden: number }[]) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/contenidos/reordenar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(reordenamiento)
      });

      if (!response.ok) {
        throw new Error('Error al reordenar contenidos');
      }

      // Actualizar orden localmente
      setContenidos(prev => {
        const nuevosContenidos = [...prev];
        reordenamiento.forEach(({ id, orden }) => {
          const idx = nuevosContenidos.findIndex(c => c.id === id);
          if (idx !== -1) {
            nuevosContenidos[idx] = { ...nuevosContenidos[idx], orden };
          }
        });
        return nuevosContenidos.sort((a, b) => a.orden - b.orden);
      });
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    contenidos,
    loading,
    error,
    fetchContenidos,
    createContenidos,
    updateContenido,
    deleteContenido,
    reorderContenidos,
    setContenidos
  };
}