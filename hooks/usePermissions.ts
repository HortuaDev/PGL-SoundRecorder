import { useState } from "react";
import { AudioModule, setAudioModeAsync } from "expo-audio";

interface PermissionState {
  permissionGranted: boolean | null;
  canAskAgain: boolean;
  requestPermission: () => Promise<void>;
}

export function usePermissions(): PermissionState {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
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