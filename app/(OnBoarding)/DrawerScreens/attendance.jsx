import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../context/useAuth';
import { useTheme } from '../../../context/useTheme';

const attendance = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { userData } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState('');
  
  // Get data from centralized userData
  const attendanceData = userData?.attendance || {};
  const months = Object.keys(attendanceData);
  
  // Set default month on mount
  useEffect(() => {
    if (months.length > 0 && !selectedMonth) {
      setSelectedMonth(months[0]);
    }
  }, [months]);
  
  const currentMonthData = attendanceData[selectedMonth] || [];
  const totalClasses = currentMonthData.reduce((sum, subject) => sum + subject.total, 0);
  const totalPresent = currentMonthData.reduce((sum, subject) => sum + subject.present, 0);
  const overallPercentage = totalClasses > 0 ? ((totalPresent / totalClasses) * 100).toFixed(1) : 0;
  
  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return '#10B981';
    if (percentage >= 75) return '#F59E0B';
    return '#EF4444';
  };
  
  const getAttendanceStatus = (percentage) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 75) return 'Good';
    return 'Low';
  };
  
  return (
    <View className="flex-1">
      {/* Header */}
      <View className="shadow-md" style={{ backgroundColor: theme.primary, paddingTop: StatusBar.currentHeight }}>
        <View className="flex-row items-center h-20 px-4 gap-4">
          <Pressable className="p-2" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={theme.textInverse} />
          </Pressable>
          <Text className="font-semibold text-xl flex-1" style={{ color: theme.textInverse }}>Attendance</Text>
        </View>
      </View>
      
      {/* Content */}
      <ScrollView className="flex-1" style={{ backgroundColor: theme.background }}>
        {/* Month Selector */}
        <View className="p-6 pb-4">
          <Text className="text-lg font-semibold mb-3" style={{ color: theme.text }}>Select Month</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3">
              {months.map((month) => (
                <TouchableOpacity
                  key={month}
                  onPress={() => setSelectedMonth(month)}
                  className="px-4 py-2 rounded-lg"
                  style={{ 
                    backgroundColor: selectedMonth === month ? theme.primary : theme.surface
                  }}
                >
                  <Text className="font-medium" style={{
                    color: selectedMonth === month ? theme.textInverse : theme.text
                  }}>
                    {month}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Overall Stats */}
        <View className="px-6 pb-4">
          <View className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: theme.surface }}>
            <View className="flex-row justify-between items-center">
              <View className="items-center flex-1">
                <Text className="text-sm" style={{ color: theme.textSecondary }}>Overall</Text>
                <Text 
                  className="text-2xl font-bold"
                  style={{ color: getAttendanceColor(parseFloat(overallPercentage)) }}
                >
                  {overallPercentage}%
                </Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-sm" style={{ color: theme.textSecondary }}>Present</Text>
                <Text className="text-2xl font-bold" style={{ color: theme.text }}>{totalPresent}</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-sm" style={{ color: theme.textSecondary }}>Total Classes</Text>
                <Text className="text-2xl font-bold" style={{ color: theme.text }}>{totalClasses}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Subject Attendance */}
        <View className="px-6 pb-6">
          <Text className="text-lg font-semibold mb-3" style={{ color: theme.text }}>{selectedMonth} Attendance</Text>
          <View className="gap-3">
            {currentMonthData.map((subject, index) => (
              <View key={index} className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: theme.surface }}>
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center flex-1">
                    <View 
                      className="w-12 h-12 rounded-lg items-center justify-center mr-4"
                      style={{ backgroundColor: `${subject.color}20` }}
                    >
                      <Ionicons name="calendar-outline" size={20} color={subject.color} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold" style={{ color: theme.text }}>{subject.subject}</Text>
                      <Text className="text-sm" style={{ color: theme.textSecondary }}>
                        {subject.present}/{subject.total} Classes
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text 
                      className="text-2xl font-bold"
                      style={{ color: getAttendanceColor(subject.percentage) }}
                    >
                      {subject.percentage}%
                    </Text>
                    <Text 
                      className="text-xs font-medium"
                      style={{ color: getAttendanceColor(subject.percentage) }}
                    >
                      {getAttendanceStatus(subject.percentage)}
                    </Text>
                  </View>
                </View>
                
                {/* Progress Bar */}
                <View className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.border }}>
                  <View 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${subject.percentage}%`,
                      backgroundColor: getAttendanceColor(subject.percentage)
                    }}
                  />
                </View>
                
                {/* Absent Info */}
                {subject.absent > 0 && (
                  <View className="mt-2 flex-row items-center">
                    <Ionicons name="warning-outline" size={14} color="#EF4444" />
                    <Text className="text-red-500 text-xs ml-1">
                      {subject.absent} absent day{subject.absent > 1 ? 's' : ''}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default attendance