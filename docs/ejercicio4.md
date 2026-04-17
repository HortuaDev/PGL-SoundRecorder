[← Volver al inicio](../README.md)

# Ejercicio 4 – Persistencia de grabaciones entre sesiones

## Enunciado

> Mediante el guardado de los audios en la memoria del dispositivo se debe recuperar los audios grabados en sesiones anteriores de uso de la aplicación.

---

## Estrategia de persistencia

Solo se guarda la **URI del fichero de audio** en `AsyncStorage`, no el audio en sí. Los archivos de audio quedan almacenados en el sistema de ficheros del dispositivo por `expo-audio`, y `AsyncStorage` conserva las referencias a esos ficheros entre sesiones.

> **Nota:** si se limpia la caché de la aplicación, los archivos de audio se perderían aunque las URIs sigan guardadas en `AsyncStorage`. Este es el comportamiento esperado según el enunciado de la actividad.

---

## Servicio de almacenamiento (`services/storageService.ts`)

Servicio genérico y reutilizable que gestiona todas las operaciones de persistencia con `AsyncStorage`. Todos los métodos devuelven el array actualizado para que el estado en React se mantenga sincronizado.

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AudioRecord } from "../types/audio.types";

const STORAGE_KEY = "recorded_audios";

const storageService = {
  getAudios: async (): Promise<AudioRecord[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting audios:", error);
      return [];
    }
  },

  saveAudio: async (uri: string): Promise<AudioRecord[]> => {
    try {
      const audios = await storageService.getAudios();
      const newAudio: AudioRecord = {
        id: Date.now().toString(),
        uri,
        date: new Date().toLocaleString("es-ES"),
      };
      const updated = [...audios, newAudio];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error("Error saving audio:", error);
      return [];
    }
  },

  deleteAudio: async (id: string): Promise<AudioRecord[]> => {
    try {
      const audios = await storageService.getAudios();
      const updated = audios.filter((a) => a.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error("Error deleting audio:", error);
      return [];
    }
  },

  clearAudios: async (): Promise<AudioRecord[]> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    } catch (error) {
      console.error("Error clearing audios:", error);
      return [];
    }
  },
};

export default storageService;
```

### Métodos disponibles

| Método            | Parámetros    | Devuelve        | Descripción                                     |
| ----------------- | ------------- | --------------- | ----------------------------------------------- |
| `getAudios()`     | —             | `AudioRecord[]` | Recupera todas las grabaciones guardadas        |
| `saveAudio(uri)`  | `uri: string` | `AudioRecord[]` | Guarda una nueva grabación con id único y fecha |
| `deleteAudio(id)` | `id: string`  | `AudioRecord[]` | Elimina una grabación por su id                 |
| `clearAudios()`   | —             | `AudioRecord[]` | Elimina todas las grabaciones                   |

---

## Carga al inicio de la sesión (`useAudioRecording`)

El hook `useAudioRecording` recupera los audios guardados al montarse el componente mediante un `useEffect` en `App.tsx`:

```typescript
// En App.tsx
useEffect(() => {
  loadAudios();
}, []);
```

La función `loadAudios` definida en el hook llama al servicio y actualiza el estado:

```typescript
const loadAudios = async (): Promise<void> => {
  const saved = await storageService.getAudios();
  setAudios(saved);
  setLoading(false);
};
```

El flag `loading` comienza en `true` y pasa a `false` solo cuando la carga termina, lo que permite mostrar el componente `Loader` durante ese tiempo (ver [Ejercicio 5](./ejercicio5.md)).

---

## Guardado al parar la grabación

Cuando el usuario para la grabación, se obtiene la URI del fichero generado por `expo-audio` y se llama a `storageService.saveAudio(uri)`:

```typescript
const handleRecordToggle = async (): Promise<void> => {
  try {
    if (recorderState.isRecording) {
      await audioRecorder.stop();
      const uri = audioRecorder.uri;
      if (uri) {
        const updated = await storageService.saveAudio(uri);
        setAudios(updated);
      }
    } else {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    }
  } catch (error) {
    console.error("Error toggling recording:", error);
    Alert.alert("Error", "No se pudo gestionar la grabación.");
  }
};
```

---

## Eliminación de grabaciones

**Individual** – El callback `handleDelete` llama a `storageService.deleteAudio(id)` y ejecuta primero `onBeforeDelete` para detener la reproducción si el audio eliminado estaba sonando:

```typescript
const handleDelete = async (
  id: string,
  onBeforeDelete: () => void,
): Promise<void> => {
  onBeforeDelete();
  const updated = await storageService.deleteAudio(id);
  setAudios(updated);
};
```

**Total** – `handleClearAll` muestra un `Alert` de confirmación antes de llamar a `storageService.clearAudios()`:

```typescript
const handleClearAll = (onBeforeClear: () => void): void => {
  Alert.alert(
    "Eliminar todo",
    "¿Estás seguro de que quieres eliminar todas las grabaciones?",
    [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          onBeforeClear();
          await storageService.clearAudios();
          setAudios([]);
        },
      },
    ],
  );
};
```

El diálogo de confirmación se muestra así en el dispositivo:

<div align="left">
  <img src="../assets/modal-confirmacion-de-eliminacion.png" width="200" alt="Diálogo de confirmación de eliminación" />
</div>

---

[← Volver al inicio](../README.md)
