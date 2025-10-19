import { BookOpen, Calendar, CheckCircle, Lock, XCircle } from 'lucide-react';

interface EdicionInfoPanelProps {
    edicion: {
        id: number;
        nombre_edicion: string;
        descripcion: string;
        fecha_apertura: string;
        fecha_cierre?: string;
        activo: boolean;
        estado_publicado: boolean;
        fecha_creacion: string;
        creado_por: string;
    };
}

export default function EdicionInfoPanel({ edicion }: EdicionInfoPanelProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
            {/* Header con gradiente */}
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-b border-white/10 p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                {edicion.nombre_edicion}
                            </h1>
                            <div className="flex items-center gap-2">
                                {edicion.estado_publicado ? (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                        <CheckCircle className="w-3 h-3" />
                                        Publicada
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30">
                                        <Lock className="w-3 h-3" />
                                        Borrador
                                    </span>
                                )}
                                
                                {edicion.activo ? (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                        <CheckCircle className="w-3 h-3" />
                                        Activa
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-300 border border-gray-500/30">
                                        <XCircle className="w-3 h-3" />
                                        Inactiva
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido */}
            <div className="p-6 space-y-6">
                {/* Descripción */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Descripción
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                        {edicion.descripcion}
                    </p>
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                            <Calendar className="w-5 h-5 text-emerald-400" />
                            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                Fecha de Apertura
                            </h4>
                        </div>
                        <p className="text-xl font-bold text-white">
                            {formatDate(edicion.fecha_apertura)}
                        </p>
                    </div>

                    {edicion.fecha_cierre && (
                        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                            <div className="flex items-center gap-3 mb-2">
                                <Calendar className="w-5 h-5 text-red-400" />
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                    Fecha de Cierre
                                </h4>
                            </div>
                            <p className="text-xl font-bold text-white">
                                {formatDate(edicion.fecha_cierre)}
                            </p>
                        </div>
                    )}
                </div>

                {/* Metadata */}
                <div className="pt-4 border-t border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-400">Creado por:</span>
                            <span className="ml-2 text-gray-200 font-medium">{edicion.creado_por}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Fecha de creación:</span>
                            <span className="ml-2 text-gray-200 font-medium">{formatDate(edicion.fecha_creacion)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}