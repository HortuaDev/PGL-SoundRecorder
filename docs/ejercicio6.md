[← Volver al inicio](../README.md)

# Ejercicio 6 – Animación propia en un elemento de la pantalla

## Enunciado

> Añade una animación propia a algún elemento que tú consideres dentro de la pantalla.

---

## Elemento animado: `RecordButton`

Se ha añadido una animación de **latido (pulse)** al botón de grabación principal. Mientras se está grabando, el botón escala suavemente entre 1 y 1.08 en bucle continuo, reforzando visualmente la sensación de que algo está "vivo" o activo. Al parar la grabación, el botón vuelve suavemente a su escala original.

---

## Implementación (`components/RecordButton.tsx`)

```typescript
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { RecordButtonProps } from "../types/audio.types";
import { colors, radius, typography, shadows } from "../styles/global";

export default function RecordButton({
  isRecording,
  onPress,
}: RecordButtonProps): React.JSX.Element {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.08,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      scale.stopAnimation();
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isRecording]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[styles.button, isRecording && styles.recording]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.text}>
          {isRecording ? "⏹  Parar grabación" : "⏺  Iniciar grabación"}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: radius.lg,
    alignItems: "center",
    marginBottom: 20,
    ...shadows,
  },
  recording: {
    backgroundColor: colors.primaryDark,
  },
  text: {
    color: colors.textPrimary,
    ...typography.buttonLarge,
  },
});
```

---

## Cómo funciona la animación

El `useEffect` observa el cambio en la prop `isRecording`:

- **Cuando empieza a grabar (`isRecording: true`):** se inicia un `Animated.loop` con una `Animated.sequence` que alterna la escala de `1` → `1.08` → `1` cada 500ms, con easing suave.
- **Cuando para la grabación (`isRecording: false`):** se detiene el loop con `scale.stopAnimation()` y se anima suavemente la escala de vuelta a `1` en 200ms para evitar un salto brusco.

El `Animated.View` envuelve al `TouchableOpacity` para que la animación de escala afecte al componente completo (botón incluido, no solo su contenido).

---

## Comparación visual

|                                       Botón en reposo                                        |                              Botón grabando (con pulso)                               |
| :------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------: |
| <img src="../assets/boton-grabacion-iniciar-grabacion.png" width="200" alt="Botón reposo" /> | <img src="../assets/boton-grabacion-grabando.png" width="200" alt="Botón grabando" /> |

---

## Nota sobre la elección de librería

Inicialmente se planteó usar `react-native-reanimated`, pero causaba errores de compatibilidad con la versión de Expo instalada y la Nueva Arquitectura de React Native. Intentar degradar `reanimated` para que encajase rompía otras dependencias del proyecto.

Tras investigar, se optó por la `Animated API` integrada en React Native, que no requiere dependencias externas adicionales, es compatible con la versión actual de Expo y cumple exactamente el mismo propósito para las animaciones requeridas en esta práctica.

---

[← Volver al inicio](../README.md)
