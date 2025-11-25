'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { CursosContent } from './components/CursosContent';

export default function CoursesPage() {
    return (
        <ProtectedRoute>
            <CursosContent />
        </ProtectedRoute>
    );
}