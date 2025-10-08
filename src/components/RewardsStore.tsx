import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Gift, Coffee, ShoppingBag, Utensils, Ticket, Check, Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  category: string;
  icon: any;
  image: string;
  available: boolean;
}

interface RewardsStoreProps {
  userPoints: number;
  onRedeem: (reward: Reward) => void;
}

export function RewardsStore({ userPoints, onRedeem }: RewardsStoreProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [redeemedReward, setRedeemedReward] = useState<Reward | null>(null);
  const [rewardCode, setRewardCode] = useState<string>('');
  const [codeCopied, setCodeCopied] = useState(false);

  const rewards: Reward[] = [
    {
      id: '1',
      name: 'Café Gratis',
      description: 'Un café de tu elección en cualquier cafetería aliada',
      points: 100,
      category: 'gastronomia',
      icon: Coffee,
      image: 'https://images.unsplash.com/photo-1635090976010-d3f6dfbb1bac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXAlMjBsYXR0ZXxlbnwxfHx8fDE3NTkyNTcxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true
    },
    {
      id: '2',
      name: 'Libro Ecológico',
      description: 'Un libro sobre sostenibilidad y medio ambiente de tu elección',
      points: 120,
      category: 'entretenimiento',
      icon: Gift,
      image: 'https://images.unsplash.com/photo-1706722416356-c96360f18d68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rc3RvcmUlMjBib29rcyUyMHJlYWRpbmd8ZW58MXx8fHwxNzU5MTU1OTc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true
    },
    {
      id: '3',
      name: 'Descuento 20% Tienda Orgánica',
      description: 'Descuento del 20% en tu próxima compra en tiendas aliadas',
      points: 150,
      category: 'compras',
      icon: ShoppingBag,
      image: 'https://images.unsplash.com/photo-1628516163406-45619a567907?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZm9vZCUyMHN0b3JlfGVufDF8fHx8MTc1OTI1NzE5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true
    },
    {
      id: '4',
      name: 'Descuento 15% Moda Sostenible',
      description: 'Descuento en ropa y accesorios de marcas sostenibles',
      points: 180,
      category: 'compras',
      icon: ShoppingBag,
      image: 'https://images.unsplash.com/photo-1573612664822-d7d347da7b80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGZhc2hpb24lMjBjbG90aGVzfGVufDF8fHx8MTc1OTI1NzE5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true
    },
    {
      id: '5',
      name: 'Entrada de Cine',
      description: 'Una entrada de cine para cualquier película en horario matinée',
      points: 200,
      category: 'entretenimiento',
      icon: Ticket,
      image: 'https://images.unsplash.com/photo-1696331419614-ec358a9e9963?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMGNpbmVtYSUyMHRoZWF0ZXJ8ZW58MXx8fHwxNzU5MjU3MTkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true
    },
    {
      id: '6',
      name: 'Almuerzo 2x1',
      description: 'Lleva un almuerzo y el segundo es gratis en restaurantes eco-friendly',
      points: 250,
      category: 'gastronomia',
      icon: Utensils,
      image: 'https://images.unsplash.com/photo-1611745843745-2c6697a925e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwbHVuY2glMjBtZWFsfGVufDF8fHx8MTc1OTI1NzE5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true
    },
    {
      id: '7',
      name: 'Kit de Reciclaje Premium',
      description: 'Kit completo con contenedores de colores y guía de reciclaje',
      points: 300,
      category: 'productos',
      icon: Gift,
      image: 'https://images.unsplash.com/photo-1716100946409-1a88c28267e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xpbmclMjBiaW5zJTIwY29udGFpbmVyc3xlbnwxfHx8fDE3NTkyNTcxOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true
    },
    {
      id: '8',
      name: 'Botella Reutilizable Premium',
      description: 'Botella de acero inoxidable térmica de alta calidad',
      points: 350,
      category: 'productos',
      icon: Gift,
      image: 'https://images.unsplash.com/photo-1623684194967-48075185a58c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXVzYWJsZSUyMHdhdGVyJTIwYm90dGxlfGVufDF8fHx8MTc1OTE5OTYzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true
    },
    {
      id: '9',
      name: 'Clase de Yoga',
      description: 'Una sesión de yoga o meditación en estudios aliados',
      points: 400,
      category: 'bienestar',
      icon: Gift,
      image: 'https://images.unsplash.com/photo-1645652367526-a0ecb717650a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwd2VsbG5lc3MlMjBtZWRpdGF0aW9ufGVufDF8fHx8MTc1OTIzNDk5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true
    },
    {
      id: '10',
      name: 'Set de Productos Ecológicos',
      description: 'Kit con productos de limpieza y cuidado personal ecológicos',
      points: 450,
      category: 'productos',
      icon: Gift,
      image: 'https://images.unsplash.com/photo-1589365252845-092198ba5334?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjBmcmllbmRseSUyMHByb2R1Y3RzfGVufDF8fHx8MTc1OTIzMTIxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true
    },
    {
      id: '11',
      name: 'Kit de Jardinería Urbana',
      description: 'Todo lo necesario para empezar tu huerto urbano en casa',
      points: 500,
      category: 'productos',
      icon: Gift,
      image: 'https://images.unsplash.com/photo-1647550232391-f758832be5c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMHNlZWRsaW5ncyUyMGdhcmRlbnxlbnwxfHx8fDE3NTkyNTcxOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true
    },
    {
      id: '12',
      name: 'Entrada a Concierto Eco',
      description: 'Entrada general para eventos musicales eco-friendly',
      points: 550,
      category: 'entretenimiento',
      icon: Ticket,
      image: 'https://images.unsplash.com/photo-1743791022256-40413c5f019b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbXVzaWMlMjBldmVudHxlbnwxfHx8fDE3NTkyMzkwNjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true
    },
    {
      id: '13',
      name: 'Masaje Relajante',
      description: 'Una sesión de masaje relajante de 60 minutos en spa aliado',
      points: 600,
      category: 'bienestar',
      icon: Gift,
      image: 'https://images.unsplash.com/photo-1757689314932-bec6e9c39e51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjBtYXNzYWdlJTIwd2VsbG5lc3N8ZW58MXx8fHwxNzU5MjM3ODYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true
    },
    {
      id: '14',
      name: 'Bicicleta Urbana',
      description: 'Bicicleta urbana de calidad para movilidad sostenible',
      points: 700,
      category: 'tecnologia',
      icon: Gift,
      image: 'https://images.unsplash.com/photo-1608751514210-d8ce63bd2170?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWN5Y2xlJTIwYmlrZSUyMGN5Y2xpbmd8ZW58MXx8fHwxNzU5MjU3MTk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true
    },
    {
      id: '15',
      name: 'Panel Solar Portátil',
      description: 'Cargador solar portátil de última generación para tus dispositivos',
      points: 800,
      category: 'tecnologia',
      icon: Gift,
      image: 'https://images.unsplash.com/photo-1614366502473-e54666693b44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBvd2VyJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTkyNTcxOTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true
    }
  ];

  const categories = [
    { id: 'todos', label: 'Todas' },
    { id: 'gastronomia', label: 'Gastronomía' },
    { id: 'compras', label: 'Compras' },
    { id: 'entretenimiento', label: 'Entretenimiento' },
    { id: 'productos', label: 'Productos' },
    { id: 'bienestar', label: 'Bienestar' },
    { id: 'tecnologia', label: 'Tecnología' }
  ];

  const filteredRewards = selectedCategory === 'todos' 
    ? rewards 
    : rewards.filter(r => r.category === selectedCategory);

  // Función para generar código único de recompensa
  const generateRewardCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const timestamp = Date.now().toString(36).toUpperCase();
    let code = 'ECO-';
    
    // Añadir 4 caracteres aleatorios
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    code += '-';
    
    // Añadir parte del timestamp para hacerlo único
    code += timestamp.slice(-4).toUpperCase();
    
    return code;
  };

  const handleRedeem = (reward: Reward) => {
    if (userPoints >= reward.points) {
      const code = generateRewardCode();
      setRewardCode(code);
      setRedeemedReward(reward);
      setShowCodeDialog(true);
      setCodeCopied(false);
      onRedeem(reward);
    } else {
      toast.error('No tienes suficientes puntos', {
        description: `Necesitas ${reward.points - userPoints} puntos más`,
        duration: 3000
      });
    }
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(rewardCode);
    setCodeCopied(true);
    toast.success('Código copiado al portapapeles', { duration: 3000 });
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // Obtener fecha de expiración (30 días desde ahora)
  const getExpirationDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl text-[#111827] mb-2">Tienda de Recompensas</h2>
        <p className="text-gray-600">
          Canjea tus puntos por increíbles beneficios en comercios aliados
        </p>
      </div>

      {/* Points Balance */}
      <Card className="bg-gradient-to-r from-[#10B981] to-[#059669] border-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-white/80 text-sm mb-1">Puntos disponibles</p>
              <p className="text-4xl">{userPoints}</p>
            </div>
            <Gift className="w-16 h-16 text-white/30" />
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            className={selectedCategory === category.id 
              ? 'bg-[#10B981] text-white hover:bg-[#059669]' 
              : 'border-gray-300 text-[#111827] hover:bg-gray-50'
            }
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Rewards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map((reward) => {
          const canAfford = userPoints >= reward.points;
          
          return (
            <Card 
              key={reward.id}
              className={`overflow-hidden hover:shadow-xl transition-all duration-300 ${
                !canAfford ? 'opacity-60' : ''
              }`}
            >
              {/* Image */}
              <div className="aspect-video overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={reward.image}
                  alt={reward.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 bg-[#10B981]/10 rounded-lg flex items-center justify-center">
                    <reward.icon className="w-5 h-5 text-[#10B981]" />
                  </div>
                  <Badge className="bg-[#10B981] text-white hover:bg-[#059669]">
                    {reward.points} pts
                  </Badge>
                </div>
                <CardTitle className="text-lg">{reward.name}</CardTitle>
                <CardDescription className="text-sm">
                  {reward.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Button
                  onClick={() => handleRedeem(reward)}
                  disabled={!canAfford}
                  className={`w-full ${
                    canAfford 
                      ? 'bg-[#10B981] hover:bg-[#059669] text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Canjear
                    </>
                  ) : (
                    `Faltan ${reward.points - userPoints} pts`
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRewards.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay recompensas en esta categoría</p>
        </div>
      )}

      {/* Código de Recompensa Dialog */}
      <AlertDialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-2xl">
              ¡Canje Exitoso! 🎉
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Has canjeado: {redeemedReward?.name}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-[#10B981]/10 to-[#059669]/10 rounded-xl p-6 space-y-3">
              <p className="text-xs text-gray-600 uppercase tracking-wide text-center">Tu código de canje</p>
              <div className="flex items-center justify-center gap-2 bg-white rounded-lg p-4 border-2 border-[#10B981]/30">
                <code className="text-2xl tracking-wider text-[#111827]">
                  {rewardCode}
                </code>
              </div>
              <Button
                onClick={copyCodeToClipboard}
                variant="outline"
                size="sm"
                className="w-full border-[#10B981] text-[#10B981] hover:bg-[#10B981]/10"
              >
                {codeCopied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar código
                  </>
                )}
              </Button>
            </div>

            <div className="text-left bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <p className="text-[#111827]">📋 Instrucciones:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Presenta este código en el comercio aliado</li>
                <li>Guarda una captura de pantalla del código</li>
                <li>Válido hasta: {getExpirationDate()}</li>
              </ul>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogAction 
              className="w-full bg-[#10B981] hover:bg-[#059669] text-white"
              onClick={() => setShowCodeDialog(false)}
            >
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}