import { UserPlus, Camera, Gift } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: 'Regístrate',
      description: 'Crea tu cuenta gratuita en menos de 1 minuto. Solo necesitas tu nombre y correo electrónico.'
    },
    {
      icon: Camera,
      title: 'Sube foto reciclando vidrio',
      description: 'Cada vez que recicles botellas o envases de vidrio, toma una foto y súbela a la plataforma.'
    },
    {
      icon: Gift,
      title: 'Acumula puntos y canjea',
      description: 'Gana 50 puntos por cada foto. Canjea tus puntos por descuentos y productos en comercios aliados.'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#111827] mb-4">
            ¿Cómo Funciona?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tres pasos simples para comenzar a ganar recompensas por reciclar
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line (desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#10B981] to-[#3B82F6]" />
              )}

              {/* Step Card */}
              <div className="relative bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#10B981] text-white rounded-full flex items-center justify-center shadow-lg z-10">
                  <span className="text-xl">{index + 1}</span>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-[#10B981]/10 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <step.icon className="w-8 h-8 text-[#10B981]" />
                </div>

                {/* Content */}
                <h3 className="text-xl text-[#111827] mb-3 text-center">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}