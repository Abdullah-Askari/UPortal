import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/useAuth';
import { useTheme } from '../context/useTheme';

export default function Index() {
  const { user, loading, hasSeenOnboarding } = useAuth();
  const { theme } = useTheme();
  // loading state
  if (loading || hasSeenOnboarding === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  // User is logged in
  if (user) {
    return <Redirect href="/(home)/Dashboard" />
  }

  // First time user
  if (!hasSeenOnboarding) {
    return <Redirect href="/(OnBoarding)/OnBoarding1" />
  }

  // Returning user not logged in
  return <Redirect href="/(auth)/SignIn" />
}
