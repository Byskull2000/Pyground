'use client';

import { ArrowRight, Sparkles } from 'lucide-react';

interface StartSectionProps {
  onGetStarted: () => void;
}

export function StartSection({ onGetStarted }: StartSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 dark:from-gray-900 dark:via-black dark:to-gray-900 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden border border-gray-700 dark:border-gray-800">
        <div className="absolute inset-0 bg-grid-white/5"></div>
        <div className="relative z-10">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-12 h-12 text-emerald-400 dark:text-emerald-500 animate-pulse" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            ¿Listo para comenzar tu viaje?
          </h2>
          <p className="text-xl text-gray-300 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Únete a cientos de estudiantes que ya están aprendiendo Python de manera efectiva
          </p>
          <button
            onClick={onGetStarted}
            className="px-10 py-4 bg-blue-600 dark:bg-blue-700 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl font-bold text-lg inline-flex items-center gap-2 group"
          >
            Comenzar gratis
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}