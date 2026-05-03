import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FeedbackMessage from '../../../components/FeedbackMessage';
import GameTimer from '../../../components/GameTimer';
import { categories } from '../constants/categories';
import { styles } from '../styles';
import { Props } from '../types';
import { saveLevelResult } from '../utils/storage';
import { soundManager } from '../utils/sounds';

type QuestionOption = number;

interface Question {
  grid: number[][];
  prompt: string;
  answer: QuestionOption;
  options: QuestionOption[];
  missingRow: number;
  missingCol: number;
}

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const generateSudokuGrid = (level: number) => {
  const size = level <= 4 ? 2 : 3;
  const base = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
  const numbers = Array.from({ length: size * size }, (_, idx) => idx + 1);
  const filled = shuffle(numbers).slice(0, size * size);
  return Array.from({ length: size }, (_, row) => filled.slice(row * size, row * size + size));
};

const generateQuestion = (level: number): Question => {
  const grid = generateSudokuGrid(level);
  const size = grid.length;
  const missingRow = Math.floor(Math.random() * size);
  const missingCol = Math.floor(Math.random() * size);
  const answer = grid[missingRow][missingCol];
  const prompt = `Fill in the missing number (${size}x${size})`;
  const options = shuffle([answer, answer + 1, answer - 1, answer + 2].filter(val => val > 0));
  const displayGrid = grid.map((row, rowIndex) => row.map((value, colIndex) => (rowIndex === missingRow && colIndex === missingCol ? 0 : value)));
  return { grid: displayGrid, prompt, answer, options, missingRow, missingCol };
};

export function SudokuPracticeScreen({ route, navigation }: Props) {
  const level = route.params?.level ?? 1;
  const category = categories.find(cat => cat.key === 'sudoku')!;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<QuestionOption | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

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
      soundManager.playCorrectSound();
      setCorrectCount(count => count + 1);
    } else {
      soundManager.playWrongSound();
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
        <GameTimer 
          startTime={startTime} 
          isRunning={!answered} 
          onTimeUpdate={setElapsedSeconds}
          color={category.color}
        />
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: progressWidth, backgroundColor: category.color }]} />
      </View>

      <ScrollView contentContainerStyle={styles.practiceScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.prompt}</Text>
          <View style={styles.sudokuContainer}>
            {currentQuestion.grid.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.sudokuRow}>
                {row.map((value, colIndex) => (
                  <View key={colIndex} style={styles.sudokuCell}>
                    <Text style={styles.sudokuText}>{value === 0 ? '' : value}</Text>
                  </View>
                ))}
              </View>
            ))}
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
          <FeedbackMessage 
            isCorrect={isCorrect}
            correctAnswer={currentQuestion?.answer}
          />
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
