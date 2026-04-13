[← Volver al inicio](../README.md)

# Implementación técnica

## Tecnologías utilizadas

- **React Native + Expo** con TypeScript como lenguaje principal
- **expo-audio** para la grabación y reproducción de audio
- **AsyncStorage** para la persistencia de datos entre sesiones
- **Animated API** de React Native para las animaciones propias
- **react-native-safe-area-context** para el manejo de áreas seguras

## Estructura del proyecto

```
PGL-SoundRecorder/
├── App.tsx                          # Pantalla principal y composición de hooks
├── index.tsx                        # Punto de entrada con SafeAreaProvider
├── components/
│   ├── AudioItem.tsx                # Elemento individual de grabación en lista
│   ├── Loader.tsx                   # Componente de carga animado propio
│   ├── NoPermissionScreen.tsx       # Pantalla cuando se deniegan los permisos
│   └── RecordButton.tsx             # Botón de grabación con animación de pulso
├── hooks/
│   ├── useAudioPlayback.ts          # Lógica de reproducción de audio
│   ├── useAudioRecording.ts         # Lógica de grabación y gestión de lista
│   └── usePermissions.ts            # Lógica de permisos de micrófono
├── services/
│   └── storageService.ts            # CRUD genérico con AsyncStorage
├── styles/
│   └── global.ts                    # Tokens de diseño: colores, espaciado, tipografía
├── types/
│   └── audio.types.ts               # Interfaces TypeScript compartidas
└── docs/
├── design.md
└── implementation.md

```

## Tipos compartidos (types/audio.types.ts)

Todas las interfaces del proyecto están centralizadas en un único archivo
para evitar duplicaciones y facilitar el mantenimiento:

- `AudioRecord` — estructura de un audio grabado (id, uri, fecha)
- `AudioItemProps` — props del componente AudioItem
- `RecordButtonProps` — props del componente RecordButton
- `NoPermissionScreenProps` — props del componente NoPermissionScreen

## Tokens de diseño (styles/global.ts)

Se han centralizado todos los valores de diseño en tokens reutilizables:

- `colors` — paleta completa de colores de la aplicación
- `spacing` — escala de espaciado (xs, sm, md, lg, xl, xxl)
- `radius` — valores de border radius (sm, md, lg)
- `typography` — estilos de texto (title, body, small, button, buttonLarge)
- `shadows` — sombras adaptadas por plataforma (iOS shadow / Android elevation)

Ningún componente usa colores ni valores de espaciado hardcodeados.

## Servicio de almacenamiento (services/storageService.ts)

Servicio genérico y reutilizable que gestiona todas las operaciones de
persistencia con AsyncStorage:

| Método            | Descripción                                     |
| ----------------- | ----------------------------------------------- |
| `getAudios()`     | Recupera todas las grabaciones guardadas        |
| `saveAudio(uri)`  | Guarda una nueva grabación con id único y fecha |
| `deleteAudio(id)` | Elimina una grabación por su id                 |
| `clearAudios()`   | Elimina todas las grabaciones                   |

Solo se guarda la URI del fichero de audio en AsyncStorage, no el audio
en sí. Esto significa que los audios persisten entre sesiones normales
pero se perderían si se limpia la caché de la aplicación, tal como
indica la documentación de la actividad.

## Hooks personalizados

La lógica de la aplicación está separada en tres hooks para mantener
App.tsx limpio y cada responsabilidad aislada.

### usePermissions

Gestiona todo el flujo de permisos de micrófono:

- Solicita el permiso al sistema mediante `AudioModule.requestRecordingPermissionsAsync()`
- Expone `permissionGranted` (null mientras no se ha respondido, true o false tras la respuesta)
- Expone `canAskAgain` para saber si el sistema permite volver a preguntar
- Configura el modo de audio con `setAudioModeAsync` cuando el permiso es concedido

### useAudioRecording

Gestiona la grabación de audio y la lista de grabaciones:

- Carga las grabaciones guardadas desde AsyncStorage al iniciar
- Controla el ciclo de grabación con `useAudioRecorder` de expo-audio
- Guarda la URI del audio grabado en AsyncStorage al parar la grabación
- Expone `handleDelete` y `handleClearAll` con callbacks para detener
  la reproducción antes de eliminar

### useAudioPlayback

Gestiona la reproducción de audio:

- Usa `useAudioPlayer` y `useAudioPlayerStatus` de expo-audio
- Controla el estado `playingId` para saber qué audio está activo
- Gestiona la carga asíncrona del audio mediante el flag `shouldPlay`,
  esperando a que `playerStatus.isLoaded` sea true antes de reproducir
- Al cambiar de audio, pausa el actual y espera a que React procese
  el estado antes de cargar el nuevo
- Resetea el estado de reproducción cuando el audio termina

## Gestión de permisos

El flujo completo de permisos es el siguiente:

1. La app arranca y solicita el permiso al sistema
2. El sistema muestra el diálogo nativo al usuario
3. Si acepta: se configura el modo de audio y se muestra la app
4. Si deniega y `canAskAgain` es true: se muestra `NoPermissionScreen`
   con botón para volver a solicitar
5. Si deniega demasiadas veces: `canAskAgain` es false y se muestra
   un botón para abrir los ajustes del dispositivo directamente

## Persistencia entre sesiones

Al montar el componente principal se ejecuta un `useEffect` a través
del hook `useAudioRecording` que recupera los audios de AsyncStorage:

```typescript
useEffect(() => {
  loadAudios();
}, []);
```

Mientras se cargan los datos se muestra el componente `Loader` con el
texto "Cargando grabaciones...".

## Animaciones (Animated API de React Native)

Las animaciones están implementadas con la API `Animated` integrada en
React Native, sin dependencias externas adicionales porque daba error de compatibilidad con la version de expo, y si la desactualizabas para que encajase, todo el resto petaba tambien, asi que decidi usar esta que vi por ahi.

| Componente     | Propiedad animada | Efecto                             |
| -------------- | ----------------- | ---------------------------------- |
| `Loader`       | scale + opacity   | Pulso de entrada y salida en bucle |
| `RecordButton` | scale             | Latido suave mientras se graba     |

Todos los valores animados usan `useRef` con `Animated.Value` y se
controlan con `Animated.loop`, `Animated.sequence`, `Animated.parallel`
y `Animated.timing` con `useNativeDriver: true`.

## Compatibilidad

- **Android:** permisos declarados en `app.json` con
  `android.permission.RECORD_AUDIO` y elevation para sombras
- **iOS:** `NSMicrophoneUsageDescription` en `infoPlist` y shadows nativas
- `newArchEnabled: true` para compatibilidad con Expo Go en Android

[← Volver al inicio](../README.md)
