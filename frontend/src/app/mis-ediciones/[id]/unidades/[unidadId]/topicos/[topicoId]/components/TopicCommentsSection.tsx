import React, { useState, useEffect, useCallback } from 'react';
import { Send, Reply, Heart, Trash2, MoreVertical, CheckCheck, Clock } from 'lucide-react';
import type { ComentarioWithUser, ReadReceipt, AvatarProps } from '@/interfaces/Comentario';
import Image from 'next/image';

const Avatar = ({ src, alt, size = 'md' }: AvatarProps) => {
  const sizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };
  return (
    <Image
      src={src || '/gatito.png'}
      alt={alt}
      className={`${sizes[size]} rounded-full object-cover ring-2 ring-white/10`}
      onError={(e) => {
        (e.target as HTMLImageElement).src = '/gatito.png';
      }}
    />
  );
};

const ReadIndicator = ({ readBy }: { readBy: ReadReceipt[] | undefined, userName: string }) => {
  const [showList, setShowList] = useState(false);
  const receipts = readBy || [];

  if (!receipts || receipts.length === 0) {
    return (
      <div className="flex items-center gap-1 text-gray-500 text-xs">
        <Clock className="w-3 h-3" />
        <span>No leído</span>
      </div>
    );
  }

  const icon = <CheckCheck className="w-3 h-3" />;

  return (
    <div className="relative">
      <button
        onClick={() => setShowList(!showList)}
        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs transition-colors"
      >
        {icon}
        <span>{receipts.length} leído{receipts.length !== 1 ? 's' : ''}</span>
      </button>

      {showList && (
        <div className="absolute bottom-full right-0 mb-2 bg-gray-900 border border-white/10 rounded-lg p-3 w-48 shadow-xl z-50">
          <p className="text-xs font-semibold text-gray-300 mb-2">Leído por:</p>
          <div className="space-y-2">
            {receipts.map((reader) => (
              <div key={reader.userId} className="flex items-center gap-2">
                <Avatar src={reader.userAvatar} alt={reader.userName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white truncate">{reader.userName}</p>
                  <p className="text-xs text-gray-500">{new Date(reader.readAt).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface CommentInputProps {
  onSubmit: (text: string) => Promise<void>;
  placeholder?: string;
  isReply?: boolean;
  onCancel?: () => void;
  currentUserAvatar?: string;
}

const CommentInput = ({
  onSubmit,
  placeholder = "Escribe un comentario...",
  isReply = false,
  onCancel,
  currentUserAvatar = '/gatito.png'
}: CommentInputProps) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      await onSubmit(text);
      setText('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex gap-3 ${isReply ? 'ml-12 my-3' : 'mb-6'}`}>
      <Avatar src={currentUserAvatar} alt="Tu avatar" size="md" />
      <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 focus-within:border-blue-500/50 focus-within:bg-white/10 transition-all">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-white placeholder-gray-500 outline-none resize-none text-sm leading-relaxed"
          rows={isReply ? 2 : 3}
        />
        <div className="flex justify-end gap-2 mt-3">
          {isReply && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || loading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 transition-all text-sm font-medium"
          >
            {loading ? '...' : <>
              <Send className="w-4 h-4" />
              Enviar
            </>}
          </button>
        </div>
      </div>
    </div>
  );
};

interface CommentItemProps {
  comment: ComentarioWithUser;
  currentUserId: number;
  onReply: (id: number) => void;
  onDelete: (id: number) => Promise<void>;
  onLike: (id: number) => Promise<void>;
  level?: number;
}

const CommentItem = ({ comment, currentUserId, onReply, onDelete, onLike, level = 0 }: CommentItemProps) => {
  const [showActions, setShowActions] = useState(false);
  const isOwner = comment.id_usuario === currentUserId;

  const formatTime = (date: string) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffMs = now.getTime() - commentDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return commentDate.toLocaleDateString();
  };

  const paddingClass = level > 0 ? 'ml-12 border-l-2 border-white/10 pl-4' : '';

  return (
    <div className={`group ${paddingClass}`}>
      <div className="flex gap-4 py-4 hover:bg-white/5 rounded-lg px-3 transition-colors">
        <Avatar src={comment.usuario?.avatar_url} alt={comment.usuario?.nombre} size="md" />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="font-medium text-white text-sm">{comment.usuario?.nombre || 'Usuario'}</p>
              <p className="text-xs text-gray-500">{formatTime(comment.fecha_publicacion)}</p>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 hover:bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>

              {showActions && (
                <div className="absolute right-0 top-full mt-1 bg-gray-900 border border-white/10 rounded-lg shadow-xl z-40 overflow-hidden">
                  {isOwner && (
                    <button
                      onClick={() => {
                        onDelete(comment.id!);
                        setShowActions(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/20 flex items-center gap-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-200 text-sm mt-2 leading-relaxed break-words">{comment.texto}</p>

          <div className="mt-3 flex justify-between items-center">
            <ReadIndicator readBy={comment.readReceipts} userName={comment.usuario?.nombre || ''} />

            <div className="flex items-center gap-3">
              <button
                onClick={() => comment.id && onLike(comment.id)}
                className={`flex items-center gap-1 text-xs transition-colors ${comment.hasLiked
                  ? 'text-red-400'
                  : 'text-gray-400 hover:text-red-400'
                  }`}
              >
                <Heart className={`w-4 h-4 ${comment.hasLiked ? 'fill-current' : ''}`} />
                <span>{comment.likes || 0}</span>
              </button>

              <button
                onClick={() => comment.id && onReply(comment.id)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Reply className="w-4 h-4" />
                Responder
              </button>
            </div>
          </div>
        </div>
      </div>

      {comment.respuestas && comment.respuestas.length > 0 && (
        <div className="space-y-0">
          {comment.respuestas.map((respuesta) => (
            <CommentItem
              key={respuesta.id}
              comment={respuesta}
              currentUserId={currentUserId}
              onReply={onReply}
              onDelete={onDelete}
              onLike={onLike}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface TopicCommentsSectionProps {
  topicoId: number;
  currentUserId: number;
  currentUserName: string;
  currentUserAvatar: string;
}

export default function TopicCommentsSection({
  topicoId,
  currentUserId,
  currentUserAvatar
}: TopicCommentsSectionProps) {
  const [comments, setComments] = useState<ComentarioWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/api/comentarios`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id_usuario: currentUserId,
            id_topico: topicoId
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        setComments(data.data || []);
      } else {
        console.error('Error response:', response.status);
      }
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, currentUserId, topicoId]);

  useEffect(() => {
    fetchComments();
  }, [topicoId, fetchComments]);


  const handleAddComment = async (text: string) => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        id_usuario: currentUserId,
        id_topico: topicoId,
        texto: text,
        ...(replyingTo && { comentarioPadreId: replyingTo })
      };

      const response = await fetch(
        `${API_URL}/api/comentarios/publicar`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (response.ok) {
        await fetchComments();
        setReplyingTo(null);
      } else {
        console.error('Error al crear comentario:', response.status);
      }
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('¿Eliminar este comentario?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/api/comentarios/${commentId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        await fetchComments();
      } else {
        console.error('Error al eliminar:', response.status);
      }
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/api/comentarios/${commentId}/like`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        await fetchComments();
      }
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-black/80 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Comentarios</h3>
        <p className="text-gray-400 text-sm">
          {comments.length} comentario{comments.length !== 1 ? 's' : ''}
        </p>
      </div>

      <CommentInput
        onSubmit={handleAddComment}
        placeholder="Comparte tu pregunta o comentario..."
        currentUserAvatar={currentUserAvatar}
      />

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Cargando comentarios...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No hay comentarios aún. ¡Sé el primero!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {comments.map((comment) => (
            <div key={comment.id}>
              <CommentItem
                comment={comment}
                currentUserId={currentUserId}
                onReply={setReplyingTo}
                onDelete={handleDeleteComment}
                onLike={handleLikeComment}
              />

              {replyingTo === comment.id && (
                <CommentInput
                  onSubmit={handleAddComment}
                  isReply={true}
                  placeholder="Escribe una respuesta..."
                  onCancel={() => setReplyingTo(null)}
                  currentUserAvatar={currentUserAvatar}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}