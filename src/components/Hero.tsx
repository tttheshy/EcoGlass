import { Button } from './ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeroProps {
  onRegisterClick: () => void;
}

export function Hero({ onRegisterClick }: HeroProps) {
  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-white to-[#F9FAFB] py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#10B981]/10 text-[#10B981] px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">Nuevo: Gana hasta 100 puntos por foto</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-[#111827] mb-6">
              Recicla Vidrio.{' '}
              <span className="text-[#10B981]">Gana Recompensas.</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Únete a la comunidad de recicladores conscientes. Sube una foto cada vez que recicles vidrio, 
              acumula puntos y canjéalos por increíbles beneficios en más de 100 comercios aliados.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={onRegisterClick}
                className="bg-[#10B981] text-white hover:bg-[#059669] px-8 py-6 text-lg shadow-lg shadow-[#10B981]/30"
              >
                Comenzar Ahora – Gratis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={scrollToHowItWorks}
                variant="outline"
                className="border-gray-300 text-[#111827] hover:bg-gray-50 px-8 py-6 text-lg"
              >
                Conocer Más
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <p className="text-3xl text-[#10B981]">+10K</p>
                <p className="text-sm text-gray-600">Usuarios</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-3xl text-[#10B981]">50+</p>
                <p className="text-sm text-gray-600">Toneladas</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-3xl text-[#10B981]">100+</p>
                <p className="text-sm text-gray-600">Comercios</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Main large image */}
              <div className="col-span-2 aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1608745167260-e15bc0e0521f?w=800&q=80"
                  alt="Reciclaje de vidrio"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Small images */}
              <div className="aspect-square rounded-xl overflow-hidden shadow-lg bg-gray-100">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1698768180145-1c9ef11fa938?w=400&q=80"
                  alt="Botellas de vidrio verdes"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-xl overflow-hidden shadow-lg bg-gray-100">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1628525886800-6988e135bb3d?w=400&q=80"
                  alt="Contenedor de reciclaje de vidrio"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#10B981]/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#3B82F6]/20 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
}