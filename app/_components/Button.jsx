import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
  secondary: '#161819',
  default:   '#0A2B4C',
  textOnPrimary:   '#fff',
  textOnSecondary: '#104172',
  textOnInfo:      '#fff',
};

const GRADIENTS = {
  primary: ['#161819', '#363B82', '#2C2D6C'],
};

export default function Button({
  title,
  variant = 'primary',
  fullWidth = false,
  onPress,
  style,
  textStyle,
  ...props
}) {
  const textColor = {
    primary:   COLORS.textOnPrimary,
    secondary: COLORS.textOnSecondary,
    info:      COLORS.textOnInfo
  }[variant];

  const isSecondary = variant === 'secondary';
  const isInfo      = variant === 'info';

  if (variant === 'primary') {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[fullWidth && { width: '100%' }, style]} {...props}>
        <LinearGradient
          colors={GRADIENTS.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, fullWidth && { width: '100%' }]}
        >
          <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (isInfo) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[
          styles.button,
          {
            backgroundColor: COLORS.secondary,
            borderWidth: 2,
            borderColor: COLORS.default
          },
          fullWidth && { width: '100%' },
          style
        ]}
        {...props}
      >
        <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: COLORS.secondary,
          borderWidth: isSecondary ? 2 : 0,
          borderColor: isSecondary ? COLORS.default : 'transparent'
        },
        fullWidth && { width: '100%' },
        style
      ]}
      {...props}
    >
      <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center'
  },
  text: {
    fontSize: 16,
    fontWeight: '600'
  }
});
