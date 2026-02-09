import analytics from '@react-native-firebase/analytics';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export { analytics, auth, firebase, firestore };

export const isFirebaseInitialized = (): boolean => {
  try {
    return !!firebase.app();
  } catch {
    return false;
  }
};