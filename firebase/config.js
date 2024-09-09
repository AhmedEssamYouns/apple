// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvxkKjx9RutzY70nbqARoZ_cWUSxbeCg0",
  authDomain: "ahmed-store-native.firebaseapp.com",
  projectId: "ahmed-store-native",
  storageBucket: "ahmed-store-native.appspot.com",
  messagingSenderId: "955917122822",
  appId: "1:955917122822:web:e038dae6a819075cd13287"
};

// Initialize Firebase only if not already initialized
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Auth with AsyncStorage for persistence
export const FIREBASE_AUTH = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
