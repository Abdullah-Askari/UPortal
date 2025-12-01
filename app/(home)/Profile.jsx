import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/useTheme';

const Profile = () => {
  const router = useRouter();
  const { theme } = useTheme();
  return (
    <View className="flex-1">
      {/* Header */}
            <View className="shadow-md" style={{ backgroundColor: theme.primary, paddingTop: StatusBar.currentHeight }}>
              <View className="flex-row items-center h-20 px-4 gap-4">
                <Pressable className="p-2"
                onPress={()=>router.back()}>
                  <Ionicons name="arrow-back" size={28} color={theme.textInverse} />
                </Pressable>
                <Text className="font-semibold text-xl flex-1" style={{ color: theme.textInverse }}>Profile</Text>
              </View>
            </View>
            {/* Edit Button */}
            <View className="flex-1 p-6" style={{ backgroundColor: theme.background }}>
              <View className="flex-row justify-end mb-6">
                <TouchableOpacity 
                  className="flex-row items-center px-4 py-2 rounded-lg" 
                  style={{ 
                    backgroundColor: theme.primary,
                    borderWidth: 1,
                    borderColor: theme.primary,
                    shadowColor: theme.shadow,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                    elevation: 3
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="create-outline" size={20} color={theme.textInverse} />
                  <Text className="ml-2 font-medium" style={{ color: theme.textInverse }}>Edit</Text>
                </TouchableOpacity>
              </View>
              
              <View className="flex justify-center items-center mb-6">
                {/* Profile Picture */}
                <View className="w-40 h-40 rounded-full border-4 overflow-hidden" style={{ borderColor: theme.border }}>
                  <Image
                  source={require('../../assets/images/Illustration-1.png')}
                  style={{ width: 160, height: 160 }}
                  contentFit="cover"
                  />
                </View>
              </View>
              
              {/* User Information [name]*/}
              <View className="rounded-xl p-4 shadow-sm mb-4" style={{ backgroundColor: theme.surface }}>
                <Text className="text-sm mb-1" style={{ color: theme.textSecondary }}>Name</Text>
                <Text className="text-lg font-semibold" style={{ color: theme.text }}>John Doe</Text>
              </View>
                  
                  {/* User Information [email]*/}
                  <View className="rounded-xl p-4 shadow-sm mb-4" style={{ backgroundColor: theme.surface }}>
                    <Text className="text-sm mb-1" style={{ color: theme.textSecondary }}>Email</Text>
                    <Text className="text-lg font-semibold" style={{ color: theme.text }}>john.doe@example.com</Text>
                  </View>
                  {/* User Information [address]*/}
                  <View className="rounded-xl p-4 shadow-sm mb-4" style={{ backgroundColor: theme.surface }}>
                    <Text className="text-sm mb-1" style={{ color: theme.textSecondary }}>Address</Text>
                    <Text className="text-lg font-semibold" style={{ color: theme.text }}>123 Main St, Springfield</Text>
                  </View>

                  {/* User Information [D.O.B]*/}
                  <View className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: theme.surface }}>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="text-sm mb-1" style={{ color: theme.textSecondary }}>D.O.B</Text>
                        <Text className="text-lg font-semibold" style={{ color: theme.text }}>January 15, 1995</Text>
                      </View>
                      <Pressable className="ml-4" onPress={() => console.log('Calendar pressed')}>
                        <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
                      </Pressable>
                    </View>
                  </View>
                  
                  {/* Save Button */}
                  <TouchableOpacity className="rounded-xl p-4 shadow-sm mt-4 items-center" style={{ backgroundColor: theme.primary }}>
                    <Text className="text-lg font-semibold" style={{ color: theme.textInverse }}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
    </View>
  )
}

export default Profile