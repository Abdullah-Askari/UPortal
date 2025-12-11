import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: '339496645684-7egbq5ig5a8mrm208koeihhur0fl6efd.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  });
};

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
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
    await GoogleSignin.signOut();
    return { success: true };
  } catch (error) {
    console.log('Google Sign-Out error:', error);
    return { success: false, error: error.message };
  }
};
