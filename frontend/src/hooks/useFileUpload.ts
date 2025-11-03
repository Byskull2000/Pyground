// hooks/useFileUpload.ts
import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface UploadResult {
  url: string;
  urls?: string[];
}

interface UseFileUploadReturn {
  uploading: boolean;
  progress: number;
  error: string | null;
  uploadSingle: (file: File) => Promise<string>;
  uploadMultiple: (files: File[]) => Promise<string[]>;
}

export function useFileUpload(): UseFileUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => localStorage.getItem('token');

  // Validar tipo de archivo
  const validateFile = (file: File): boolean => {
    const allowedTypes = [
      // Imágenes
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      // Videos
      'video/mp4',
      'video/avi',
      'video/quicktime', // .mov
      'video/x-matroska', // .mkv
      'video/webm'
    ];

    return allowedTypes.includes(file.type);
  };

  // Subir un solo archivo
  const uploadSingle = async (file: File): Promise<string> => {
    if (!validateFile(file)) {
      throw new Error('Tipo de archivo no permitido. Solo imágenes (jpeg, jpg, png, gif, webp) y videos (mp4, avi, mov, mkv, webm)');
    }

    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      // Promesa para manejar la carga
      const uploadPromise = new Promise<string>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            setProgress(Math.round(percentComplete));
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            resolve(response.data.url);
          } else {
            const error = JSON.parse(xhr.responseText);
            reject(new Error(error.message || 'Error al subir archivo'));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Error de red al subir archivo'));
        });

        xhr.open('POST', `${API_URL}/api/contenidos/upload/single`);
        xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);
        xhr.send(formData);
      });

      const url = await uploadPromise;
      return `${API_URL}${url}`;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      throw err;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  // Subir múltiples archivos
  const uploadMultiple = async (files: File[]): Promise<string[]> => {
    // Validar todos los archivos
    for (const file of files) {
      if (!validateFile(file)) {
        throw new Error(`Archivo no permitido: ${file.name}. Solo imágenes y videos.`);
      }
    }

    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      const formData = new FormData();
      files.forEach(file => {
        formData.append('file', file);
      });

      const xhr = new XMLHttpRequest();

      const uploadPromise = new Promise<string[]>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            setProgress(Math.round(percentComplete));
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            resolve(response.data.urls);
          } else {
            const error = JSON.parse(xhr.responseText);
            reject(new Error(error.message || 'Error al subir archivos'));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Error de red al subir archivos'));
        });

        xhr.open('POST', `${API_URL}/api/contenidos/upload`);
        xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);
        xhr.send(formData);
      });

      const urls = await uploadPromise;
      return urls.map(url => `${API_URL}${url}`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
      throw err;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return {
    uploading,
    progress,
    error,
    uploadSingle,
    uploadMultiple
  };
}