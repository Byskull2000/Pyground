// components/FileUploadModal.tsx
'use client';
import { useState, useCallback } from 'react';
import { X, Upload, Image as ImageIcon, Video, AlertCircle, CheckCircle } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import Image from 'next/image';

interface FileUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadComplete: (url: string) => void;
    type: 'image' | 'video';
    title?: string;
}

export default function FileUploadModal({
    isOpen,
    onClose,
    onUploadComplete,
    type,
    title
}: FileUploadModalProps) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { uploading, progress, error, uploadSingle } = useFileUpload();

    const acceptedTypes = type === 'image'
        ? 'image/jpeg,image/jpg,image/png,image/gif,image/webp'
        : 'video/mp4,video/avi,video/quicktime,video/x-matroska,video/webm';

    const acceptedExtensions = type === 'image'
        ? '.jpg, .jpeg, .png, .gif, .webp'
        : '.mp4, .avi, .mov, .mkv, .webm';

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        setSelectedFile(file);

        // Crear preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            const url = await uploadSingle(selectedFile);
            onUploadComplete(url);
            onClose();
            // Limpiar
            setSelectedFile(null);
            setPreviewUrl(null);
        } catch (err) {
            console.error('Error al subir:', err);
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-2xl shadow-2xl border border-white/20 max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Fondo decorativo */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-pink-500/10 opacity-50"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl"></div>

                {/* Header */}
                <div className="relative p-6 border-b border-white/10">
                    <button
                        onClick={handleCancel}
                        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type === 'image' ? 'from-fuchsia-500 to-pink-600' : 'from-cyan-500 to-teal-600'
                            } flex items-center justify-center shadow-lg`}>
                            {type === 'image' ? (
                                <ImageIcon className="w-7 h-7 text-white" />
                            ) : (
                                <Video className="w-7 h-7 text-white" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">
                                {title || `Subir ${type === 'image' ? 'Imagen' : 'Video'}`}
                            </h3>
                            <p className="text-sm text-gray-400">
                                Formatos: {acceptedExtensions}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contenido */}
                <div className="relative p-6">
                    {!selectedFile ? (
                        // Zona de drag & drop
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`
                relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer
                ${dragActive
                                    ? 'border-blue-500 bg-blue-500/10'
                                    : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                                }
              `}
                        >
                            <input
                                type="file"
                                accept={acceptedTypes}
                                onChange={handleChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />

                            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h4 className="text-lg font-semibold text-white mb-2">
                                {dragActive ? '¡Suelta el archivo aquí!' : 'Arrastra y suelta tu archivo'}
                            </h4>
                            <p className="text-sm text-gray-400 mb-4">
                                o haz clic para seleccionar
                            </p>
                            <div className="inline-block px-4 py-2 bg-white/10 rounded-lg text-xs text-gray-400">
                                {acceptedExtensions}
                            </div>
                        </div>
                    ) : (
                        // Preview del archivo
                        <div className="space-y-4">
                            <div className="relative bg-black/40 rounded-xl overflow-hidden border border-white/10 aspect-video">
                                {
                                    previewUrl ?

                                        type === 'image' ? (
                                            <Image
                                                fill
                                                src={previewUrl || ''}
                                                alt="Preview"
                                                className="w-full h-64 object-contain"
                                            />
                                        ) : (
                                            <video
                                                src={previewUrl || ''}
                                                className="w-full h-64"
                                                controls
                                            />
                                        )
                                        : null
                                }
                            </div>

                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-400">Archivo seleccionado:</span>
                                    <button
                                        onClick={() => {
                                            setSelectedFile(null);
                                            setPreviewUrl(null);
                                        }}
                                        className="text-xs text-red-400 hover:text-red-300 transition"
                                    >
                                        Cambiar
                                    </button>
                                </div>
                                <p className="text-white font-medium truncate">{selectedFile.name}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>

                            {/* Barra de progreso */}
                            {uploading && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Subiendo...</span>
                                        <span className="text-blue-400 font-medium">{progress}%</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-300 rounded-full"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-red-300 font-medium text-sm">Error al subir</p>
                                        <p className="text-red-400 text-xs mt-1">{error}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="relative p-6 border-t border-white/10 flex gap-3">
                    <button
                        onClick={handleCancel}
                        disabled={uploading}
                        className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all font-medium border border-white/20 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading}
                        className={`
              flex-1 px-6 py-3 bg-gradient-to-r text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              ${type === 'image'
                                ? 'from-fuchsia-500 to-pink-600 hover:shadow-pink-500/50'
                                : 'from-cyan-500 to-teal-600 hover:shadow-cyan-500/50'
                            }
            `}
                    >
                        {uploading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Subiendo...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                Subir Archivo
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}