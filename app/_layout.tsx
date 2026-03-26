import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from 'react-native-paper';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#4900b0',
    },
  };
  return (
    <PaperProvider
      theme={theme}
    >

      <StatusBar
        style="auto"
      />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <Toast />
    </PaperProvider>
  );
}
