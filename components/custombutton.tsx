import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const CustomButton: React.FC = () => {
  const handleButtonPress = () => {
    alert('Custom Button');
  };

  const handleSecondaryPress = () => {
    alert('Secondary Button');
  };

  const handleSuccessPress = () => {
    alert('Success Button');
  };

  return (
    <View>
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>TASK 2</Text>
      </SafeAreaView>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#007AFF' }]}
        onPress={handleButtonPress}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Primary</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#6C757D' }]}
        onPress={handleSecondaryPress}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Secondary</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#28A745' }]}
        onPress={handleSuccessPress}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Success</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#CCCCCC' }]}
        onPress={() => {}}
        activeOpacity={0.7}
        disabled={true}
      >
        <Text style={styles.buttonText}>Disabled</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
