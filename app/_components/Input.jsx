import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function Input({
  style,
  placeholderTextColor = '#fff',
  ...props
}) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor={placeholderTextColor}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    color: 'white',
    backgroundColor: '#2F3335',
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    height: 50,
  },
});
