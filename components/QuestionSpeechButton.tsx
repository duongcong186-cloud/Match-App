import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type QuestionOption = number | string;

interface QuestionSpeechButtonProps {
  prompt: string;
  options: QuestionOption[];
  accentColor?: string;
  autoPlayKey: string | number;
}

const optionLabels = ['A', 'B', 'C', 'D'];

const readableMathText = (value: QuestionOption) =>
  String(value)
    .replace(/Ã·|÷/g, ' divided by ')
    .replace(/Ã—|×/g, ' times ')
    .replace(/\+/g, ' plus ')
    .replace(/-/g, ' minus ')
    .replace(/=/g, ' equals ')
    .replace(/>/g, ' greater than ')
    .replace(/</g, ' less than ')
    .replace(/__/g, ' blank ')
    .replace(/\?/g, ' question mark ')
    .replace(/\s+/g, ' ')
    .trim();

export function QuestionSpeechButton({
  prompt,
  options,
  accentColor = '#3b82f6',
  autoPlayKey,
}: QuestionSpeechButtonProps) {
  const speakQuestion = useCallback(() => {
    const answerText = options
      .map((option, index) => `${optionLabels[index]}. ${readableMathText(option)}.`)
      .join(' ');

    Speech.stop();
    Speech.speak(`Question. ${readableMathText(prompt)}. Answers. ${answerText}`, {
      language: 'en-US',
      pitch: 1,
      rate: 0.88,
    });
  }, [options, prompt]);

  useEffect(() => {
    const timeoutId = setTimeout(speakQuestion, 250);

    return () => {
      clearTimeout(timeoutId);
      Speech.stop();
    };
  }, [autoPlayKey, speakQuestion]);

  return (
    <TouchableOpacity
      style={[speechStyles.button, { borderColor: accentColor }]}
      activeOpacity={0.75}
      onPress={speakQuestion}
    >
      <Ionicons name="volume-high-outline" size={18} color={accentColor} />
      <Text style={[speechStyles.text, { color: accentColor }]}>Read question</Text>
    </TouchableOpacity>
  );
}

const speechStyles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginTop: 10,
    marginBottom: 14,
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default QuestionSpeechButton;
