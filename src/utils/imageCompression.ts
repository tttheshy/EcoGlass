/**
 * Utilidades para compresión de imágenes
 * Especialmente útil para imágenes capturadas desde cámaras móviles
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1
  maxSizeMB?: number;
}

/**
 * Comprime una imagen base64 a un tamaño manejable
 * @param base64Image - Imagen en formato base64
 * @param options - Opciones de compresión
 * @returns Promise con la imagen comprimida en base64
 */
export async function compressImage(
  base64Image: string,
  options: CompressionOptions = {}
): Promise<string> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.85,
    maxSizeMB = 1.5,
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      try {
        // Calcular dimensiones manteniendo aspecto
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          
          if (width > height) {
            width = maxWidth;
            height = width / aspectRatio;
          } else {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }

        // Crear canvas para redimensionar
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo crear el contexto del canvas'));
          return;
        }

        // Configurar mejor calidad de redimensionamiento
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a base64
        let compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        
        // Si aún es muy grande, reducir calidad progresivamente
        let currentQuality = quality;
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        
        while (compressedBase64.length > maxSizeBytes && currentQuality > 0.3) {
          currentQuality -= 0.1;
          compressedBase64 = canvas.toDataURL('image/jpeg', currentQuality);
        }

        resolve(compressedBase64);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Error al cargar la imagen'));
    };

    img.src = base64Image;
  });
}

/**
 * Obtiene el tamaño de una imagen base64 en MB
 */
export function getBase64SizeMB(base64String: string): number {
  const sizeInBytes = (base64String.length * 3) / 4;
  return sizeInBytes / (1024 * 1024);
}

/**
 * Verifica si una imagen necesita compresión
 */
export function needsCompression(base64String: string, maxSizeMB: number = 1.5): boolean {
  return getBase64SizeMB(base64String) > maxSizeMB;
}
