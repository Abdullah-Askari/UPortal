import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { uploadToCloudinary } from '../../cloudinaryConfig';
import { useAuth } from '../../context/useAuth';
import { useTheme } from '../../context/useTheme';
import { updateProfile } from '../../firestore';
import KeyboardView from '../components/KeyboardView';

const Profile = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, userData, updateUserProfile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Get profile data from centralized userData
  const profileData = userData?.profile || {
    name: '',
    email: '',
    address: '',
    dob: '',
    profilePicture: ''
  };

  // Use refs for editable fields
  const nameRef = useRef(profileData.name);
  const emailRef = useRef(profileData.email);
  const addressRef = useRef(profileData.address);
  const dobRef = useRef(profileData.dob);

  // Handle edit toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset refs to original values
      nameRef.current = profileData.name;
      emailRef.current = profileData.email;
      addressRef.current = profileData.address;
      dobRef.current = profileData.dob;
      setIsEditing(false);
    } else {
      // Start editing 
      setIsEditing(true);
    }
  };

  // Pick image from gallery
  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to change your profile picture.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera permissions to take a photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  // Upload image to Cloudinary and save URL
  const uploadProfilePicture = async (imageUri) => {
    setUploading(true);
    try {
      const { url } = await uploadToCloudinary(imageUri);
      
      // Update profile with new picture URL
      await updateUserProfile({ 
        profile: { 
          ...profileData, 
          profilePicture: url 
        } 
      });
      
      Alert.alert('Success', 'Profile picture updated!');
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Show options for changing profile picture
  const handleChangeProfilePicture = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Save profile changes
  const handleSaveChanges = async () => {
    if (!user?.uid) {
      Alert.alert('Error', 'You must be logged in to save changes');
      return;
    }
    
    const editedProfile = {
      name: nameRef.current,
      email: emailRef.current,
      address: addressRef.current,
      dob: dobRef.current,
      profilePicture: profileData.profilePicture
    };
    
    try {
      const result = await updateProfile(user.uid, editedProfile);
      if (result.success) {
        // Update local state
        await updateUserProfile({ profile: editedProfile });
        setIsEditing(false);
        Alert.alert('Success', 'Profile saved successfully!');
      } else {
        Alert.alert('Error', result.error || 'Failed to save profile');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  // Handle date picker change
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      dobRef.current = formattedDate;
    }
  };

  // Parse date string to Date object
  const parseDate = (dateString) => {
    if (!dateString) return new Date();
    const parsed = new Date(dateString);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  return (
    <View className="flex-1">
      {/* Header */}
            <View className="shadow-md" style={{ backgroundColor: theme.primary, paddingTop: StatusBar.currentHeight }}>
              <View className="flex-row items-center h-20 px-4 gap-4">
                <Pressable className="p-2"
                onPress={()=>router.back()}>
                  <Ionicons name="arrow-back" size={28} color={theme.textInverse} />
                </Pressable>
                <Text className="font-semibold text-xl flex-1" style={{ color: theme.textInverse }}>Profile</Text>
              </View>
            </View>
            {/* Content */}
            <KeyboardView contentContainerStyle={{ padding: 24, backgroundColor: theme.background }}>
              
              {/* Edit Button  */}
              <View className="flex-row justify-end mb-4">
                <TouchableOpacity
                  className="px-4 py-2 rounded-lg flex-row items-center gap-2"
                  style={{ backgroundColor: isEditing ? theme.textSecondary : theme.primary }}
                  onPress={handleEditToggle}
                >
                  <Ionicons name={isEditing ? "close-outline" : "create-outline"} size={16} color={theme.textInverse} />
                  <Text className="font-semibold" style={{ color: theme.textInverse }}>{isEditing ? 'Cancel' : 'Edit'}</Text>
                </TouchableOpacity>
              </View>

              <View className="flex justify-center items-center mb-6">
                {/* Profile Picture */}
                <TouchableOpacity 
                  onPress={handleChangeProfilePicture}
                  disabled={uploading}
                  activeOpacity={0.8}
                >
                  <View className="w-40 h-40 rounded-full border-4 overflow-hidden" style={{ borderColor: theme.border }}>
                    {uploading ? (
                      <View className="w-full h-full items-center justify-center" style={{ backgroundColor: theme.surface }}>
                        <ActivityIndicator size="large" color={theme.primary} />
                        <Text className="text-xs mt-2" style={{ color: theme.textSecondary }}>Uploading...</Text>
                      </View>
                    ) : (
                      <Image
                        source={profileData.profilePicture 
                          ? { uri: profileData.profilePicture } 
                          : require('../../assets/images/Illustration-1.png')
                        }
                        style={{ width: 160, height: 160 }}
                        contentFit="cover"
                      />
                    )}
                  </View>
                  {/* Camera Icon Overlay */}
                  <View 
                    className="absolute bottom-0 right-0 w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: theme.primary }}
                  >
                    <Ionicons name="camera" size={20} color={theme.textInverse} />
                  </View>
                </TouchableOpacity>
              </View>
              
              {/* User Information [name]*/}
              <View className="rounded-xl p-4 shadow-sm mb-4" style={{ backgroundColor: theme.surface }}>
                <Text className="text-sm mb-1" style={{ color: theme.textSecondary }}>Name</Text>
                {isEditing ? (
                  <TextInput
                    className="text-lg font-semibold"
                    style={{ color: theme.text, padding: 0 }}
                    defaultValue={nameRef.current}
                    onChangeText={(text) => nameRef.current = text}
                    placeholder="Enter your name"
                    placeholderTextColor={theme.textSecondary}
                  />
                ) : (
                  <Text className="text-lg font-semibold" style={{ color: theme.text }}>{profileData.name || 'Not set'}</Text>
                )}
              </View>
                  
                  {/* User Information [email]*/}
                  <View className="rounded-xl p-4 shadow-sm mb-4" style={{ backgroundColor: theme.surface }}>
                    <Text className="text-sm mb-1" style={{ color: theme.textSecondary }}>Email</Text>
                    {isEditing ? (
                      <TextInput
                        className="text-lg font-semibold"
                        style={{ color: theme.text, padding: 0 }}
                        defaultValue={emailRef.current}
                        onChangeText={(text) => emailRef.current = text}
                        placeholder="Enter your email"
                        placeholderTextColor={theme.textSecondary}
                        keyboardType="email-address"
                      />
                    ) : (
                      <Text className="text-lg font-semibold" style={{ color: theme.text }}>{user?.email}</Text>
                    )}
                  </View>
                  {/* User Information [address]*/}
                  <View className="rounded-xl p-4 shadow-sm mb-4" style={{ backgroundColor: theme.surface }}>
                    <Text className="text-sm mb-1" style={{ color: theme.textSecondary }}>Address</Text>
                    {isEditing ? (
                      <TextInput
                        className="text-lg font-semibold"
                        style={{ color: theme.text, padding: 0 }}
                        defaultValue={addressRef.current}
                        onChangeText={(text) => addressRef.current = text}
                        placeholder="Enter your address"
                        placeholderTextColor={theme.textSecondary}
                        multiline
                      />
                    ) : (
                      <Text className="text-lg font-semibold" style={{ color: theme.text }}>{profileData.address || 'Not set'}</Text>
                    )}
                  </View>

                  {/* User Information [D.O.B]*/}
                  <View className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: theme.surface }}>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="text-sm mb-1" style={{ color: theme.textSecondary }}>D.O.B</Text>
                        {isEditing ? (
                          <Text className="text-lg font-semibold" style={{ color: theme.text }}>
                            {dobRef.current || 'Select date of birth'}
                          </Text>
                        ) : (
                          <Text className="text-lg font-semibold" style={{ color: theme.text }}>{profileData.dob || 'Not set'}</Text>
                        )}
                      </View>
                      {isEditing && (
                        <Pressable className="ml-4 p-2" onPress={() => setShowDatePicker(true)}>
                          <Ionicons name="calendar-outline" size={24} color={theme.primary} />
                        </Pressable>
                      )}
                    </View>
                  </View>

                  {/* Date Picker Modal */}
                  {showDatePicker && (
                    <DateTimePicker
                      value={parseDate(dobRef.current)}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                    />
                  )}
                  
                  {/* Save Button - Only show when editing */}
                  {isEditing && (
                    <TouchableOpacity 
                      className="rounded-xl p-4 shadow-sm mt-4 items-center" 
                      style={{ backgroundColor: theme.primary }}
                      onPress={handleSaveChanges}
                    >
                      <Text className="text-lg font-semibold" style={{ color: theme.textInverse }}>Save Changes</Text>
                    </TouchableOpacity>
                  )}
            </KeyboardView>
    </View>
  )
}

export default Profile