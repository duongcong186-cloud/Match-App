import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FeedbackMessage from '../../../components/FeedbackMessage';
import { categories } from '../constants/categories';
import { styles } from '../styles';
import { Props } from '../types';

type QuestionOption = number | string;

interface Question {
  prompt: string;
  answer: QuestionOption;
  options: QuestionOption[];
}

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const generateOptions = (answer: number, spread: number) => {
  const options = new Set<number>([answer]);
  while (options.size < 4) {
    const delta = Math.floor(Math.random() * spread) + 1;
    const wrong = Math.random() > 0.5 ? answer + delta : answer - delta;
    if (wrong > 0 && wrong !== answer) options.add(wrong);
  }
  const result = Array.from(options);
  // Ensure exactly 4 options by taking first 4 if more were generated
  return shuffle(result.slice(0, 4));
};

const generateAdditionQuestion = (level: number): Question => {
  const maxValue = level <= 3 ? 12 : level <= 6 ? 25 : level <= 8 ? 45 : 70;
  const rawA = Math.floor(Math.random() * maxValue) + 1;
  const rawB = Math.floor(Math.random() * maxValue) + 1;
  const operation: '+' | '-' = Math.random() < 0.55 ? '+' : '-';
  const [a, b] = operation === '-' ? (rawA >= rawB ? [rawA, rawB] : [rawB, rawA]) : [rawA, rawB];
  const answer = operation === '+' ? a + b : a - b;
  const options = generateOptions(answer, Math.max(6, Math.floor(maxValue / 2)));

  return {
    prompt: `${a} ${operation} ${b} = ?`,
    answer,
    options,
  };
};

const generateMultiplicationQuestion = (level: number): Question => {
  const maxFactor = level <= 3 ? 5 : level <= 6 ? 8 : level <= 8 ? 10 : 12;
  const a = Math.floor(Math.random() * maxFactor) + 1;
  const b = Math.floor(Math.random() * maxFactor) + 1;
  const isDivision = Math.random() < 0.3;

  if (isDivision) {
    const product = a * b;
    return {
      prompt: `${product} ÷ ${a} = ?`,
      answer: b,
      options: generateOptions(b, Math.max(4, Math.floor(maxFactor / 2))),
    };
  }

  const answer = a * b;
  return {
    prompt: `${a} × ${b} = ?`,
    answer,
    options: generateOptions(answer, Math.max(8, Math.floor(maxFactor * 2))),
  };
};

const generateComparisonQuestion = (level: number): Question => {
  const maxValue = level <= 3 ? 20 : level <= 6 ? 50 : 100;
  const a = Math.floor(Math.random() * maxValue) + 1;
  const b = Math.floor(Math.random() * maxValue) + 1;
  const answer = a === b ? '=' : a > b ? '>' : '<';

  return {
    prompt: `${a} __ ${b}`,
    answer,
    options: shuffle(['>', '<', '=']),
  };
};

const generateOrderingQuestion = (level: number): Question => {
  const length = level <= 4 ? 3 : level <= 7 ? 4 : 5;
  const start = Math.floor(Math.random() * 10) + 1;
  const step = Math.floor(Math.random() * 3) + 1;
  const numbers = Array.from({ length }, (_, idx) => start + idx * step + Math.floor(Math.random() * 3));
  const sorted = [...numbers].sort((a, b) => a - b);

  return {
    prompt: `Order from least to greatest: ${numbers.join(', ')}`,
    answer: sorted.join(', '),
    options: shuffle([
      sorted.join(', '),
      [...sorted].reverse().join(', '),
      shuffle([...sorted]).join(', '),
      shuffle([...sorted]).join(', '),
    ]),
  };
};

const generateCountingQuestion = (level: number): Question => {
  const length = level <= 4 ? 4 : 5;
  const start = Math.floor(Math.random() * 10) + 1;
  const step = level <= 4 ? 1 : level <= 7 ? 2 : 3;
  const sequence = Array.from({ length }, (_, idx) => start + idx * step);
  const missingIndex = Math.floor(Math.random() * length);
  const answer = sequence[missingIndex];
  const prompt = sequence.map((value, idx) => (idx === missingIndex ? '__' : value)).join(', ');

  return {
    prompt: `Fill the blank: ${prompt}`,
    answer,
    options: generateOptions(answer, 6),
  };
};

