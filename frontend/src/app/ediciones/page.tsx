'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { EdicionesContent } from '../ediciones/components/EdicionesContent';

export default function CoursesPage() {
    return (
        <ProtectedRoute>
            <EdicionesContent />
        </ProtectedRoute>
    );
}