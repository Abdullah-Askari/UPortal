import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

const OnBoarding = () => {
  const router = useRouter();
  return (
    <View className="flex-1 bg-[#CEEDFF]">
      <TouchableOpacity 
      activeOpacity={0.7}
        onPress={() => {router.push('/(auth)/SignIn')}}
        style={{ position: 'absolute', top: 50, right: 20, zIndex: 10 }}
      >
        <Text className="text-[#001C27] font-semibold text-base">Skip</Text>
      </TouchableOpacity>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
        <Text style={{ 
          color: '#001C27', 
          fontWeight: 'bold', 
          fontSize: 28, 
          lineHeight: 36,
          textAlign: 'center',
          marginBottom: 24
        }}>
          Stay Updated!
        </Text>
        
        <Text style={{ 
          color: '#001C27', 
          textAlign: 'center', 
          fontSize: 16,
          lineHeight: 22,
          marginBottom: 32
        }}>
          Get real-time notifications about your course timing on your device.
        </Text>
        
        <Image
          source={require('../../assets/images/Illustration.png')}
          style={{ width: 300, height: 300 }}
          resizeMode="contain"
        />
      </View>
      <TouchableOpacity
      activeOpacity={0.7}
      onPress={()=>{router.push('/(OnBoarding)/OnBoarding2')}}
      style={{ position: 'absolute', bottom: 50, right: 20, zIndex: 10,
        borderRadius: 8,
        backgroundColor: '#2D9CDB',
        paddingVertical: 12,
        paddingHorizontal: 54,
       }}>
        <Text
        style={{ color: 'white' , fontWeight: '600', fontSize: 16 }}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnBoarding;
