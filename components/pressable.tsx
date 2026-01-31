import React, { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export const CustomPressable: React.FC = () => {
  const [timesPressed, setTimesPressed] = useState(0);

  const onPressFunction = () => {
    setTimesPressed(current => current + 1);
  };
  
  const longPressFunction = () => {
    setTimesPressed(0);
    alert('LongPress!');
  };

  return (
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
  );
};

const styles = StyleSheet.create({
  logBox: {
    padding: 1,
    margin: 5,
    fontSize: 16,
    textAlign: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#f0f0f0',
  },
});
