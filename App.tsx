import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";

import storageService, { AudioRecord } from "./services/storageService";
import AudioItem from "./components/AudioItem";
import Loader from "./components/Loader";
import NoPermissionScreen from "./components/NoPermissionScreen";
import RecordButton from "./components/RecordButton";

export default function App(): React.JSX.Element {
  const [audios, setAudios] = useState<AudioRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playingUri, setPlayingUri] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
    null,
  );
  const [canAskAgain, setCanAskAgain] = useState<boolean>(true);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const player = useAudioPlayer(playingUri ? { uri: playingUri } : null);

  // cargar audios guardados
  useEffect(() => {
    (async () => {
      const saved = await storageService.getAudios();
      setAudios(saved);
      setLoading(false);
    })();
  }, []);

  // pedri permisos al inicio
  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  const handleRetryPermission = async (): Promise<void> => {
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
      console.error("Error retrying permission:", error);
    }
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

  const handlePlay = (id: string, uri: string): void => {
    setPlayingId(id);
    setPlayingUri(uri);
    setTimeout(() => player.play(), 100);
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (playingId === id) {
      player.pause();
      setPlayingId(null);
      setPlayingUri(null);
    }
    const updated = await storageService.deleteAudio(id);
    setAudios(updated);
  };

  const handleClearAll = (): void => {
    Alert.alert(
      "Eliminar todo",
      "¿Estás seguro de que quieres eliminar todas las grabaciones?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            player.pause();
            setPlayingId(null);
            setPlayingUri(null);
            const updated = await storageService.clearAudios();
            setAudios(updated);
          },
        },
      ],
    );
  };

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
        onRetry={handleRetryPermission}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      <Text style={styles.title}>🎙️ Grabadora de Audio</Text>

      <RecordButton
        isRecording={recorderState.isRecording}
        onPress={handleRecordToggle}
      />

      {recorderState.isRecording && (
        <View style={styles.recordingIndicator}>
          <Loader />
          <Text style={styles.recordingText}>
            Grabando... {Math.round(recorderState.durationMillis / 1000)}s
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
            onPlay={(uri) => handlePlay(item.id, uri)}
            onDelete={handleDelete}
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
          onPress={handleClearAll}
          activeOpacity={0.8}
        >
          <Text style={styles.clearText}>
            🗑 Eliminar todas las grabaciones
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    padding: 20,
    paddingTop: Platform.OS === "android" ? 40 : 20,
  },
  centered: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 28,
    letterSpacing: 1,
  },
  loadingText: {
    color: "#aaa",
    marginTop: 12,
    fontSize: 14,
  },
  recordingIndicator: {
    alignItems: "center",
    marginBottom: 16,
  },
  recordingText: {
    color: "#e74c3c",
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  list: {
    paddingBottom: 20,
  },
  empty: {
    color: "#555",
    textAlign: "center",
    marginTop: 60,
    fontSize: 15,
    lineHeight: 24,
  },
  clearBtn: {
    backgroundColor: "#922b21",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  clearText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
