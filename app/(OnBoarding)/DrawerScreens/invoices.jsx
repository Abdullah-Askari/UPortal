import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../context/useTheme';

const invoices = () => {
  const router = useRouter();
  const { theme } = useTheme();
  return (
    <View
    className="flex-1">
      {/* Header */}
       <View className="shadow-md" style={{ backgroundColor: theme.primary, paddingTop: StatusBar.currentHeight }}>
        <View className="flex-row items-center h-20 px-4 gap-4">
          <Pressable className="p-2" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={theme.textInverse} />
          </Pressable>
          <Text className="font-semibold text-xl flex-1" style={{ color: theme.textInverse }}>Invoices</Text>
        </View>
      </View>
      {/* Content */}
      <View className="flex-1 p-6" style={{ backgroundColor: theme.background }}>
        {/* 2024 Year Section */}
        <View className="rounded-xl p-6 shadow-sm mb-4" style={{ backgroundColor: theme.surface }}>
          <Text className="text-2xl font-bold mb-4" style={{ color: theme.text }}>2024</Text>
          
          {/* Fall 2024 Invoice */}
          <View className="pt-4 mb-4" style={{ borderTopWidth: 1, borderTopColor: theme.border }}>
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-1">
                <Text className="text-lg font-medium" style={{ color: theme.textSecondary }}>Invoice #20241001</Text>
                <Text className="font-semibold" style={{ color: theme.success }}>Status: Paid</Text>
                <Text style={{ color: theme.textSecondary }}>Fall 2024</Text>
              </View>
              <TouchableOpacity 
                onPress={() => router.push('/(OnBoarding)/DrawerScreens/invoice-detail?invoiceId=20241001')}
                className="rounded-lg py-2 px-4 flex-row items-center"
                style={{ backgroundColor: theme.primary }}
                activeOpacity={0.7}
              >
                <Text className="font-medium mr-2" style={{ color: theme.textInverse }}>View Details</Text>
                <Ionicons name="chevron-forward" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Spring 2024 Invoice */}
          <View className="pt-4" style={{ borderTopWidth: 1, borderTopColor: theme.border }}>
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-1">
                <Text className="text-lg font-medium" style={{ color: theme.textSecondary }}>Invoice #20241002</Text>
                <Text className="font-semibold" style={{ color: theme.success }}>Status: Paid</Text>
                <Text style={{ color: theme.textSecondary }}>Spring 2024</Text>
              </View>
              <TouchableOpacity 
                onPress={() => router.push('/(OnBoarding)/DrawerScreens/invoice-detail?invoiceId=20241002')}
                className="rounded-lg py-2 px-4 flex-row items-center"
                style={{ backgroundColor: theme.primary }}
                activeOpacity={0.7}
              >
                <Text className="font-medium mr-2" style={{ color: theme.textInverse }}>View Details</Text>
                <Ionicons name="chevron-forward" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 2023 Year Section */}
        <View className="rounded-xl p-6 shadow-sm mb-4" style={{ backgroundColor: theme.surface }}>
          <Text className="text-2xl font-bold mb-4" style={{ color: theme.text }}>2023</Text>
          
          {/* Fall 2023 Invoice */}
          <View className="pt-4 mb-4" style={{ borderTopWidth: 1, borderTopColor: theme.border }}>
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-1">
                <Text className="text-lg font-medium" style={{ color: theme.textSecondary }}>Invoice #20231001</Text>
                <Text className="font-semibold" style={{ color: theme.success }}>Status: Paid</Text>
                <Text style={{ color: theme.textSecondary }}>Fall 2023</Text>
              </View>
              <TouchableOpacity 
                onPress={() => router.push('/(OnBoarding)/DrawerScreens/invoice-detail?invoiceId=20231001')}
                className="rounded-lg py-2 px-4 flex-row items-center"
                style={{ backgroundColor: theme.primary }}
                activeOpacity={0.7}
              >
                <Text className="font-medium mr-2" style={{ color: theme.textInverse }}>View Details</Text>
                <Ionicons name="chevron-forward" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Spring 2023 Invoice */}
          <View className="pt-4" style={{ borderTopWidth: 1, borderTopColor: theme.border }}>
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-1">
                <Text className="text-lg font-medium" style={{ color: theme.textSecondary }}>Invoice #20231002</Text>
                <Text className="font-semibold" style={{ color: theme.success }}>Status: Paid</Text>
                <Text style={{ color: theme.textSecondary }}>Spring 2023</Text>
              </View>
              <TouchableOpacity 
                onPress={() => router.push('/(OnBoarding)/DrawerScreens/invoice-detail?invoiceId=20231002')}
                className="rounded-lg py-2 px-4 flex-row items-center"
                style={{ backgroundColor: theme.primary }}
                activeOpacity={0.7}
              >
                <Text className="font-medium mr-2" style={{ color: theme.textInverse }}>View Details</Text>
                <Ionicons name="chevron-forward" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default invoices