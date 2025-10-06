// components/landing/FeaturesSection.tsx
import { BookOpen,  CheckCircle, Lightbulb, BarChart3, Users, FlaskRound, FlaskConical } from 'lucide-react';
import FeatureCard from './FeactureCard';

const features = [
  {
    Icon: BookOpen,
    title: 'Tópicos Estructurados',
    description: 'Contenido organizado en unidades y lecciones de 5-15 minutos. Aprende a tu propio ritmo con material multimedia.',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    Icon: FlaskConical,
    title: 'Laboratorios Prácticos',
    description: 'Ejercicios hands-on para aplicar conceptos. Escribe código real con evaluación automática y feedback instantáneo.',
    bgColor: 'bg-indigo-100',
    iconColor: 'text-indigo-600'
  },
  {
    Icon: CheckCircle,
    title: 'Checkpoints',
    description: 'Evaluaciones diagnósticas que identifican tus áreas de mejora y ajustan tu ruta de aprendizaje.',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    Icon: Lightbulb,
    title: 'Sistema de Pistas',
    description: 'Ayudas inteligentes cuando las necesites: tips, pistas específicas, ejemplos y soluciones parciales.',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    Icon: BarChart3,
    title: 'Seguimiento de Progreso',
    description: 'Visualiza tu avance en tiempo real. Analiza tu desempeño y celebra tus logros.',
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600'
  },
  {
    Icon: Users,
    title: 'Para Profesores',
    description: 'Crea cursos, gestiona ediciones, diseña laboratorios y supervisa el progreso de tus estudiantes.',
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600'
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Todo lo que necesitas para aprender Python
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Una plataforma completa con herramientas diseñadas para estudiantes y profesores
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            Icon={feature.Icon}
            title={feature.title}
            description={feature.description}
            bgColor={feature.bgColor}
            iconColor={feature.iconColor}
          />
        ))}
      </div>
    </section>
  );
}