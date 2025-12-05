import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

/**
 * Update user data in Firestore (generic update function)
 * @param {string} userId - The user's UID
 * @param {object} data - The data to update
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const updateUserData = async (userId, data) => {
  if (!userId) return { success: false, error: 'No user ID provided' };
  
  try {
    await setDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user data:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update a specific section of user data
 * @param {string} userId - The user's UID
 * @param {string} section - The section to update (e.g., 'profile', 'feedback', 'settings')
 * @param {any} data - The data for that section
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const updateUserSection = async (userId, section, data) => {
  if (!userId) return { success: false, error: 'No user ID provided' };
  
  try {
    await setDoc(doc(db, 'users', userId), {
      [section]: data,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    return { success: true };
  } catch (error) {
    console.error(`Error updating ${section}:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Update user profile
 * @param {string} userId - The user's UID
 * @param {object} profileData - The profile data to update
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const updateProfile = async (userId, profileData) => {
  return updateUserSection(userId, 'profile', profileData);
};

/**
 * Submit feedback for a subject
 * @param {string} userId - The user's UID
 * @param {array} feedbackData - The updated feedback array
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const submitFeedback = async (userId, feedbackData) => {
  return updateUserSection(userId, 'submittedFeedback', feedbackData);
};

/**
 * Update a single feedback item in the feedback array
 * @param {string} userId - The user's UID
 * @param {number} feedbackIndex - Index of feedback to update
 * @param {object} updatedFeedback - The updated feedback object
 * @param {array} currentFeedback - Current feedback array
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const updateSingleFeedback = async (userId, feedbackIndex, updatedFeedback, currentFeedback) => {
  if (!userId) return { success: false, error: 'No user ID provided' };
  
  try {
    const newFeedback = [...currentFeedback];
    newFeedback[feedbackIndex] = {
      ...newFeedback[feedbackIndex],
      ...updatedFeedback,
      type: 'Submitted',
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    };
    
    await setDoc(doc(db, 'users', userId), {
      feedback: newFeedback,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    return { success: true, feedback: newFeedback };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user data from Firestore
 * @param {string} userId - The user's UID
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getUserData = async (userId) => {
  if (!userId) return { success: false, error: 'No user ID provided' };
  
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    }
    return { success: false, error: 'User document not found' };
  } catch (error) {
    console.error('Error getting user data:', error);
    return { success: false, error: error.message };
  }
};