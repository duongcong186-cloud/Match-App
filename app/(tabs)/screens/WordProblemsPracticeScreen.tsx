import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FeedbackMessage from '../../../components/FeedbackMessage';
import GameTimer from '../../../components/GameTimer';
import { categories } from '../constants/categories';
import { styles } from '../styles';
import { Props } from '../types';
import { saveLevelResult } from '../utils/storage';

type QuestionOption = number;

interface Question {
  prompt: string;
  answer: QuestionOption;
  options: QuestionOption[];
  images?: { icon: string; count: number }[];
}

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const WordProblemImage = ({ type, color }: { type: string; color: string }) => {
  const renderApple = () => (
    <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ 
        width: 24, 
        height: 24, 
        backgroundColor: '#ef4444', 
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        <View style={{ 
          width: 4, 
          height: 4, 
          backgroundColor: '#dc2626', 
          borderRadius: 2,
          position: 'absolute',
          top: 6
        }} />
        <View style={{ 
          width: 2, 
          height: 6, 
          backgroundColor: '#84cc16', 
          borderRadius: 1,
          position: 'absolute',
          top: -2
        }} />
      </View>
    </View>
  );

  const renderFish = () => (
    <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ 
        width: 28, 
        height: 16, 
        backgroundColor: '#06b6d4', 
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        <View style={{ 
          width: 6, 
          height: 8, 
          backgroundColor: '#0891b2', 
          borderRadius: 3,
          position: 'absolute',
          right: -2
        }} />
        <View style={{ 
          width: 3, 
          height: 3, 
          backgroundColor: '#ffffff', 
          borderRadius: 2,
          position: 'absolute',
          left: 6
        }} />
      </View>
    </View>
  );

  const renderCar = () => (
    <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ 
        width: 26, 
        height: 14, 
        backgroundColor: '#059669', 
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        <View style={{ 
          width: 4, 
          height: 6, 
          backgroundColor: '#047857', 
          borderRadius: 2,
          position: 'absolute',
          top: -4
        }} />
        <View style={{ 
          width: 3, 
          height: 3, 
          backgroundColor: '#064e3b', 
          borderRadius: 2,
          position: 'absolute',
          bottom: -1,
          left: 4
        }} />
        <View style={{ 
          width: 3, 
          height: 3, 
          backgroundColor: '#064e3b', 
          borderRadius: 2,
          position: 'absolute',
          bottom: -1,
          right: 4
        }} />
      </View>
    </View>
  );

  const renderPizza = () => (
    <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ 
        width: 24, 
        height: 24, 
        backgroundColor: '#dc2626', 
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        <View style={{ 
          width: 18, 
          height: 18, 
          backgroundColor: '#fbbf24', 
          borderRadius: 9,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{ 
            width: 12, 
            height: 12, 
            backgroundColor: '#f59e0b', 
            borderRadius: 6
          }} />
        </View>
      </View>
    </View>
  );

  const renderIceCream = () => (
    <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ 
        width: 8, 
        height: 12, 
        backgroundColor: '#ec4899', 
        borderRadius: 4,
        position: 'absolute',
        bottom: 8
      }} />
      <View style={{ 
        width: 12, 
        height: 8, 
        backgroundColor: '#f472b6', 
        borderRadius: 6,
        position: 'absolute',
        bottom: 16
      }} />
      <View style={{ 
        width: 16, 
        height: 6, 
        backgroundColor: '#f9a8d4', 
        borderRadius: 8,
        position: 'absolute',
        bottom: 22
      }} />
      <View style={{ 
        width: 4, 
        height: 8, 
        backgroundColor: '#be185d', 
        borderRadius: 2,
        position: 'absolute',
        bottom: 0
      }} />
    </View>
  );

  const renderPaw = () => (
    <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ 
        width: 20, 
        height: 20, 
        backgroundColor: '#84cc16', 
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        <View style={{ 
          width: 6, 
          height: 6, 
          backgroundColor: '#65a30d', 
          borderRadius: 3,
          position: 'absolute',
          top: -2
        }} />
        <View style={{ 
          width: 6, 
          height: 6, 
          backgroundColor: '#65a30d', 
          borderRadius: 3,
          position: 'absolute',
          bottom: -2
        }} />
        <View style={{ 
          width: 6, 
          height: 6, 
          backgroundColor: '#65a30d', 
          borderRadius: 3,
          position: 'absolute',
          left: -2
        }} />
        <View style={{ 
          width: 6, 
          height: 6, 
          backgroundColor: '#65a30d', 
          borderRadius: 3,
          position: 'absolute',
          right: -2
        }} />
      </View>
    </View>
  );

  const renderOperator = (operator: string) => (
    <View style={{ 
      width: 30, 
      height: 30, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#3b82f6',
      borderRadius: 15
    }}>
      <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>
        {operator}
      </Text>
    </View>
  );

  const renderMarble = () => (
    <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ 
        width: 20, 
        height: 20, 
        backgroundColor: '#8b5cf6', 
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        <View style={{ 
          width: 8, 
          height: 8, 
          backgroundColor: '#7c3aed', 
          borderRadius: 4,
          opacity: 0.6
        }} />
      </View>
    </View>
  );

  const renderCake = () => (
    <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ 
        width: 22, 
        height: 16, 
        backgroundColor: '#f59e0b', 
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        <View style={{ 
          width: 18, 
          height: 4, 
          backgroundColor: '#dc2626', 
          borderRadius: 2,
          position: 'absolute',
          top: 2
        }} />
        <View style={{ 
          width: 18, 
          height: 4, 
          backgroundColor: '#ffffff', 
          borderRadius: 2,
          position: 'absolute',
          bottom: 2
        }} />
      </View>
    </View>
  );

  const renderCube = () => (
    <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ 
        width: 20, 
        height: 20, 
        backgroundColor: '#6366f1', 
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        <View style={{ 
          width: 20, 
          height: 20, 
          backgroundColor: '#4f46e5', 
          transform: [{ skewX: '20deg' }],
          position: 'absolute',
          top: -4,
          left: 4
        }} />
        <View style={{ 
          width: 20, 
          height: 20, 
          backgroundColor: '#818cf8', 
          transform: [{ skewY: '20deg' }],
          position: 'absolute',
          top: 4,
          left: -4
        }} />
      </View>
    </View>
  );

  const renderBasket = () => (
    <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ 
        width: 24, 
        height: 18, 
        backgroundColor: '#a855f7', 
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        <View style={{ 
          width: 20, 
          height: 2, 
          backgroundColor: '#9333ea', 
          borderRadius: 1,
          position: 'absolute',
          top: 4
        }} />
        <View style={{ 
          width: 20, 
          height: 2, 
          backgroundColor: '#9333ea', 
          borderRadius: 1,
          position: 'absolute',
          bottom: 4
        }} />
        <View style={{ 
          width: 2, 
          height: 6, 
          backgroundColor: '#7c3aed', 
          borderRadius: 1,
          position: 'absolute',
          top: -2
        }} />
      </View>
    </View>
  );

  const renderBicycle = () => (
    <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ 
        width: 26, 
        height: 16, 
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        <View style={{ 
          width: 16, 
          height: 2, 
          backgroundColor: '#ea580c', 
          borderRadius: 1,
          position: 'absolute',
          top: 6
        }} />
        <View style={{ 
          width: 6, 
          height: 6, 
          backgroundColor: '#ea580c', 
          borderRadius: 3,
          position: 'absolute',
          bottom: 2,
          left: 2
        }} />
        <View style={{ 
          width: 6, 
          height: 6, 
          backgroundColor: '#ea580c', 
          borderRadius: 3,
          position: 'absolute',
          bottom: 2,
          right: 2
        }} />
        <View style={{ 
          width: 8, 
          height: 4, 
          backgroundColor: '#dc2626', 
          borderRadius: 2,
          position: 'absolute',
          top: 2,
          right: 4
        }} />
      </View>
    </View>
  );

  switch (type) {
    case 'apple-outline':
      return renderApple();
    case 'add-circle-outline':
      return renderOperator('+');
    case 'remove-circle-outline':
      return renderOperator('-');
    case 'ellipse-outline':
      return renderMarble();
    case 'restaurant-outline':
      return renderCake();
    case 'paw-outline':
      return renderPaw();
    case 'fish-outline':
      return renderFish();
    case 'cube-outline':
      return renderCube();
    case 'basket-outline':
      return renderBasket();
    case 'pizza-outline':
      return renderPizza();
    case 'ice-cream-outline':
      return renderIceCream();
    case 'car-outline':
      return renderCar();
    case 'bicycle-outline':
      return renderBicycle();
    default:
      return renderOperator('?');
  }
};

