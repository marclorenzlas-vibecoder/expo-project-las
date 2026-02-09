import { Image } from 'expo-image';
import React from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { analytics, auth, firebase, firestore, isFirebaseInitialized } from '@/FirebaseConfig';

export default function TabTwoScreen() {
  const [firestoreData, setFirestoreData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  React.useEffect(() => {
    // Log screen view
    analytics().logScreenView({
      screen_name: 'Explore',
      screen_class: 'ExploreScreen',
    });

    // Listen to auth state changes
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const writeToFirestore = async () => {
    setLoading(true);
    try {
      const docRef = await firestore()
        .collection('users')
        .add({
          name: 'Test User',
          email: 'test@example.com',
          timestamp: new Date().toISOString(),
          platform: Platform.OS
        });
      
      await analytics().logEvent('data_written', {
        collection: 'users',
        docId: docRef.id
      });
      
      Alert.alert('Success', `Document created with ID: ${docRef.id}`);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const readFromFirestore = async () => {
    setLoading(true);
    try {
      const snapshot = await firestore()
        .collection('users')
        .limit(5)
        .get();
      
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setFirestoreData(data);
      
      await analytics().logEvent('data_read', {
        collection: 'users',
        count: data.length
      });
      
      Alert.alert('Success', `Retrieved ${data.length} documents`);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const logCustomEvent = async () => {
    try {
      await analytics().logEvent('custom_button_press', {
        button_name: 'Analytics Test',
        screen: 'Explore',
        timestamp: new Date().toISOString()
      });
      
      Alert.alert('Success', 'Analytics event logged!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
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
      
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      
      await analytics().logEvent('sign_up', {
        method: 'email'
      });
      
      Alert.alert(
        'Account Created!',
        `Successfully signed up as: ${email}`
      );
      
      // Clear the form
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
      
      // Clear the form
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
      
      Alert.alert('Signed Out', 'You have been signed out successfully.');
    } catch (error: any) {
      Alert.alert('Sign Out Error', error.message);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#000000', dark: '#000000' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          🔥 Firebase Demo
        </ThemedText>
      </ThemedView>
      <ThemedText>Test Firebase services integrated in your Expo app.</ThemedText>
      
      <Collapsible title="🔐 Authentication">
        <ThemedText style={styles.sectionText}>
          Firebase Authentication enables secure user sign-in with email/password.
        </ThemedText>
        
        {currentUser ? (
          <View>
            <View style={styles.userInfo}>
              <ThemedText type="subtitle">Signed In</ThemedText>
              <ThemedText style={styles.userEmail}>{currentUser.email}</ThemedText>
              <ThemedText style={styles.userDetail}>UID: {currentUser.uid}</ThemedText>
            </View>
            
            <TouchableOpacity style={styles.authButton} onPress={signOutUser}>
              <Text style={styles.buttonText}>🚪 Sign Out</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <ThemedText style={styles.infoText}>
              Not signed in
            </ThemedText>
            
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
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
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>
            
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.authButton} onPress={signInUser}>
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.signUpButton} onPress={signUpUser}>
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>
            </View>
            
            <ThemedText style={styles.infoText}>
              Add users in Firebase Console to test sign in
            </ThemedText>
          </View>
        )}
        
        <ExternalLink href="https://firebase.google.com/docs/auth">
          <ThemedText type="link">Learn more about Authentication</ThemedText>
        </ExternalLink>
      </Collapsible>
      
      <Collapsible title="�🔥 Firestore Database">
        <ThemedText style={styles.sectionText}>
          Cloud Firestore is a NoSQL cloud database to store and sync data.
        </ThemedText>
        
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.firebaseButton} onPress={writeToFirestore}>
            <Text style={styles.buttonText}>➕ Write Data</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.firebaseButton} onPress={readFromFirestore}>
            <Text style={styles.buttonText}>📖 Read Data</Text>
          </TouchableOpacity>
        </View>
        
        {firestoreData.length > 0 && (
          <View style={styles.dataContainer}>
            <ThemedText type="subtitle">Latest Records:</ThemedText>
            {firestoreData.map((item, index) => (
              <View key={item.id} style={styles.dataItem}>
                <ThemedText>
                  {index + 1}. {item.name || 'No name'} - {item.email || 'No email'}
                </ThemedText>
              </View>
            ))}
          </View>
        )}
        
        <ExternalLink href="https://firebase.google.com/docs/firestore">
          <ThemedText type="link">Learn more about Firestore</ThemedText>
        </ExternalLink>
      </Collapsible>
      
      <Collapsible title="📊 Analytics">
        <ThemedText style={styles.sectionText}>
          Firebase Analytics provides insights on app usage and user engagement.
        </ThemedText>
        
        <TouchableOpacity style={styles.firebaseButton} onPress={logCustomEvent}>
          <Text style={styles.buttonText}>📈 Log Custom Event</Text>
        </TouchableOpacity>
        
        <ThemedText style={styles.infoText}>
          Events are automatically logged and can be viewed in Firebase Console → Analytics.
        </ThemedText>
        
        <ExternalLink href="https://firebase.google.com/docs/analytics">
          <ThemedText type="link">Learn more about Analytics</ThemedText>
        </ExternalLink>
      </Collapsible>
      
      <Collapsible title="🔧 Firebase Config">
        <View style={styles.configInfo}>
          <ThemedText>
            Status: {isFirebaseInitialized() ? 'Connected' : 'Not Connected'}
          </ThemedText>
          {isFirebaseInitialized() && (
            <ThemedText>
              Project: {firebase.app().options.projectId}
            </ThemedText>
          )}
        </View>
        
        <ExternalLink href="https://rnfirebase.io">
          <ThemedText type="link">React Native Firebase Docs</ThemedText>
        </ExternalLink>
      </Collapsible>
      
      <Collapsible title="File-based routing">
        <ThemedText>
          This app has two screens:{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
          different screen densities
        </ThemedText>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={{ width: 100, height: 100, alignSelf: 'center' }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
          what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
          the powerful{' '}
          <ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
            react-native-reanimated
          </ThemedText>{' '}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sectionText: {
    marginBottom: 10,
  },
  buttonGroup: {
    gap: 10,
    marginVertical: 10,
  },
  firebaseButton: {
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  authButton: {
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
  buttonWrapper: {
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  dataContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  dataItem: {
    paddingVertical: 5,
  },
  infoText: {
    marginTop: 10,
    fontSize: 12,
    opacity: 0.7,
  },
  configInfo: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    gap: 5,
    marginBottom: 10,
  },
  userInfo: {
    padding: 15,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 8,
    marginBottom: 10,
  },
  userEmail: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  userDetail: {
    marginTop: 3,
    fontSize: 12,
    opacity: 0.7,
  },
  formContainer: {
    marginVertical: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#fff',
  },
});
