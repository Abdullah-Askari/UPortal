import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as AuthSession from 'expo-auth-session';

const SignIn = () => {
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();

  // YOUR GOOGLE CLIENT ID (Web Client ID)
  const clientId =
    "21114518358-emll0l81vpcn6jsfe9unv2lne0k6eemi.apps.googleusercontent.com";

  // Must use proxy in Expo Go
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

  // Google OAuth 2.0 Discovery
  const discovery = {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    revocationEndpoint: "https://oauth2.googleapis.com/revoke",
  };

  // Create OAuth Request
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      redirectUri,
      scopes: ["openid", "profile", "email"],
      responseType: "code",
      usePKCE: true,
    },
    discovery
  );

  // When user returns from Google
  useEffect(() => {
    const handleSignIn = async () => {
      if (response?.type === "success") {
        const { code } = response.params;

        // Exchange Code -> Access Token
        const tokenResponse = await AuthSession.exchangeCodeAsync(
          {
            clientId,
            code,
            redirectUri,
            extraParams: {
              code_verifier: request.codeVerifier,
            },
          },
          discovery
        );

        fetchUserInfo(tokenResponse.access_token);
      }
    };

    handleSignIn();
  }, [response]);

  // Fetch user info
  const fetchUserInfo = async (token) => {
    try {
      const res = await fetch(
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const user = await res.json();
      setUserInfo(user);

      Alert.alert("Login Successful", `Welcome ${user.name}`);

      // Navigate to /home after Google login
      router.replace('/home');

    } catch (err) {
      Alert.alert("Error", "Failed to fetch Google user info");
    }
  };

  // Regular email login
  const handleLogin = () => {
    Alert.alert("Login", "Regular login functionality will be implemented");
  };

  return (
    <View className="flex justify-center items-center pt-8">
      <Image
        source={require("../../assets/images/signIn.png")}
        style={{ width: 142, height: 142 }}
        contentFit="contain"
      />

      <Text
        style={{
          color: "#001C27",
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
          color: "#001C27",
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
            color: "#001C27",
            fontWeight: "600",
            fontSize: 16,
            marginBottom: 8,
          }}
        >
          Email
        </Text>

        <TextInput
          placeholder="l1s23bsse0037@ucp.edu.pk"
          placeholderTextColor="#999"
          style={{
            paddingVertical: 12,
            fontSize: 16,
            color: "#001C27",
            marginBottom: 24,
            borderBottomWidth: 2,
            borderBottomColor: "#E5E5E5",
            width: "100%",
          }}
        />

        <Text>Password</Text>

        <TextInput
          placeholder="********"
          secureTextEntry={true}
          placeholderTextColor="#999"
          style={{
            paddingVertical: 12,
            fontSize: 16,
            color: "#001C27",
            marginBottom: 24,
            borderBottomWidth: 2,
            borderBottomColor: "#E5E5E5",
            width: "100%",
          }}
        />

        <TouchableOpacity
          onPress={() => {}}
          className="flex justify-center items-center p-2"
        >
          <Text style={{ color: "#0F93DF", fontSize: 14, fontWeight: "500" }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <View className="flex justify-center items-center p-8">
          {/* Email login */}
          <TouchableOpacity
            onPress={handleLogin}
            style={{
              borderRadius: 8,
              backgroundColor: "#2D9CDB",
              paddingVertical: 12,
              paddingHorizontal: 54,
            }}
          >
            <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
              Login
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              color: "#001C27",
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
              backgroundColor: "#ffffff",
              borderWidth: 1,
              borderColor: "#E5E5E5",
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
              style={{ color: "#001C27", fontWeight: "600", fontSize: 16 }}
            >
              Login with Microsoft
            </Text>
          </TouchableOpacity>

          {/* Google Sign-In */}
          <TouchableOpacity
            onPress={() => promptAsync()}
            style={{
              borderRadius: 8,
              backgroundColor: "#ffffff",
              borderWidth: 1,
              borderColor: "#E5E5E5",
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
              style={{ color: "#001C27", fontWeight: "600", fontSize: 16 }}
            >
              Sign in with Google
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignIn;
