/**
 * Servicio de Validación de Imágenes con IA
 * 
 * Este servicio utiliza la API de OpenAI Vision (GPT-4 Vision) para validar
 * que las imágenes subidas contengan vidrio reciclable.
 * 
 * CONFIGURACIÓN:
 * 1. Obtén una API key de OpenAI en: https://platform.openai.com/api-keys
 * 2. Guarda tu API key en localStorage usando:
 *    localStorage.setItem('openai_api_key', 'tu-api-key-aqui')
 * 
 * IMPORTANTE: Esta es una demostración. En producción:
 * - NUNCA expongas tu API key en el frontend
 * - Usa un backend para hacer las llamadas a la API
 * - Implementa rate limiting y validaciones adicionales
 */

export interface ValidationResult {
  isValid: boolean;
  confidence: number; // 0-100
  detectedItems: string[];
  message: string;
  requiresApiKey?: boolean;
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Valida si una imagen contiene vidrio reciclable usando IA
 */
export async function validateGlassImage(imageBase64: string): Promise<ValidationResult> {
  const apiKey = localStorage.getItem('openai_api_key');

  // Modo simulación (sin API key)
  if (!apiKey || apiKey.trim() === '') {
    // Simular un pequeño delay para parecer más realista
    await new Promise(resolve => setTimeout(resolve, 300));
    return simulateValidation();
  }

  try {
    // Validar que la imagen no sea demasiado grande
    // La compresión automática debería evitar esto, pero validamos por seguridad
    if (imageBase64.length > 3500000) { // ~2.5MB en base64 (después de compresión)
      return {
        isValid: false,
        confidence: 0,
        detectedItems: [],
        message: 'La imagen es demasiado grande incluso después de optimización. Intenta con otra foto.',
      };
    }

    // Crear AbortController para timeout (más tiempo en móviles)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos timeout para móviles

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analiza esta imagen y determina si contiene vidrio reciclable (botellas de vidrio, frascos, envases de vidrio, etc.).

Responde SOLO con un objeto JSON en este formato exacto:
{
  "isValid": true o false,
  "confidence": número entre 0 y 100,
  "detectedItems": ["item1", "item2"],
  "message": "descripción breve"
}

Criterios:
- isValid: true solo si hay vidrio claramente visible y reciclable
- confidence: tu nivel de confianza en la detección
- detectedItems: lista de objetos de vidrio detectados (en español)
- message: descripción corta de lo que ves (en español, max 50 palabras)

IMPORTANTE: Responde ÚNICAMENTE con el JSON, sin texto adicional.`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64,
                  detail: 'low', // Usar 'low' para reducir costos y mejorar velocidad
                },
              },
            ],
          },
        ],
        max_tokens: 300,
        temperature: 0.3,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('API key inválida. Verifica tu configuración.');
      }
      if (response.status === 429) {
        throw new Error('Límite de uso excedido. Intenta más tarde.');
      }
      throw new Error(`Error en la API: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Respuesta vacía de la API');
    }

    // Extraer JSON de la respuesta (por si hay texto adicional)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Formato de respuesta inválido');
    }

    const result = JSON.parse(jsonMatch[0]);

    return {
      isValid: result.isValid === true,
      confidence: Math.min(100, Math.max(0, result.confidence || 0)),
      detectedItems: Array.isArray(result.detectedItems) ? result.detectedItems : [],
      message: result.message || 'Análisis completado',
    };

  } catch (error) {
    console.error('Error validating image:', error);
    
    // Mensaje específico para timeout y otros errores
    let errorMessage = 'Error al validar la imagen';
    let shouldRetry = false;
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'La validación tardó demasiado. La imagen se optimizó, pero tu conexión puede ser lenta.';
        shouldRetry = true;
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Error de conexión. Verifica tu internet e intenta nuevamente.';
        shouldRetry = true;
      } else {
        errorMessage = error.message;
      }
    }
    
    // Si hay error, retornar resultado de simulación con mensaje de error
    return {
      isValid: false,
      confidence: 0,
      detectedItems: [],
      message: errorMessage + (shouldRetry ? ' (Modo simulación activado)' : ''),
      requiresApiKey: true,
    };
  }
}

/**
 * Simulación de validación (cuando no hay API key)
 * Retorna un resultado aleatorio para demostración
 */
function simulateValidation(): ValidationResult {
  // En modo demo, aceptamos el 70% de las imágenes
  const isValid = Math.random() > 0.3;
  
  if (isValid) {
    const glassItems = [
      ['botellas de vidrio'],
      ['frascos de vidrio'],
      ['botellas de vidrio', 'envases'],
      ['envases de vidrio', 'botellas'],
      ['botellas de cerveza', 'frascos'],
    ];
    
    const randomItems = glassItems[Math.floor(Math.random() * glassItems.length)];
    
    return {
      isValid: true,
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100
      detectedItems: randomItems,
      message: `Se detectaron ${randomItems.join(', ')} en la imagen.`,
      requiresApiKey: true,
    };
  } else {
    const reasons = [
      'No se detectó vidrio reciclable en la imagen.',
      'La imagen no muestra claramente objetos de vidrio.',
      'Se detectaron otros materiales pero no vidrio.',
    ];
    
    return {
      isValid: false,
      confidence: Math.floor(Math.random() * 40) + 30, // 30-70
      detectedItems: [],
      message: reasons[Math.floor(Math.random() * reasons.length)],
      requiresApiKey: true,
    };
  }
}

/**
 * Comprueba si hay una API key configurada
 */
export function hasApiKey(): boolean {
  const apiKey = localStorage.getItem('openai_api_key');
  return !!(apiKey && apiKey.trim() !== '');
}

/**
 * Guarda la API key en localStorage
 */
export function setApiKey(apiKey: string): void {
  if (apiKey && apiKey.trim() !== '') {
    localStorage.setItem('openai_api_key', apiKey.trim());
  } else {
    localStorage.removeItem('openai_api_key');
  }
}

/**
 * Elimina la API key de localStorage
 */
export function clearApiKey(): void {
  localStorage.removeItem('openai_api_key');
}
