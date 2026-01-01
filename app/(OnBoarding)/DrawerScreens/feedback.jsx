import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../context/useAuth';
import { useTheme } from '../../../context/useTheme';
import { submitFeedback } from '../../../firestore';
import CustomAlert from '../../components/CustomAlert';

const Feedback = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, userData, updateUserProfile } = useAuth();
  const [selectedTab, setSelectedTab] = useState('received');
  const feedbackRef = useRef('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [rating, setRating] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const scrollViewRef = useRef(null);
  const textInputRef = useRef(null);
  const [alertVisible, setAlertVisible] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
  });

  // Get data from centralized userData
  const submittedFeedbackList = userData?.submittedFeedback || [];
  const subjects = userData?.subjects?.map(s => s.name) || [];

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      // Scroll to the text input when keyboard appears
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      // Scroll down to show submit button when keyboard closes
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    });

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  const showAlert = (title, message, type = 'info', onConfirm = null) => {
    setAlertVisible({
      visible: true,
      title,
      message,
      type,
      onConfirm,
    });
  }
  const hideAlert = () => {
    setAlertVisible(prev => ({
      ...prev,
      visible: false
    }))
  };
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

  const handleSubmitFeedback = async () => {
    if (!selectedSubject || rating === 0) {
      showAlert('Error', 'Please select a subject and provide a rating before submitting feedback', 'error');
      return;
    }

    if (!user?.uid) {
      showAlert('Error', 'You must be logged in to submit feedback', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const feedbackData = {
        id: Date.now().toString(),
        subject: selectedSubject,
        category: selectedCategory || 'General',
        rating: rating,
        message: feedbackRef.current.trim(),
        type: 'Submitted',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        createdAt: new Date().toISOString(),
        color: '#4F46E5'
      };

      // Get current submitted feedback and add new one
      const currentSubmittedFeedback = userData?.submittedFeedback || [];
      const updatedFeedback = [...currentSubmittedFeedback, feedbackData];

      const result = await submitFeedback(user.uid, updatedFeedback);

      if (result.success) {
        // Update local state so it appears immediately
        updateUserProfile({ submittedFeedback: updatedFeedback });

        showAlert('Success', 'Your feedback has been submitted successfully!', 'success', () => setSelectedTab('received'));

        // Reset form
        feedbackRef.current = '';
        setSelectedSubject('');
        setSelectedCategory('');
        setRating(0);
      } else {
        showAlert('Error', result.error || 'Failed to submit feedback. Please try again.', 'error');
      }
    } catch (error) {
      console.log('Error submitting feedback:', error);
      showAlert('Error', 'Failed to submit feedback. Please try again.', 'error');
    } finally {
      setSubmitting(false);
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          style={{ backgroundColor: theme.background }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: isKeyboardVisible ? 350 : 20 }}
          automaticallyAdjustKeyboardInsets={true}
        >
          {selectedTab === 'received' ? (
            <View className="p-6">
              {/* Submitted Feedback Section - Show First */}
              <Text className="text-lg font-semibold mb-4" style={{ color: theme.text }}>Your Submitted Feedback</Text>

              {submittedFeedbackList.length > 0 ? (
                <View className="gap-4">
                  {submittedFeedbackList.map((feedback) => (
                    <View key={feedback.id} className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: theme.surface }}>
                      <View className="flex-row items-start justify-between mb-3">
                        <View className="flex-1">
                          <View className="flex-row items-center mb-2">
                            <View
                              className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                              style={{ backgroundColor: feedback.color + '20' }}
                            >
                              <Ionicons name="chatbubble-outline" size={20} color={feedback.color} />
                            </View>
                            <View className="flex-1">
                              <Text className="text-lg font-semibold" style={{ color: theme.text }}>{feedback.subject}</Text>
                              <Text className="text-sm" style={{ color: theme.textSecondary }}>{feedback.category}</Text>
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
                          <View className="px-2 py-1 rounded" style={{ backgroundColor: '#10B981' + '20' }}>
                            <Text className="text-xs font-medium" style={{ color: '#10B981' }}>{feedback.type}</Text>
                          </View>
                          <Text
                            className="text-sm font-semibold"
                            style={{ color: getRatingColor(feedback.rating) }}
                          >
                            {getRatingText(feedback.rating)}
                          </Text>
                        </View>
                      </View>

                      {feedback.message ? (
                        <Text className="leading-5" style={{ color: theme.textSecondary }}>{feedback.message}</Text>
                      ) : null}
                    </View>
                  ))}
                </View>
              ) : (
                <View className="rounded-xl p-6 items-center" style={{ backgroundColor: theme.surface }}>
                  <Ionicons name="chatbubble-ellipses-outline" size={48} color={theme.textSecondary} />
                  <Text className="text-base font-medium mt-3" style={{ color: theme.text }}>No feedback submitted yet</Text>
                  <Text className="text-sm mt-1 text-center" style={{ color: theme.textSecondary }}>
                    Go to "Give Feedback" tab to submit your course feedback
                  </Text>
                </View>
              )}
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
                      onPress={() => setSelectedCategory(category)}
                      className="px-3 py-2 rounded-full"
                      style={{
                        backgroundColor: selectedCategory === category ? theme.primary : theme.backgroundSecondary
                      }}
                    >
                      <Text className="text-sm" style={{
                        color: selectedCategory === category ? theme.textInverse : theme.text
                      }}>{category}</Text>
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
                  <Ionicons name="chatbubble-outline" size={16} color={theme.textSecondary} /> Your Detailed Feedback (Optional)
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
                    defaultValue={feedbackRef.current}
                    onChangeText={(text) => feedbackRef.current = text}
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
                      {feedbackRef.current.length}/500
                    </Text>
                  </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  onPress={handleSubmitFeedback}
                  className="rounded-lg py-4 px-6 flex-row items-center justify-center shadow-sm"
                  style={{
                    backgroundColor: selectedSubject && rating > 0 && !submitting
                      ? theme.primary
                      : theme.border
                  }}
                  disabled={!selectedSubject || rating === 0 || submitting}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color={theme.textInverse} />
                  ) : (
                    <>
                      <Ionicons
                        name="send-outline"
                        size={20}
                        color={selectedSubject && rating > 0 ? theme.textInverse : theme.textTertiary}
                      />
                      <Text className="font-semibold ml-2" style={{
                        color: selectedSubject && rating > 0 ? theme.textInverse : theme.textTertiary
                      }}>
                        Submit Feedback
                      </Text>
                    </>
                  )}
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

      {/*  Loading Overlay */}
      {submitting && (
        <View className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
          <View className="bg-white rounded-2xl p-8 items-center shadow-lg" style={{ backgroundColor: theme.surface }}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text className="mt-4 font-semibold text-center" style={{ color: theme.text }}>
              Submitting Feedback...
            </Text>
          </View>
        </View>
      )}
      <CustomAlert
        visible={alertVisible.visible}
        title={alertVisible.title}
        message={alertVisible.message}
        type={alertVisible.type}
        onConfirm={() => {
          hideAlert();
          if (alertVisible.onConfirm) {
            alertVisible.onConfirm();
          }
        }}
      />
    </View>
  )
}

export default Feedback