const generateGeometryQuestion = (level: number): Question => {
  // Helper function to create exactly 4 options (shape names)
  const createFourShapeOptions = (correct: string, wrong1: string, wrong2: string, wrong3: string) => {
    return shuffle([correct, wrong1, wrong2, wrong3]);
  };

  if (level <= 3) {
    // Level 1-3: Basic shapes - identify shapes
    const basicQuestions = [
      {
        prompt: '🔺 Which shape is this?',
        answer: 'Triangle',
        options: createFourShapeOptions('Triangle', 'Square', 'Circle', 'Rectangle')
      },
      {
        prompt: '⬜ Which shape is this?',
        answer: 'Square',
        options: createFourShapeOptions('Square', 'Triangle', 'Circle', 'Rectangle')
      },
      {
        prompt: '⭕ Which shape is this?',
        answer: 'Circle',
        options: createFourShapeOptions('Circle', 'Triangle', 'Square', 'Rectangle')
      },
      {
        prompt: '▭ Which shape is this?',
        answer: 'Rectangle',
        options: createFourShapeOptions('Rectangle', 'Square', 'Triangle', 'Circle')
      }
    ];
    
    const question = basicQuestions[Math.floor(Math.random() * basicQuestions.length)];
    return {
      prompt: question.prompt,
      answer: question.answer,
      options: question.options
    };
  } else if (level <= 6) {
    // Level 4-6: Intermediate shapes - identify more complex shapes
    const intermediateQuestions = [
      {
        prompt: '⬟ Which shape is this?',
        answer: 'Pentagon',
        options: createFourShapeOptions('Pentagon', 'Triangle', 'Square', 'Hexagon')
      },
      {
        prompt: '⬢ Which shape is this?',
        answer: 'Hexagon',
        options: createFourShapeOptions('Hexagon', 'Pentagon', 'Square', 'Circle')
      },
      {
        prompt: '🔷 Which shape is this?',
        answer: 'Diamond',
        options: createFourShapeOptions('Diamond', 'Square', 'Triangle', 'Circle')
      },
      {
        prompt: '⬠ Which shape is this?',
        answer: 'Trapezoid',
        options: createFourShapeOptions('Trapezoid', 'Rectangle', 'Square', 'Triangle')
      },
      {
        prompt: '⬡ Which shape is this?',
        answer: 'Rhombus',
        options: createFourShapeOptions('Rhombus', 'Square', 'Diamond', 'Rectangle')
      }
    ];
    
    const question = intermediateQuestions[Math.floor(Math.random() * intermediateQuestions.length)];
    return {
      prompt: question.prompt,
      answer: question.answer,
      options: question.options
    };
  } else if (level <= 8) {
    // Level 7-8: Complex shapes - identify advanced 2D shapes
    const complexQuestions = [
      {
        prompt: '⭐ Which shape is this?',
        answer: 'Star',
        options: createFourShapeOptions('Star', 'Circle', 'Triangle', 'Square')
      },
      {
        prompt: '❤️ Which shape is this?',
        answer: 'Heart',
        options: createFourShapeOptions('Heart', 'Circle', 'Star', 'Diamond')
      },
      {
        prompt: '🌙 Which shape is this?',
        answer: 'Crescent',
        options: createFourShapeOptions('Crescent', 'Circle', 'Moon', 'Oval')
      },
      {
        prompt: '⬭ Which shape is this?',
        answer: 'Octagon',
        options: createFourShapeOptions('Octagon', 'Hexagon', 'Circle', 'Square')
      },
      {
        prompt: '🔶 Which shape is this?',
        answer: 'Parallelogram',
        options: createFourShapeOptions('Parallelogram', 'Rectangle', 'Square', 'Rhombus')
      }
    ];
    
    const question = complexQuestions[Math.floor(Math.random() * complexQuestions.length)];
    return {
      prompt: question.prompt,
      answer: question.answer,
      options: question.options
    };
  } else {
    // Level 9-10: Advanced geometry - 3D shapes and complex properties
    const advancedQuestions = [
      {
        prompt: '🔷 Which 3D shape has 6 faces?',
        answer: 'Cube',
        options: createFourShapeOptions('Cube', 'Sphere', 'Pyramid', 'Cylinder')
      },
      {
        prompt: '🔺 Which 3D shape has 4 faces?',
        answer: 'Pyramid',
        options: createFourShapeOptions('Pyramid', 'Cube', 'Cone', 'Sphere')
      },
      {
        prompt: '⭕ Which 3D shape has no faces?',
        answer: 'Sphere',
        options: createFourShapeOptions('Sphere', 'Cube', 'Cylinder', 'Cone')
      },
      {
        prompt: '🥛 Which 3D shape has 2 circular faces?',
        answer: 'Cylinder',
        options: createFourShapeOptions('Cylinder', 'Cone', 'Sphere', 'Cube')
      },
      {
        prompt: '🎩 Which 3D shape has 1 circular face?',
        answer: 'Cone',
        options: createFourShapeOptions('Cone', 'Cylinder', 'Pyramid', 'Sphere')
      },
      {
        prompt: '📦 Which shape has 12 edges?',
        answer: 'Cube',
        options: createFourShapeOptions('Cube', 'Rectangular Prism', 'Pyramid', 'Cylinder')
      }
    ];
    
    const question = advancedQuestions[Math.floor(Math.random() * advancedQuestions.length)];
    return {
      prompt: question.prompt,
      answer: question.answer,
      options: question.options
    };
  }
};