const generateQuestion = (level: number): Question => {
  // Giới hạn số lượng để tránh quá nhiều hình ảnh
  const maxCount = 3;
  const a = Math.floor(Math.random() * maxCount) + 1;
  const b = Math.floor(Math.random() * maxCount) + 1;
  const scenario = Math.random();
  let prompt = '';
  let answer = 0;
  let images: { icon: string; count: number }[] = [];

  if (scenario < 0.12) {
    // Addition - apples
    prompt = `${a} apples + ${b} apples = ?`;
    answer = a + b;
    images = [
      { icon: 'apple-outline', count: a },
      { icon: 'add-circle-outline', count: 1 },
      { icon: 'apple-outline', count: b }
    ];
  } else if (scenario < 0.24) {
    // Subtraction - marbles
    const bigger = Math.max(a, b);
    const smaller = Math.min(a, b);
    prompt = `${bigger} marbles - ${smaller} marbles = ?`;
    answer = bigger - smaller;
    images = [
      { icon: 'ellipse-outline', count: bigger },
      { icon: 'remove-circle-outline', count: 1 },
      { icon: 'ellipse-outline', count: smaller }
    ];
  } else if (scenario < 0.36) {
    // Multiplication - groups of objects
    prompt = `${a} groups of ${b} pencils = ?`;
    answer = a * b;
    images = Array.from({ length: a }, () => ({ icon: 'basket-outline', count: b }));
  } else if (scenario < 0.48) {
    // Division - sharing equally
    const total = a * b;
    prompt = `${total} cookies shared by ${a} friends = ? each`;
    answer = b;
    images = [
      { icon: 'pizza-outline', count: total },
      { icon: 'remove-circle-outline', count: 1 },
      { icon: 'paw-outline', count: a }
    ];
  } else if (scenario < 0.6) {
    // Comparison - which is more
    prompt = `${a} cats vs ${b} dogs - which is more?`;
    answer = a > b ? a : b;
    images = [
      { icon: 'paw-outline', count: a },
      { icon: 'add-circle-outline', count: 1 },
      { icon: 'paw-outline', count: b }
    ];
  } else if (scenario < 0.72) {
    // Money problems
    const priceA = a * 2;
    const priceB = b * 3;
    prompt = `${a} books ($${priceA}) + ${b} pens ($${priceB}) = $ total?`;
    answer = priceA + priceB;
    images = [
      { icon: 'cube-outline', count: a },
      { icon: 'add-circle-outline', count: 1 },
      { icon: 'ice-cream-outline', count: b }
    ];
  } else if (scenario < 0.84) {
    // Time problems
    const hoursA = a;
    const hoursB = b;
    prompt = `${hoursA} hours + ${hoursB} hours = ? hours total`;
    answer = hoursA + hoursB;
    images = [
      { icon: 'car-outline', count: hoursA },
      { icon: 'add-circle-outline', count: 1 },
      { icon: 'bicycle-outline', count: hoursB }
    ];
  } else {
    // Distance problems
    const kmA = a * 5;
    const kmB = b * 3;
    prompt = `${kmA}km by car + ${kmB}km by bike = ? km total`;
    answer = kmA + kmB;
    images = [
      { icon: 'car-outline', count: a },
      { icon: 'add-circle-outline', count: 1 },
      { icon: 'bicycle-outline', count: b }
    ];
  }

  // Generate unique options
  const generateUniqueOptions = (correctAnswer: number) => {
    const options = [correctAnswer];
    
    // Add wrong answers
    const wrongAnswers = [];
    
    // Add answer - 1 (but not negative and not duplicate)
    const minusOne = correctAnswer - 1;
    if (minusOne >= 0 && !options.includes(minusOne)) {
      wrongAnswers.push(minusOne);
    }
    
    // Add answer + 1
    const plusOne = correctAnswer + 1;
    if (!options.includes(plusOne)) {
      wrongAnswers.push(plusOne);
    }
    
    // Add answer + 2
    const plusTwo = correctAnswer + 2;
    if (!options.includes(plusTwo)) {
      wrongAnswers.push(plusTwo);
    }
    
    // Add answer - 2 if needed
    if (wrongAnswers.length < 3) {
      const minusTwo = correctAnswer - 2;
      if (minusTwo >= 0 && !options.includes(minusTwo)) {
        wrongAnswers.push(minusTwo);
      }
    }
    
    // Take only 3 wrong answers
    const finalWrongAnswers = wrongAnswers.slice(0, 3);
    
    return shuffle([...options, ...finalWrongAnswers]);
  };

  return {
    prompt,
    answer,
    images,
    options: generateUniqueOptions(answer),
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
  
  // Animation states
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
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
          <View style={styles.wordProblemContainer}>
            <View style={styles.wordProblemImagesContainer}>
              {currentQuestion.images && currentQuestion.images.map((imageGroup, index) => (
                <View key={index} style={styles.wordProblemImageGroup}>
                  {Array.from({ length: imageGroup.count }).map((_, i) => (
                    <WordProblemImage
                      key={i}
                      type={imageGroup.icon}
                      color={category.color}
                    />
                  ))}
                </View>
              ))}
            </View>
            <Text style={styles.questionText}>{currentQuestion.prompt}</Text>
          </View>
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
