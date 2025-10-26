'use client'
import { useEffect, useState } from 'react';
import { AlertCircle, Loader } from 'lucide-react';
import UnidadesPanel from './components/UnidadesPanel'

interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  codigo_curso: string;
  activo: boolean;
  fecha_creacion: string;
  creado_por: string;
}

interface Unidad {
  id: number;
  id_curso: number;
  titulo: string;
  descripcion: string;
  orden: number;
  icono: string;
  color: string;
}

export default function CursoDetailPage() {
  const [curso, setCurso] = useState<Curso | null>(null);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const cursoId = 1; 
  const cursoUnidadesId = cursoId; 

  useEffect(() => {
    fetchCursoYUnidades();
  }, []);

  const fetchCursoYUnidades = async () => {
    try {
      const token = localStorage.getItem('token');

      const cursoResponse = await fetch(`${API_URL}/api/cursos/${cursoId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!cursoResponse.ok) throw new Error('Error al cargar el curso');
      const cursoData = await cursoResponse.json();
      setCurso(cursoData.data);

      // Obtener unidades del curso
      const unidadesResponse = await fetch(`${API_URL}/api/unidades-plantilla/curso/${cursoUnidadesId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (unidadesResponse.ok) {
        const unidadesData = await unidadesResponse.json();
        setUnidades(unidadesData.data || []);
      }

      setError('');
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar los datos del curso');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 mx-auto animate-spin" />
          <p className="mt-4 text-gray-400">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-400">No se pudo cargar la información del curso</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-lg border border-red-500/30 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300 font-medium">{error}</p>
          </div>
        )}

        {/* Información del curso */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-gray-700 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{curso.nombre}</h1>
          <p className="text-gray-300">{curso.descripcion}</p>
          <p className="text-sm text-gray-400 mt-2">Código: {curso.codigo_curso}</p>
        </div>

        {/* Unidades del curso */}
        <UnidadesPanel 
          unidades={unidades} 
          cursoId={curso.id} 
        />
      </div>
    </div>
  );
}
