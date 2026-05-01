import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface FeedbackMessageProps {
  isCorrect: boolean;
  correctAnswer?: any;
  showIcon?: boolean;
}

export function FeedbackMessage({ isCorrect, correctAnswer, showIcon = true }: FeedbackMessageProps) {
  const getCorrectMessage = () => {
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
      'Superb!'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getWrongMessage = () => {
    const messages = [
      'Not correct!',
      'Try again!',
      'Keep trying!',
      'Wrong answer!',
      'Not quite!',
      'Incorrect!',
      'Almost there!',
      'Try once more!',
      'Not right!',
      'Keep going!'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const message = isCorrect ? getCorrectMessage() : getWrongMessage();
  const iconName = isCorrect ? 'checkmark-circle' : 'close-circle';
  const iconColor = isCorrect ? '#10b981' : '#ef4444';
  const textColor = isCorrect ? '#10b981' : '#ef4444';

  return (
    <View style={feedbackStyles.container}>
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
            Correct answer is: {correctAnswer}
          </Text>
        )}
      </View>
    </View>
  );
}

const feedbackStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
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
