import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User } from '../App';
import { toast } from 'sonner@2.0.3';
import { LogIn, Loader2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
}

export function LoginModal({ isOpen, onClose, onLogin, onSwitchToRegister }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    requestAnimationFrame(() => setTimeout(() => {
      // Limpiar espacios en blanco (problema común en móviles)
      const cleanEmail = email.trim();
      const cleanPassword = password.trim();

      if (!cleanEmail || !cleanPassword) {
        toast.error('Campos incompletos', { duration: 3000 });
        setIsLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        toast.error('Email inválido', { duration: 3000 });
        setIsLoading(false);
        return;
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: User & { password: string }) => 
        u.email.toLowerCase() === cleanEmail.toLowerCase() && u.password === cleanPassword
      );

      if (user) {
        onLogin({
          name: user.name,
          email: user.email,
          points: user.points || 0
        });
        toast.success(`¡Bienvenido, ${user.name}!`, { duration: 3000 });
        setEmail('');
        setPassword('');
      } else {
        const emailExists = users.some((u: User) => u.email.toLowerCase() === email.toLowerCase());
        
        if (emailExists) {
          toast.error('Contraseña incorrecta', { duration: 3000 });
        } else {
          toast.error('Usuario no encontrado', { duration: 3000 });
        }
      }
      
      setIsLoading(false);
    }, 50));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-12 h-12 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-6 h-6 text-[#10B981]" />
          </div>
          <DialogTitle className="text-center text-2xl">Iniciar Sesión</DialogTitle>
          <DialogDescription className="text-center">
            Ingresa a tu cuenta para continuar ganando puntos
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="login-email">Correo electrónico</Label>
            <Input
              id="login-email"
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
            <Label htmlFor="login-password">Contraseña</Label>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#10B981] hover:bg-[#059669] text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Iniciando...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </Button>

          <div className="text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-[#10B981] hover:underline"
              disabled={isLoading}
            >
              Regístrate gratis
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
