import { Coffee, ShoppingBag, Dumbbell, BookOpen, Utensils, Sparkles, Laptop, Shirt } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Partners() {
  // Logos de comercios aliados con iconos únicos
  const partners = [
    { name: 'Café Verde', category: 'Cafetería', Icon: Coffee, bgClass: 'bg-amber-100', iconClass: 'text-amber-700' },
    { name: 'Tienda Orgánica', category: 'Alimentos', Icon: ShoppingBag, bgClass: 'bg-emerald-100', iconClass: 'text-emerald-600' },
    { name: 'EcoFit Gym', category: 'Deportes', Icon: Dumbbell, bgClass: 'bg-red-100', iconClass: 'text-red-600' },
    { name: 'Librería Central', category: 'Cultura', Icon: BookOpen, bgClass: 'bg-indigo-100', iconClass: 'text-indigo-600' },
    { name: 'Restaurante Bio', category: 'Gastronomía', Icon: Utensils, bgClass: 'bg-orange-100', iconClass: 'text-orange-600' },
    { name: 'Spa Natural', category: 'Bienestar', Icon: Sparkles, bgClass: 'bg-pink-100', iconClass: 'text-pink-600' },
    { name: 'Tech Store', category: 'Tecnología', Icon: Laptop, bgClass: 'bg-blue-100', iconClass: 'text-blue-600' },
    { name: 'Moda Sostenible', category: 'Moda', Icon: Shirt, bgClass: 'bg-purple-100', iconClass: 'text-purple-600' }
  ];

  return (
    <section id="partners" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#111827] mb-4">
            Comercios Aliados
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Canjea tus puntos en más de 100 comercios locales comprometidos con el medio ambiente
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="bg-[#F9FAFB] rounded-xl p-8 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200"
            >
              <div className={`w-16 h-16 ${partner.bgClass} rounded-full flex items-center justify-center mb-3`}>
                <partner.Icon className={`w-8 h-8 ${partner.iconClass}`} />
              </div>
              <p className="text-[#111827] text-center mb-1">
                {partner.name}
              </p>
              <p className="text-xs text-gray-500">{partner.category}</p>
            </div>
          ))}
        </div>

        {/* Image Showcase */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 aspect-video rounded-2xl overflow-hidden shadow-lg bg-gray-100">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1643904767413-bd2098ffc1ab?w=800&q=80"
              alt="Gestión sostenible de residuos de vidrio"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-video rounded-2xl overflow-hidden shadow-lg bg-gray-100">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1552940661-f6e181c4e0c0?w=400&q=80"
              alt="Cero residuos - Vidrio"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-gray-100 px-6 py-3 rounded-full border border-gray-200">
            <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
            <p className="text-gray-600">
              <span className="text-[#111827]">Portal para comercios aliados:</span> Próximamente
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            ¿Tienes un negocio? Pronto podrás unirte como comercio aliado
          </p>
        </div>
      </div>
    </section>
  );
}