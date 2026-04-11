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

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.borderDefault,
  },
  playing: {
    borderLeftColor: colors.borderActive,
    backgroundColor: colors.surfaceActive,
  },
  disabled: {
    opacity: 0.45,
  },
  date: {
    color: colors.textSecondary,
    fontSize: typography.small.fontSize,
    marginBottom: spacing.xs + 2,
  },
  playingLabel: {
    color: colors.success,
    fontSize: typography.small.fontSize,
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  playBtn: {
    backgroundColor: colors.info,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
  },
  playBtnActive: {
    backgroundColor: colors.success,
  },
  playBtnDisabled: {
    backgroundColor: colors.disabled,
  },
  playText: {
    color: colors.textPrimary,
    ...typography.button,
  },
  textDisabled: {
    color: colors.textDisabled,
  },
  deleteBtn: {
    backgroundColor: colors.danger,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
  },
  deleteText: {
    color: colors.textPrimary,
    ...typography.button,
  },
});
