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
          ? "Esta app necesita acceso al micrófono para poder grabar audio. Por favor, acepta el permiso para continuar."
          : "Has denegado el permiso demasiadas veces. Para usar la app debes activarlo manualmente desde los ajustes de tu dispositivo."}
      </Text>
      {canAskAgain ? (
        <TouchableOpacity
          style={styles.button}
          onPress={onRetry}
          activeOpacity={0.8}
        >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  icon: {
    fontSize: 64,
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  description: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: radius.lg,
  },
  settingsButton: {
    backgroundColor: colors.info,
  },
  buttonText: {
    color: colors.textPrimary,
    fontWeight: "bold",
    fontSize: 16,
  },
});
