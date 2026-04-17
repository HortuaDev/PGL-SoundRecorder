[← Volver al inicio](../README.md)

# Ejercicio 3 – Solicitud de permisos de grabación

## Enunciado

> Solicita permisos de grabación al usuario siempre que se vaya a grabar un nuevo audio. Si no se ha concedido el permiso aún, la app debe solicitarlo antes de empezar a grabar.

---

## Flujo completo de permisos

1. La app arranca y solicita automáticamente el permiso al sistema mediante `useEffect`
2. El sistema muestra el diálogo nativo al usuario
3. Si acepta → se configura el modo de audio y se muestra la app
4. Si deniega y `canAskAgain` es `true` → se muestra `NoPermissionScreen` con botón para volver a solicitar
5. Si deniega demasiadas veces → `canAskAgain` es `false` y se muestra un botón para abrir los ajustes del dispositivo directamente

---

## Hook `usePermissions`

Centraliza toda la lógica de permisos de micrófono en un único hook reutilizable.

```typescript
import { useState } from "react";
import { AudioModule, setAudioModeAsync } from "expo-audio";

interface PermissionState {
  permissionGranted: boolean | null;
  canAskAgain: boolean;
  requestPermission: () => Promise<void>;
}

export function usePermissions(): PermissionState {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
    null,
  );
  const [canAskAgain, setCanAskAgain] = useState<boolean>(true);

  const requestPermission = async (): Promise<void> => {
    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      setPermissionGranted(status.granted);
      setCanAskAgain(status.canAskAgain);

      if (status.granted) {
        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: true,
        });
      }
    } catch (error) {
      console.error("Error requesting permissions:", error);
      setPermissionGranted(false);
    }
  };

  return { permissionGranted, canAskAgain, requestPermission };
}
```

**Detalles de implementación:**

- `permissionGranted` se inicializa a `null` para distinguir el estado "todavía no respondido" de `true`/`false`. Mientras sea `null`, la app muestra la pantalla de carga.
- `requestPermission` llama a `AudioModule.requestRecordingPermissionsAsync()` de `expo-audio`, que muestra el diálogo nativo del sistema.
- Si el permiso es concedido, se configura el modo de audio con `setAudioModeAsync` para permitir grabación y reproducción en modo silencio.
- `canAskAgain` refleja si el sistema aún permite mostrar el diálogo o si el usuario debe ir a ajustes.

---

## Solicitud automática al arrancar

El permiso se solicita automáticamente al montar el componente principal a través de un `useEffect`:

```typescript
useEffect(() => {
  requestPermission();
}, []);
```

---

## Estados de la interfaz según el permiso

```typescript
// En App.tsx

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
```

| Estado de `permissionGranted` | Pantalla mostrada                                     |
| ----------------------------- | ----------------------------------------------------- |
| `null`                        | Loader con texto "Solicitando permisos..."            |
| `false`                       | `NoPermissionScreen` con botón de reintento o ajustes |
| `true`                        | Pantalla principal de la aplicación                   |

---

## Pantalla de permisos denegados (`NoPermissionScreen`)

Se muestra cuando el usuario deniega el permiso. Incluye dos variantes según el estado de `canAskAgain`:

- **`canAskAgain: true`** → botón "Solicitar permiso" que vuelve a lanzar el diálogo del sistema
- **`canAskAgain: false`** → botón "Abrir ajustes" que redirige a los ajustes del dispositivo

|                                  Primera denegación (`canAskAgain: true`)                                   |                             Denegación definitiva (`canAskAgain: false`)                              |
| :---------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------: |
| <img src="../assets/pedir-permisos-al-rechazar-por-primera-vez.png" width="200" alt="Primera denegación" /> | <img src="../assets/modal-permitir-permisos-microfono.png" width="200" alt="Denegación definitiva" /> |

---

## Compatibilidad por plataforma

Los permisos están declarados en `app.json` para que el sistema operativo los reconozca:

**Android** – `android.permission.RECORD_AUDIO` declarado en el manifiesto de la app.

**iOS** – `NSMicrophoneUsageDescription` en `infoPlist` con el mensaje que el sistema muestra al usuario.

La apertura de ajustes usa `Linking` con la URL correcta para cada plataforma:

```typescript
const handleOpenSettings = (): void => {
  if (Platform.OS === "ios") {
    Linking.openURL("app-settings:");
  } else {
    Linking.openSettings();
  }
};
```

---

[← Volver al inicio](../README.md)
