import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/useAuth';
import { useTheme } from '../../context/useTheme';

const Notification = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { userData } = useAuth();
  
  // Get notifications from centralized userData
  const notificationList = userData?.notifications || [];
  
  return (
    <View className="flex-1">
      {/* Header */}
      <View className="shadow-md" style={{ backgroundColor: theme.primary, paddingTop: StatusBar.currentHeight }}>
        <View className="flex-row items-center h-20 px-4 gap-4">
          <Pressable className="p-2" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={theme.textInverse} />
          </Pressable>
          <Text className="font-semibold text-xl flex-1" style={{ color: theme.textInverse }}>Notifications</Text>
        </View>
      </View>
      
      {/* Content */}
      <View className="flex-1 p-6" style={{ backgroundColor: theme.background }}>
        <Text className="text-2xl font-bold mb-6" style={{ color: theme.text }}>Recent Notifications</Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {notificationList.length === 0 ? (
            <View className="items-center py-10">
              <Ionicons name="notifications-off-outline" size={48} color={theme.textTertiary} />
              <Text className="mt-4" style={{ color: theme.textSecondary }}>No notifications yet</Text>
            </View>
          ) : (
            notificationList.map((notification, index) => (
              <TouchableOpacity 
                key={notification.id || index}
                className="p-4 rounded-xl shadow-sm mb-4"
                style={{ backgroundColor: theme.surface }}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <View 
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: notification.color + '20' }}
                  >
                    <Ionicons name={notification.icon} size={24} color={notification.color} />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="font-semibold" style={{ color: theme.text }}>{notification.sender}</Text>
                      <Text className="text-sm" style={{ color: theme.textTertiary }}>{notification.time}</Text>
                    </View>
                    <Text style={{ color: theme.textSecondary }}>{notification.message}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  )
}

export default Notification