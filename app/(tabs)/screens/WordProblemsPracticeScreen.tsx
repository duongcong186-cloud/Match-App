import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { categories } from '../constants/categories';
import { styles } from '../styles';
import { Props } from '../types';
import { saveLevelResult } from '../utils/storage';

type QuestionOption = number;

interface Question {
  prompt: string;
  answer: QuestionOption;
  options: QuestionOption[];
}

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const generateQuestion = (level: number): Question => {
  const base = level <= 4 ? 5 : level <= 7 ? 12 : 20;
  const a = Math.floor(Math.random() * base) + 1;
  const b = Math.floor(Math.random() * base) + 1;
  const scenario = Math.random();
  let prompt = '';
  let answer = 0;

  if (scenario < 0.4) {
    prompt = `Tom has ${a} apples. He buys ${b} more. How many apples does Tom have?`;
    answer = a + b;
  } else if (scenario < 0.75) {
    prompt = `Lana has ${Math.max(a, b)} marbles. She gives ${Math.min(a, b)} to a friend. How many are left?`;
    answer = Math.max(a, b) - Math.min(a, b);
  } else {
    prompt = `Harry has ${a} cakes. He eats ${Math.floor(b / 2)}. How many are left?`;
    answer = a - Math.floor(b / 2);
    if (answer < 0) answer = 0;
  }

  return {
    prompt,
    answer,
    options: shuffle([answer, Math.max(answer - 1, 0), answer + 1, answer + 2]),
  };
};

export function WordProblemsPracticeScreen({ route, navigation }: Props) {
  const level = route.params?.level ?? 1;
  const category = categories.find(cat => cat.key === 'wordproblems')!;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<QuestionOption | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    const newQuestions = Array.from({ length: 10 }, () => generateQuestion(level));
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setCorrectCount(0);
    setStartTime(Date.now());
  }, [level]);

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion?.answer;
  const progressWidth = ((currentIndex + 1) / 10) * (Dimensions.get('window').width - 40);

  const handleAnswer = (option: QuestionOption) => {
    if (answered || !currentQuestion) return;
    setSelectedAnswer(option);
    setAnswered(true);
    if (option === currentQuestion.answer) {
      setCorrectCount(count => count + 1);
    }
  };

  const handleNext = async () => {
    if (!answered) return;
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(index => index + 1);
      setSelectedAnswer(null);
      setAnswered(false);
      return;
    }
    const duration = Math.round((Date.now() - startTime) / 1000);
    await saveLevelResult(category.key, level, correctCount, duration);
    navigation.navigate('Result', {
      categoryKey: category.key,
      level,
      score: correctCount,
      duration,
    });
  };

  if (questions.length === 0) return null;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#f8fafc' }]}> 
      <View style={styles.container}> 
      <View style={[styles.practiceHeader, { backgroundColor: category.color }]}>
        <View style={styles.practiceHeaderRow}>
          <TouchableOpacity style={styles.practiceBackButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.practiceHeaderTextGroup}>
            <Text style={[styles.practiceHeaderTitle, { color: '#ffffff' }]}>{category.title}</Text>
          </View>
        </View>
      </View>

      <View style={styles.practiceMetaContainer}>
        <Text style={[styles.practiceMetaText, { color: category.color }]}>Level {level}</Text>
        <Text style={[styles.practiceMetaText, { color: category.color }]}>{currentIndex + 1}/10</Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: progressWidth, backgroundColor: category.color }]} />
      </View>

      <ScrollView contentContainerStyle={styles.practiceScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.prompt}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, idx) => {
            const selected = selectedAnswer === option;
            const correct = answered && option === currentQuestion.answer;
            const backgroundColor = !answered
              ? selected
                ? category.color
                : '#ffffff'
              : selected
                ? correct
                  ? '#10b981'
                  : '#ef4444'
                : correct
                  ? '#10b981'
                  : '#ffffff';
            const textColor = selected || correct ? '#ffffff' : '#111827';
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.optionButton, { backgroundColor, borderColor: backgroundColor }]}
                onPress={() => handleAnswer(option)}
                disabled={answered}
              >
                <Text style={[styles.optionLabel, { color: textColor }]}>{String.fromCharCode(65 + idx)}</Text>
                <Text style={[styles.optionText, { color: textColor }]}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {answered && (
          <Text style={[styles.feedbackText, { color: isCorrect ? '#10b981' : '#ef4444' }]}>
            {isCorrect ? 'Correct! Great job.' : `Incorrect — the correct answer is ${currentQuestion?.answer}.`}
          </Text>
        )}
      </ScrollView>

      {answered && (
        <View style={styles.practiceNextButtonContainer}>
          <TouchableOpacity style={[styles.practiceNextButton, { backgroundColor: category.color }]} onPress={handleNext}>
            <Text style={styles.practiceNextButtonText}>{currentIndex === 9 ? 'Finish' : 'Next'}</Text>
            <Ionicons
              name={currentIndex === 9 ? 'checkmark' : 'arrow-forward'}
              size={20}
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>
      )}
      </View>
    </SafeAreaView>
  );
}
