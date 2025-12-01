import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

const notifications = [
  {
    id: 1,
    sender: 'Csdemo.agent',
    message: 'Makeup class scheduled',
    time: '2h ago',
    icon: 'calendar-outline',
    color: '#3B82F6'
  },
  {
    id: 2,
    sender: 'Csdemo.agent',
    message: 'New assignment posted',
    time: '5h ago',
    icon: 'document-text-outline',
    color: '#10B981'
  },
  {
    id: 3,
    sender: 'Csdemo.agent',
    message: 'Class cancelled',
    time: '1d ago',
    icon: 'close-circle-outline',
    color: '#EF4444'
  },
  {
    id: 4,
    sender: 'Csdemo.agent',
    message: 'New grades available',
    time: '2d ago',
    icon: 'ribbon-outline',
    color: '#8B5CF6'
  },
  {
    id: 5,
    sender: 'Csdemo.agent',
    message: 'Exam schedule released',
    time: '3d ago',
    icon: 'clipboard-outline',
    color: '#F59E0B'
  },
  {
    id: 6,
    sender: 'Csdemo.agent',
    message: 'New course material uploaded',
    time: '5d ago',
    icon: 'book-outline',
    color: '#06B6D4'
  },
  {
    id: 7,
    sender: 'Csdemo.agent',
    message: 'Project deadline extended',
    time: '1w ago',
    icon: 'time-outline',
    color: '#84CC16'
  }
];

const Notification = () => {
  const router = useRouter();
  
  return (
    <View className="flex-1">
      {/* Header */}
      <View className="bg-[#86C3E5] shadow-md" style={{ paddingTop: StatusBar.currentHeight }}>
        <View className="flex-row items-center h-20 px-4 gap-4">
          <Pressable className="p-2" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </Pressable>
          <Text className="text-black font-semibold text-xl flex-1">Notifications</Text>
        </View>
      </View>
      
      {/* Content */}
      <View className="flex-1 bg-[#CEEDFF] p-6">
        <Text className="text-2xl font-bold text-gray-800 mb-6">Recent Notifications</Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {notifications.map((notification, index) => (
            <TouchableOpacity 
              key={notification.id}
              className="bg-white p-4 rounded-xl shadow-sm mb-4"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <View 
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: `${notification.color}20` }}
                >
                  <Ionicons name={notification.icon} size={24} color={notification.color} />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-black font-semibold">{notification.sender}</Text>
                    <Text className="text-gray-500 text-sm">{notification.time}</Text>
                  </View>
                  <Text className="text-gray-600">{notification.message}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  )
}

export default Notification