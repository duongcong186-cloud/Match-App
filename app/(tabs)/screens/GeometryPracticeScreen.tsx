import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FeedbackMessage from '../../../components/FeedbackMessage';
import GameTimer from '../../../components/GameTimer';
import { categories } from '../constants/categories';
import { styles } from '../styles';
import { Props } from '../types';
import { soundManager } from '../utils/sounds';
import { saveLevelResult } from '../utils/storage';

type QuestionOption = string;

interface Question {
  prompt: string;
  answer: QuestionOption;
  options: QuestionOption[];
  targetShape: string;
  shapeImage: string;
}

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

// Helper function to create exactly 4 options (shape names)
const createFourShapeOptions = (correct: string, wrong1: string, wrong2: string, wrong3: string) => {
  return shuffle([correct, wrong1, wrong2, wrong3]);
};

// Function to render shape images using CSS shapes
const renderShapeImage = (shapeType: string) => {
  switch (shapeType) {
    case 'triangle':
      return (
        <View style={styles.shapeWrapper}>
          <View style={[styles.triangleShape, { borderBottomColor: '#f97316' }]} />
        </View>
      );
    case 'square':
      return (
        <View style={styles.shapeWrapper}>
          <View style={[styles.squareShape, { backgroundColor: '#10b981' }]} />
        </View>
      );
    case 'circle':
      return (
        <View style={styles.shapeWrapper}>
          <View style={[styles.circleShape, { backgroundColor: '#3b82f6' }]} />
        </View>
      );
    case 'rectangle':
      return (
        <View style={styles.shapeWrapper}>
          <View style={[styles.rectangleShape, { backgroundColor: '#8b5cf6' }]} />
        </View>
      );
    case 'pentagon':
      return (
        <View style={styles.shapeWrapper}>
          <View style={[styles.pentagonShape, { backgroundColor: '#ef4444' }]} />
        </View>
      );
    case 'hexagon':
      return (
        <View style={styles.shapeWrapper}>
          <View style={[styles.hexagonShape, { backgroundColor: '#f59e0b' }]} />
        </View>
      );
    case 'diamond':
      return (
        <View style={styles.shapeWrapper}>
          <View style={[styles.diamondShape, { backgroundColor: '#ec4899' }]} />
        </View>
      );
    case 'trapezoid':
      return (
        <View style={styles.shapeWrapper}>
          <View style={[styles.trapezoidShape, { backgroundColor: '#14b8a6' }]} />
        </View>
      );
    case 'rhombus':
      return (
        <View style={styles.shapeWrapper}>
          <View style={[styles.rhombusShape, { backgroundColor: '#f97316' }]} />
        </View>
      );
    case 'star':
      return (
        <View style={styles.shapeWrapper}>
          <View style={[styles.starShape, { backgroundColor: '#eab308' }]} />
        </View>
      );
    case 'heart':
      return (
        <View style={styles.shapeWrapper}>
          <View style={[styles.heartShape, { backgroundColor: '#ef4444' }]} />
        </View>
      );
    case 'crescent':
      return (
        <View style={styles.shapeWrapper}>
          <View style={[styles.crescentShape, { backgroundColor: '#3b82f6' }]} />
        </View>
      );
    case 'octagon':
      return (
        <View style={styles.shapeWrapper}>
          <View style={[styles.octagonShape, { backgroundColor: '#10b981' }]} />
        </View>
      );
    case 'parallelogram':
      return (
        <View style={styles.shapeWrapper}>
          <View style={[styles.parallelogramShape, { backgroundColor: '#8b5cf6' }]} />
        </View>
      );
    case 'cube':
      return (
        <View style={styles.shapeWrapper}>
          <View style={[styles.cubeShape, { backgroundColor: '#6b7280' }]} />
        </View>
      );
    case 'pyramid':
      return (
        <View style={styles.shapeWrapper}>
          <View style={[styles.pyramidShape, { backgroundColor: '#f97316' }]} />
        </View>
      );
    case 'sphere':
      return (
        <View style={styles.shapeWrapper}>
          <View style={[styles.sphereShape, { backgroundColor: '#3b82f6' }]} />
        </View>
      );
    case 'cylinder':
      return (
        <View style={styles.shapeWrapper}>
          <View style={[styles.cylinderShape, { backgroundColor: '#10b981' }]} />
        </View>
      );
    case 'cone':
      return (
        <View style={styles.shapeWrapper}>
          <View style={[styles.coneShape, { backgroundColor: '#ef4444' }]} />
        </View>
      );
    default:
      return (
        <View style={styles.shapeWrapper}>
          <View style={[styles.squareShape, { backgroundColor: '#6b7280' }]} />
        </View>
      );
  }
};

