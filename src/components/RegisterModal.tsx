import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User } from '../App';
import { toast } from 'sonner@2.0.3';
import { UserPlus, Loader2, Check } from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (user: User) => void;
  onSwitchToLogin: () => void;
}

export function RegisterModal({ isOpen, onClose, onRegister, onSwitchToLogin }: RegisterModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    requestAnimationFrame(() => setTimeout(() => {
      // Limpiar espacios en blanco (problema común en móviles)
      const cleanName = name.trim();
      const cleanEmail = email.trim();
      const cleanPassword = password.trim();

      if (!cleanName || !cleanEmail || !cleanPassword) {
        toast.error('Completa todos los campos', { duration: 3000 });
        setIsLoading(false);
        return;
      }

      if (cleanName.length < 2) {
        toast.error('Nombre muy corto', { duration: 3000 });
        setIsLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        toast.error('Email inválido', { duration: 3000 });
        setIsLoading(false);
        return;
      }

      if (cleanPassword.length < 6) {
        toast.error('Contraseña debe tener al menos 6 caracteres', { duration: 3000 });
        setIsLoading(false);
        return;
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const emailExists = users.some((u: User & { password: string }) => 
        u.email.toLowerCase() === cleanEmail.toLowerCase()
      );

      if (emailExists) {
        toast.error('Este email ya está registrado', { duration: 3000 });
        setIsLoading(false);
        return;
      }

      const newUser: User & { password: string } = {
        name: cleanName,
        email: cleanEmail.toLowerCase(),
        password: cleanPassword,
        points: 0
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      onRegister({
        name: newUser.name,
        email: newUser.email,
        points: newUser.points
      });

      toast.success(`¡Bienvenido, ${cleanName}!`, { duration: 3000 });
      
      setName('');
      setEmail('');
      setPassword('');
      setIsLoading(false);
    }, 50));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-12 h-12 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-6 h-6 text-[#10B981]" />
          </div>
          <DialogTitle className="text-center text-2xl">Crear Cuenta</DialogTitle>
          <DialogDescription className="text-center">
            Únete gratis y comienza a ganar puntos por reciclar
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="register-name">Nombre completo</Label>
            <Input
              id="register-name"
              type="text"
              placeholder="Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
              disabled={isLoading}
              autoComplete="name"
              autoCorrect="off"
            />
          </div>

          <div>
            <Label htmlFor="register-email">Correo electrónico</Label>
            <Input
              id="register-email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              disabled={isLoading}
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          <div>
            <Label htmlFor="register-password">Contraseña</Label>
            <Input
              id="register-password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              disabled={isLoading}
              autoComplete="new-password"
            />
            {password && (
              <div className="mt-2">
                <div className={`flex items-center gap-2 text-xs ${password.length >= 6 ? 'text-green-600' : 'text-gray-500'}`}>
                  <Check className={`w-3 h-3 ${password.length >= 6 ? 'opacity-100' : 'opacity-30'}`} />
                  Mínimo 6 caracteres
                </div>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#10B981] hover:bg-[#059669] text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creando...
              </>
            ) : (
              'Crear Cuenta Gratis'
            )}
          </Button>

          <div className="text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-[#10B981] hover:underline"
              disabled={isLoading}
            >
              Inicia sesión
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
