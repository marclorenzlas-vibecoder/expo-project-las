import React from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { analytics, firestore } from '@/FirebaseConfig';

export function MessageForm() {
  const [message, setMessage] = React.useState('');

  const testFirestoreWrite = async () => {
    try {
      if (!message.trim()) {
        Alert.alert('Error', 'Please enter a message');
        return;
      }

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

  return (
    <>
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
    </>
  );
}

const styles = StyleSheet.create({
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
  buttonContainer: {
    marginVertical: 10,
  },
  firebaseButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
