'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { EdicionDetailContent } from './components/EdicionDetailContent';
import { use } from 'react';

export default function EdicionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    
    return (
        <ProtectedRoute>
            <EdicionDetailContent edicionId={resolvedParams.id} />
        </ProtectedRoute>
    );
}