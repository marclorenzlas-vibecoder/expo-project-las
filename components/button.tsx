import React from 'react';
import { Button } from 'react-native';

export const BasicButton: React.FC = () => {
  const onPressButton = () => {
    alert('Hello');
  };

  return (
    <Button
      onPress={onPressButton}
      title="Button"
      color="#17d9f3"
    />
  );
};
