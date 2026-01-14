import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: Constants.expoConfig?.extra?.webClientId,
    scopes: ['profile', 'email'],
    forceCodeForRefreshToken: true,
  });
};

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();

    try{
      await GoogleSignin.signOut();
    } catch (error) {
      console.log('Google Sign-Out error during sign-in:', error);
    }

    const userInfo = await GoogleSignin.signIn({
      prompt: 'select_account',
    });

    return {
      success: true,
      userInfo: {
        idToken: userInfo.data.idToken,
        accessToken: userInfo.data.accessToken,
        user: userInfo.data.user,
      },
    };
  } catch (error) {
    console.log('Google Sign-In error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const signOutGoogle = async () => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    return { success: true };
  } catch (error) {
    console.log('Google Sign-Out error:', error);
    return { success: false, error: error.message };
  }
};
