import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/useAuth';
import { useTheme } from '../../context/useTheme';
import CustomAlert from '../components/CustomAlert';

const ForgetPassword = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { forgetPassword } = useAuth();
  const emailRef = useRef('');
  const [sending, setSending] = useState(false);
  const [alertVisible, setAlertVisible] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
  });

  const showAlert = (title, message, type = 'info', onConfirm = null) => {
    setAlertVisible({
      visible: true,
      title,
      message,
      type,
      onConfirm,
    });
  }
  const hideAlert = () => {
    setAlertVisible(prev => ({
      ...prev,
      visible: false
    }))
  };
  const handleForgetPassword = async () => {
    const email = (emailRef.current || '').trim().toLowerCase();
    if (!email) {
      showAlert('Error', 'Please enter your email address.', 'error');
      return;
    }
    try {
      setSending(true);
      const res = await forgetPassword(email);
      setSending(false);
      if (res?.success) {
        showAlert('Success', 'Password reset link sent. Check your email.', 'success', () => {
          router.back();
        });
      } else {
        showAlert('Error', res?.error || 'Failed to send reset email', 'error');
      }
    } catch (e) {
      setSending(false);
      showAlert('Error', e?.message || 'Failed to send reset email', 'error');
    }
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
            onChangeText={(val) => emailRef.current = val}
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
            style={{ backgroundColor: theme.primary, opacity: sending ? 0.7 : 1 }}
            onPress={sending ? undefined : handleForgetPassword}
          >
            <Text className="text-lg font-semibold" style={{ color: theme.textInverse }}>
              {sending ? 'Sending…' : 'Send Reset Link'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <CustomAlert
        visible={alertVisible.visible}
        title={alertVisible.title}
        message={alertVisible.message}
        type={alertVisible.type}
        onConfirm={() => {
          hideAlert();
          if (alertVisible.onConfirm) {
            alertVisible.onConfirm();
          }
        }}
      />
    </View>
  );
};

export default ForgetPassword;
