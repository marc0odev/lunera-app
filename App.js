import React, { useState } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { I18nProvider } from "./src/i18n";
import { ThemeProvider, useTheme } from "./src/theme";
import { AppProvider } from "./src/state/app";
import Shell from "./src/Shell";
import Experience3D from "./src/screens/Experience3D";

// Raiz: o App (Shell) ou a experiência 3D (caixa aberta e patch em camadas)
function Root() {
  const { colors, mode } = useTheme();
  const [x3, setX3] = useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      {x3 ? (
        <Experience3D onClose={() => setX3(false)} />
      ) : (
        <Shell onOpen3D={() => setX3(true)} />
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <I18nProvider>
          <AppProvider>
            <Root />
          </AppProvider>
        </I18nProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
