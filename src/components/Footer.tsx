import { Leaf, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="footer" className="bg-[#111827] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div 
              className="flex items-center gap-2 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => scrollToSection('hero')}
            >
              <div className="w-10 h-10 bg-[#10B981] rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="font-semibold text-xl">EcoGlass</span>
            </div>
            <p className="text-gray-400 text-sm">
              Transformando el reciclaje de vidrio en recompensas tangibles para un futuro más sostenible.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Plataforma</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button 
                  onClick={() => scrollToSection('hero')} 
                  className="hover:text-[#10B981] transition-colors text-left"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('how-it-works')} 
                  className="hover:text-[#10B981] transition-colors text-left"
                >
                  Cómo Funciona
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('benefits')} 
                  className="hover:text-[#10B981] transition-colors text-left"
                >
                  Beneficios
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('partners')} 
                  className="hover:text-[#10B981] transition-colors text-left"
                >
                  Comercios Aliados
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button className="hover:text-[#10B981] transition-colors text-left">
                  Términos y Condiciones
                </button>
              </li>
              <li>
                <button className="hover:text-[#10B981] transition-colors text-left">
                  Política de Privacidad
                </button>
              </li>
              <li>
                <button className="hover:text-[#10B981] transition-colors text-left">
                  Cookies
                </button>
              </li>
              <li>
                <button className="hover:text-[#10B981] transition-colors text-left">
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>InnovacionyEmprendimiento@ecoglass.com</span>
              </div>
              <div className="flex gap-4 mt-4">
                <button 
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#10B981] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </button>
                <button 
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#10B981] transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button 
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#10B981] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} EcoGlass. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}