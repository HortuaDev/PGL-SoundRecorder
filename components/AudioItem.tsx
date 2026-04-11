import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AudioRecord } from "../services/storageService";

interface Props {
  audio: AudioRecord;
  isPlaying: boolean;
  onPlay: (uri: string) => void;
  onDelete: (id: string) => void;
}

export default function AudioItem({
  audio,
  isPlaying,
  onPlay,
  onDelete,
}: Props): React.JSX.Element {
  return (
    <View style={[styles.container, isPlaying && styles.playing]}>
      <Text style={styles.date}>🗓 {audio.date}</Text>

      {isPlaying && <Text style={styles.playingLabel}>▶ Reproduciendo...</Text>}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.playBtn, isPlaying && styles.playBtnActive]}
          onPress={() => onPlay(audio.uri)}
        >
          <Text style={styles.playText}>
            {isPlaying ? "↺ Repetir" : "▶ Reproducir"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => onDelete(audio.id)}
        >
          <Text style={styles.deleteText}>🗑 Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#16213e",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#e74c3c",
  },
  playing: {
    borderLeftColor: "#2ecc71",
    backgroundColor: "#1a2e1a",
  },
  date: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 6,
  },
  playingLabel: {
    color: "#2ecc71",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  playBtn: {
    backgroundColor: "#2980b9",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  playBtnActive: {
    backgroundColor: "#27ae60",
  },
  playText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  deleteBtn: {
    backgroundColor: "#922b21",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
});
