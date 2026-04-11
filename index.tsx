import { registerRootComponent } from "expo";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";
import App from "./App";

function Root(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
}

registerRootComponent(Root);
