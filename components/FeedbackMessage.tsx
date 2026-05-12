import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

interface FeedbackMessageProps {
  isCorrect: boolean;
  correctAnswer?: any;
  showIcon?: boolean;
}

export function FeedbackMessage({ isCorrect, correctAnswer, showIcon = true }: FeedbackMessageProps) {
  const message = useMemo(() => {
    if (isCorrect) {
      const messages = [
        'Correct!',
        'Well done!',
        'Great job!',
        'Perfect!',
        'Excellent!',
        'Awesome!',
        'Spot on!',
        'Brilliant!',
        'Outstanding!',
        'Superb!',
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }

    const messages = [
      'Good try!',
      'Not quite!',
      'Almost there!',
      'Keep going!',
      'Try the next one!',
      'You are learning!',
      'Nice effort!',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }, [isCorrect]);

  const iconName = isCorrect ? 'checkmark-circle' : 'close-circle';
  const iconColor = isCorrect ? '#10b981' : '#ef4444';
  const textColor = isCorrect ? '#10b981' : '#ef4444';
  const backgroundColor = isCorrect ? '#ecfdf5' : '#fef2f2';
  const borderColor = isCorrect ? '#bbf7d0' : '#fecaca';

  return (
    <View style={[feedbackStyles.container, { backgroundColor, borderColor }]}>
      {showIcon && (
        <View style={[feedbackStyles.iconContainer, { backgroundColor: iconColor }]}>
          <Ionicons 
            name={iconName} 
            size={24} 
            color="#ffffff" 
          />
        </View>
      )}
      <View style={feedbackStyles.textContainer}>
        <Text style={[feedbackStyles.messageText, { color: textColor }]}>
          {message}
        </Text>
        {!isCorrect && correctAnswer !== undefined && (
          <Text style={[feedbackStyles.correctAnswerText, { color: textColor }]}>
            Correct answer: {correctAnswer}
          </Text>
        )}
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');
const isCompactWidth = width < 380;

const feedbackStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingVertical: isCompactWidth ? 12 : 16,
    paddingHorizontal: isCompactWidth ? 14 : 20,
    marginHorizontal: isCompactWidth ? 0 : 8,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  iconContainer: {
    width: isCompactWidth ? 40 : 48,
    height: isCompactWidth ? 40 : 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 4,
  },
  correctAnswerText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    opacity: 0.8,
  },
});

export default FeedbackMessage;
