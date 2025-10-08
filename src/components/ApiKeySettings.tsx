import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Key, Eye, EyeOff, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { hasApiKey, setApiKey, clearApiKey } from '../services/imageValidationService';
import { toast } from 'sonner@2.0.3';

export function ApiKeySettings() {
  const [apiKey, setApiKeyState] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    setIsConfigured(hasApiKey());
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error('Por favor ingresa una API key válida', { duration: 3000 });
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      toast.error('La API key debe comenzar con "sk-"', { duration: 3000 });
      return;
    }

    setApiKey(apiKey.trim());
    setIsConfigured(true);
    setApiKeyState('');
    toast.success('API key configurada correctamente', {
      description: 'Ahora la validación de imágenes usará IA real',
      duration: 3000,
    });
  };

  const handleRemove = () => {
    clearApiKey();
    setIsConfigured(false);
    setApiKeyState('');
    toast.info('API key eliminada', {
      description: 'Se usará el modo de simulación',
      duration: 3000,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5 text-[#10B981]" />
          Configuración de Validación con IA
        </CardTitle>
        <CardDescription>
          Configura la validación automática de imágenes de vidrio reciclable
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Alert */}
        {isConfigured ? (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>IA activada:</strong> Las imágenes se validarán usando OpenAI Vision
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Modo simulación:</strong> La validación es aleatoria. Configura una API key para usar IA real.
            </AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        <div className="space-y-2 text-sm">
          <p className="text-gray-700">
            Para activar la validación real con IA, necesitas una API key de OpenAI:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-2 text-xs sm:text-sm">
            <li>Visita <strong className="break-all">platform.openai.com/api-keys</strong></li>
            <li>Crea una cuenta o inicia sesión</li>
            <li>Genera una nueva API key</li>
            <li>Pégala aquí abajo</li>
          </ol>
          <Button
            variant="link"
            size="sm"
            className="px-0 h-auto text-[#3B82F6] hover:text-[#2563EB] text-xs sm:text-sm"
            onClick={() => window.open('https://platform.openai.com/api-keys', '_blank')}
          >
            Abrir OpenAI Platform
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>

        {/* API Key Input */}
        <div className="space-y-2">
          <Label htmlFor="apiKey">OpenAI API Key</Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKeyState(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showApiKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <Button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="bg-[#10B981] hover:bg-[#059669] text-white w-full sm:w-auto"
            >
              Guardar
            </Button>
          </div>
        </div>

        {/* Remove Button */}
        {isConfigured && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemove}
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Eliminar API Key
          </Button>
        )}

        {/* Security Warning */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs text-gray-600">
            <strong>Nota de seguridad:</strong> Esta es una demostración. En producción, 
            NUNCA almacenes API keys en el navegador. Usa un backend seguro para las 
            llamadas a la API.
          </AlertDescription>
        </Alert>

        {/* Cost Info */}
        <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
          <p><strong>Costo aproximado:</strong> ~$0.001-0.002 USD por imagen (modelo gpt-4o-mini)</p>
          <p><strong>Velocidad:</strong> 2-5 segundos por validación</p>
        </div>
      </CardContent>
    </Card>
  );
}
