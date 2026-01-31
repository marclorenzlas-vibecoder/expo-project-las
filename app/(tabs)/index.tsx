import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Button, Platform, Pressable, SafeAreaView, StyleSheet, Text } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  const [timesPressed, setTimesPressed] = useState(0);

  const onPressButton = () => {
    alert('Hello');
  };

  const onPressFunction = () => {
    setTimesPressed(current => current + 1);
  };
  const longPressFunction = () => {
    setTimesPressed(0);
    alert('LongPress');
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
  },
  text: {
    fontSize: 25,
    fontWeight: '500',
    color: '#ffffff',
  },
  wrapperCustom: {
    borderRadius: 8,
    padding: 6,
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
