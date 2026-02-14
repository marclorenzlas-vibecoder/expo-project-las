import { AuthForm } from '@/components/auth';
import { MessageForm } from '@/components/messageform';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { analytics, auth, firebase, isFirebaseInitialized } from '@/FirebaseConfig';
import { Image } from 'expo-image';
import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

export default function HomeScreen() {
  const [firebaseStatus, setFirebaseStatus] = React.useState<string>('Checking...');
  const [userStatus, setUserStatus] = React.useState<string>('Not signed in');
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  React.useEffect(() => {
    checkFirebaseConnection();
    analytics().logScreenView({
      screen_name: 'Home',
      screen_class: 'HomeScreen',
    });

    const unsubscribe = auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        setUserStatus(`Signed in as: ${user.email}`);
      } else {
        setUserStatus('Not signed in');
      }
    });

    return () => unsubscribe();
  }, []);

  const checkFirebaseConnection = async () => {
    try {
      if (isFirebaseInitialized()) {
        const app = firebase.app();
        setFirebaseStatus(`Connected to: ${app.options.projectId}`);
        
        // Log analytics event
        await analytics().logEvent('app_opened', {
          timestamp: new Date().toISOString(),
          screen: 'Home'
        });
      } else {
        setFirebaseStatus('Firebase not initialized');
      }
    } catch (error: any) {
      setFirebaseStatus(`Error: ${error.message}`);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFFFFF', dark: '#FFFFFF' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>TASK 3</Text>
      </SafeAreaView>
      
      <AuthForm currentUser={currentUser} />
      
      <MessageForm />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 25,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
  },
});