import ParallaxScrollView from '@/components/parallax-scroll-view';
import { analytics, auth, firebase, firestore, isFirebaseInitialized } from '@/FirebaseConfig';
import { Image } from 'expo-image';
import React from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [firebaseStatus, setFirebaseStatus] = React.useState<string>('Checking...');
  const [userStatus, setUserStatus] = React.useState<string>('Not signed in');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    checkFirebaseConnection();
    analytics().logScreenView({
      screen_name: 'Home',
      screen_class: 'HomeScreen',
    });

    const unsubscribe = auth().onAuthStateChanged((user) => {
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

  const testFirestoreWrite = async () => {
    try {
      if (!message.trim()) {
        Alert.alert('Error', 'Please enter a message');
        return;
      }

      const timestamp = new Date().toISOString();
      const docRef = await firestore()
        .collection('messages')
        .add({
          message,
        });
      
      // Log analytics event
      await analytics().logEvent('message_sent', {
        collection: 'messages'
      });
      
      Alert.alert('Success', `Message sent!`);
      setMessage(''); // Clear the message input
    } catch (error: any) {
      Alert.alert('Error', `Failed to send: ${error.message}`);
    }
  };

  const signUpUser = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Error', 'Please enter both email and password');
        return;
      }

      if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return;
      }
      
      await auth().createUserWithEmailAndPassword(email, password);
      
      await analytics().logEvent('sign_up', {
        method: 'email'
      });
      
      Alert.alert('Account Created!', `Successfully signed up as: ${email}`);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'This email is already registered');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'Invalid email format');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Error', 'Password is too weak');
      } else {
        Alert.alert('Sign Up Error', error.message);
      }
    }
  };

  const signInUser = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Error', 'Please enter both email and password');
        return;
      }
      
      await auth().signInWithEmailAndPassword(email, password);
      
      await analytics().logEvent('login', {
        method: 'email'
      });
      
      Alert.alert('Success!', `Signed in as: ${email}`);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Error', 'No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'Incorrect password');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'Invalid email format');
      } else {
        Alert.alert('Sign In Error', error.message);
      }
    }
  };

  const signOutUser = async () => {
    try {
      await auth().signOut();
      await analytics().logEvent('logout', {});
      Alert.alert('Signed Out', 'You have been signed out.');
    } catch (error: any) {
      Alert.alert('Sign Out Error', error.message);
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
      
      {!auth().currentUser ? (
        <View style={styles.authContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#fff"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#fff"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.signInButton} onPress={signInUser}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.authContainer}>
          <TouchableOpacity style={styles.signOutButton} onPress={signOutUser}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.messageContainer}>
        <Text style={styles.messageLabel}>Send a Message</Text>
        <TextInput
          style={styles.messageInput}
          placeholder="Type your message here..."
          placeholderTextColor="#fff"
          value={message}
          onChangeText={setMessage}
          multiline
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.firebaseButton} onPress={testFirestoreWrite}>
          <Text style={styles.buttonText}>Send Message</Text>
        </TouchableOpacity>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
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
  statusContainer: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    minWidth: 300,
  },
  statusText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  firebaseButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  signInButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  signUpButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  signOutButton: {
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
  },
  authContainer: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#ffffff',
  },
  buttonGroup: {
    marginTop: 10,
  },
  messageContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  messageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },
  messageInput: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#ffffff',
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
