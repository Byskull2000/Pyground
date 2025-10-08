import { UserPlus, GraduationCap, Trophy } from 'lucide-react';

const steps = [
  {
    number: 1,
    Icon: UserPlus,
    title: 'Inscríbete a un curso',
    description: 'Elige entre múltiples cursos diseñados por profesores expertos'
  },
  {
    number: 2,
    Icon: GraduationCap,
    title: 'Aprende y practica',
    description: 'Estudia tópicos y resuelve laboratorios'
  },
  {
    number: 3,
    Icon: Trophy,
    title: 'Domina Python',
    description: 'Avanza a tu ritmo y demuestra tu dominio con proyectos reales'
  }
];

export default function HowItWorksSection() {
  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-950 dark:to-black py-20 border-y border-gray-800 dark:border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-xl text-gray-300 dark:text-gray-400 max-w-2xl mx-auto">
            Tu camino hacia el dominio de Python en 3 pasos simples
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-gray-800 dark:bg-gray-900 border border-gray-700 dark:border-gray-800 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <step.Icon className="w-10 h-10 text-blue-400 dark:text-blue-500" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md">
                  {step.number}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-gray-300 dark:text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}