import React, { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

export const CustomTextInput: React.FC = () => {
  const [textInput, setTextInput] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (textInput.trim()) {
      setName(textInput);
      alert(`Welcome, ${textInput}!`);
    } else {
      alert('Please enter your name');
    }
  };

  const handleClear = () => {
    setTextInput('');
    setName('');
  };

  return (
    <TextInput
      style={styles.input}
      placeholder="Enter your name"
      placeholderTextColor="#888"
      value={textInput}
      onChangeText={setTextInput}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
    color: '#ffffff',
  },
});
