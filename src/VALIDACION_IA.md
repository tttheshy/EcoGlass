# 🤖 Validación de Imágenes con IA - EcoGlass

## ✨ ¿Qué es esto?

EcoGlass ahora incluye un sistema de validación inteligente que usa **OpenAI Vision (GPT-4o-mini)** para verificar automáticamente que las fotos subidas contengan vidrio reciclable real.

## 🎯 Características

- ✅ **Detección automática** de botellas, frascos y envases de vidrio
- 🎨 **Feedback visual** con nivel de confianza y objetos detectados
- 🔒 **Prevención de fraude** - rechaza imágenes sin vidrio (cuando está configurada la API)
- 💰 **Modo simulación** - funciona sin API key para pruebas
- ⚡ **Rápido** - validación en 2-5 segundos

## 🚀 Cómo Configurar la Validación con IA Real

### Paso 1: Obtener API Key de OpenAI

1. Visita [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Crea una cuenta o inicia sesión
3. Haz clic en **"Create new secret key"**
4. Copia tu API key (comienza con `sk-...`)

### Paso 2: Configurar en EcoGlass

1. Inicia sesión en tu cuenta de EcoGlass
2. Ve a la pestaña **"Config IA"** en el dashboard
3. Pega tu API key en el campo correspondiente
4. Haz clic en **"Guardar"**

¡Listo! Ahora todas las imágenes se validarán automáticamente con IA real.

## 💡 Cómo Funciona

### Sin API Key (Modo Simulación)
- La validación es **aleatoria** (~70% aceptación)
- Útil para pruebas y desarrollo
- Muestra un mensaje indicando que es simulación

### Con API Key (IA Real)
1. Usuario selecciona/toma una foto
2. La imagen se envía a OpenAI Vision automáticamente
3. La IA analiza la imagen y detecta:
   - ✅ Si hay vidrio reciclable
   - 📊 Nivel de confianza (0-100%)
   - 🏷️ Objetos específicos detectados
4. Muestra resultado visual con feedback
5. Solo permite subir si la validación es exitosa

## 💰 Costos

- **Modelo usado:** gpt-4o-mini (el más económico)
- **Costo por imagen:** ~$0.001-0.002 USD
- **Configuración:** Resolución baja para optimizar costos
- **Ejemplo:** 1000 validaciones = ~$1-2 USD

## 🔒 Seguridad

### ⚠️ IMPORTANTE - Solo para Demostración

Esta implementación almacena la API key en `localStorage` del navegador, lo cual **NO es seguro para producción**.

### Para Producción Real:

```
❌ NUNCA expongas API keys en el frontend
✅ Usa un backend (Node.js, Python, etc.)
✅ Implementa rate limiting
✅ Valida usuarios antes de procesar
✅ Encripta las credenciales
```

### Arquitectura Recomendada:

```
Frontend → Backend API → OpenAI
  (UI)    (Node.js/Python)  (Vision API)
           ↓
         - Valida usuario
         - Rate limiting
         - Guarda API key segura
         - Procesa imagen
         - Retorna resultado
```

## 📊 Ejemplos de Validación

### ✅ Imágenes Aceptadas
- Botellas de vidrio (vino, cerveza, refrescos)
- Frascos de vidrio (mermelada, conservas)
- Envases de vidrio
- Cristalería reciclable

### ❌ Imágenes Rechazadas
- Plástico, metal, papel
- Imágenes sin objetos reciclables
- Fotos borrosas o poco claras
- Imágenes de vidrio roto peligroso

## 🛠️ Funciones Técnicas

### `validateGlassImage(imageBase64: string)`
Valida una imagen codificada en base64.

**Retorna:**
```typescript
{
  isValid: boolean,        // ¿Contiene vidrio?
  confidence: number,      // 0-100
  detectedItems: string[], // ["botellas", "frascos"]
  message: string,         // Descripción
  requiresApiKey?: boolean // True si es simulación
}
```

### `hasApiKey()`
Verifica si hay una API key configurada.

### `setApiKey(apiKey: string)`
Guarda una API key en localStorage.

### `clearApiKey()`
Elimina la API key.

## 🎨 Interfaz de Usuario

### Estados Visuales

1. **Seleccionando imagen** - Botones de cámara/galería
2. **Validando** - Spinner con "Validando con IA..."
3. **Validación exitosa** - ✅ Banner verde con detalles
4. **Validación fallida** - ⚠️ Banner amarillo/rojo
5. **Subiendo** - "Procesando..." después de confirmar

### Feedback al Usuario

- 🎉 **Toast de éxito** cuando se valida correctamente
- ⚠️ **Toast de advertencia** cuando falla la validación
- 📊 **Nivel de confianza** mostrado en el resultado
- 🏷️ **Objetos detectados** listados claramente

## 🔧 Personalización

### Cambiar el Modelo de IA

En `/services/imageValidationService.ts`:

```typescript
// Cambiar 'gpt-4o-mini' por 'gpt-4o' para más precisión (más caro)
model: 'gpt-4o-mini'
```

### Ajustar Sensibilidad

Modificar el prompt en el servicio para ser más o menos estricto:

```typescript
text: `Analiza esta imagen...
      - isValid: true solo si hay vidrio CLARAMENTE visible...`
```

### Cambiar Límite de Tamaño

```typescript
if (file.size > 5 * 1024 * 1024) { // 5MB
  // Cambiar a 10MB: 10 * 1024 * 1024
}
```

## 🐛 Resolución de Problemas

### "API key inválida"
- Verifica que comience con `sk-`
- Genera una nueva en OpenAI Platform
- Asegúrate de tener créditos en tu cuenta

### "Límite de uso excedido"
- Has alcanzado el límite de tu cuenta
- Espera o agrega créditos en OpenAI

### "Error al validar la imagen"
- Verifica tu conexión a internet
- Reduce el tamaño de la imagen
- Intenta con otra imagen

### Validación muy lenta
- Usa imágenes más pequeñas (< 2MB)
- Verifica tu conexión
- El modelo 'gpt-4o-mini' es más rápido que 'gpt-4o'

## 📱 Compatibilidad

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Móvil (iOS Safari, Chrome Android)
- ✅ Cámara nativa en móviles
- ✅ Drag & drop en desktop

## 🌟 Próximas Mejoras

- [ ] Backend real con Node.js/Express
- [ ] Base de datos para guardar validaciones
- [ ] Dashboard de administrador
- [ ] Estadísticas de validación
- [ ] ML model local (TensorFlow.js)
- [ ] Validación offline

## 📞 Soporte

¿Problemas? Revisa:
1. Consola del navegador (F12)
2. Logs en la pestaña Network
3. Documentación de OpenAI
4. Este archivo de ayuda

---

**Desarrollado para EcoGlass** 🌱♻️
