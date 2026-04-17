[← Volver al inicio](../README.md)

# Ejercicio 2 – Implementación de la aplicación

## Enunciado

> Crea una aplicación que muestre por pantalla dicho diseño.

---

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
    ├── ejercicio1.md
    ├── ejercicio2.md
    ├── ejercicio3.md
    ├── ejercicio4.md
    ├── ejercicio5.md
    └── ejercicio6.md
```

---

## Tecnologías utilizadas

| Tecnología                       | Uso                                  |
| -------------------------------- | ------------------------------------ |
| React Native + Expo (TypeScript) | Framework principal                  |
| `expo-audio`                     | Grabación y reproducción de audio    |
| `AsyncStorage`                   | Persistencia de datos entre sesiones |
| `Animated API` de React Native   | Animaciones propias                  |
| `react-native-safe-area-context` | Manejo de áreas seguras en pantalla  |

---

## Punto de entrada (`index.tsx`)

El punto de entrada de la aplicación envuelve todo en un `SafeAreaProvider` para garantizar que el contenido respete las zonas seguras del dispositivo en iOS y Android.

```typescript
import { registerRootComponent } from "expo";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";
import App from "./App";

function Root(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
}

registerRootComponent(Root);
```

---

## Pantalla principal (`App.tsx`)

`App.tsx` es el componente raíz de la aplicación. Compone los tres hooks personalizados (`usePermissions`, `useAudioRecording`, `useAudioPlayback`) y renderiza la interfaz en función del estado actual.

```typescript
import React, { useEffect } from "react";
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AudioItem from "./components/AudioItem";
import Loader from "./components/Loader";
import NoPermissionScreen from "./components/NoPermissionScreen";
import RecordButton from "./components/RecordButton";
import { usePermissions } from "./hooks/usePermissions";
import { useAudioRecording } from "./hooks/useAudioRecording";
import { useAudioPlayback } from "./hooks/useAudioPlayback";
import { colors, spacing, typography } from "./styles/global";

