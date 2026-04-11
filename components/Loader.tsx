import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export default function Loader(): React.JSX.Element {
  const scale = useSharedValue<number>(1);
  const opacity = useSharedValue<number>(1);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.6, {
        duration: 600,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
    opacity.value = withRepeat(
      withTiming(0.3, {
        duration: 600,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e74c3c",
  },
});
