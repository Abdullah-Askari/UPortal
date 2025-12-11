import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../context/useAuth';
import { useTheme } from '../../../context/useTheme';

const invoices = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { userData } = useAuth();
  
  // Get data from centralized userData
  const invoiceData = userData?.invoices || {};

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
      <ScrollView className="flex-1 p-6" style={{ backgroundColor: theme.background }}>
        {Object.keys(invoiceData).length === 0 ? (
          <View className="items-center py-10">
            <Ionicons name="document-text-outline" size={48} color={theme.textTertiary} />
            <Text className="mt-4" style={{ color: theme.textSecondary }}>No invoices found</Text>
          </View>
        ) : (
          Object.keys(invoiceData).map((year) => (
            <View key={year} className="rounded-xl p-6 shadow-sm mb-4" style={{ backgroundColor: theme.surface }}>
              <Text className="text-2xl font-bold mb-4" style={{ color: theme.text }}>{year}</Text>
              
              {invoiceData[year].map((invoice, index) => (
                <View key={invoice.id} className="pt-4 mb-4" style={{ borderTopWidth: index > 0 ? 1 : 0, borderTopColor: theme.border }}>
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-1">
                      <Text className="text-lg font-medium" style={{ color: theme.textSecondary }}>Invoice #{invoice.id}</Text>
                      <Text className="font-semibold" style={{ color: invoice.statusColor || theme.success }}>Status: {invoice.status}</Text>
                      <Text style={{ color: theme.textSecondary }}>{invoice.semester}</Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => router.push(`/(OnBoarding)/DrawerScreens/invoice-detail?invoiceId=${invoice.id}`)}
                      className="rounded-lg py-2 px-4 flex-row items-center"
                      style={{ backgroundColor: theme.primary }}
                      activeOpacity={0.7}
                    >
                      <Text className="font-medium mr-2" style={{ color: theme.textInverse }}>View Details</Text>
                      <Ionicons name="chevron-forward" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default invoices