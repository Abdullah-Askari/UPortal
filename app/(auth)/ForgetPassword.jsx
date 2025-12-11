import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { Pressable, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import useAuth from '../../context/useAuth';
import { useTheme } from '../../context/useTheme';

const ForgetPassword = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { forgetPassword } = useAuth();
  const emailRef = useRef();

  const handleForgetPassword = async () => {
    const email=emailRef?.current?.trim();
    if(!email){
      alert('Please enter your email address');
      return;
    }
    await forgetPassword(email);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      {/* Header */}
      <View className="shadow-md" style={{ backgroundColor: theme.primary, paddingTop: StatusBar.currentHeight }}>
        <View className="flex-row items-center h-16 px-4 gap-4">
          <Pressable className="p-2" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={theme.textInverse} />
          </Pressable>
          <Text className="font-semibold text-xl flex-1" style={{ color: theme.textInverse }}>Forget Password</Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 p-6">
        <View className="flex items-center m-4">
        <Text className="text-xl mb-6" style={{ color: theme.text }}>
          No worries, we'll send your reset code.
        </Text>
        {/* Email Input Field */}
        </View>
        <View className="p-8">
        <TextInput
          placeholder="l1s23bsse0037@ucp.edu.pk"
          placeholderTextColor={theme.textTertiary}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(val)=>emailRef.current=val}
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
        activeOpacity={0.7}
          className="mt-6 py-4 rounded-lg items-center"
          style={{ backgroundColor: theme.primary }}
          onPress={handleForgetPassword}
        >
          <Text className="text-lg font-semibold" style={{ color: theme.textInverse }}>
            Send Reset Link
          </Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ForgetPassword;
