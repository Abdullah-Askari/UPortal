import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { auth, db } from '../firebaseConfig';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(null);
  const dataFetchedRef = useRef(false);

  // Fetch all user data from Firestore once
  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        return data;
      }
      return null;
    } catch (error) {
      console.log('Error fetching user data:', error);
      return null;
    }
  };

  // Refresh user data (can be called manually if needed)
  const refreshUserData = async () => {
    if (user?.uid && !dataFetchedRef.current) {
      dataFetchedRef.current = true;
      return await fetchUserData(user.uid);
    }
    return userData;
  };

  // Check if user has seen onboarding
  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('hasSeenOnboarding');
      return value === 'true';
    } catch {
      return false;
    }
  };

  // Mark onboarding as complete
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      setHasSeenOnboarding(true);
    } catch (error) {
      console.log('Error saving onboarding status:', error);
    }
  };

  useEffect(() => {
    // Check onboarding status on mount
    const initOnboarding = async () => {
      const seen = await checkOnboardingStatus();
      setHasSeenOnboarding(seen);
    };
    initOnboarding();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get all user data from Firestore once
        const data = await fetchUserData(firebaseUser.uid);
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
        setUserData(data);
        dataFetchedRef.current = true;
      } else {
        setUser(null);
        setUserData(null);
        dataFetchedRef.current = false;
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Sign up with email and password
  const signUp = async (email, password, additionalData = {}) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user: firebaseUser } = userCredential;

      // Create user document in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        email: firebaseUser.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...additionalData
      });

      return { success: true, user: firebaseUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Sign in with Google
  const signInWithGoogle = async (idToken, accessToken) => {
    try {
      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      const userCredential = await signInWithCredential(auth, credential);
      const { user: firebaseUser } = userCredential;

      // Check if user document exists, if not create one
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      return { success: true, user: firebaseUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserData(null);
      dataFetchedRef.current = false;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Update user profile in Firestore
  const updateUserProfile = async (data) => {
    if (!user?.uid) return { success: false, error: 'No user logged in' };
    
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Update local userData state
      setUserData(prev => ({ ...prev, ...data }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Update specific section of userData locally and in Firestore
  const updateUserData = async (section, data) => {
    if (!user?.uid) return { success: false, error: 'No user logged in' };
    
    try {
      await setDoc(doc(db, 'users', user.uid), {
        [section]: data,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Update local userData state
      setUserData(prev => ({ ...prev, [section]: data }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Save screen-specific data to Firestore
  const saveScreenData = async (screenName, data) => {
    if (!user?.uid) return { success: false, error: 'No user logged in' };
    
    try {
      await setDoc(doc(db, 'users', user.uid, 'screens', screenName), {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Forget password
  const forgetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  // Get screen-specific data from Firestore
  const getScreenData = async (screenName) => {
    if (!user?.uid) return { success: false, error: 'No user logged in' };
    
    try {
      const docSnap = await getDoc(doc(db, 'users', user.uid, 'screens', screenName));
      if (docSnap.exists()) {
        return { success: true, data: docSnap.data() };
      }
      return { success: true, data: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userData,
      loading,
      hasSeenOnboarding,
      signIn,
      signUp,
      signOut,
      signInWithGoogle,
      updateUserProfile,
      updateUserData,
      refreshUserData,
      forgetPassword,
      saveScreenData,
      getScreenData,
      completeOnboarding,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
