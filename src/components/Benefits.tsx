import { Users, Recycle, Store, Leaf } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Benefits() {
  const benefits = [
    {
      icon: Users,
      title: '+10,000 usuarios',
      description: 'Una comunidad creciente de recicladores comprometidos con el medio ambiente',
      color: '#10B981'
    },
    {
      icon: Recycle,
      title: '50+ toneladas recicladas',
      description: 'Juntos hemos evitado que toneladas de vidrio terminen en vertederos',
      color: '#3B82F6'
    },
    {
      icon: Store,
      title: '100+ comercios aliados',
      description: 'Red en expansión de negocios locales donde canjear tus puntos',
      color: '#10B981'
    },
    {
      icon: Leaf,
      title: '100% Eco-Friendly',
      description: 'Cada acción cuenta. Contribuye al planeta mientras obtienes beneficios',
      color: '#3B82F6'
    }
  ];

  return (
    <section id="benefits" className="py-16 sm:py-20 lg:py-24 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#111827] mb-4">
            Beneficios que Importan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Únete a una plataforma que genera impacto real
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="bg-white border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6 text-center">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto"
                  style={{ backgroundColor: `${benefit.color}20` }}
                >
                  <benefit.icon className="w-8 h-8" style={{ color: benefit.color }} />
                </div>
                <h3 className="text-xl text-[#111827] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Image Banner */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-video rounded-2xl overflow-hidden shadow-lg bg-gray-100">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1644176775736-1423796d251b?w=800&q=80"
              alt="Colección de botellas de vidrio"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-video rounded-2xl overflow-hidden shadow-lg bg-gray-100">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1749805339958-4b1d0f16423d?w=800&q=80"
              alt="Impacto ambiental del reciclaje"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}