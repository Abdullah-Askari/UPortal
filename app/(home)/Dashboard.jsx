import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { Animated, Dimensions, Pressable, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from '../../context/useTheme'

const { width, height } = Dimensions.get('window')

const Dashboard = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const slideAnim = useRef(new Animated.Value(-width * 0.8)).current
  const overlayAnim = useRef(new Animated.Value(0)).current

  const toggleDrawer = () => {
    const toValue = isDrawerOpen ? -width * 0.8 : 0
    const overlayValue = isDrawerOpen ? 0 : 0.5
    
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: overlayValue,
        duration: 350,
        useNativeDriver: true,
      })
    ]).start()
    
    setIsDrawerOpen(!isDrawerOpen)
  }

  const menuItems = [
    {
      icon:'book-outline', label:'Gradebook', color:'#000', route:'/(OnBoarding)/DrawerScreens/gradebook'
    },
    {
      icon:'calendar-outline', label:'Attendance', color:'#000', route:'/(OnBoarding)/DrawerScreens/attendance'
    },
    {
      icon:'chatbubble-ellipses-outline', label:'Feedback', color:'#000', route:'/(OnBoarding)/DrawerScreens/feedback'
    },
    {
      icon:'document-text-outline', label:'Invoices', color:'#000', route:'/(OnBoarding)/DrawerScreens/invoices'
    },
    {
      icon:'settings-outline', label:'Settings', color:'#000', route:'/(OnBoarding)/DrawerScreens/settings'
    }
  ]
  const subjects = [
    {
        icon: 'calculator',
        name: 'Calculus',
        time: '9:00 AM - 10:30 AM',
        color: '#000'
    },
    {
        icon: 'flask',
        name: 'Physics',
        time: '11:00 AM - 12:30 PM',
        color: 'black'
    },
    {
        icon: 'desktop',
        name: 'Computer Science',
        time: '2:00 PM - 3:30 PM',
        color: '#000'
    }
  ]

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="shadow-md" style={{ backgroundColor: theme.primary, paddingTop: StatusBar.currentHeight }}>
        <View className="flex-row items-center h-20 px-4">
          <TouchableOpacity 
            onPress={toggleDrawer} 
            className="mr-4 p-2 rounded-lg"
            style={{ backgroundColor: theme.textInverse + '20' }}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="menu-outline" 
              size={24} 
              color={theme.textInverse}
            />
          </TouchableOpacity>
          <Text className="font-semibold text-xl flex-1" style={{ color: theme.textInverse }} numberOfLines={1}>Dashboard</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        className="flex-1" 
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Subject Cards */}
        <View className="gap-4 mb-8">
          {subjects.map((subject, index) => (
            <View 
              key={index}
              className="p-5 rounded-2xl flex-row items-center"
              style={{ 
                backgroundColor: theme.surface,
                borderWidth: 1,
                borderColor: theme.border,
                shadowColor: theme.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4
              }}
            >
              <View 
                className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
                style={{ 
                  backgroundColor: theme.primary + '15',
                  borderWidth: 2,
                  borderColor: theme.primary + '30'
                }}
              >
                <Ionicons name={subject.icon} size={32} color={theme.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold mb-1" style={{ color: theme.text }}>{subject.name}</Text>
                <Text className="text-sm" style={{ color: theme.textSecondary }}>{subject.time}</Text>
              </View>
            </View>
          ))}
        </View>
        
        {/* Quick Stats */}
        <View className="gap-4">
          <View className="flex-row gap-4">
            <TouchableOpacity 
              className="p-6 rounded-2xl flex-1 items-center"
              style={{ 
                backgroundColor: theme.surface,
                borderWidth: 1,
                borderColor: theme.border,
                shadowColor: theme.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4
              }}
              activeOpacity={0.8}
            >
              <View 
                className="w-14 h-14 rounded-2xl items-center justify-center mb-3"
                style={{ backgroundColor: theme.success + '15', borderWidth: 2, borderColor: theme.success + '30' }}
              >
                <Ionicons name="ribbon" size={28} color={theme.success} />
              </View>
              <Text className="text-sm font-medium mb-1" style={{ color: theme.textSecondary }}>Grades</Text>
              <Text className="text-3xl font-bold" style={{ color: theme.success }}>92%</Text>
              <Text className="text-xs mt-1" style={{ color: theme.textTertiary }}>Excellent</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="p-6 rounded-2xl flex-1 items-center"
              style={{ 
                backgroundColor: theme.surface,
                borderWidth: 1,
                borderColor: theme.border,
                shadowColor: theme.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4
              }}
              activeOpacity={0.8}
            >
              <View 
                className="w-14 h-14 rounded-2xl items-center justify-center mb-3"
                style={{ backgroundColor: theme.primary + '15', borderWidth: 2, borderColor: theme.primary + '30' }}
              >
                <Ionicons name="checkmark-done" size={28} color={theme.primary} />
              </View>
              <Text className="text-sm font-medium mb-1" style={{ color: theme.textSecondary }}>Attendance</Text>
              <Text className="text-3xl font-bold" style={{ color: theme.primary }}>95%</Text>
              <Text className="text-xs mt-1" style={{ color: theme.textTertiary }}>Great</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            className="p-6 rounded-2xl items-center"
            style={{ 
              backgroundColor: theme.surface,
              borderWidth: 1,
              borderColor: theme.border,
              shadowColor: theme.shadow,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4
            }}
            activeOpacity={0.8}
          >
            <View 
              className="w-16 h-16 rounded-2xl items-center justify-center mb-4"
              style={{ backgroundColor: theme.warning + '15', borderWidth: 2, borderColor: theme.warning + '30' }}
            >
              <Ionicons name='card' size={32} color={theme.warning} />
            </View>
            <Text className="text-sm font-medium mb-2" style={{ color: theme.textSecondary }}>Pending Fees</Text>
            <Text className="text-4xl font-bold mb-1" style={{ color: theme.warning }}>$1,200</Text>
            <Text className="text-xs" style={{ color: theme.textTertiary }}>Due by Dec 15</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Animated Overlay */}
      <Animated.View 
        className="absolute inset-0 bg-black"
        style={{
          opacity: overlayAnim,
          height: height,
          pointerEvents: isDrawerOpen ? 'auto' : 'none'
        }}
        pointerEvents={isDrawerOpen ? 'auto' : 'none'}
      >
        <TouchableOpacity 
          activeOpacity={1}
          className="flex-1"
          onPress={toggleDrawer}
        />
      </Animated.View>

      {/* Drawer */}
      <Animated.View 
        className="absolute top-0 left-0 w-[80%] shadow-2xl"
        style={{
          backgroundColor: theme.primary,
          height: height,
          transform: [{ translateX: slideAnim }],
        }}
      >
        {/* Close Button */}
        <View className="absolute top-12 right-4 z-10">
          <Pressable
            onPress={toggleDrawer}
            className="p-2 rounded-full bg-white/30"
          >
            <Ionicons name="close" size={24} color={theme.textInverse} />
          </Pressable>
        </View>

        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Drawer Header */}
          <View className="pt-16 pb-6 px-6">
            {/* Menu Image */}
            <View className="items-center">
              <Image
                source={require('../../assets/images/menu.png')}
                style={{ width: 100, height: 100 }}
              />
            </View>
          </View>

          {/* Menu Items */}
          <View className="px-6 mb-8">
            {menuItems.map((item, index) => (
              <TouchableOpacity 
                key={index}
                className="flex-row items-center py-4 px-4 mb-3 rounded-xl shadow-sm"
                style={{ backgroundColor: theme.surface }}
                activeOpacity={0.7}
                onPress={() => router.push(item.route)}
              >
                <View 
                  className="w-10 h-10 rounded-lg items-center justify-center mr-4"
                  style={{ backgroundColor: theme.primary + '20' }}
                >
                  <Ionicons name={item.icon} size={20} color={theme.primary} />
                </View>
                <Text className="text-lg font-medium" style={{ color: theme.text }}>{item.label}</Text>
                <View className="flex-1" />
                <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Drawer Footer */}
          <View className="px-6">
            <TouchableOpacity
              className="flex-row items-center py-4 px-4 rounded-xl shadow-sm"
              style={{ backgroundColor: theme.surface }}
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 rounded-lg items-center justify-center mr-4">
                <Image
                  source={require('../../assets/images/Logout Icon.png')}
                  style={{ width: 20, height: 20 }}
                />
              </View>
              <Text className="text-lg font-medium" style={{ color: theme.text }}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  )
}

export default Dashboard