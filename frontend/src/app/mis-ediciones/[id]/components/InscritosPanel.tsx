import { useState } from 'react';
import { Users, UserCheck, GraduationCap, Shield, User, Calendar, Mail, CheckCircle, XCircle } from 'lucide-react';

interface Inscripcion {
    id: number;
    usuario_id: number;
    cargo_id: number;
    fecha_inscripcion: string;
    activo: boolean;
    usuario: {
        id: number;
        email: string;
        nombre: string;
        apellido: string;
        rol: string;
        avatar_url?: string;
    };
    cargo: {
        id: number;
        nombre: string;
    };
}

interface InscritosPanelProps {
    inscripciones: Inscripcion[];
}

export default function InscritosPanel({ inscripciones }: InscritosPanelProps) {
    const [filtroActivo, setFiltroActivo] = useState<'todos' | 'docentes' | 'editores' | 'estudiantes'>('todos');

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getCargoIcon = (cargoId: number) => {
        switch (cargoId) {
            case 1: return <UserCheck className="w-4 h-4" />;
            case 2: return <GraduationCap className="w-4 h-4" />;
            case 3: return <User className="w-4 h-4" />;
            default: return <User className="w-4 h-4" />;
        }
    };

    const getCargoColor = (cargoId: number) => {
        switch (cargoId) {
            case 1: return 'from-green-500 to-emerald-600';
            case 2: return 'from-purple-500 to-pink-600';
            case 3: return 'from-blue-500 to-cyan-600';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const getRolIcon = (rol?: string) => {
        const rolUpper = (rol ?? '').toUpperCase();
        switch (rolUpper) {
            case 'ADMIN': return <Shield className="w-4 h-4 text-red-400" />;
            case 'DOCENTE': return <UserCheck className="w-4 h-4 text-green-400" />;
            case 'ACADEMICO': return <GraduationCap className="w-4 h-4 text-blue-400" />;
            default: return <User className="w-4 h-4 text-gray-400" />;
        }
    };

    const docentes = inscripciones.filter(i => i.cargo_id === 1);
    const editores = inscripciones.filter(i => i.cargo_id === 2);
    const estudiantes = inscripciones.filter(i => i.cargo_id === 3);

    const inscripcionesFiltradas = inscripciones.filter(i => {
        if (filtroActivo === 'todos') return true;
        if (filtroActivo === 'docentes') return i.cargo_id === 1;
        if (filtroActivo === 'editores') return i.cargo_id === 2;
        if (filtroActivo === 'estudiantes') return i.cargo_id === 3;
        return true;
    });

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-b border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                Usuarios Inscritos
                            </h2>
                            <p className="text-sm text-gray-400">
                                {inscripciones.length} {inscripciones.length === 1 ? 'usuario inscrito' : 'usuarios inscritos'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/5 backdrop-blur-lg rounded-lg p-3 border border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                            <UserCheck className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-gray-400">Docentes</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{docentes.length}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-lg rounded-lg p-3 border border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                            <GraduationCap className="w-4 h-4 text-purple-400" />
                            <span className="text-xs text-gray-400">Editores</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{editores.length}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-lg rounded-lg p-3 border border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                            <User className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-gray-400">Estudiantes</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{estudiantes.length}</p>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="p-6 border-b border-white/10">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFiltroActivo('todos')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            filtroActivo === 'todos'
                                ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                        }`}
                    >
                        Todos ({inscripciones.length})
                    </button>
                    <button
                        onClick={() => setFiltroActivo('docentes')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            filtroActivo === 'docentes'
                                ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                        }`}
                    >
                        Docentes ({docentes.length})
                    </button>
                    <button
                        onClick={() => setFiltroActivo('editores')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            filtroActivo === 'editores'
                                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                        }`}
                    >
                        Editores ({editores.length})
                    </button>
                    <button
                        onClick={() => setFiltroActivo('estudiantes')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            filtroActivo === 'estudiantes'
                                ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                        }`}
                    >
                        Estudiantes ({estudiantes.length})
                    </button>
                </div>
            </div>

            {/* Lista de inscritos */}
            <div className="p-6">
                {inscripcionesFiltradas.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-400">No hay usuarios en esta categoría</p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {inscripcionesFiltradas.map((inscripcion) => (
                            <div
                                key={inscripcion.id}
                                className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all hover:shadow-lg group"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        {inscripcion.usuario.avatar_url ? (
                                            <img
                                                src={inscripcion.usuario.avatar_url}
                                                alt={`${inscripcion.usuario.nombre} ${inscripcion.usuario.apellido}`}
                                                className="w-14 h-14 rounded-xl object-cover ring-2 ring-white/20"
                                            />
                                        ) : (
                                            <div className={`w-14 h-14 bg-gradient-to-br ${getCargoColor(inscripcion.cargo_id)} rounded-xl flex items-center justify-center text-white font-bold text-lg ring-2 ring-white/20`}>
                                                {inscripcion.usuario.nombre.charAt(0)}{inscripcion.usuario.apellido.charAt(0)}
                                            </div>
                                        )}
                                        
                                        {/* Badge de cargo sobre avatar */}
                                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br ${getCargoColor(inscripcion.cargo_id)} rounded-lg flex items-center justify-center shadow-lg border-2 border-gray-900`}>
                                            {getCargoIcon(inscripcion.cargo_id)}
                                        </div>
                                    </div>

                                    {/* Información del usuario */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-bold text-lg truncate group-hover:text-blue-300 transition-colors">
                                                    {inscripcion.usuario.nombre} {inscripcion.usuario.apellido}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${getCargoColor(inscripcion.cargo_id)}/20 border border-white/20`}>
                                                        {getCargoIcon(inscripcion.cargo_id)}
                                                        <span className="text-white">{inscripcion.cargo.nombre}</span>
                                                    </span>
                                                    
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-300 border border-gray-500/30">
                                                        {getRolIcon(inscripcion.usuario.rol)}
                                                        {inscripcion.usuario.rol}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Estado activo */}
                                            <div>
                                                {inscripcion.activo ? (
                                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                                ) : (
                                                    <XCircle className="w-5 h-5 text-red-400" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Detalles adicionales */}
                                        <div className="space-y-1 text-sm">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                                                <span className="truncate">{inscripcion.usuario.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                                                <span>Inscrito el {formatDate(inscripcion.fecha_inscripcion)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </div>
    );
}