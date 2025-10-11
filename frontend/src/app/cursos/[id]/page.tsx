'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { CursoDetailContent } from './components/CursoDetailContent';
import { use } from 'react';

export default function CursoDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    
    return (
        <ProtectedRoute>
            <CursoDetailContent cursoId={resolvedParams.id} />
        </ProtectedRoute>
    );
}