import { Slot } from "expo-router";
import '../global.css';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return(
    <SafeAreaProvider>
      <SafeAreaView
      className="flex-1 bg-[#CEEDFF]">
        <Slot />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
