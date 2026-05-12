import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FeedbackMessage from '../../../components/FeedbackMessage';
import GameTimer from '../../../components/GameTimer';
import { MascotCharacter } from '../../../components/MascotCharacter';
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

const renderShapeImage = (shapeType: string) => {
  const iconColor = '#ffffff';

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
          <View style={styles.pentagonShape}>
            <View style={[styles.pentagonTop, { borderBottomColor: '#ef4444' }]} />
            <View style={[styles.pentagonBody, { backgroundColor: '#ef4444' }]} />
          </View>
        </View>
      );
    case 'hexagon':
      return (
        <View style={styles.shapeWrapper}>
          <View style={styles.hexagonShape}>
            <View style={[styles.hexagonTop, { borderBottomColor: '#f59e0b' }]} />
            <View style={[styles.hexagonMiddle, { backgroundColor: '#f59e0b' }]} />
            <View style={[styles.hexagonBottom, { borderTopColor: '#f59e0b' }]} />
          </View>
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
          <View style={[styles.trapezoidShape, { borderBottomColor: '#14b8a6' }]} />
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
          <Ionicons name="star" size={92} color="#eab308" />
        </View>
      );
    case 'heart':
      return (
        <View style={styles.shapeWrapper}>
          <Ionicons name="heart" size={92} color="#ef4444" />
        </View>
      );
    case 'crescent':
      return (
        <View style={styles.shapeWrapper}>
          <Ionicons name="moon" size={92} color="#3b82f6" />
        </View>
      );
    case 'octagon':
      return (
        <View style={styles.shapeWrapper}>
          <View style={styles.octagonShape}>
            <View style={[styles.octagonCap, { backgroundColor: '#10b981' }]} />
            <View style={[styles.octagonMiddle, { backgroundColor: '#10b981' }]} />
            <View style={[styles.octagonCap, { backgroundColor: '#10b981' }]} />
          </View>
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
          <View style={styles.cubeShape}>
            <View style={[styles.cubeTop, { backgroundColor: '#9ca3af' }]} />
            <View style={[styles.cubeSide, { backgroundColor: '#6b7280' }]} />
            <View style={[styles.cubeFront, { backgroundColor: '#4b5563' }]}>
              <Ionicons name="grid-outline" size={34} color={iconColor} />
            </View>
          </View>
        </View>
      );
    case 'pyramid':
      return (
        <View style={styles.shapeWrapper}>
          <View style={[styles.pyramidShape, { borderBottomColor: '#f97316' }]}>
            <View style={styles.pyramidCenterLine} />
          </View>
        </View>
      );
    case 'sphere':
      return (
        <View style={styles.shapeWrapper}>
          <View style={[styles.sphereShape, { backgroundColor: '#3b82f6' }]}>
            <View style={styles.sphereHighlight} />
          </View>
        </View>
      );
    case 'cylinder':
      return (
        <View style={styles.shapeWrapper}>
          <View style={styles.cylinderShape}>
            <View style={[styles.cylinderBody, { backgroundColor: '#10b981' }]} />
            <View style={styles.cylinderTop} />
            <View style={styles.cylinderBottom} />
          </View>
        </View>
      );
    case 'cone':
      return (
        <View style={styles.shapeWrapper}>
          <View style={styles.coneShape}>
            <View style={[styles.coneTriangle, { borderBottomColor: '#ef4444' }]} />
            <View style={styles.coneBase} />
          </View>
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
      },
      {
        prompt: 'What shape has 3 sides?',
        answer: 'Triangle',
        options: createFourShapeOptions('Triangle', 'Square', 'Circle', 'Rectangle'),
        shapeImage: 'triangle'
      },
      {
        prompt: 'What shape has 4 equal sides?',
        answer: 'Square',
        options: createFourShapeOptions('Square', 'Rectangle', 'Triangle', 'Circle'),
        shapeImage: 'square'
      },
      {
        prompt: 'What shape has no corners?',
        answer: 'Circle',
        options: createFourShapeOptions('Circle', 'Square', 'Triangle', 'Rectangle'),
        shapeImage: 'circle'
      },
      {
        prompt: 'What long shape has 4 right angles?',
        answer: 'Rectangle',
        options: createFourShapeOptions('Rectangle', 'Square', 'Triangle', 'Circle'),
        shapeImage: 'rectangle'
      },
      {
        prompt: 'Which shape looks like a pizza slice?',
        answer: 'Triangle',
        options: createFourShapeOptions('Triangle', 'Square', 'Circle', 'Rectangle'),
        shapeImage: 'triangle'
      },
      {
        prompt: 'Which shape looks like a box?',
        answer: 'Square',
        options: createFourShapeOptions('Square', 'Rectangle', 'Triangle', 'Circle'),
        shapeImage: 'square'
      },
      {
        prompt: 'Which shape looks like a ball?',
        answer: 'Circle',
        options: createFourShapeOptions('Circle', 'Square', 'Triangle', 'Rectangle'),
        shapeImage: 'circle'
      },
      {
        prompt: 'Which shape looks like a door?',
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
      },
      {
        prompt: 'What shape has 5 sides?',
        answer: 'Pentagon',
        options: createFourShapeOptions('Pentagon', 'Hexagon', 'Square', 'Triangle'),
        shapeImage: 'pentagon'
      },
      {
        prompt: 'What shape has 6 sides?',
        answer: 'Hexagon',
        options: createFourShapeOptions('Hexagon', 'Pentagon', 'Square', 'Circle'),
        shapeImage: 'hexagon'
      },
      {
        prompt: 'What shape has 4 equal sides but not right angles?',
        answer: 'Diamond',
        options: createFourShapeOptions('Diamond', 'Square', 'Rectangle', 'Rhombus'),
        shapeImage: 'diamond'
      },
      {
        prompt: 'What shape has one pair of parallel sides?',
        answer: 'Trapezoid',
        options: createFourShapeOptions('Trapezoid', 'Rectangle', 'Square', 'Triangle'),
        shapeImage: 'trapezoid'
      },
      {
        prompt: 'What shape looks like a tilted square?',
        answer: 'Diamond',
        options: createFourShapeOptions('Diamond', 'Square', 'Rectangle', 'Rhombus'),
        shapeImage: 'diamond'
      },
      {
        prompt: 'Which shape is used in stop signs?',
        answer: 'Octagon',
        options: createFourShapeOptions('Octagon', 'Hexagon', 'Square', 'Circle'),
        shapeImage: 'octagon'
      },
      {
        prompt: 'Which slanted shape has opposite sides parallel?',
        answer: 'Parallelogram',
        options: createFourShapeOptions('Parallelogram', 'Rectangle', 'Square', 'Triangle'),
        shapeImage: 'parallelogram'
      },
      {
        prompt: 'Which shape looks like a diamond ring?',
        answer: 'Diamond',
        options: createFourShapeOptions('Diamond', 'Square', 'Circle', 'Triangle'),
        shapeImage: 'diamond'
      },
      {
        prompt: 'What shape has 8 sides?',
        answer: 'Octagon',
        options: createFourShapeOptions('Octagon', 'Hexagon', 'Square', 'Circle'),
        shapeImage: 'octagon'
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
      },
      {
        prompt: 'Which shape has 5 points?',
        answer: 'Star',
        options: createFourShapeOptions('Star', 'Circle', 'Triangle', 'Square'),
        shapeImage: 'star'
      },
      {
        prompt: 'Which shape symbolizes love?',
        answer: 'Heart',
        options: createFourShapeOptions('Heart', 'Circle', 'Star', 'Diamond'),
        shapeImage: 'heart'
      },
      {
        prompt: 'Which shape looks like the moon?',
        answer: 'Crescent',
        options: createFourShapeOptions('Crescent', 'Circle', 'Moon', 'Oval'),
        shapeImage: 'crescent'
      },
      {
        prompt: 'Which shape has 8 sides?',
        answer: 'Octagon',
        options: createFourShapeOptions('Octagon', 'Hexagon', 'Square', 'Circle'),
        shapeImage: 'octagon'
      },
      {
        prompt: 'Which slanted shape has opposite sides parallel?',
        answer: 'Parallelogram',
        options: createFourShapeOptions('Parallelogram', 'Rectangle', 'Square', 'Rhombus'),
        shapeImage: 'parallelogram'
      },
      {
        prompt: 'What shape is used for rating stars?',
        answer: 'Star',
        options: createFourShapeOptions('Star', 'Circle', 'Triangle', 'Diamond'),
        shapeImage: 'star'
      },
      {
        prompt: 'Which shape has two curves?',
        answer: 'Heart',
        options: createFourShapeOptions('Heart', 'Circle', 'Star', 'Diamond'),
        shapeImage: 'heart'
      },
      {
        prompt: 'Which shape looks like a banana?',
        answer: 'Crescent',
        options: createFourShapeOptions('Crescent', 'Circle', 'Moon', 'Oval'),
        shapeImage: 'crescent'
      },
      {
        prompt: 'Which shape is used in traffic signs?',
        answer: 'Octagon',
        options: createFourShapeOptions('Octagon', 'Hexagon', 'Square', 'Circle'),
        shapeImage: 'octagon'
      },
      {
        prompt: 'What shape has 4 sides with different angles?',
        answer: 'Parallelogram',
        options: createFourShapeOptions('Parallelogram', 'Rectangle', 'Square', 'Triangle'),
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
        prompt: 'Which 3D shape has triangular faces?',
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
      },
      {
        prompt: 'Which 3D shape has 8 vertices?',
        answer: 'Cube',
        options: createFourShapeOptions('Cube', 'Sphere', 'Pyramid', 'Cylinder'),
        shapeImage: 'cube'
      },
      {
        prompt: 'Which 3D shape has 5 vertices?',
        answer: 'Pyramid',
        options: createFourShapeOptions('Pyramid', 'Cube', 'Cone', 'Sphere'),
        shapeImage: 'pyramid'
      },
      {
        prompt: 'Which 3D shape has no vertices?',
        answer: 'Sphere',
        options: createFourShapeOptions('Sphere', 'Cube', 'Cylinder', 'Cone'),
        shapeImage: 'sphere'
      },
      {
        prompt: 'Which 3D shape has no edges?',
        answer: 'Sphere',
        options: createFourShapeOptions('Sphere', 'Cube', 'Cylinder', 'Cone'),
        shapeImage: 'sphere'
      },
      {
        prompt: 'Which 3D shape has 1 circular edge?',
        answer: 'Cone',
        options: createFourShapeOptions('Cone', 'Cylinder', 'Pyramid', 'Sphere'),
        shapeImage: 'cone'
      },
      {
        prompt: 'Which 3D shape looks like a dice?',
        answer: 'Cube',
        options: createFourShapeOptions('Cube', 'Sphere', 'Pyramid', 'Cylinder'),
        shapeImage: 'cube'
      },
      {
        prompt: 'Which 3D shape looks like a ball?',
        answer: 'Sphere',
        options: createFourShapeOptions('Sphere', 'Cube', 'Cylinder', 'Cone'),
        shapeImage: 'sphere'
      },
      {
        prompt: 'Which 3D shape looks like a can?',
        answer: 'Cylinder',
        options: createFourShapeOptions('Cylinder', 'Cone', 'Sphere', 'Cube'),
        shapeImage: 'cylinder'
      },
      {
        prompt: 'Which 3D shape looks like an ice cream cone?',
        answer: 'Cone',
        options: createFourShapeOptions('Cone', 'Cylinder', 'Pyramid', 'Sphere'),
        shapeImage: 'cone'
      },
      {
        prompt: 'Which 3D shape looks like a pyramid in Egypt?',
        answer: 'Pyramid',
        options: createFourShapeOptions('Pyramid', 'Cube', 'Cone', 'Sphere'),
        shapeImage: 'pyramid'
      },
      {
        prompt: 'Which 3D shape has all square faces?',
        answer: 'Cube',
        options: createFourShapeOptions('Cube', 'Sphere', 'Pyramid', 'Cylinder'),
        shapeImage: 'cube'
      },
      {
        prompt: 'Which 3D shape has triangular faces?',
        answer: 'Pyramid',
        options: createFourShapeOptions('Pyramid', 'Cube', 'Cone', 'Sphere'),
        shapeImage: 'pyramid'
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
          <MascotCharacter size="small" />
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

      <ScrollView style={styles.practiceScrollView} contentContainerStyle={styles.practiceScroll} showsVerticalScrollIndicator={false}>
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
