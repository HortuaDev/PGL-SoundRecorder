import React, { useEffect } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface Props {
  isRecording: boolean;
  onPress: () => void;
}

export default function RecordButton({
  isRecording,
  onPress,
}: Props): React.JSX.Element {
  const scale = useSharedValue<number>(1);

  useEffect(() => {
    if (isRecording) {
      scale.value = withRepeat(
        withTiming(1.08, {
          duration: 500,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      );
    } else {
      scale.value = withTiming(1, { duration: 200 });
    }
  }, [isRecording]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
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
    backgroundColor: "#e74c3c",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#e74c3c",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  recording: {
    backgroundColor: "#c0392b",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
