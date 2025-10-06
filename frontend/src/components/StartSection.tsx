
'use client';

import { ArrowRight, Sparkles } from 'lucide-react';

interface StartSectionProps {
  onGetStarted: () => void;
}

export function StartSection({ onGetStarted }: StartSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="relative z-10">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-12 h-12 text-yellow-300 animate-pulse" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            ¿Listo para comenzar tu viaje?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a cientos de estudiantes que ya están aprendiendo Python de manera efectiva
          </p>
          <button
            onClick={onGetStarted}
            className="px-10 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl font-bold text-lg inline-flex items-center gap-2 group"
          >
            Comenzar gratis
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

