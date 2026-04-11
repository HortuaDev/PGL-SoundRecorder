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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
    paddingTop: Platform.OS === "android" ? 40 : spacing.xl,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.xxl,
  },
  loadingText: {
    color: colors.textSecondary,
    marginTop: spacing.md,
    fontSize: typography.body.fontSize,
  },
  recordingIndicator: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  recordingText: {
    color: colors.textDanger,
    fontWeight: "bold",
    fontSize: typography.body.fontSize,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: typography.small.fontSize,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  empty: {
    color: colors.disabled,
    textAlign: "center",
    marginTop: 60,
    fontSize: 15,
    lineHeight: 24,
  },
  clearBtn: {
    backgroundColor: colors.danger,
    padding: 14,
    borderRadius: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  clearText: {
    color: colors.textPrimary,
    fontWeight: "bold",
    fontSize: typography.body.fontSize,
  },
});
