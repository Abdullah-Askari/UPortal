import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/useAuth';
import { useTheme } from '../../context/useTheme';
import CustomAlert from '../components/CustomAlert';
import KeyboardView from '../components/KeyboardView';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const SignIn = () => {
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();
  const { theme } = useTheme();
  const [alertVisible, setAlertVisible] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info',
  });

  // Request notification permissions on mount
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  const requestNotificationPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permission not granted');
      }
    } catch (error) {
      console.log('Error requesting notification permissions:', error);
    }
  };

  // Email/Password login
  const handleLogin = async () => {
    if (!emailRef.current || !passwordRef.current) {
      setAlertVisible({
        visible: true,
        title: 'Error',
        message: 'Please enter both email and password.',
        type: 'error',
      })
      return;
    }

    setLoading(true);
    const result = await signIn(emailRef.current, passwordRef.current);
    setLoading(false);

    if (result.success) {
      router.replace('/(home)/Dashboard');
    } else {
      setAlertVisible({
        visible: true,
        title: 'Login Failed',
        message: result.error || 'An error occurred during login',
        type: 'error',
      });
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const result = await signInWithGoogle();
    setGoogleLoading(false);

    if (result.success) {
      router.replace('/(home)/Dashboard');
    } else {
      setAlertVisible({
        visible: true,
        title: 'Google Sign-In Failed',
        message: result.error || 'An error occurred during Google Sign-In',
        type: 'error',
      });
    }
  };

  return (
    <KeyboardView>
      <View className="flex-1 justify-center items-center pt-8" style={{ backgroundColor: theme.background }}>
        <Image
          source={require("../../assets/images/signIn.png")}
          style={{ width: 142, height: 142 }}
          contentFit="contain"
        />

        <Text
          style={{
            color: theme.text,
            fontWeight: "bold",
            fontSize: 20,
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          Welcome to UCP Portal
        </Text>

        <Text
          style={{
            color: theme.textSecondary,
            textAlign: "center",
            fontSize: 16,
            lineHeight: 22,
            marginBottom: 32,
          }}
        >
          Embark on your adventure of fun, learning, and achievement!
        </Text>

        <View style={{ width: "90%", marginBottom: 20 }}>
          <Text
            style={{
              color: theme.text,
              fontWeight: "600",
              fontSize: 16,
              marginBottom: 8,
            }}
          >
            Email
          </Text>

          <TextInput
            placeholder="l1s23bsse0037@ucp.edu.pk"
            placeholderTextColor={theme.textTertiary}
            defaultValue={emailRef.current}
            onChangeText={(text) => emailRef.current = text}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              paddingVertical: 12,
              fontSize: 16,
              color: theme.text,
              marginBottom: 24,
              borderBottomWidth: 2,
              borderBottomColor: theme.border,
              width: "100%",
            }}
          />

          <Text style={{ color: theme.text }}>Password</Text>

          <View style={{ position: 'relative', marginBottom: 24 }}>
            <TextInput
              placeholder="********"
              secureTextEntry={!passwordVisible}
              placeholderTextColor={theme.textTertiary}
              defaultValue={passwordRef.current}
              onChangeText={(text) => passwordRef.current = text}
              style={{
                paddingVertical: 12,
                paddingRight: 40,
                fontSize: 16,
                color: theme.text,
                borderBottomWidth: 2,
                borderBottomColor: theme.border,
                width: "100%",
              }}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={{
                position: 'absolute',
                right: 0,
                top: 12,
                padding: 8,
              }}
            >
              <Ionicons
                name={passwordVisible ? "eye" : "eye-off"}
                size={24}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => { router.push('/(auth)/ForgetPassword') }}
            className="flex justify-center items-center p-2"
          >
            <Text style={{ color: theme.primary, fontSize: 14, fontWeight: "500" }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <View className="flex justify-center items-center p-8">
            {/* Email login */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              style={{
                borderRadius: 8,
                backgroundColor: loading ? theme.primary + '80' : theme.primary,
                paddingVertical: 12,
                paddingHorizontal: 54,
              }}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
                  Login
                </Text>
              )}
            </TouchableOpacity>

            <Text
              style={{
                color: theme.textSecondary,
                fontSize: 14,
                fontWeight: "500",
                marginTop: 16,
              }}
            >
              OR
            </Text>


            {/* Google Sign-In Button */}
            <TouchableOpacity
              onPress={handleGoogleLogin}
              disabled={googleLoading}
              style={{
                borderRadius: 4,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#DADCE0',
                paddingVertical: 11,
                paddingHorizontal: 24,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 12,
                width: "100%",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.15,
                shadowRadius: 1,
                elevation: 2,
              }}
            >
              {googleLoading ? (
                <ActivityIndicator color="#1F2937" />
              ) : (
                <>
                  {/* Google Official Logo  */}
                  <Image
                    source={require("../../assets/images/google-logo.jpg")}
                    style={{ width: 20, height: 20, marginRight: 10 }}
                    contentFit="contain"
                  />
                  <Text
                    style={{
                      color: '#3C4043',
                      fontWeight: "600",
                      fontSize: 16,
                      letterSpacing: 0.3
                    }}
                  >
                    Sign in with Google
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <CustomAlert
        visible={alertVisible.visible}
        title={alertVisible.title}
        message={alertVisible.message}
        type={alertVisible.type}
        onClose={() => setAlertVisible({ ...alertVisible, visible: false })}
      />
    </KeyboardView>
  );
};

export default SignIn;
