import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../context/useAuth';
import { useTheme } from '../../../context/useTheme';

const gradebook = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { userData } = useAuth();
  const [selectedSemester, setSelectedSemester] = useState('');
  
  // Get data from centralized userData
  const semesterData = userData?.gradebook || {};
  const semesters = Object.keys(semesterData);
  
  // Set default semester on mount
  useEffect(() => {
    if (semesters.length > 0 && !selectedSemester) {
      setSelectedSemester(semesters[0]);
    }
  }, [semesters]);
  
  const currentSemesterGrades = semesterData[selectedSemester] || [];
  const totalCredits = currentSemesterGrades.reduce((sum, subject) => sum + subject.credits, 0);
  const weightedGPA = currentSemesterGrades.reduce((sum, subject) => sum + (subject.gpa * subject.credits), 0) / totalCredits;
  
  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return '#10B981';
    if (grade.startsWith('B')) return '#F59E0B';
    if (grade.startsWith('C')) return '#EF4444';
    return '#6B7280';
  };
  
  return (
    <View className="flex-1">
      {/* Header */}
      <View className="shadow-md" style={{ backgroundColor: theme.primary, paddingTop: StatusBar.currentHeight }}>
        <View className="flex-row items-center h-20 px-4 gap-4">
          <Pressable className="p-2" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={theme.textInverse} />
          </Pressable>
          <Text className="font-semibold text-xl flex-1" style={{ color: theme.textInverse }}>Gradebook</Text>
        </View>
      </View>
      
      {/* Content */}
      <ScrollView className="flex-1" style={{ backgroundColor: theme.background }}>
        {/* Semester Selector */}
        <View className="p-6 pb-4">
          <Text className="text-lg font-semibold mb-3" style={{ color: theme.text }}>Select Semester</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3">
              {semesters.map((semester) => (
                <TouchableOpacity
                  key={semester}
                  onPress={() => setSelectedSemester(semester)}
                  className="px-4 py-2 rounded-lg"
                  style={{ 
                    backgroundColor: selectedSemester === semester ? theme.primary : theme.surface
                  }}
                >
                  <Text className="font-medium" style={{
                    color: selectedSemester === semester ? theme.textInverse : theme.text
                  }}>
                    {semester}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Semester Stats */}
        <View className="px-6 pb-4">
          <View className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: theme.surface }}>
            <View className="flex-row justify-between items-center">
              <View className="items-center flex-1">
                <Text className="text-sm" style={{ color: theme.textSecondary }}>Semester GPA</Text>
                <Text className="text-2xl font-bold" style={{ color: theme.text }}>{weightedGPA.toFixed(2)}</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-sm" style={{ color: theme.textSecondary }}>Total Credits</Text>
                <Text className="text-2xl font-bold" style={{ color: theme.text }}>{totalCredits}</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-sm" style={{ color: theme.textSecondary }}>Subjects</Text>
                <Text className="text-2xl font-bold" style={{ color: theme.text }}>{currentSemesterGrades.length}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Subject Grades */}
        <View className="px-6 pb-6">
          <Text className="text-lg font-semibold mb-3" style={{ color: theme.text }}>{selectedSemester} Grades</Text>
          <View className="gap-3">
            {currentSemesterGrades.map((subject, index) => (
              <View key={index} className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: theme.surface }}>
                <View className="flex-row items-center">
                  <View 
                    className="w-12 h-12 rounded-lg items-center justify-center mr-4"
                    style={{ backgroundColor: `${subject.color}20` }}
                  >
                    <Ionicons name="book-outline" size={20} color={subject.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-semibold" style={{ color: theme.text }}>{subject.name}</Text>
                    <Text className="text-sm" style={{ color: theme.textSecondary }}>{subject.code} • {subject.credits} Credits</Text>
                  </View>
                  <View className="items-end">
                    <Text 
                      className="text-2xl font-bold"
                      style={{ color: getGradeColor(subject.grade) }}
                    >
                      {subject.grade}
                    </Text>
                    <Text className="text-xs" style={{ color: theme.textTertiary }}>{subject.gpa} GPA</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default gradebook