const generateWordProblemQuestion = (level: number): Question => {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const answer = a + b;

  return {
    prompt: `A book costs $${a} and a pen costs $${b}. How much do they cost together?`,
    answer,
    options: generateOptions(answer, 5),
  };
};

const generateQuestionForCategory = (categoryKey: string | undefined, level: number) => {
  switch (categoryKey) {
    case 'addition':
      return generateAdditionQuestion(level);
    case 'multiplication':
      return generateMultiplicationQuestion(level);
    case 'comparison':
      return generateComparisonQuestion(level);
    case 'ordering':
      return generateOrderingQuestion(level);
    case 'counting':
      return generateCountingQuestion(level);
    case 'geometry':
      return generateGeometryQuestion(level);
    case 'wordproblems':
      return generateWordProblemQuestion(level);
    default:
      return generateAdditionQuestion(level);
  }
};

export function PracticeScreen({ route, navigation }: Props) {
  const categoryKey = route.params?.categoryKey;
  const level = route.params?.level ?? 1;
  const category = categories.find(cat => cat.key === categoryKey);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<QuestionOption | null>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    const newQuestions = Array.from({ length: 10 }, () => generateQuestionForCategory(categoryKey, level));
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
  }, [categoryKey, level]);

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion.answer;
  const screenWidth = Dimensions.get('window').width;
  const progressWidth = ((currentIndex + 1) / 10) * (screenWidth - 40);

  const handleAnswer = (option: QuestionOption) => {
    if (!answered) {
      setSelectedAnswer(option);
      setAnswered(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#f8fafc' }]}>
      <View style={styles.container}>
        <View style={[styles.practiceHeader, { backgroundColor: category?.color ?? '#3b82f6' }]}>
          <View style={styles.practiceHeaderRow}>
            <TouchableOpacity style={styles.practiceBackButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={28} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.practiceHeaderTextGroup}>
              <Text style={[styles.practiceHeaderTitle, { color: '#ffffff' }]}>{category?.title ?? 'Practice'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.practiceMetaContainer}>
          <Text style={[styles.practiceMetaText, { color: category?.color ?? '#3b82f6' }]}>Level {level}</Text>
          <Text style={[styles.practiceMetaText, { color: category?.color ?? '#3b82f6' }]}>{currentIndex + 1}/10</Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: progressWidth, backgroundColor: category?.color ?? '#3b82f6' }]} />
        </View>

        <ScrollView contentContainerStyle={styles.practiceScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{currentQuestion.prompt}</Text>
          </View>

          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const backgroundColor = !answered
                ? isSelected
                  ? category?.color
                  : '#ffffff'
                : isSelected
                  ? isCorrect
                    ? '#10b981'
                    : '#ef4444'
                  : option === currentQuestion.answer
                    ? '#10b981'
                    : '#ffffff';

            const textColor = !answered
              ? isSelected
                ? '#ffffff'
                : '#111827'
              : isSelected || option === currentQuestion.answer
                ? '#ffffff'
                : '#111827';

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
          <TouchableOpacity
            style={[styles.practiceNextButton, { backgroundColor: category?.color || '#3b82f6' }]}
            onPress={handleNext}
          >
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
