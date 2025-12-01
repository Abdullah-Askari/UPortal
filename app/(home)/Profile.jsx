import { View, Text,Pressable,StatusBar, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

const Profile = () => {
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
                <Text className="text-black font-semibold text-xl flex-1">Profile</Text>
              </View>
            </View>
            {/* Edit Button */}
            <View className="flex-1 bg-[#CEEDFF] p-6">
              <View className="flex-row justify-end mb-6">
                <TouchableOpacity className="flex-row items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                  <Ionicons name="create-outline" size={20} color="#2D9CDB" />
                  <Text className="text-blue-600 ml-2 font-medium">Edit</Text>
                </TouchableOpacity>
              </View>
              
              <View className="flex justify-center items-center mb-6">
                {/* Profile Picture */}
                <View className="w-40 h-40 rounded-full border-4 border-gray-300 overflow-hidden">
                  <Image
                  source={require('../../assets/images/Illustration-1.png')}
                  style={{ width: 160, height: 160 }}
                  contentFit="cover"
                  />
                </View>
              </View>
              
              {/* User Information [name]*/}
              <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
                <Text className="text-gray-600 text-sm mb-1">Name</Text>
                <Text className="text-lg font-semibold text-gray-800">John Doe</Text>
              </View>
                  
                  {/* User Information [email]*/}
                  <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
                    <Text className="text-gray-600 text-sm mb-1">Email</Text>
                    <Text className="text-lg font-semibold text-gray-800">john.doe@example.com</Text>
                  </View>
                  {/* User Information [address]*/}
                  <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
                    <Text className="text-gray-600 text-sm mb-1">Address</Text>
                    <Text className="text-lg font-semibold text-gray-800">123 Main St, Springfield</Text>
                  </View>

                  {/* User Information [D.O.B]*/}
                  <View className="bg-white rounded-xl p-4 shadow-sm">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="text-gray-600 text-sm mb-1">D.O.B</Text>
                        <Text className="text-lg font-semibold text-gray-800">January 15, 1995</Text>
                      </View>
                      <Pressable className="ml-4" onPress={() => console.log('Calendar pressed')}>
                        <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                      </Pressable>
                    </View>
                  </View>
                  
                  {/* Save Button */}
                  <TouchableOpacity className="bg-white rounded-xl p-4 shadow-sm mt-4 items-center">
                    <Text className="text-lg font-semibold text-blue-600">Save Changes</Text>
                  </TouchableOpacity>
                </View>
    </View>
  )
}

export default Profile