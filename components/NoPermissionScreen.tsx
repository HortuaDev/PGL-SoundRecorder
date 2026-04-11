import React from "react";
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  canAskAgain: boolean;
  onRetry: () => void;
}

export default function NoPermissionScreen({
  canAskAgain,
  onRetry,
}: Props): React.JSX.Element {
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
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  icon: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 50,
  },
  settingsButton: {
    backgroundColor: "#2980b9",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