const generateQuestion = (level: number): Question => {
  if (level <= 3) {
    // Level 1-3: Basic shapes - identify shapes
    const basicQuestions = [
      {
        prompt: 'Which shape is this?',
        answer: 'Triangle',
        options: createFourShapeOptions('Triangle', 'Square', 'Circle', 'Rectangle'),
        shapeImage: 'triangle'
      },
      {
        prompt: 'Which shape is this?',
        answer: 'Square',
        options: createFourShapeOptions('Square', 'Triangle', 'Circle', 'Rectangle'),
        shapeImage: 'square'
      },
      {
        prompt: 'Which shape is this?',
        answer: 'Circle',
        options: createFourShapeOptions('Circle', 'Triangle', 'Square', 'Rectangle'),
        shapeImage: 'circle'
      },
      {
        prompt: 'Which shape is this?',
        answer: 'Rectangle',
        options: createFourShapeOptions('Rectangle', 'Square', 'Triangle', 'Circle'),
        shapeImage: 'rectangle'
      }
    ];
    
    const question = basicQuestions[Math.floor(Math.random() * basicQuestions.length)];
    return {
      prompt: question.prompt,
      answer: question.answer,
      options: question.options,
      targetShape: question.answer,
      shapeImage: question.shapeImage
    };
  } else if (level <= 6) {
    // Level 4-6: Intermediate shapes - identify more complex shapes
    const intermediateQuestions = [
      {
        prompt: 'Which shape is this?',
        answer: 'Pentagon',
        options: createFourShapeOptions('Pentagon', 'Triangle', 'Square', 'Hexagon'),
        shapeImage: 'pentagon'
      },
      {
        prompt: 'Which shape is this?',
        answer: 'Hexagon',
        options: createFourShapeOptions('Hexagon', 'Pentagon', 'Square', 'Circle'),
        shapeImage: 'hexagon'
      },
      {
        prompt: 'Which shape is this?',
        answer: 'Diamond',
        options: createFourShapeOptions('Diamond', 'Square', 'Triangle', 'Circle'),
        shapeImage: 'diamond'
      },
      {
        prompt: 'Which shape is this?',
        answer: 'Trapezoid',
        options: createFourShapeOptions('Trapezoid', 'Rectangle', 'Square', 'Triangle'),
        shapeImage: 'trapezoid'
      },
      {
        prompt: 'Which shape is this?',
        answer: 'Rhombus',
        options: createFourShapeOptions('Rhombus', 'Square', 'Diamond', 'Rectangle'),
        shapeImage: 'rhombus'
      }
    ];
    
    const question = intermediateQuestions[Math.floor(Math.random() * intermediateQuestions.length)];
    return {
      prompt: question.prompt,
      answer: question.answer,
      options: question.options,
      targetShape: question.answer,
      shapeImage: question.shapeImage
    };
  } else if (level <= 8) {
    // Level 7-8: Complex shapes - identify advanced 2D shapes
    const complexQuestions = [
      {
        prompt: 'Which shape is this?',
        answer: 'Star',
        options: createFourShapeOptions('Star', 'Circle', 'Triangle', 'Square'),
        shapeImage: 'star'
      },
      {
        prompt: 'Which shape is this?',
        answer: 'Heart',
        options: createFourShapeOptions('Heart', 'Circle', 'Star', 'Diamond'),
        shapeImage: 'heart'
      },
      {
        prompt: 'Which shape is this?',
        answer: 'Crescent',
        options: createFourShapeOptions('Crescent', 'Circle', 'Moon', 'Oval'),
        shapeImage: 'crescent'
      },
      {
        prompt: 'Which shape is this?',
        answer: 'Octagon',
        options: createFourShapeOptions('Octagon', 'Hexagon', 'Circle', 'Square'),
        shapeImage: 'octagon'
      },
      {
        prompt: 'Which shape is this?',
        answer: 'Parallelogram',
        options: createFourShapeOptions('Parallelogram', 'Rectangle', 'Square', 'Rhombus'),
        shapeImage: 'parallelogram'
      }
    ];
    
    const question = complexQuestions[Math.floor(Math.random() * complexQuestions.length)];
    return {
      prompt: question.prompt,
      answer: question.answer,
      options: question.options,
      targetShape: question.answer,
      shapeImage: question.shapeImage
    };
  } else {
    // Level 9-10: Advanced geometry - 3D shapes and complex properties
    const advancedQuestions = [
      {
        prompt: 'Which 3D shape has 6 faces?',
        answer: 'Cube',
        options: createFourShapeOptions('Cube', 'Sphere', 'Pyramid', 'Cylinder'),
        shapeImage: 'cube'
      },
      {
        prompt: 'Which 3D shape has 4 faces?',
        answer: 'Pyramid',
        options: createFourShapeOptions('Pyramid', 'Cube', 'Cone', 'Sphere'),
        shapeImage: 'pyramid'
      },
      {
        prompt: 'Which 3D shape has no faces?',
        answer: 'Sphere',
        options: createFourShapeOptions('Sphere', 'Cube', 'Cylinder', 'Cone'),
        shapeImage: 'sphere'
      },
      {
        prompt: 'Which 3D shape has 2 circular faces?',
        answer: 'Cylinder',
        options: createFourShapeOptions('Cylinder', 'Cone', 'Sphere', 'Cube'),
        shapeImage: 'cylinder'
      },
      {
        prompt: 'Which 3D shape has 1 circular face?',
        answer: 'Cone',
        options: createFourShapeOptions('Cone', 'Cylinder', 'Pyramid', 'Sphere'),
        shapeImage: 'cone'
      },
      {
        prompt: 'Which shape has 12 edges?',
        answer: 'Cube',
        options: createFourShapeOptions('Cube', 'Rectangular Prism', 'Pyramid', 'Cylinder'),
        shapeImage: 'cube'
      }
    ];
    
    const question = advancedQuestions[Math.floor(Math.random() * advancedQuestions.length)];
    return {
      prompt: question.prompt,
      answer: question.answer,
      options: question.options,
      targetShape: question.answer,
      shapeImage: question.shapeImage
    };
  }
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
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  
  // Animation states
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [isTransitioning, setIsTransitioning] = useState(false);

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
          <View style={styles.shapeImageContainer}>
            {renderShapeImage(currentQuestion.shapeImage)}
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
