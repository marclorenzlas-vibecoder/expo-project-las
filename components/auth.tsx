import React from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { analytics, auth } from '@/FirebaseConfig';

interface AuthFormProps {
  currentUser: any;
}

export function AuthForm({ currentUser }: AuthFormProps) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

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
        Alert.alert('Error', 'Invalid email');
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

  if (currentUser) {
    return (
      <View style={styles.authContainer}>
        <TouchableOpacity style={styles.signOutButton} onPress={signOutUser}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
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
  );
}

const styles = StyleSheet.create({
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
  signInButton: {
    backgroundColor: '#4CAF50',
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
});
