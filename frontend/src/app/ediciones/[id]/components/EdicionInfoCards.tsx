import { User, Calendar, CalendarCheck, CalendarX } from "lucide-react";
import type { Edicion } from "../../interfaces/Edicion";

interface EdicionInfoCardsProps {
    edicion: Edicion;
}

export function EdicionInfoCards({ edicion }: EdicionInfoCardsProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const cards = [
        {
            icon: User,
            gradient: "from-purple-500 to-pink-600",
            bgGradient: "from-purple-500/10 to-pink-500/10",
            title: "Creador",
            value: edicion.creado_por,
            capitalize: true
        },
        {
            icon: CalendarCheck,
            gradient: "from-green-500 to-emerald-600",
            bgGradient: "from-green-500/10 to-emerald-500/10",
            title: "Fecha de Apertura",
            value: formatDate(edicion.fecha_apertura),
            capitalize: false
        },
        {
            icon: CalendarX,
            gradient: "from-orange-500 to-red-600",
            bgGradient: "from-orange-500/10 to-red-500/10",
            title: "Fecha de Cierre",
            value: formatDate(edicion.fecha_cierre),
            capitalize: false
        },
        {
            icon: Calendar,
            gradient: "from-cyan-500 to-blue-600",
            bgGradient: "from-cyan-500/10 to-blue-500/10",
            title: "Fecha de Creación",
            value: formatDate(edicion.fecha_creacion),
            capitalize: false
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div
                        key={index}
                        className="relative group bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    >
                        {/* Fondo con gradiente glassmorphism */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
                        
                        {/* Círculo decorativo */}
                        <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${card.gradient} rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>

                        <div className="relative">
                            {/* Icono con glassmorphism */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="relative w-12 h-12">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-xl blur opacity-40`}></div>
                                    <div className={`relative w-full h-full bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    {card.title}
                                </h3>
                            </div>

                            {/* Valor */}
                            <p className={`text-lg font-bold text-gray-900 dark:text-white ${card.capitalize ? 'capitalize' : ''}`}>
                                {card.value}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}