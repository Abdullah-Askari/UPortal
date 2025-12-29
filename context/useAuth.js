import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  linkWithCredential,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';

import { auth, db } from '../firebaseConfig';
import {
  configureGoogleSignIn,
  signInWithGoogle as nativeGoogleSignIn
} from '../googleSignInConfig';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(null);

  const dataFetchedRef = useRef(false);

  /* -------------------- GOOGLE INIT -------------------- */
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  /* -------------------- ONBOARDING -------------------- */
  const checkOnboardingStatus = async () => {
    const value = await AsyncStorage.getItem('hasSeenOnboarding');
    return value === 'true';
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    setHasSeenOnboarding(true);
  };

  /* -------------------- USER DATA -------------------- */
  const fetchUserData = async (uid) => {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      setUserData(snap.data());
      return snap.data();
    }
    return null;
  };

  /* -------------------- AUTH STATE -------------------- */
  useEffect(() => {
    (async () => {
      setHasSeenOnboarding(await checkOnboardingStatus());
    })();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
        if (!dataFetchedRef.current) {
          await fetchUserData(firebaseUser.uid);
          dataFetchedRef.current = true;
        }
      } else {
        setUser(null);
        setUserData(null);
        dataFetchedRef.current = false;
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /* -------------------- EMAIL SIGN IN -------------------- */
  const signIn = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: res.user };
    } catch (e) {
      let errorMessage = "Login failed. Please check your credentials.";
      if (e.code === 'auth/invalid-credential' || e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (e.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (e.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Please contact support.';
      } else if (e.code === 'auth/invalid-email') {
        errorMessage = 'The email address is not valid.';
      }
      return { success: false, error: errorMessage };
    }
  };

  /* -------------------- EMAIL SIGN UP -------------------- */
  const signUp = async (email, password, extra = {}) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, 'users', res.user.uid), {
        email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...extra
      });

      return { success: true, user: res.user };
    } catch (e) {
      let errorMessage = "Login failed. Please check your credentials.";
      if (e.code === 'auth/invalid-credential' || e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (e.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (e.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Please contact support.';
      } else if (e.code === 'auth/invalid-email') {
        errorMessage = 'The email address is not valid.';
      }
      return { success: false, error: errorMessage };
    }
  };

  
  /* -------------------- GOOGLE SIGN IN -------------------- */
  const signInWithGoogle = async () => {
    try {
      const googleRes = await nativeGoogleSignIn();
      if (!googleRes.success) {
        return { success: false, error: googleRes.error };
      }

      const { idToken, accessToken, user } = googleRes.userInfo;
      const email = user.email;

      const methods = await fetchSignInMethodsForEmail(auth, email);

      const credential = GoogleAuthProvider.credential(idToken, accessToken);

      if (methods.includes('password')) {
        return {
          success: false,
          code: 'LINK_REQUIRED',
          email,
          error: 'Login with email/password first to link Google.'
        };
      }


      const res = await signInWithCredential(auth, credential);
      await ensureUserDoc(res.user);
      return { success: true, user: res.user };

    } catch (e) {
      return { success: false, error: e.message };
    }
  };


  /* -------------------- LINK GOOGLE -------------------- */
  const linkGoogleProvider = async (email, password) => {
    const emailRes = await signInWithEmailAndPassword(auth, email, password);
    const googleRes = await nativeGoogleSignIn();

    const credential = GoogleAuthProvider.credential(
      googleRes.userInfo.idToken,
      googleRes.userInfo.accessToken
    );

    await linkWithCredential(emailRes.user, credential);
  };


  /* -------------------- FIRESTORE ENSURE -------------------- */
  const ensureUserDoc = async (firebaseUser) => {
    const ref = doc(db, 'users', firebaseUser.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  };

  /* -------------------- LOGOUT -------------------- */
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserData(null);
      dataFetchedRef.current = false;
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  /* -------------------- PASSWORD RESET -------------------- */
  const forgetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
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
      linkGoogleProvider,
      forgetPassword,
      completeOnboarding,
      updateUserProfile: (data) => setUserData(prev => ({ ...prev, ...data }))
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
