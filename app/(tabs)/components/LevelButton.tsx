import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';

interface LevelButtonProps {
  level: number;
  stars: number;
  color: string;
  onPress: () => void;
  isLocked?: boolean;
}

export function LevelButton({ 
  level, 
  stars, 
  color, 
  onPress, 
  isLocked = false 
}: LevelButtonProps) {
  return (
    <TouchableOpacity 
      style={styles.levelButtonContainer}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={isLocked}
    >
      <View style={[styles.levelCircle, { backgroundColor: color }]}>
        <Text style={styles.levelNumber}>{level}</Text>
      </View>
      
      <View style={styles.starsContainer}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Ionicons
            key={index}
            name={index < stars ? 'star' : 'star-outline'}
            size={18}
            color={index < stars ? '#fbbf24' : '#d1d5db'}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
}
