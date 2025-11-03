// components/ConfirmDialog.tsx
'use client';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  type = 'warning'
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const iconColors = {
    danger: 'from-red-500 to-rose-600',
    warning: 'from-orange-500 to-amber-600',
    info: 'from-blue-500 to-indigo-600'
  };

  const buttonColors = {
    danger: 'from-red-500 to-rose-600 hover:shadow-red-500/50',
    warning: 'from-orange-500 to-amber-600 hover:shadow-orange-500/50',
    info: 'from-blue-500 to-indigo-600 hover:shadow-blue-500/50'
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-2xl shadow-2xl border border-white/20 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-pink-500/10 opacity-50"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl"></div>

        {/* Header con icono */}
        <div className="relative p-6 border-b border-white/10">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${iconColors[type]} flex items-center justify-center shadow-lg`}>
              {type === 'danger' ? (
                <Trash2 className="w-7 h-7 text-white" />
              ) : (
                <AlertTriangle className="w-7 h-7 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="relative p-6">
          <p className="text-gray-300 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer con botones */}
        <div className="relative p-6 border-t border-white/10 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all font-medium border border-white/20"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`flex-1 px-6 py-3 bg-gradient-to-r ${buttonColors[type]} text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

// Hook personalizado para usar el diálogo
export function useConfirmDialog() {
  const [dialogState, setDialogState] = React.useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const showConfirm = (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }) => {
    setDialogState({
      isOpen: true,
      ...options
    });
  };

  const hideConfirm = () => {
    setDialogState(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      isOpen={dialogState.isOpen}
      title={dialogState.title}
      message={dialogState.message}
      confirmText={dialogState.confirmText}
      cancelText={dialogState.cancelText}
      type={dialogState.type}
      onConfirm={dialogState.onConfirm}
      onCancel={hideConfirm}
    />
  );

  return { showConfirm, ConfirmDialogComponent };
}