import { Platform } from "react-native";

export const colors = {
  background: "#1a1a2e",
  surface: "#16213e",
  surfaceActive: "#1a2e1a",
  primary: "#e74c3c",
  primaryDark: "#c0392b",
  primaryShadow: "#e74c3c",
  success: "#2ecc71",
  info: "#2980b9",
  danger: "#922b21",
  disabled: "#555",
  textPrimary: "#ffffff",
  textSecondary: "#aaa",
  textDisabled: "#999",
  textDanger: "#e74c3c",
  borderDefault: "#e74c3c",
  borderActive: "#2ecc71",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 50,
};

export const typography = {
  title: {
    fontSize: 26,
    fontWeight: "bold" as const,
    letterSpacing: 1,
  },
  body: {
    fontSize: 14,
  },
  small: {
    fontSize: 12,
  },
  button: {
    fontSize: 13,
    fontWeight: "bold" as const,
  },
  buttonLarge: {
    fontSize: 18,
    fontWeight: "bold" as const,
    letterSpacing: 0.5,
  },
};

export const shadows = Platform.select({
  ios: {
    shadowColor: colors.primaryShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  android: {
    elevation: 6,
  },
  default: {},
});