export default function App(): React.JSX.Element {
  const { permissionGranted, canAskAgain, requestPermission } =
    usePermissions();
  const {
    audios,
    loading,
    isRecording,
    durationMillis,
    loadAudios,
    handleRecordToggle,
    handleDelete,
    handleClearAll,
  } = useAudioRecording();
  const { playingId, handlePlay, stopPlayback } = useAudioPlayback();

  useEffect(() => {
    loadAudios();
  }, []);

  useEffect(() => {
    requestPermission();
  }, []);

  if (loading || permissionGranted === null) {
    return (
      <SafeAreaView style={styles.centered}>
        <Loader />
        <Text style={styles.loadingText}>
          {loading ? "Cargando grabaciones..." : "Solicitando permisos..."}
        </Text>
      </SafeAreaView>
    );
  }

  if (permissionGranted === false) {
    return (
      <NoPermissionScreen
        canAskAgain={canAskAgain}
        onRetry={requestPermission}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <Text style={styles.title}>Grabadora de Audio</Text>

      <RecordButton isRecording={isRecording} onPress={handleRecordToggle} />

      {isRecording && (
        <View style={styles.recordingIndicator}>
          <Loader />
          <Text style={styles.recordingText}>
            Grabando... {Math.round(durationMillis / 1000)}s
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Grabaciones guardadas ({audios.length})
      </Text>

      <FlatList
        data={audios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AudioItem
            audio={item}
            isPlaying={playingId === item.id}
            isDisabled={playingId !== null && playingId !== item.id}
            onPlay={(uri) => handlePlay(item.id, uri)}
            onDelete={(id) =>
              handleDelete(id, () => {
                if (playingId === id) stopPlayback();
              })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No hay grabaciones aún.{"\n"}Pulsa el botón para empezar.
          </Text>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {audios.length > 0 && (
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={() => handleClearAll(stopPlayback)}
          activeOpacity={0.8}
        >
          <Text style={styles.clearText}>Eliminar todas las grabaciones</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
```

---

## Tipos compartidos (`types/audio.types.ts`)

Todas las interfaces están centralizadas en un único archivo para evitar duplicaciones:

```typescript
export interface AudioRecord {
  id: string;
  uri: string;
  date: string;
}

export interface AudioItemProps {
  audio: AudioRecord;
  isPlaying: boolean;
  isDisabled: boolean;
  onPlay: (uri: string) => void;
  onDelete: (id: string) => void;
}

export interface RecordButtonProps {
  isRecording: boolean;
  onPress: () => void;
}

export interface NoPermissionScreenProps {
  canAskAgain: boolean;
  onRetry: () => void;
}
```

---

## Tokens de diseño (`styles/global.ts`)

Todos los valores de diseño están centralizados en tokens reutilizables. Ningún componente usa colores ni valores de espaciado hardcodeados.

```typescript
import { Platform } from "react-native";

export const colors = {
  background: "#1a1a2e",
  surface: "#16213e",
  surfaceActive: "#1a2e1a",
  primary: "#e74c3c",
  primaryDark: "#c0392b",
  primaryShadow: "#e74c3c",
  success: "#2ecc71",
  info: "#2980b9",
  danger: "#922b21",
  disabled: "#555",
  textPrimary: "#ffffff",
  textSecondary: "#aaa",
  textDisabled: "#999",
  textDanger: "#e74c3c",
  borderDefault: "#e74c3c",
  borderActive: "#2ecc71",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 50,
};

export const typography = {
  title: {
    fontSize: 26,
    fontWeight: "bold" as const,
    letterSpacing: 1,
  },
  body: { fontSize: 14 },
  small: { fontSize: 12 },
  button: {
    fontSize: 13,
    fontWeight: "bold" as const,
  },
  buttonLarge: {
    fontSize: 18,
    fontWeight: "bold" as const,
    letterSpacing: 0.5,
  },
};

export const shadows = Platform.select({
  ios: {
    shadowColor: colors.primaryShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  android: {
    elevation: 6,
  },
  default: {},
});
```

---

## Componente `AudioItem`

Representa cada grabación en la lista. Recibe el audio, el estado de reproducción y los callbacks de acción.

```typescript
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AudioItemProps } from "../types/audio.types";
import { colors, spacing, radius, typography } from "../styles/global";

export default function AudioItem({
  audio,
  isPlaying,
  isDisabled,
  onPlay,
  onDelete,
}: AudioItemProps): React.JSX.Element {
  return (
    <View
      style={[
        styles.container,
        isPlaying && styles.playing,
        isDisabled && styles.disabled,
      ]}
    >
      <Text style={styles.date}>{audio.date}</Text>
      {isPlaying && <Text style={styles.playingLabel}>▶ Reproduciendo...</Text>}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.playBtn,
            isPlaying && styles.playBtnActive,
            isDisabled && styles.playBtnDisabled,
          ]}
          onPress={() => onPlay(audio.uri)}
          disabled={isDisabled}
          activeOpacity={0.8}
        >
          <Text style={[styles.playText, isDisabled && styles.textDisabled]}>
            {isPlaying ? "↺ Repetir" : "▶ Reproducir"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => onDelete(audio.id)}
        >
          <Text style={styles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
```

**Lógica de estilos condicionales:**

- `isPlaying` aplica `styles.playing` (borde verde, fondo `surfaceActive`) y muestra el label `"▶ Reproduciendo..."`
- `isDisabled` aplica `styles.disabled` (opacidad 0.45) y deshabilita el botón de reproducir
- El botón de reproducir cambia de color y texto según `isPlaying`

---

## Componente `NoPermissionScreen`

Pantalla mostrada cuando el usuario deniega el permiso de micrófono. Tiene dos variantes según `canAskAgain`.

```typescript
import React from "react";
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NoPermissionScreenProps } from "../types/audio.types";
import { colors, spacing, radius, typography } from "../styles/global";

export default function NoPermissionScreen({
  canAskAgain,
  onRetry,
}: NoPermissionScreenProps): React.JSX.Element {
  const handleOpenSettings = (): void => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🎙️</Text>
      <Text style={styles.title}>Permiso de micrófono requerido</Text>
      <Text style={styles.description}>
        {canAskAgain
          ? "Esta app necesita acceso al micrófono para poder grabar audio."
          : "Has denegado el permiso demasiadas veces. Actívalo desde los ajustes."}
      </Text>
      {canAskAgain ? (
        <TouchableOpacity style={styles.button} onPress={onRetry} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Solicitar permiso</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.button, styles.settingsButton]}
          onPress={handleOpenSettings}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Abrir ajustes</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
```

---

## Demo de la aplicación

<div align="center">
  <img src="../assets/app_video.gif" width="250" alt="Demo de la aplicación en funcionamiento" />
</div>

---

[← Volver al inicio](../README.md)
