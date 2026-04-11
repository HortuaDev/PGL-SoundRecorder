import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { RecordButtonProps } from "../types/audio.types";
import { colors, radius, typography, shadows } from "../styles/global";

export default function RecordButton({
  isRecording,
  onPress,
}: RecordButtonProps): React.JSX.Element {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.08,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      scale.stopAnimation();
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isRecording]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[styles.button, isRecording && styles.recording]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.text}>
          {isRecording ? "⏹  Parar grabación" : "⏺  Iniciar grabación"}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: radius.lg,
    alignItems: "center",
    marginBottom: 20,
    ...shadows,
  },
  recording: {
    backgroundColor: colors.primaryDark,
  },
  text: {
    color: colors.textPrimary,
    ...typography.buttonLarge,
  },
});
