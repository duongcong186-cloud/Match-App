import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface GameTimerProps {
  startTime: number;
  isRunning: boolean;
  onTimeUpdate?: (elapsedSeconds: number) => void;
  color?: string;
}

export function GameTimer({ startTime, isRunning, onTimeUpdate, color }: GameTimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        setElapsedSeconds(elapsed);
        onTimeUpdate?.(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, startTime, onTimeUpdate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[timerStyles.container, { borderColor: color || '#6b7280' }]}>
      <Ionicons name="time-outline" size={20} color={color || '#6b7280'} />
      <Text style={[timerStyles.timerText, { color: color || '#374151' }]}>{formatTime(elapsedSeconds)}</Text>
    </View>
  );
}

const timerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'monospace',
  },
});

export default GameTimer;
