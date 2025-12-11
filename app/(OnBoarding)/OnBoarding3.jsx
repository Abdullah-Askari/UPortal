import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/useAuth';
import { useTheme } from '../../context/useTheme';

const OnBoarding3 = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { completeOnboarding } = useAuth();

  const handleContinue = async () => {
    await completeOnboarding();
    router.replace('/(auth)/SignIn');
  };

   return (
     <View className="flex-1" style={{ backgroundColor: theme.background }}>
       <TouchableOpacity 
         activeOpacity={0.7}
         onPress={handleContinue}
         style={{ position: 'absolute', top: 50, right: 20, zIndex: 10 }}
       >
         <Text style={{ color: theme.text, fontWeight: '600', fontSize: 16 }}>Skip</Text>
       </TouchableOpacity>
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
         <Text style={{ 
           color: theme.text, 
           fontWeight: 'bold', 
           fontSize: 28, 
           lineHeight: 36,
           textAlign: 'center',
           marginBottom: 24
         }}>
          Course Enrollment
         </Text>
         
         <Text style={{ 
           color: theme.textSecondary, 
           textAlign: 'center', 
           fontSize: 16,
           lineHeight: 22,
           marginBottom: 32
         }}>
                Enroll in your desired courses with just a few taps.
         </Text>
         
         <Image
           source={require('../../assets/images/Illustration-1.png')}
           style={{ width: 300, height: 300 }}
           contentFit="contain"
         />
       </View>
       <TouchableOpacity
       activeOpacity={0.7}
      onPress={handleContinue}
       style={{ position: 'absolute', bottom: 50, right: 20, zIndex: 10,
         borderRadius: 8,
         backgroundColor: theme.primary,
         paddingVertical: 12,
         paddingHorizontal: 54,
        }}>
         <Text
         style={{ color: 'white' , fontWeight: '600', fontSize: 16 }}>
            Let's Go
         </Text>
       </TouchableOpacity>
     </View>
   );
}

export default OnBoarding3