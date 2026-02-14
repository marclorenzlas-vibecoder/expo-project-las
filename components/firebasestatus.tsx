import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface FirebaseStatusProps {
  status: string;
  userStatus: string;
}

export function FirebaseStatus({ status, userStatus }: FirebaseStatusProps) {
  return (
    <View style={styles.statusContainer}>
      <Text style={styles.statusText}>Firebase: {status}</Text>
      <Text style={styles.statusText}>User: {userStatus}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
