import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';
import { categories } from '../constants/categories';
import { Props } from '../types';
import { saveLevelResult } from '../utils/storage';

type QuestionOption = string;

interface Question {
  prompt: string;
  answer: QuestionOption;
  options: QuestionOption[];
  targetShape: string;
}

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const shapes = [
  { name: 'Triangle', label: 'Triangle' },
  { name: 'Square', label: 'Square' },
  { name: 'Rectangle', label: 'Rectangle' },
  { name: 'Pentagon', label: 'Pentagon' },
  { name: 'Hexagon', label: 'Hexagon' },
];

const generateQuestion = (level: number): Question => {
  const item = shapes[Math.floor(Math.random() * shapes.length)];
  const prompt = Math.random() < 0.6
    ? `Which shape is a ${item.label}?`
    : `Which shape has ${item.name === 'Triangle' ? '3' : item.name === 'Square' || item.name === 'Rectangle' ? '4' : item.name === 'Pentagon' ? '5' : '6'} sides?`;
  const options = shuffle(shapes.map(shape => shape.label));
  return {
    prompt,
    answer: item.label,
    options,
    targetShape: item.label,
  };
};

export function GeometryPracticeScreen({ route, navigation }: Props) {
  const level = route.params?.level ?? 1;
  const category = categories.find(cat => cat.key === 'geometry')!;
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
      <View style={[styles.practiceHeader, { backgroundColor: category.color }]}>
        <TouchableOpacity style={styles.practiceBackButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.practiceHeaderContent}>
          <View style={styles.screenHeaderIcon}>
            <Ionicons name={category.icon as any} size={26} color="#fff" />
          </View>
          <View style={styles.practiceHeaderTextGroup}>
            <Text style={[styles.practiceHeaderTitle, { color: '#ffffff' }]}>{category.title}</Text>
            <Text style={styles.practiceHeaderSubtitle}>{category.subtitle}</Text>
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
          <View style={styles.shapesRow}>
            <View style={styles.shapeItem}>
              <View style={[styles.triangle, { borderBottomColor: '#f97316' }]} />
              <Text style={styles.shapeLabel}>Triangle</Text>
            </View>
            <View style={styles.shapeItem}>
              <View style={[styles.square, { backgroundColor: '#10b981' }]} />
              <Text style={styles.shapeLabel}>Square</Text>
            </View>
            <View style={styles.shapeItem}>
              <View style={[styles.circle, { backgroundColor: '#3b82f6' }]} />
              <Text style={styles.shapeLabel}>Circle</Text>
            </View>
          </View>
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
    </SafeAreaView>
  );
}
