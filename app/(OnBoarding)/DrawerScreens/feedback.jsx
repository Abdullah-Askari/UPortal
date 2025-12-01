import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../context/useTheme';

const Feedback = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState('received');
  const [newFeedback, setNewFeedback] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [rating, setRating] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef(null);
  const textInputRef = useRef(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      // Scroll to the text input when keyboard appears
      setTimeout(() => {
        if (scrollViewRef.current && textInputRef.current) {
          textInputRef.current.measure((x, y, width, height, pageX, pageY) => {
            scrollViewRef.current.scrollTo({
              y: pageY - 100,
              animated: true,
            });
          });
        }
      }, 100);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);
  
  const receivedFeedback = [
    {
      id: 1,
      subject: 'Calculus III',
      instructor: 'Dr. Sarah Ahmed',
      date: '2024-11-28',
      type: 'Assignment',
      rating: 4,
      message: 'Excellent work on the integration problems. Your step-by-step approach shows good understanding. Keep up the great work!',
      color: '#4F46E5'
    },
    {
      id: 2,
      subject: 'Physics II',
      instructor: 'Prof. Muhammad Hassan',
      date: '2024-11-25',
      type: 'Lab Report',
      rating: 5,
      message: 'Outstanding lab report! Your analysis of the electromagnetic field experiments was thorough and accurate.',
      color: '#059669'
    },
    {
      id: 3,
      subject: 'Computer Science',
      instructor: 'Dr. Fatima Khan',
      date: '2024-11-22',
      type: 'Project',
      rating: 3,
      message: 'Good effort on the programming project. However, your code could be more optimized. Consider using better algorithms for improved performance.',
      color: '#DC2626'
    },
    {
      id: 4,
      subject: 'English Literature',
      instructor: 'Ms. Ayesha Ali',
      date: '2024-11-20',
      type: 'Essay',
      rating: 4,
      message: 'Well-structured essay with good arguments. Your writing style has improved significantly this semester.',
      color: '#7C2D12'
    }
  ];
  
  const subjects = ['Calculus III', 'Physics II', 'Computer Science', 'English Literature', 'Chemistry'];
  
  const getRatingColor = (rating) => {
    if (rating >= 4) return '#10B981';
    if (rating >= 3) return '#F59E0B';
    return '#EF4444';
  };
  
  const getRatingText = (rating) => {
    switch (rating) {
      case 5: return 'Excellent';
      case 4: return 'Good';
      case 3: return 'Average';
      case 2: return 'Below Average';
      case 1: return 'Poor';
      default: return 'Not Rated';
    }
  };
  
  const handleSubmitFeedback = () => {
    if (newFeedback.trim() && selectedSubject && rating > 0) {
      console.log('Feedback submitted:', {
        subject: selectedSubject,
        rating: rating,
        message: newFeedback
      });
      // Reset form
      setNewFeedback('');
      setSelectedSubject('');
      setRating(0);
      // Show success message or navigate
    }
  };
  
  return (
    <View className="flex-1">
      {/* Header */}
      <View className="shadow-md" style={{ backgroundColor: theme.primary, paddingTop: StatusBar.currentHeight }}>
        <View className="flex-row items-center h-20 px-4 gap-4">
          <Pressable className="p-2" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={theme.textInverse} />
          </Pressable>
          <Text className="font-semibold text-xl flex-1" style={{ color: theme.textInverse }}>Feedback</Text>
        </View>
      </View>
      
      {/* Tab Navigation */}
      <View className="border-b" style={{ backgroundColor: theme.surface, borderBottomColor: theme.border }}>
        <View className="flex-row">
          <TouchableOpacity
            className="flex-1 py-4"
            style={{ 
              borderBottomWidth: selectedTab === 'received' ? 2 : 0,
              borderBottomColor: selectedTab === 'received' ? theme.primary : 'transparent'
            }}
            onPress={() => setSelectedTab('received')}
          >
            <Text className="text-center font-medium" style={{
              color: selectedTab === 'received' ? theme.primary : theme.textSecondary
            }}>
              Received Feedback
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 py-4"
            style={{ 
              borderBottomWidth: selectedTab === 'give' ? 2 : 0,
              borderBottomColor: selectedTab === 'give' ? theme.primary : 'transparent'
            }}
            onPress={() => setSelectedTab('give')}
          >
            <Text className="text-center font-medium" style={{
              color: selectedTab === 'give' ? theme.primary : theme.textSecondary
            }}>
              Give Feedback
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Content */}
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          className="flex-1"
          style={{ backgroundColor: theme.background }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: isKeyboardVisible ? 300 : 20 }}
        >
          {selectedTab === 'received' ? (
          <View className="p-6">
            <Text className="text-lg font-semibold mb-4" style={{ color: theme.text }}>Recent Feedback from Instructors</Text>
            
            <View className="gap-4">
              {receivedFeedback.map((feedback) => (
                <View key={feedback.id} className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: theme.surface }}>
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-2">
                        <View 
                          className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                          style={{ backgroundColor: feedback.color + '20' }}
                        >
                          <Ionicons name="person-outline" size={20} color={feedback.color} />
                        </View>
                        <View className="flex-1">
                          <Text className="text-lg font-semibold" style={{ color: theme.text }}>{feedback.subject}</Text>
                          <Text className="text-sm" style={{ color: theme.textSecondary }}>{feedback.instructor}</Text>
                        </View>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className="text-xs mb-1" style={{ color: theme.textTertiary }}>{feedback.date}</Text>
                      <View className="flex-row items-center">
                        {[...Array(5)].map((_, i) => (
                          <Ionicons
                            key={i}
                            name={i < feedback.rating ? "star" : "star-outline"}
                            size={16}
                            color={i < feedback.rating ? getRatingColor(feedback.rating) : "#D1D5DB"}
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                  
                  <View className="mb-3">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-sm font-medium" style={{ color: theme.textSecondary }}>Type: {feedback.type}</Text>
                      <Text 
                        className="text-sm font-semibold"
                        style={{ color: getRatingColor(feedback.rating) }}
                      >
                        {getRatingText(feedback.rating)}
                      </Text>
                    </View>
                  </View>
                  
                  <Text className="leading-5" style={{ color: theme.textSecondary }}>{feedback.message}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View className="p-6">
            <Text className="text-lg font-semibold mb-4" style={{ color: theme.text }}>Submit Course Feedback</Text>
            
            {/* Instructions Card */}
            <View className="rounded-xl p-4 mb-4" style={{ backgroundColor: theme.primary + '10', borderWidth: 1, borderColor: theme.primary + '30' }}>
              <View className="flex-row items-center mb-2">
                <Ionicons name="information-circle-outline" size={20} color={theme.primary} />
                <Text className="font-medium ml-2" style={{ color: theme.primary }}>Feedback Guidelines</Text>
              </View>
              <Text className="text-sm" style={{ color: theme.primary }}>
                Your feedback helps us improve our courses and teaching methods. Please be honest and constructive in your comments.
              </Text>
            </View>
            
            <View className="rounded-xl p-6 shadow-sm" style={{ backgroundColor: theme.surface }}>
              {/* Subject Selection */}
              <Text className="font-semibold mb-3" style={{ color: theme.text }}>
                <Ionicons name="book-outline" size={16} color={theme.textSecondary} /> Select Subject *
              </Text>
              <View className="mb-6">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-3">
                    {subjects.map((subject) => (
                      <TouchableOpacity
                        key={subject}
                        onPress={() => setSelectedSubject(subject)}
                        className="px-4 py-3 rounded-lg border-2"
                        style={{
                          backgroundColor: selectedSubject === subject ? theme.primary : theme.backgroundSecondary,
                          borderColor: selectedSubject === subject ? theme.primary : theme.border
                        }}
                      >
                        <Text className="font-medium text-center" style={{
                          color: selectedSubject === subject ? theme.textInverse : theme.text
                        }}>
                          {subject}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
              
              {/* Feedback Categories */}
              <Text className="font-semibold mb-3" style={{ color: theme.text }}>
                <Ionicons name="list-outline" size={16} color={theme.textSecondary} /> Feedback Category
              </Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                {['Course Content', 'Teaching Method', 'Assignments', 'Lab Sessions', 'Overall Experience'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    className="px-3 py-2 rounded-full"
                    style={{ backgroundColor: theme.backgroundSecondary }}
                  >
                    <Text className="text-sm" style={{ color: theme.text }}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Rating */}
              <Text className="font-semibold mb-3" style={{ color: theme.text }}>
                <Ionicons name="star-outline" size={16} color={theme.textSecondary} /> Rate this Course *
              </Text>
              <View className="rounded-lg p-4 mb-6" style={{ backgroundColor: theme.backgroundSecondary }}>
                <View className="flex-row items-center justify-center mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                      className="mx-1 p-1"
                    >
                      <Ionicons
                        name={star <= rating ? "star" : "star-outline"}
                        size={36}
                        color={star <= rating ? "#F59E0B" : "#D1D5DB"}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <Text className="text-center font-medium" style={{ color: theme.textSecondary }}>
                  {rating > 0 ? rating + '/5 - ' + getRatingText(rating) : 'Tap stars to rate'}
                </Text>
              </View>
              
              {/* Feedback Text */}
              <Text className="font-semibold mb-3" style={{ color: theme.text }}>
                <Ionicons name="chatbubble-outline" size={16} color={theme.textSecondary} /> Your Detailed Feedback *
              </Text>
              <View className="relative" ref={textInputRef}>
                <TextInput
                  ref={textInputRef}
                  className="rounded-xl p-4 mb-2 shadow-sm"
                  style={{
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderWidth: 2,
                    borderColor: theme.border
                  }}
                  placeholder="Please share specific details about your experience with this course. What did you like? What could be improved? Any suggestions for future students?"
                  placeholderTextColor={theme.textTertiary}
                  value={newFeedback}
                  onChangeText={setNewFeedback}
                  multiline
                  numberOfLines={isKeyboardVisible ? 4 : 8}
                  textAlignVertical="top"
                  onFocus={() => {
                    setTimeout(() => {
                      if (scrollViewRef.current) {
                        scrollViewRef.current.scrollToEnd({ animated: true });
                      }
                    }, 300);
                  }}
                  returnKeyType="default"
                  blurOnSubmit={false}
                />
                {/* Character count badge */}
                <View className="absolute bottom-4 right-4 px-3 py-1 rounded-full" style={{ backgroundColor: theme.text }}>
                  <Text className="text-xs font-medium" style={{ color: theme.textInverse }}>
                    {newFeedback.length}/500
                  </Text>
                </View>
              </View>
              
              {/* Validation message */}
              <View className="flex-row items-center mb-6">
                <Ionicons 
                  name={newFeedback.length >= 20 ? "checkmark-circle" : "information-circle-outline"} 
                  size={16} 
                  color={newFeedback.length >= 20 ? theme.success : theme.textSecondary} 
                />
                <Text className="text-xs ml-2" style={{
                  color: newFeedback.length >= 20 ? theme.success : theme.textSecondary
                }}>
                  {newFeedback.length >= 20 
                    ? 'Great! Your feedback meets the minimum requirement.' 
                    : 'Minimum 20 characters required (' + (20 - newFeedback.length) + ' more needed)'
                  }
                </Text>
              </View>
              
              {/* Anonymous Option */}
              <View className="flex-row items-center justify-between mb-6 p-4 rounded-lg" style={{ backgroundColor: theme.backgroundSecondary }}>
                <View className="flex-1">
                  <Text className="font-medium" style={{ color: theme.text }}>Submit Anonymously</Text>
                  <Text className="text-sm" style={{ color: theme.textSecondary }}>Your identity will not be shared with instructors</Text>
                </View>
                <TouchableOpacity className="w-12 h-6 rounded-full p-1" style={{ backgroundColor: theme.primary }}>
                  <View className="w-4 h-4 rounded-full ml-auto" style={{ backgroundColor: theme.textInverse }} />
                </TouchableOpacity>
              </View>
              
              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmitFeedback}
                className="rounded-lg py-4 px-6 flex-row items-center justify-center shadow-sm"
                style={{
                  backgroundColor: newFeedback.trim().length >= 20 && selectedSubject && rating > 0 
                    ? theme.primary 
                    : theme.border
                }}
                disabled={newFeedback.trim().length < 20 || !selectedSubject || rating === 0}
              >
                <Ionicons 
                  name="send-outline" 
                  size={20} 
                  color={newFeedback.trim().length >= 20 && selectedSubject && rating > 0 ? theme.textInverse : theme.textTertiary} 
                />
                <Text className="font-semibold ml-2" style={{
                  color: newFeedback.trim().length >= 20 && selectedSubject && rating > 0 ? theme.textInverse : theme.textTertiary
                }}>
                  Submit Feedback
                </Text>
              </TouchableOpacity>
              
              {/* Help Text */}
              <Text className="text-center text-xs mt-4" style={{ color: theme.textTertiary }}>
                Your feedback is valuable and helps improve the learning experience for everyone
              </Text>
            </View>
          </View>
        )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default Feedback