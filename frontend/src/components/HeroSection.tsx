'use client';

interface HeroSectionProps {
    onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        Plataforma educativa de Python
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                        Aprende Python
                        <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            paso a paso
                        </span>
                    </h1>

                    <p className="text-xl text-gray-600 leading-relaxed">
                        Una plataforma interactiva diseñada para estudiantes y profesores.
                        Practica con laboratorios reales, resuelve problemas y domina Python
                        con contenido estructurado y evaluación automática.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={onGetStarted}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                        >
                            Comenzar ahora
                        </button>
                        <a
                            href="#features"
                            className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all font-semibold text-lg text-center"
                        >
                            Explorar funciones
                        </a>
                    </div>

                    <div className="flex items-center gap-8 pt-4">
                        <div>
                            <div className="text-3xl font-bold text-gray-900">500+</div>
                            <div className="text-sm text-gray-600">Estudiantes activos</div>
                        </div>
                        <div className="w-px h-12 bg-gray-300"></div>
                        <div>
                            <div className="text-3xl font-bold text-gray-900">50+</div>
                            <div className="text-sm text-gray-600">Laboratorios</div>
                        </div>
                        <div className="w-px h-12 bg-gray-300"></div>
                        <div>
                            <div className="text-3xl font-bold text-gray-900">20+</div>
                            <div className="text-sm text-gray-600">Cursos</div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-3xl opacity-20"></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>

                            <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto text-sm">
                                <code>{`# Bienvenido a PyGround
def calcular_promedio(numeros):
    """
    Calcula el promedio de una lista
    """
    total = sum(numeros)
    return total / len(numeros)

# Prueba tu código
notas = [85, 92, 78, 95, 88]
promedio = calcular_promedio(notas)
print(f"Promedio: {promedio}")

# ✓ Test pasado: 87.6`}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}