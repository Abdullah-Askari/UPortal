import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { useAuth } from '../../../context/useAuth';
import { useTheme } from '../../../context/useTheme';

const InvoiceDetail = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { userData } = useAuth();
  const { invoiceId } = useLocalSearchParams();
  
  // Find invoice from centralized userData
  const invoiceData = userData?.invoices || {};
  let invoice = null;
  for (const year of Object.keys(invoiceData)) {
    const found = invoiceData[year].find(inv => inv.id === invoiceId);
    if (found) {
      invoice = found;
      break;
    }
  }

  if (!invoice) {
    return (
      <View className="flex-1">
        <View className="shadow-md" style={{ backgroundColor: theme.primary, paddingTop: StatusBar.currentHeight }}>
          <View className="flex-row items-center h-20 px-4 gap-4">
            <Pressable className="p-2" onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={28} color={theme.textInverse} />
            </Pressable>
            <Text className="font-semibold text-xl flex-1" style={{ color: theme.textInverse }}>Invoice Details</Text>
          </View>
        </View>
        <View className="flex-1 justify-center items-center" style={{ backgroundColor: theme.background }}>
          <Ionicons name="document-text-outline" size={48} color={theme.textTertiary} />
          <Text className="mt-4" style={{ color: theme.textSecondary }}>Invoice not found</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View className="flex-1">
      {/* Header */}
      <View className="shadow-md" style={{ backgroundColor: theme.primary, paddingTop: StatusBar.currentHeight }}>
        <View className="flex-row items-center h-20 px-4 gap-4">
          <Pressable className="p-2" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={theme.textInverse} />
          </Pressable>
          <Text className="font-semibold text-xl flex-1" style={{ color: theme.textInverse }}>Invoice Details</Text>
        </View>
      </View>
      
      {/* Content */}
      <ScrollView className="flex-1" style={{ backgroundColor: theme.background }}>
        <View className="p-6">
          {/* Invoice Header */}
          <View className="rounded-xl p-6 shadow-sm mb-4" style={{ backgroundColor: theme.surface }}>
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-2xl font-bold" style={{ color: theme.text }}>Invoice #{invoice.id}</Text>
                <Text className="text-lg" style={{ color: theme.textSecondary }}>{invoice.semester}</Text>
              </View>
              <View 
                className="px-4 py-2 rounded-full"
                style={{ backgroundColor: `${invoice.statusColor}20` }}
              >
                <Text 
                  className="font-semibold"
                  style={{ color: invoice.statusColor }}
                >
                  {invoice.status}
                </Text>
              </View>
            </View>
            
            <Text className="mb-4" style={{ color: theme.textSecondary }}>{invoice.description}</Text>
            
            {/* Amount Display */}
            <View className="rounded-lg p-4 mb-4" style={{ backgroundColor: theme.backgroundSecondary }}>
              <Text className="text-sm mb-1" style={{ color: theme.textSecondary }}>Total Amount</Text>
              <Text className="text-3xl font-bold mb-1" style={{ color: theme.text }}>{invoice.amountPKR}</Text>
              <Text className="text-sm" style={{ color: theme.textTertiary }}>({invoice.amountUSD})</Text>
            </View>
          </View>
          
          {/* Date Information */}
          <View className="rounded-xl p-6 shadow-sm mb-4" style={{ backgroundColor: theme.surface }}>
            <Text className="text-xl font-bold mb-4" style={{ color: theme.text }}>Important Dates</Text>
            
            <View className="gap-3">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: theme.primary + '20' }}>
                  <Ionicons name="calendar-outline" size={20} color={theme.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm" style={{ color: theme.textSecondary }}>Issue Date</Text>
                  <Text className="text-lg font-semibold" style={{ color: theme.text }}>{invoice.issueDate}</Text>
                </View>
              </View>
              
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: theme.error + '20' }}>
                  <Ionicons name="alarm-outline" size={20} color={theme.error} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm" style={{ color: theme.textSecondary }}>Due Date</Text>
                  <Text className="text-lg font-semibold" style={{ color: theme.text }}>{invoice.dueDate}</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Fee Breakdown */}
          <View className="rounded-xl p-6 shadow-sm mb-4" style={{ backgroundColor: theme.surface }}>
            <Text className="text-xl font-bold mb-4" style={{ color: theme.text }}>Fee Breakdown</Text>
            
            <View className="gap-3">
              {invoice.breakdown?.map((item, index) => (
                <View key={index} className="flex-row items-center justify-between py-2">
                  <Text className="flex-1" style={{ color: theme.textSecondary }}>{item.item}</Text>
                  <Text className="font-semibold" style={{ color: theme.text }}>{item.amount}</Text>
                </View>
              ))}
            </View>
            
            <View className="pt-3 mt-3" style={{ borderTopWidth: 1, borderTopColor: theme.border }}>
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-bold" style={{ color: theme.text }}>Total Amount</Text>
                <Text className="text-lg font-bold" style={{ color: theme.text }}>{invoice.amountPKR}</Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  )
}

export default InvoiceDetail