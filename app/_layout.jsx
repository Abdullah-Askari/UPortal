import { Slot } from "expo-router";
import { View } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from '../context/useAuth';
import { ThemeProvider, useTheme } from '../context/useTheme';
import '../global.css';

function ThemedSlot() {
  const { theme } = useTheme();
  
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: theme.background 
    }}>
      <Slot />
    </View>
  );
}

export default function RootLayout() {
  return(
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <ThemedSlot />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
