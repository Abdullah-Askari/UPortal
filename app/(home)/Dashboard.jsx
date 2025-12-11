import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Alert, Animated, BackHandler, Dimensions, Pressable, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { useAuth } from '../../context/useAuth'
import { useTheme } from '../../context/useTheme'

const { width, height } = Dimensions.get('window')

const Dashboard = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, userData, signOut } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const slideAnim = useRef(new Animated.Value(-width * 0.8)).current
  const overlayAnim = useRef(new Animated.Value(0)).current
  
  // Get data from centralized userData
  const dashboardData = userData?.dashboard || {
    grades: '0%',
    attendance: '0%',
    pendingFees: 'PKR 0',
    dueDate: 'N/A'
  };
  
  // Get today's classes from schedule
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];
  const schedule = userData?.schedule || [];
  const todaySchedule = schedule.find(s => s.day === today);
  const todayClasses = todaySchedule?.classes || [];

  // Prevent back button from going to auth/onboarding screens
  useEffect(() => {
    const backAction = () => {
      if (isDrawerOpen) {
        toggleDrawer();
        return true;
      }
      // Show exit confirmation or just prevent back
      Alert.alert('Exit App', 'Are you sure you want to exit?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [isDrawerOpen]);

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            const result = await signOut();
            if (result.success) {
              router.replace('/(auth)/SignIn');
            }
          }
        }
      ]
    );
  };

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
        {/* Today's Classes */}
        <Text className="text-lg font-bold mb-4" style={{ color: theme.text }}>Today's Classes - {today}</Text>
        <View className="gap-4 mb-8">
          {todayClasses.length > 0 ? (
            todayClasses.map((classItem, index) => (
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
                    backgroundColor: (classItem.color || theme.primary) + '15',
                    borderWidth: 2,
                    borderColor: (classItem.color || theme.primary) + '30'
                  }}
                >
                  <Ionicons name={classItem.icon || 'book'} size={32} color={classItem.color || theme.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-bold mb-1" style={{ color: theme.text }}>{classItem.subject}</Text>
                  <Text className="text-sm" style={{ color: theme.textSecondary }}>{classItem.time}</Text>
                  <Text className="text-xs mt-1" style={{ color: theme.textTertiary }}>{classItem.room} • {classItem.professor}</Text>
                </View>
              </View>
            ))
          ) : (
            <View 
              className="p-8 rounded-2xl items-center"
              style={{ 
                backgroundColor: theme.surface,
                borderWidth: 1,
                borderColor: theme.border,
              }}
            >
              <Ionicons name="calendar-outline" size={48} color={theme.textTertiary} />
              <Text className="text-lg font-medium mt-3" style={{ color: theme.textSecondary }}>No Classes Today</Text>
              <Text className="text-sm mt-1" style={{ color: theme.textTertiary }}>Enjoy your day off!</Text>
            </View>
          )}
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
              <Text className="text-3xl font-bold" style={{ color: theme.success }}>{dashboardData.grades}</Text>
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
              <Text className="text-3xl font-bold" style={{ color: theme.primary }}>{dashboardData.attendance}</Text>
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
            <Text className="text-4xl font-bold mb-1" style={{ color: theme.warning }}>{dashboardData.pendingFees}</Text>
            <Text className="text-xs" style={{ color: theme.textTertiary }}>Due by {dashboardData.dueDate}</Text>
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
              onPress={handleLogout}
            >
              <View 
                className="w-10 h-10 rounded-lg items-center justify-center mr-4"
                style={{ backgroundColor: theme.error + '20' }}
              >
                <Ionicons name="log-out-outline" size={20} color={theme.error} />
              </View>
              <Text className="text-lg font-medium" style={{ color: theme.error }}>Logout</Text>
              <View className="flex-1" />
              <Ionicons name="chevron-forward" size={20} color={theme.error} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  )
}

export default Dashboard