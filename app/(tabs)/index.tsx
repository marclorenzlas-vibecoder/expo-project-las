import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Button, Pressable, SafeAreaView, StyleSheet, Text, TextInput } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';

export default function HomeScreen() {
  const [timesPressed, setTimesPressed] = useState(0);
  const [textInput, setTextInput] = useState('');
  const [name, setName] = useState('');

  const onPressButton = () => {
    alert('Hello');
  };

  const onPressFunction = () => {
    setTimesPressed(current => current + 1);
  };
  
  const longPressFunction = () => {
    setTimesPressed(0);
    alert('LongPress!');
  };

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
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>TASK 1</Text>
      </SafeAreaView>
      
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="#888"
        value={textInput}
        onChangeText={setTextInput}
      />
      
      <Button
        onPress={onPressButton}
        title="Button"
        color="#17d9f3"
      />
      
      <Pressable 
        onPress={onPressFunction}
        onLongPress={longPressFunction}
        style={({ pressed }) => [
          styles.logBox,
          {
            backgroundColor: pressed ? 'rgb(29, 230, 230)' : 'white',
            opacity: pressed ? 0.6 : 1,
          },  
        ]}
      >
        <Text style={styles.logBox}>PRESSABLE ({timesPressed})</Text>
      </Pressable>
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
  logBox: {
    padding: 1,
    margin: 5,
    fontSize: 16,
    textAlign: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#f0f0f0',
  },
});
