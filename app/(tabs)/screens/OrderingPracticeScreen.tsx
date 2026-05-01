import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FeedbackMessage from '../../../components/FeedbackMessage';
import GameTimer from '../../../components/GameTimer';
import { categories } from '../constants/categories';
import { styles } from '../styles';
import { Props } from '../types';
import { saveLevelResult } from '../utils/storage';

type QuestionOption = string;

interface Question {
  prompt: string;
  answer: QuestionOption;
  options: QuestionOption[];
}

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const generateSequence = (level: number) => {
  const length = level <= 4 ? 4 : level <= 7 ? 5 : 6;
  const start = Math.floor(Math.random() * 10) + 1;
  const step = Math.floor(Math.random() * 3) + 1;
  return Array.from({ length }, (_, idx) => start + idx * step);
};

const generateQuestion = (level: number): Question => {
  const sequence = generateSequence(level);
  const shuffled = shuffle(sequence);
  const scenario = Math.random();
  let prompt = '';
  let answer = '';
  let options: string[] = [];

  if (scenario < 0.2) {
    // Ascending order
    prompt = `Arrange from smallest to largest: ${shuffled.join(', ')}`;
    answer = [...sequence].sort((a, b) => a - b).join(', ');
    options = shuffle([
      answer,
      [...sequence].sort((a, b) => b - a).join(', '),
      shuffle([...sequence]).join(', '),
      shuffle([...sequence]).join(', '),
    ]);
  } else if (scenario < 0.4) {
    // Descending order
    prompt = `Arrange from largest to smallest: ${shuffled.join(', ')}`;
    answer = [...sequence].sort((a, b) => b - a).join(', ');
    options = shuffle([
      answer,
      [...sequence].sort((a, b) => a - b).join(', '),
      shuffle([...sequence]).join(', '),
      shuffle([...sequence]).join(', '),
    ]);
  } else if (scenario < 0.6) {
    // Find largest
    prompt = `Which number is largest? ${shuffled.join(', ')}`;
    answer = Math.max(...shuffled).toString();
    options = shuffle([
      answer,
      Math.min(...shuffled).toString(),
      shuffled[0].toString(),
      shuffled[shuffled.length - 1].toString(),
    ]);
  } else if (scenario < 0.8) {
    // Find smallest
    prompt = `Which number is smallest? ${shuffled.join(', ')}`;
    answer = Math.min(...shuffled).toString();
    options = shuffle([
      answer,
      Math.max(...shuffled).toString(),
      shuffled[0].toString(),
      shuffled[shuffled.length - 1].toString(),
    ]);
  } else {
    // Find middle/position
    const sorted = [...shuffled].sort((a, b) => a - b);
    const middleIndex = Math.floor(sorted.length / 2);
    prompt = `Which number is in the middle? ${shuffled.join(', ')}`;
    answer = sorted[middleIndex].toString();
    options = shuffle([
      answer,
      sorted[0].toString(),
      sorted[sorted.length - 1].toString(),
      shuffled[Math.floor(Math.random() * shuffled.length)].toString(),
    ]);
  }

  // Ensure unique options
  const uniqueOptions = [...new Set(options)];
  while (uniqueOptions.length < 4) {
    const randomNum = Math.floor(Math.random() * 20) + 1;
    if (!uniqueOptions.includes(randomNum.toString())) {
      uniqueOptions.push(randomNum.toString());
    }
  }

  return { prompt, answer, options: shuffle(uniqueOptions.slice(0, 4)) };
};

export function OrderingPracticeScreen({ route, navigation }: Props) {
  const level = route.params?.level ?? 1;
  const category = categories.find(cat => cat.key === 'ordering')!;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<QuestionOption | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  
  // Animation states
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [isTransitioning, setIsTransitioning] = useState(false);
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
      setCorrectCount(count => count + 1);
    }
  };

  const animateTransition = (callback: () => void) => {
    setIsTransitioning(true);
    
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Change content
      callback();
      
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setIsTransitioning(false);
      });
    });
  };

  const handleNext = async () => {
    if (!answered || isTransitioning) return;
    
    if (currentIndex < questions.length - 1) {
      animateTransition(() => {
        setCurrentIndex(index => index + 1);
        setSelectedAnswer(null);
        setAnswered(false);
      });
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
        <Animated.View style={[styles.questionCard, { opacity: fadeAnim }]}>
          <Text style={styles.questionText}>{currentQuestion.prompt}</Text>
        </Animated.View>

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
