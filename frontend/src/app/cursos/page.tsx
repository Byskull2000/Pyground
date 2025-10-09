'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { CursosContent } from './components/CursosContent';


interface Curso {
    id: number;
    nombre: string;
    descripcion: string;
    codigo_curso: string;
    activo: boolean;
    fecha_creacion: string;
    creado_por: string;
}



export default function CoursesPage() {
    return (
        <ProtectedRoute>
            <CursosContent />
        </ProtectedRoute>
    );
}