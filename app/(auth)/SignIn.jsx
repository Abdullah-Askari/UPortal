import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/useAuth';
import { useTheme } from '../../context/useTheme';
import KeyboardView from '../components/KeyboardView';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();
  const { theme } = useTheme();

  // Email/Password login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (result.success) {
      router.replace('/(home)/Dashboard');
    } else {
      Alert.alert('Login Failed', result.error);
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
          value={email}
          onChangeText={setEmail}
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

        <TextInput
          placeholder="********"
          secureTextEntry={true}
          placeholderTextColor={theme.textTertiary}
          value={password}
          onChangeText={setPassword}
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

        <TouchableOpacity
          onPress={() => {router.push('/(auth)/ForgetPassword')}}
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

          {/* Microsoft */}
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderRadius: 8,
              backgroundColor: theme.surface,
              borderWidth: 1,
              borderColor: theme.border,
              paddingVertical: 12,
              paddingHorizontal: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 16,
              width: "100%",
            }}
          >
            <Image
              source={require("../../assets/images/Image.png")}
              style={{ width: 20, height: 20, marginRight: 12 }}
              contentFit="contain"
            />
            <Text
              style={{ color: theme.text, fontWeight: "600", fontSize: 16 }}
            >
              Login with Microsoft
            </Text>
          </TouchableOpacity>

          {/* Google Sign-In (disabled for now) */}
          <TouchableOpacity
            onPress={() => Alert.alert('Coming Soon', 'Google sign-in will be available soon')}
            style={{
              borderRadius: 8,
              backgroundColor: theme.surface,
              borderWidth: 1,
              borderColor: theme.border,
              paddingVertical: 12,
              paddingHorizontal: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 12,
              width: "100%",
            }}
          >
            <Text style={{ fontSize: 20, marginRight: 12 }}>🔍</Text>
            <Text
              style={{ color: theme.text, fontWeight: "600", fontSize: 16 }}
            >
              Sign in with Google
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </KeyboardView>
  );
};

export default SignIn;
