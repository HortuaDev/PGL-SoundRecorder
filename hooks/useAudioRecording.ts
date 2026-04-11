import { useState } from "react";
import { Alert } from "react-native";
import { RecordingPresets, useAudioRecorder, useAudioRecorderState } from "expo-audio";
import { AudioRecord } from "../types/audio.types";
import storageService from "../services/storageService";

interface AudioRecordingState {
  audios: AudioRecord[];
  loading: boolean;
  isRecording: boolean;
  durationMillis: number;
  setAudios: (audios: AudioRecord[]) => void;
  loadAudios: () => Promise<void>;
  handleRecordToggle: () => Promise<void>;
  handleDelete: (id: string, onBeforeDelete: () => void) => Promise<void>;
  handleClearAll: (onBeforeClear: () => void) => void;
}

export function useAudioRecording(): AudioRecordingState {
  const [audios, setAudios] = useState<AudioRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const loadAudios = async (): Promise<void> => {
    const saved = await storageService.getAudios();
    setAudios(saved);
    setLoading(false);
  };

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

  const handleDelete = async (
    id: string,
    onBeforeDelete: () => void,
  ): Promise<void> => {
    onBeforeDelete();
    const updated = await storageService.deleteAudio(id);
    setAudios(updated);
  };

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
            try {
              onBeforeClear();
              await storageService.clearAudios();
              setAudios([]);
            } catch (error) {
              console.error("Error clearing audios:", error);
            }
          },
        },
      ],
    );
  };

  return {
    audios,
    loading,
    isRecording: recorderState.isRecording,
    durationMillis: recorderState.durationMillis,
    setAudios,
    loadAudios,
    handleRecordToggle,
    handleDelete,
    handleClearAll,
  };
}