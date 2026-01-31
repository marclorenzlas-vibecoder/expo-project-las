import { Image } from 'expo-image';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

import { CustomButton } from '@/components/custom-button';
import ParallaxScrollView from '@/components/parallax-scroll-view';


export default function HomeScreen() {
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
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>

      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>TASK 2</Text>
      </SafeAreaView>

      <CustomButton
        title="Primary"
        onPress={handleButtonPress}
      />

      <CustomButton
        title="Secondary"
        onPress={handleSecondaryPress}
        backgroundColor="#6C757D"
      />

      <CustomButton
        title="Success"
        onPress={handleSuccessPress}
        backgroundColor="#28A745"
      />

      <CustomButton
        title="Disabled"
        onPress={() => {}}
        disabled={true}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  text: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
