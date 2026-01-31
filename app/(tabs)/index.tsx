import { Image } from 'expo-image';
import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

import { CustomBasicButton } from '@/components/button';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { CustomPressable } from '@/components/pressable';
import { CustomTextInput } from '@/components/textinput';

export default function HomeScreen() {
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
      
      <CustomTextInput />
      
      <CustomBasicButton />
      
      <CustomPressable />
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
});
