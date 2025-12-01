import { Slot, usePathname } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from '../context/useTheme';
import { View } from 'react-native';
import '../global.css';

function ThemedSlot() {
  const { theme } = useTheme();
  const pathname = usePathname();
  
  // Don't apply theme background to onboarding and auth screens
  const isOnboardingOrAuth = pathname.includes('OnBoarding') || pathname.includes('auth');
  
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: isOnboardingOrAuth ? 'transparent' : theme.background 
    }}>
      <Slot />
    </View>
  );
}

export default function RootLayout() {
  return(
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemedSlot />
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
