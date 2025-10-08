import { Leaf, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { User } from '../App';
import { useState } from 'react';

interface HeaderProps {
  currentUser: User | null;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onLogout: () => void;
}

export function Header({ currentUser, onLoginClick, onRegisterClick, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="w-10 h-10 bg-[#10B981] rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-[#111827] font-semibold text-xl">EcoGlass</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('hero')} className="text-[#111827] hover:text-[#10B981] transition-colors">
              Inicio
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-[#111827] hover:text-[#10B981] transition-colors">
              Cómo Funciona
            </button>
            <button onClick={() => scrollToSection('benefits')} className="text-[#111827] hover:text-[#10B981] transition-colors">
              Beneficios
            </button>
            <button onClick={() => scrollToSection('partners')} className="text-[#111827] hover:text-[#10B981] transition-colors">
              Comercios Aliados
            </button>
            <button onClick={() => scrollToSection('footer')} className="text-[#111827] hover:text-[#10B981] transition-colors">
              Contacto
            </button>
          </nav>

          {/* Auth Buttons / User Info */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-[#111827]">Bienvenido, <span className="font-semibold">{currentUser.name}</span></p>
                  <p className="text-xs text-[#10B981]">{currentUser.points} puntos</p>
                </div>
                <Button
                  onClick={onLogout}
                  variant="outline"
                  className="border-gray-300 text-[#111827] hover:bg-gray-50"
                >
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <>
                <Button
                  onClick={onLoginClick}
                  variant="outline"
                  className="border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  onClick={onRegisterClick}
                  className="bg-[#10B981] text-white hover:bg-[#059669]"
                >
                  Registrarse Gratis
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#111827]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <button onClick={() => scrollToSection('hero')} className="text-[#111827] hover:text-[#10B981] text-left">
                Inicio
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-[#111827] hover:text-[#10B981] text-left">
                Cómo Funciona
              </button>
              <button onClick={() => scrollToSection('benefits')} className="text-[#111827] hover:text-[#10B981] text-left">
                Beneficios
              </button>
              <button onClick={() => scrollToSection('partners')} className="text-[#111827] hover:text-[#10B981] text-left">
                Comercios Aliados
              </button>
              <button onClick={() => scrollToSection('footer')} className="text-[#111827] hover:text-[#10B981] text-left">
                Contacto
              </button>
              
              {currentUser ? (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-[#111827] mb-2">Bienvenido, <span className="font-semibold">{currentUser.name}</span></p>
                  <p className="text-xs text-[#10B981] mb-3">{currentUser.points} puntos</p>
                  <Button
                    onClick={onLogout}
                    variant="outline"
                    className="w-full border-gray-300 text-[#111827]"
                  >
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 flex flex-col gap-2">
                  <Button
                    onClick={onLoginClick}
                    variant="outline"
                    className="w-full border-[#10B981] text-[#10B981]"
                  >
                    Iniciar Sesión
                  </Button>
                  <Button
                    onClick={onRegisterClick}
                    className="w-full bg-[#10B981] text-white"
                  >
                    Registrarse Gratis
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}