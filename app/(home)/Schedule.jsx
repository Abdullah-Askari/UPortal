import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";

const weeklySchedule = [
  {
    day: "Monday",
    classes: [
      {
        subject: "Calculus",
        time: "9:00 AM - 10:30 AM",
        room: "Room 301",
        professor: "Dr. Smith",
        color: "#3B82F6",
        icon: "calculator"
      },
      {
        subject: "Physics",
        time: "2:00 PM - 3:30 PM",
        room: "Lab 205",
        professor: "Dr. Johnson",
        color: "#EF4444",
        icon: "flask"
      }
    ]
  },
  {
    day: "Tuesday",
    classes: [
      {
        subject: "Computer Science",
        time: "10:00 AM - 11:30 AM",
        room: "CS Building",
        professor: "Prof. Davis",
        color: "#10B981",
        icon: "desktop"
      },
      {
        subject: "Calculus",
        time: "1:00 PM - 2:30 PM",
        room: "Room 301",
        professor: "Dr. Smith",
        color: "#3B82F6",
        icon: "calculator"
      }
    ]
  },
  {
    day: "Wednesday",
    classes: [
      {
        subject: "Physics",
        time: "9:00 AM - 10:30 AM",
        room: "Lab 205",
        professor: "Dr. Johnson",
        color: "#EF4444",
        icon: "flask"
      }
    ]
  },
  {
    day: "Thursday",
    classes: [
      {
        subject: "Computer Science",
        time: "11:00 AM - 12:30 PM",
        room: "CS Building",
        professor: "Prof. Davis",
        color: "#10B981",
        icon: "desktop"
      },
      {
        subject: "Calculus",
        time: "2:00 PM - 3:30 PM",
        room: "Room 301",
        professor: "Dr. Smith",
        color: "#3B82F6",
        icon: "calculator"
      }
    ]
  },
  {
    day: "Friday",
    classes: [
      {
        subject: "Physics",
        time: "10:00 AM - 11:30 AM",
        room: "Lab 205",
        professor: "Dr. Johnson",
        color: "#EF4444",
        icon: "flask"
      }
    ]
  }
];

export default function Schedule() {
  const router = useRouter();
  return (
    <View className="flex-1">
      {/* Header */}
      <View className="bg-[#86C3E5] shadow-md" style={{ paddingTop: StatusBar.currentHeight }}>
        <View className="flex-row items-center h-20 px-4 gap-4">
          <Pressable className="p-2"
          onPress={()=>router.back()}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </Pressable>
          <Text className="text-black font-semibold text-xl flex-1">Schedule</Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 bg-[#CEEDFF] p-6">
        <Text className="text-2xl font-bold text-gray-800 mb-6">This Week</Text>
        
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {weeklySchedule.map((daySchedule, dayIndex) => (
            <View key={dayIndex} className="mb-6">
              <Text className="text-lg font-bold text-gray-800 mb-3">{daySchedule.day}</Text>
              
              {daySchedule.classes.map((classItem, classIndex) => (
                <View 
                  key={classIndex} 
                  className="bg-white rounded-xl p-4 mb-3 shadow-sm"
                >
                  <View className="flex-row items-center">
                    <View 
                      className="w-12 h-12 rounded-full items-center justify-center mr-4"
                      style={{ backgroundColor: `${classItem.color}20` }}
                    >
                      <Ionicons name={classItem.icon} size={24} color={classItem.color} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-800">{classItem.subject}</Text>
                      <Text className="text-gray-600 text-sm mt-1">{classItem.time}</Text>
                      <View className="flex-row items-center mt-1">
                        <Ionicons name="location-outline" size={12} color="#6B7280" />
                        <Text className="text-gray-500 text-xs ml-1">{classItem.room}</Text>
                        <Text className="text-gray-400 mx-2">•</Text>
                        <Text className="text-gray-500 text-xs">{classItem.professor}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
