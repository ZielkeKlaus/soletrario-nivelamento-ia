import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, Metrics } from '../styles/theme';

const CustomButton = ({ title, onPress, color = Colors.secondary }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: color }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: Metrics.borderRadius,
    borderWidth: Metrics.borderWidth,
    borderColor: Colors.border,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  text: {
    fontFamily: Fonts.titles, // Luckiest Guy
    fontSize: 20,
    color: Colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
});

export default CustomButton;