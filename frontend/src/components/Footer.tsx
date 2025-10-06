
import { Code2, Mail, FileText, Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">PyGround</span>
          </div>

          <p className="text-sm">
            © 2025 PyGround. Plataforma educativa de Python.
          </p>

          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
              <FileText className="w-4 h-4" />
              Términos
            </a>
            <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
              <Lock className="w-4 h-4" />
              Privacidad
            </a>
            <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
              <Mail className="w-4 h-4" />
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}