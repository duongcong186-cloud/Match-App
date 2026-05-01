import React, { useRef } from 'react';
import { Animated, Text, TouchableOpacity } from 'react-native';
import { styles } from '../app/(tabs)/styles';
import { soundManager } from '../app/(tabs)/utils/sounds';

interface AnimatedOptionButtonProps {
  option: any;
  idx: number;
  selected: boolean;
  answered: boolean;
  correct: boolean;
  backgroundColor: string;
  textColor: string;
  onPress: () => void;
  disabled: boolean;
}

export function AnimatedOptionButton({
  option,
  idx,
  selected,
  answered,
  correct,
  backgroundColor,
  textColor,
  onPress,
  disabled
}: AnimatedOptionButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    if (answered) return;
    
    if (correct) {
      // Correct answer - scale up animation + sound
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      soundManager.playCorrectSound();
    } else {
      // Wrong answer - shake animation + sound
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      soundManager.playWrongSound();
    }
    
    onPress();
  };

  return (
    <Animated.View
      style={[
        styles.optionButton,
        { backgroundColor, borderColor: backgroundColor },
        selected && answered && correct && {
          transform: [{ scale: scaleAnim }]
        },
        selected && answered && !correct && {
          transform: [{ translateX: shakeAnim }]
        }
      ]}
    >
      <TouchableOpacity
        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, gap: 12 }}
        onPress={handlePress}
        disabled={disabled}
      >
        <Text style={[styles.optionLabel, { color: textColor }]}>{String.fromCharCode(65 + idx)}</Text>
        <Text style={[styles.optionText, { color: textColor }]}>{option}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
