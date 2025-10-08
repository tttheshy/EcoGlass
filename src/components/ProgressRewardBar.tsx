import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from './ui/card';
import { Trophy, Zap } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface ProgressRewardBarProps {
  userEmail: string;
  onRewardClaimed: (points: number) => void;
}

interface ProgressData {
  progress: number;
  level: number;
  totalCompleted: number;
}

export function ProgressRewardBar({ userEmail, onRewardClaimed }: ProgressRewardBarProps) {
  const [progressData, setProgressData] = useState<ProgressData>({ progress: 0, level: 1, totalCompleted: 0 });
  const [showRewardDialog, setShowRewardDialog] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(`progress_${userEmail}`);
      if (savedProgress) {
        setProgressData(JSON.parse(savedProgress));
      }
    } catch {
      // Ignore error
    }
  }, [userEmail]);

  const calculateRewardPoints = (level: number): number => {
    return 100 + ((level - 1) * 50);
  };

  const incrementProgress = useCallback((amount: number = 20) => {
    setProgressData(prev => {
      const newProgress = prev.progress + amount;
      
      if (newProgress >= 100) {
        const rewardPoints = calculateRewardPoints(prev.level);
        const newLevel = prev.level + 1;
        const newData: ProgressData = {
          progress: 0,
          level: newLevel,
          totalCompleted: prev.totalCompleted + 1
        };
        
        // Guardar en localStorage de forma asíncrona
        setTimeout(() => {
          localStorage.setItem(`progress_${userEmail}`, JSON.stringify(newData));
        }, 0);
        
        toast.success('¡Barra de Bonus Completada! 🎊', {
          description: `Ganaste +${rewardPoints} puntos bonus`,
          duration: 3000
        });
        
        setEarnedPoints(rewardPoints);
        setShowRewardDialog(true);
        onRewardClaimed(rewardPoints);
        
        return newData;
      } else {
        const newData: ProgressData = {
          ...prev,
          progress: newProgress
        };
        
        // Guardar en localStorage de forma asíncrona
        setTimeout(() => {
          localStorage.setItem(`progress_${userEmail}`, JSON.stringify(newData));
        }, 0);
        
        const photosNeeded = Math.ceil((100 - newProgress) / 20);
        if (newProgress > 0) {
          toast.info(`Barra de bonus: ${newProgress}%`, {
            description: `${photosNeeded} ${photosNeeded === 1 ? 'foto más' : 'fotos más'} para completar`,
            duration: 3000
          });
        }
        
        return newData;
      }
    });
  }, [userEmail, onRewardClaimed]);

  useEffect(() => {
    (window as any).incrementProgressReward = incrementProgress;
    return () => {
      delete (window as any).incrementProgressReward;
    };
  }, [incrementProgress]);

  const currentRewardPoints = calculateRewardPoints(progressData.level);
  const uploadsNeeded = Math.ceil((100 - progressData.progress) / 20);

  return (
    <>
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-[#111827]">Barra de Bonus</h3>
                  <p className="text-xs text-gray-600">
                    Nivel {progressData.level}
                    {progressData.totalCompleted > 0 && (
                      <> • {progressData.totalCompleted} {progressData.totalCompleted === 1 ? 'completada' : 'completadas'}</>
                    )}
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs text-gray-600">Próxima recompensa</p>
                <p className="text-xl text-amber-600">+{currentRewardPoints} pts</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{progressData.progress}%</span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {uploadsNeeded} {uploadsNeeded === 1 ? 'foto' : 'fotos'} más
                </span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-amber-200 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progressData.progress}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-2xl">
              ¡Barra Completada! 🎊
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg">
              Has llenado la barra de progreso completamente
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 space-y-3">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Bonus ganado</p>
              <p className="text-5xl text-amber-600 mb-2">+{earnedPoints}</p>
              <p className="text-sm text-gray-600">puntos bonus</p>
            </div>
            
            <div className="pt-4 border-t border-amber-200">
              <p className="text-xs text-gray-600 text-center">
                Ahora estás en el Nivel {progressData.level}
              </p>
              <p className="text-xs text-gray-500 text-center mt-1">
                Próxima recompensa: +{calculateRewardPoints(progressData.level)} puntos
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogAction 
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              onClick={() => setShowRewardDialog(false)}
            >
              ¡Genial!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
