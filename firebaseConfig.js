import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDPZMk7_5rpoBDK7k6syWstc4Klc7WFfqw",
  authDomain: "portalclone-b0cab.firebaseapp.com",
  projectId: "portalclone-b0cab",
  storageBucket: "portalclone-b0cab.firebasestorage.app",
  messagingSenderId: "21114518358",
  appId: "1:21114518358:web:98f9c73d3aab4cc621f4f7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  return await signInWithPopup(auth, provider);
}
