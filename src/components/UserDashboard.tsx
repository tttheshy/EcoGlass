import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { User, Upload } from '../App';
import { Camera, Upload as UploadIcon, Award, Trash2, Gift, Image, Loader2, CheckCircle2, XCircle, Settings } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { RewardsStore } from './RewardsStore';
import { ProgressRewardBar } from './ProgressRewardBar';
import { ApiKeySettings } from './ApiKeySettings';
import { validateGlassImage, hasApiKey, type ValidationResult } from '../services/imageValidationService';
import { compressImage, getBase64SizeMB, needsCompression } from '../utils/imageCompression';

interface UserDashboardProps {
  user: User;
  onUpdatePoints: (newPoints: number) => void;
}

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

export function UserDashboard({ user, onUpdatePoints }: UserDashboardProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Cargar uploads al montar
  useEffect(() => {
    try {
      const savedUploads = localStorage.getItem(`uploads_${user.email}`);
      if (savedUploads) {
        setUploads(JSON.parse(savedUploads));
      }
    } catch (error) {
      console.error('Error loading uploads:', error);
    }
  }, [user.email]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona una imagen válida', { duration: 3000 });
        return;
      }

      // Mostrar toast de procesamiento para imágenes grandes
      const isLargeFile = file.size > 2 * 1024 * 1024;
      if (isLargeFile) {
        toast.info('📸 Optimizando imagen...', { duration: 2000 });
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          let imageData = event.target?.result as string;
          
          // Comprimir imagen si es necesaria (especialmente para fotos de cámara móvil)
          if (needsCompression(imageData, 1.5)) {
            const originalSize = getBase64SizeMB(imageData);
            console.log(`Comprimiendo imagen desde ${originalSize.toFixed(2)}MB...`);
            
            try {
              imageData = await compressImage(imageData, {
                maxWidth: 1200,
                maxHeight: 1200,
                quality: 0.85,
                maxSizeMB: 1.5,
              });
              
              const newSize = getBase64SizeMB(imageData);
              console.log(`Imagen comprimida a ${newSize.toFixed(2)}MB`);
              
              if (isLargeFile) {
                toast.success('✅ Imagen optimizada', { duration: 2000 });
              }
            } catch (compressionError) {
              console.error('Error compressing image:', compressionError);
              toast.warning('No se pudo optimizar la imagen, usando original', { duration: 2000 });
            }
          }

          setSelectedImage(imageData);
          setValidationResult(null);
          
          // Validar imagen automáticamente
          setIsValidating(true);
          
          // Ejecutar validación de forma asíncrona
          validateGlassImage(imageData)
            .then(result => {
              setValidationResult(result);
              
              if (result.isValid) {
                toast.success('✅ Imagen validada', {
                  description: result.message,
                  duration: 3000,
                });
              } else {
                toast.warning('⚠️ Validación fallida', {
                  description: result.message,
                  duration: 3000,
                });
              }
            })
            .catch(error => {
              console.error('Error validating image:', error);
              toast.error('Error al validar la imagen', { duration: 3000 });
              setValidationResult({
                isValid: false,
                confidence: 0,
                detectedItems: [],
                message: 'Error al validar',
                requiresApiKey: true,
              });
            })
            .finally(() => {
              setIsValidating(false);
            });
        } catch (error) {
          console.error('Error processing image:', error);
          toast.error('Error al procesar la imagen', { duration: 3000 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmUpload = () => {
    if (!selectedImage) {
      toast.error('Primero selecciona una imagen', {
        duration: 3000
      });
      return;
    }

    // Validar que la imagen haya sido verificada
    if (!validationResult) {
      toast.error('Espera a que se valide la imagen', {
        duration: 3000
      });
      return;
    }

    // Si la validación con IA real falló, no permitir subida
    if (!validationResult.isValid && !validationResult.requiresApiKey) {
      toast.error('Esta imagen no contiene vidrio reciclable', {
        description: validationResult.message,
        duration: 4000
      });
      return;
    }

    setIsUploading(true);

    const pointsEarned = 50;
    const newUpload: Upload = {
      id: Date.now().toString(),
      imageData: selectedImage,
      date: new Date().toISOString(),
      points: pointsEarned
    };

    const updatedUploads = [newUpload, ...uploads];
    setUploads(updatedUploads);
    
    const newPoints = user.points + pointsEarned;
    onUpdatePoints(newPoints);

    try {
      localStorage.setItem(`uploads_${user.email}`, JSON.stringify(updatedUploads));
    } catch (error) {
      console.error('Error saving uploads:', error);
    }

    // Incrementar progreso de la barra de recompensa
    if ((window as any).incrementProgressReward) {
      (window as any).incrementProgressReward(20);
    }

    toast.success(`¡Felicitaciones! Ganaste ${pointsEarned} puntos 🎉`, {
      description: 'Tu foto ha sido registrada correctamente',
      duration: 3000
    });
    
    // Limpiar imagen seleccionada y AMBOS inputs
    setSelectedImage(null);
    setValidationResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
    
    setIsUploading(false);
  };

  const handleDeleteUpload = (uploadId: string) => {
    const uploadToDelete = uploads.find(u => u.id === uploadId);
    if (!uploadToDelete) {
      toast.error('No se pudo encontrar el upload', {
        duration: 3000
      });
      return;
    }

    const updatedUploads = uploads.filter(u => u.id !== uploadId);
    setUploads(updatedUploads);
    localStorage.setItem(`uploads_${user.email}`, JSON.stringify(updatedUploads));

    const newPoints = Math.max(0, user.points - uploadToDelete.points);
    onUpdatePoints(newPoints);

    toast.info('Foto eliminada', {
      description: `Se restaron ${uploadToDelete.points} puntos de tu cuenta`,
      duration: 3000
    });
  };

  const handleRewardRedeem = (reward: Reward) => {
    const newPoints = user.points - reward.points;
    onUpdatePoints(newPoints);

    // Guardar recompensa canjeada
    const redeemedRewards = JSON.parse(localStorage.getItem(`redeemed_${user.email}`) || '[]');
    redeemedRewards.push({
      ...reward,
      redeemedAt: new Date().toISOString(),
      code: `ECOG-${Date.now().toString(36).toUpperCase()}`
    });
    localStorage.setItem(`redeemed_${user.email}`, JSON.stringify(redeemedRewards));
  };

  const handleProgressReward = (bonusPoints: number) => {
    const newPoints = user.points + bonusPoints;
    onUpdatePoints(newPoints);
  };

  return (
    <section className="py-12 min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl text-[#111827] mb-2">
            ¡Hola, {user.name}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Continúa reciclando y ganando puntos
          </p>
        </div>

        {/* Progress Reward Bar */}
        <div className="mb-8">
          <ProgressRewardBar 
            userEmail={user.email}
            onRewardClaimed={handleProgressReward}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upload" className="space-y-8">
          <TabsList className="grid w-full max-w-2xl grid-cols-2 sm:grid-cols-4 mx-auto">
            <TabsTrigger value="upload" className="flex items-center gap-1 sm:gap-2">
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Subir Foto</span>
              <span className="sm:hidden">Subir</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-1 sm:gap-2">
              <Gift className="w-4 h-4" />
              <span className="hidden sm:inline">Recompensas</span>
              <span className="sm:hidden">Premios</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-1 sm:gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Mi Galería</span>
              <span className="sm:hidden">Galería</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1 sm:gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Config IA</span>
              <span className="sm:hidden">IA</span>
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Upload Section */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5 text-[#10B981]" />
                      Subir Nueva Foto de Reciclaje
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Preview or Upload Area */}
                      {selectedImage ? (
                        <div className="border-2 border-[#10B981] rounded-xl p-4 bg-gray-50">
                          <div className="space-y-4">
                            <div className="relative">
                              <img
                                src={selectedImage}
                                alt="Preview"
                                className="max-h-64 mx-auto rounded-lg"
                              />
                              {isValidating && (
                                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                  <div className="bg-white rounded-lg p-3 sm:p-4 flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin text-[#10B981]" />
                                    <span className="text-xs sm:text-sm">
                                      <span className="hidden sm:inline">Validando con IA...</span>
                                      <span className="sm:hidden">Validando...</span>
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Validation Result */}
                            {validationResult && !isValidating && (
                              <Alert className={validationResult.isValid ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}>
                                {validationResult.isValid ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-amber-600" />
                                )}
                                <AlertDescription className={validationResult.isValid ? 'text-green-800' : 'text-amber-800'}>
                                  <div className="space-y-1">
                                    <p className="text-sm">
                                      <strong>{validationResult.isValid ? '✅ Validación exitosa' : '⚠️ Advertencia'}</strong>
                                    </p>
                                    <p className="text-xs">{validationResult.message}</p>
                                    {validationResult.detectedItems.length > 0 && (
                                      <p className="text-xs">
                                        <strong>Detectado:</strong> {validationResult.detectedItems.join(', ')}
                                      </p>
                                    )}
                                    {validationResult.requiresApiKey && (
                                      <p className="text-xs opacity-70">
                                        (Modo simulación - configura API key para IA real)
                                      </p>
                                    )}
                                    <p className="text-xs opacity-70">
                                      Confianza: {validationResult.confidence}%
                                    </p>
                                  </div>
                                </AlertDescription>
                              </Alert>
                            )}

                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedImage(null);
                                  setValidationResult(null);
                                  cameraInputRef.current?.click();
                                }}
                                disabled={isUploading || isValidating}
                                className="flex-1"
                              >
                                <Camera className="w-4 h-4 mr-2" />
                                Tomar Otra
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedImage(null);
                                  setValidationResult(null);
                                  fileInputRef.current?.click();
                                }}
                                disabled={isUploading || isValidating}
                                className="flex-1"
                              >
                                <Image className="w-4 h-4 mr-2" />
                                Cambiar
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Action Buttons for Mobile & Desktop */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Button
                              variant="outline"
                              size="lg"
                              onClick={() => cameraInputRef.current?.click()}
                              disabled={isUploading}
                              className="h-auto py-6 flex flex-col gap-2 border-2 hover:border-[#10B981] hover:bg-[#10B981]/5"
                            >
                              <Camera className="w-8 h-8 text-[#10B981]" />
                              <div>
                                <p className="text-[#111827]">Tomar Foto</p>
                                <p className="text-xs text-gray-500">Usa tu cámara</p>
                              </div>
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="lg"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isUploading}
                              className="h-auto py-6 flex flex-col gap-2 border-2 hover:border-[#10B981] hover:bg-[#10B981]/5"
                            >
                              <Image className="w-8 h-8 text-[#10B981]" />
                              <div>
                                <p className="text-[#111827]">Seleccionar Imagen</p>
                                <p className="text-xs text-gray-500">Desde tu galería</p>
                              </div>
                            </Button>
                          </div>

                          {/* Drag & Drop Zone - Desktop Only */}
                          <div
                            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#10B981] transition-colors cursor-pointer hidden sm:block"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <UploadIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-1">O arrastra y suelta una imagen aquí</p>
                            <p className="text-xs text-gray-500">PNG, JPG, WEBP hasta 2MB</p>
                          </div>
                        </>
                      )}

                      {/* Hidden File Inputs */}
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        capture="environment"
                        onChange={handleImageSelect}
                        className="hidden"
                        aria-label="Tomar foto con cámara"
                      />
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageSelect}
                        className="hidden"
                        aria-label="Seleccionar imagen de galería"
                      />

                      {/* Confirm Upload Button */}
                      {selectedImage && (
                        <Button
                          onClick={handleConfirmUpload}
                          disabled={isUploading || isValidating || !validationResult}
                          className="w-full bg-[#10B981] hover:bg-[#059669] text-white disabled:opacity-50"
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Procesando...
                            </>
                          ) : isValidating ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Validando...
                            </>
                          ) : (
                            <>
                              <Award className="w-4 h-4 mr-2" />
                              Confirmar y Ganar 50 Puntos
                            </>
                          )}
                        </Button>
                      )}

                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 text-center">
                          📸 Asegúrate de que la foto muestre claramente el reciclaje de vidrio
                        </p>
                        <p className="text-xs text-gray-400 text-center">
                          💡 Las fotos grandes se optimizan automáticamente
                        </p>
                        {!hasApiKey() && (
                          <p className="text-xs text-amber-600 text-center">
                            🔑 Configura una API key en "Config IA" para validación real con IA
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Points Card */}
              <div className="lg:col-span-1">
                <Card className="bg-gradient-to-br from-[#10B981] to-[#059669] text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Award className="w-5 h-5" />
                      Tus Puntos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-5xl mb-2">{user.points}</p>
                      <p className="text-white/80 text-sm">puntos acumulados</p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/20">
                      <p className="text-sm text-white/80 mb-2">Total de reciclajes:</p>
                      <p className="text-2xl">{uploads.length}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards">
            <RewardsStore 
              userPoints={user.points}
              onRedeem={handleRewardRedeem}
            />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="max-w-2xl mx-auto">
              <ApiKeySettings />
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            {uploads.length > 0 ? (
              <div>
                <h2 className="text-2xl text-[#111827] mb-6">
                  Tu Galería de Reciclajes
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {uploads.map((upload) => (
                    <Card key={upload.id} className="overflow-hidden group relative">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={upload.imageData}
                          alt="Reciclaje"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600">
                              {new Date(upload.date).toLocaleDateString('es-ES')}
                            </p>
                            <p className="text-[#10B981]">+{upload.points} puntos</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteUpload(upload.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card className="p-12">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl text-[#111827] mb-2">
                    Aún no has subido fotos
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Comienza a ganar puntos subiendo fotos de tus reciclajes de vidrio
                  </p>
                  <Button
                    onClick={() => {
                      const tabButton = document.querySelector('[value="upload"]') as HTMLElement;
                      tabButton?.click();
                    }}
                    className="bg-[#10B981] hover:bg-[#059669] text-white"
                  >
                    Subir Primera Foto
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}