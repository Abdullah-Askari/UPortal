import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StatusBar, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../context/useTheme';
import CustomAlert from '../../components/CustomAlert';

const Settings = () => {
  const router = useRouter();
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [alertVisible, setAlertVisible] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info'
  });

  useEffect(() => {
    checkNotificationPermissions();
  }, []);

  const checkNotificationPermissions = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setNotificationsEnabled(status === 'granted');
    } catch (error) {
      console.log('Error checking notification permissions:', error);
    }
  };

  const showAlert = (title, message, type = 'info') => {
    setAlertVisible({
      visible: true,
      title,
      message,
      type,
    });
  }
  const hideAlert = () => {
    setAlertVisible(prev => ({
      ...prev,
      visible: false
    }))
  };

  const handleThemeToggle = async () => {
    await toggleTheme();
    showAlert('Theme Changed', isDarkMode ? 'Light mode enabled' : 'Dark mode enabled', 'success');
  };

  const handleNotificationToggle = async (value) => {
    if (value) {
      // Request permission to enable notifications
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === 'granted') {
          setNotificationsEnabled(true);
          showAlert('Notifications Enabled', 'You will now receive real-time notifications', 'success');
        } else {
          showAlert('Permission Denied', 'Notifications permission was denied', 'error');
          setNotificationsEnabled(false);
        }
      } catch (error) {
        console.log('Error requesting notification permissions:', error);
        showAlert('Error', 'Failed to enable notifications', 'error');
      }
    } else {
      // Disable notifications
      setNotificationsEnabled(false);
      showAlert('Notifications Disabled', 'You will no longer receive real-time notifications', 'info');
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      {/* Header */}
      <View className="shadow-md" style={{
        backgroundColor: theme.primary,
        paddingTop: StatusBar.currentHeight
      }}>
        <View className="flex-row items-center h-20 px-4 gap-4">
          <Pressable className="p-2" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={theme.textInverse} />
          </Pressable>
          <Text className="font-semibold text-xl flex-1" style={{ color: theme.textInverse }}>
            Settings
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 p-6">
        <Text className="text-lg font-semibold mb-4 px-2" style={{ color: theme.text }}>
          Appearance
        </Text>

        <View className="rounded-xl shadow-sm" style={{ backgroundColor: theme.surface }}>
          <TouchableOpacity
            className="flex-row items-center p-6"
            disabled={true}
          >
            <View
              className="w-14 h-14 rounded-lg items-center justify-center mr-4"
              style={{ backgroundColor: isDarkMode ? theme.primary + '20' : theme.accent + '20' }}
            >
              <Ionicons
                name={isDarkMode ? 'moon' : 'sunny'}
                size={28}
                color={isDarkMode ? theme.primary : theme.accent}
              />
            </View>

            <View className="flex-1">
              <Text className="text-xl font-semibold" style={{ color: theme.text }}>
                Dark Mode
              </Text>
              <Text className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                {isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}
              </Text>
            </View>

            <Switch
              value={isDarkMode}
              onValueChange={handleThemeToggle}
              trackColor={{ false: theme.borderSecondary, true: theme.primary + '50' }}
              thumbColor={isDarkMode ? theme.primary : theme.accent}
              style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
            />
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <Text className="text-lg font-semibold mb-4 px-2 mt-6" style={{ color: theme.text }}>
          Notifications
        </Text>

        <View className="rounded-xl shadow-sm" style={{ backgroundColor: theme.surface }}>
          <TouchableOpacity
            className="flex-row items-center p-6"
            disabled={true}
          >
            <View
              className="w-14 h-14 rounded-lg items-center justify-center mr-4"
              style={{ backgroundColor: notificationsEnabled ? theme.primary + '20' : theme.textTertiary + '20' }}
            >
              <Ionicons
                name={notificationsEnabled ? 'notifications' : 'notifications-off'}
                size={28}
                color={notificationsEnabled ? theme.primary : theme.textTertiary}
              />
            </View>

            <View className="flex-1">
              <Text className="text-xl font-semibold" style={{ color: theme.text }}>
                Notifications
              </Text>
              <Text className="text-sm mt-1" style={{ color: theme.textSecondary }}>
                {notificationsEnabled ? 'Notifications enabled' : 'Notifications disabled'}
              </Text>
            </View>

            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: theme.borderSecondary, true: theme.primary + '50' }}
              thumbColor={notificationsEnabled ? theme.primary : theme.textTertiary}
              style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <CustomAlert
        visible={alertVisible.visible}
        title={alertVisible.title}
        message={alertVisible.message}
        type={alertVisible.type}
        onClose={hideAlert}
      />
    </View>
  )
}

export default Settings