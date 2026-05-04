import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FeedbackMessage from '../../../components/FeedbackMessage';
import GameTimer from '../../../components/GameTimer';
import { categories } from '../constants/categories';
import { styles } from '../styles';
import { Props } from '../types';
import { soundManager } from '../utils/sounds';
import { saveLevelResult } from '../utils/storage';

// ============================================
// TYPES & INTERFACES
// ============================================
interface Question {
  prompt: string;
  answer: string;
  options: string[];
  targetShape: string;
  shapeImage: string;
}

// ============================================
// CONSTANTS & SHAPES DATA
// ============================================
const SHAPE_STYLES: Record<string, { [key: string]: string }> = {
  triangle: { borderBottomColor: '#f97316' },
  square: { backgroundColor: '#10b981' },
  circle: { backgroundColor: '#3b82f6' },
  rectangle: { backgroundColor: '#8b5cf6' },
  pentagon: { backgroundColor: '#ef4444' },
  hexagon: { backgroundColor: '#f59e0b' },
  diamond: { backgroundColor: '#ec4899' },
  trapezoid: { backgroundColor: '#14b8a6' },
  rhombus: { backgroundColor: '#f97316' },
  star: { backgroundColor: '#eab308' },
  heart: { backgroundColor: '#ef4444' },
  crescent: { backgroundColor: '#3b82f6' }, // crescentShape uses borderRadius, so backgroundColor is correct
  octagon: { backgroundColor: '#10b981' },
  parallelogram: { backgroundColor: '#8b5cf6' },
  cube: { backgroundColor: '#6b7280' },
  pyramid: { backgroundColor: '#f97316' },
  sphere: { backgroundColor: '#3b82f6' },
  cylinder: { backgroundColor: '#10b981' },
  cone: { backgroundColor: '#ef4444' },
};

const SHAPE_COMPONENTS: Record<string, string> = {
  triangle: 'triangleShape',
  square: 'squareShape',
  circle: 'circleShape',
  rectangle: 'rectangleShape',
  pentagon: 'pentagonShape',
  hexagon: 'hexagonShape',
  diamond: 'diamondShape',
  trapezoid: 'trapezoidShape',
  rhombus: 'rhombusShape',
  star: 'starShape',
  heart: 'heartShape',
  crescent: 'crescentShape',
  octagon: 'octagonShape',
  parallelogram: 'parallelogramShape',
  cube: 'cubeShape',
  pyramid: 'pyramidShape',
  sphere: 'sphereShape',
  cylinder: 'cylinderShape',
  cone: 'coneShape',
};

const LEVEL_QUESTIONS = {
  basic: [
    { prompt: 'Which shape has 3 sides?', answer: 'Triangle', options: ['Triangle', 'Square', 'Circle', 'Rectangle'], shapeImage: 'triangle' },
    { prompt: 'Which shape has 4 equal sides?', answer: 'Square', options: ['Square', 'Triangle', 'Circle', 'Rectangle'], shapeImage: 'square' },
    { prompt: 'Which shape has no corners?', answer: 'Circle', options: ['Circle', 'Triangle', 'Square', 'Rectangle'], shapeImage: 'circle' },
    { prompt: 'Which shape has 2 pairs of equal sides?', answer: 'Rectangle', options: ['Rectangle', 'Square', 'Triangle', 'Circle'], shapeImage: 'rectangle' },
    { prompt: 'Which shape looks like a pizza slice?', answer: 'Triangle', options: ['Triangle', 'Square', 'Circle', 'Rectangle'], shapeImage: 'triangle' },
    { prompt: 'Which shape looks like a box?', answer: 'Square', options: ['Square', 'Triangle', 'Circle', 'Rectangle'], shapeImage: 'square' },
    { prompt: 'Which shape looks like a ball?', answer: 'Circle', options: ['Circle', 'Triangle', 'Square', 'Rectangle'], shapeImage: 'circle' },
    { prompt: 'Which shape looks like a door?', answer: 'Rectangle', options: ['Rectangle', 'Square', 'Triangle', 'Circle'], shapeImage: 'rectangle' },
    { prompt: 'Which shape has 3 corners?', answer: 'Triangle', options: ['Triangle', 'Square', 'Circle', 'Rectangle'], shapeImage: 'triangle' },
    { prompt: 'Which shape has 4 right angles?', answer: 'Square', options: ['Square', 'Triangle', 'Circle', 'Rectangle'], shapeImage: 'square' },
    { prompt: 'Which shape is perfectly round?', answer: 'Circle', options: ['Circle', 'Triangle', 'Square', 'Rectangle'], shapeImage: 'circle' },
    { prompt: 'Which shape has opposite sides equal?', answer: 'Rectangle', options: ['Rectangle', 'Square', 'Triangle', 'Circle'], shapeImage: 'rectangle' },
  ],
  intermediate: [
    { prompt: 'Which shape has 5 sides?', answer: 'Pentagon', options: ['Pentagon', 'Triangle', 'Square', 'Hexagon'], shapeImage: 'pentagon' },
    { prompt: 'Which shape has 6 sides?', answer: 'Hexagon', options: ['Hexagon', 'Pentagon', 'Square', 'Circle'], shapeImage: 'hexagon' },
    { prompt: 'Which shape looks like a tilted square?', answer: 'Diamond', options: ['Diamond', 'Square', 'Triangle', 'Circle'], shapeImage: 'diamond' },
    { prompt: 'Which shape has one pair of parallel sides?', answer: 'Trapezoid', options: ['Trapezoid', 'Rectangle', 'Square', 'Triangle'], shapeImage: 'trapezoid' },
    { prompt: 'Which shape has 4 equal sides but not 90° angles?', answer: 'Rhombus', options: ['Rhombus', 'Square', 'Diamond', 'Rectangle'], shapeImage: 'rhombus' },
    { prompt: 'Which shape is used in stop signs?', answer: 'Octagon', options: ['Octagon', 'Hexagon', 'Square', 'Circle'], shapeImage: 'octagon' },
    { prompt: 'Which shape has 8 sides?', answer: 'Octagon', options: ['Octagon', 'Hexagon', 'Square', 'Circle'], shapeImage: 'octagon' },
    { prompt: 'Which shape looks like a diamond?', answer: 'Diamond', options: ['Diamond', 'Square', 'Triangle', 'Circle'], shapeImage: 'diamond' },
    { prompt: 'Which shape has opposite sides parallel but different lengths?', answer: 'Trapezoid', options: ['Trapezoid', 'Rectangle', 'Square', 'Triangle'], shapeImage: 'trapezoid' },
    { prompt: 'Which shape has all sides equal but angles not 90°?', answer: 'Rhombus', options: ['Rhombus', 'Square', 'Diamond', 'Rectangle'], shapeImage: 'rhombus' },
    { prompt: 'Which shape has 5 corners?', answer: 'Pentagon', options: ['Pentagon', 'Triangle', 'Square', 'Hexagon'], shapeImage: 'pentagon' },
    { prompt: 'Which shape has 6 corners?', answer: 'Hexagon', options: ['Hexagon', 'Pentagon', 'Square', 'Circle'], shapeImage: 'hexagon' },
  ],
  complex: [
    { prompt: 'Which shape has 5 points?', answer: 'Star', options: ['Star', 'Circle', 'Triangle', 'Square'], shapeImage: 'star' },
    { prompt: 'Which shape symbolizes love?', answer: 'Heart', options: ['Heart', 'Circle', 'Star', 'Diamond'], shapeImage: 'heart' },
    { prompt: 'Which shape looks like the moon?', answer: 'Crescent', options: ['Crescent', 'Circle', 'Moon', 'Oval'], shapeImage: 'crescent' },
    { prompt: 'Which shape has opposite sides parallel but not equal?', answer: 'Parallelogram', options: ['Parallelogram', 'Rectangle', 'Square', 'Rhombus'], shapeImage: 'parallelogram' },
    { prompt: 'Which shape has 4 sides with different angles?', answer: 'Parallelogram', options: ['Parallelogram', 'Rectangle', 'Square', 'Triangle'], shapeImage: 'parallelogram' },
    { prompt: 'Which shape is used for rating stars?', answer: 'Star', options: ['Star', 'Circle', 'Triangle', 'Diamond'], shapeImage: 'star' },
    { prompt: 'Which shape has two curves?', answer: 'Heart', options: ['Heart', 'Circle', 'Star', 'Diamond'], shapeImage: 'heart' },
    { prompt: 'Which shape looks like a banana?', answer: 'Crescent', options: ['Crescent', 'Circle', 'Moon', 'Oval'], shapeImage: 'crescent' },
    { prompt: 'Which shape has 5 points and sharp angles?', answer: 'Star', options: ['Star', 'Circle', 'Triangle', 'Square'], shapeImage: 'star' },
    { prompt: 'Which shape has two rounded parts?', answer: 'Heart', options: ['Heart', 'Circle', 'Star', 'Diamond'], shapeImage: 'heart' },
    { prompt: 'Which shape has one curved side?', answer: 'Crescent', options: ['Crescent', 'Circle', 'Moon', 'Oval'], shapeImage: 'crescent' },
    { prompt: 'Which shape has 4 sides with parallel opposite sides?', answer: 'Parallelogram', options: ['Parallelogram', 'Rectangle', 'Square', 'Rhombus'], shapeImage: 'parallelogram' },
  ],
  advanced: [
    { prompt: 'Which 3D shape has 6 faces?', answer: 'Cube', options: ['Cube', 'Sphere', 'Pyramid', 'Cylinder'], shapeImage: 'cube' },
    { prompt: 'Which 3D shape has 4 faces?', answer: 'Pyramid', options: ['Pyramid', 'Cube', 'Cone', 'Sphere'], shapeImage: 'pyramid' },
    { prompt: 'Which 3D shape has no faces?', answer: 'Sphere', options: ['Sphere', 'Cube', 'Cylinder', 'Cone'], shapeImage: 'sphere' },
    { prompt: 'Which 3D shape has 2 circular faces?', answer: 'Cylinder', options: ['Cylinder', 'Cone', 'Sphere', 'Cube'], shapeImage: 'cylinder' },
    { prompt: 'Which 3D shape has 1 circular face?', answer: 'Cone', options: ['Cone', 'Cylinder', 'Pyramid', 'Sphere'], shapeImage: 'cone' },
    { prompt: 'Which shape has 12 edges?', answer: 'Cube', options: ['Cube', 'Rectangular Prism', 'Pyramid', 'Cylinder'], shapeImage: 'cube' },
    { prompt: 'Which 3D shape has 8 vertices?', answer: 'Cube', options: ['Cube', 'Sphere', 'Pyramid', 'Cylinder'], shapeImage: 'cube' },
    { prompt: 'Which 3D shape has 5 vertices?', answer: 'Pyramid', options: ['Pyramid', 'Cube', 'Cone', 'Sphere'], shapeImage: 'pyramid' },
    { prompt: 'Which 3D shape has no vertices?', answer: 'Sphere', options: ['Sphere', 'Cube', 'Cylinder', 'Cone'], shapeImage: 'sphere' },
    { prompt: 'Which 3D shape looks like a dice?', answer: 'Cube', options: ['Cube', 'Sphere', 'Pyramid', 'Cylinder'], shapeImage: 'cube' },
    { prompt: 'Which 3D shape looks like a ball?', answer: 'Sphere', options: ['Sphere', 'Cube', 'Cylinder', 'Cone'], shapeImage: 'sphere' },
    { prompt: 'Which 3D shape looks like a can?', answer: 'Cylinder', options: ['Cylinder', 'Cone', 'Sphere', 'Cube'], shapeImage: 'cylinder' },
    { prompt: 'Which 3D shape looks like an ice cream cone?', answer: 'Cone', options: ['Cone', 'Cylinder', 'Pyramid', 'Sphere'], shapeImage: 'cone' },
    { prompt: 'Which 3D shape looks like a pyramid in Egypt?', answer: 'Pyramid', options: ['Pyramid', 'Cube', 'Cone', 'Sphere'], shapeImage: 'pyramid' },
    { prompt: 'Which 3D shape has all square faces?', answer: 'Cube', options: ['Cube', 'Sphere', 'Pyramid', 'Cylinder'], shapeImage: 'cube' },
    { prompt: 'Which 3D shape has triangular faces?', answer: 'Pyramid', options: ['Pyramid', 'Cube', 'Cone', 'Sphere'], shapeImage: 'pyramid' },
    { prompt: 'Which 3D shape has no edges?', answer: 'Sphere', options: ['Sphere', 'Cube', 'Cylinder', 'Cone'], shapeImage: 'sphere' },
    { prompt: 'Which 3D shape has circular top and bottom?', answer: 'Cylinder', options: ['Cylinder', 'Cone', 'Sphere', 'Cube'], shapeImage: 'cylinder' },
    { prompt: 'Which 3D shape has circular base and point?', answer: 'Cone', options: ['Cone', 'Cylinder', 'Pyramid', 'Sphere'], shapeImage: 'cone' },
  ],
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
const shuffle = <T,>(items: T[]): T[] => [...items].sort(() => Math.random() - 0.5);

const createFourShapeOptions = (correct: string, ...wrong: string[]): string[] => {
  return shuffle([correct, ...wrong]);
};

// Mapping function to ensure shapeImage matches answer
const getShapeImageForAnswer = (answer: string): string => {
  const shapeMapping: Record<string, string> = {
    'Triangle': 'triangle',
    'Square': 'square',
    'Circle': 'circle',
    'Rectangle': 'rectangle',
    'Pentagon': 'pentagon',
    'Hexagon': 'hexagon',
    'Diamond': 'diamond',
    'Trapezoid': 'trapezoid',
    'Rhombus': 'rhombus',
    'Star': 'star',
    'Heart': 'heart',
    'Crescent': 'crescent',
    'Octagon': 'octagon',
    'Parallelogram': 'parallelogram',
    'Cube': 'cube',
    'Pyramid': 'pyramid',
    'Sphere': 'sphere',
    'Cylinder': 'cylinder',
    'Cone': 'cone',
  };
  
  const mappedShape = shapeMapping[answer] || 'square';
  console.log('🔍 DEBUG MAPPING:', { answer, mappedShape });
  return mappedShape;
};

const renderShapeImage = (shapeType: string) => {
  console.log('🎨 RENDER SHAPE:', { shapeType });
  
  // Special handling for crescent shape - PRIORITY 1
  if (shapeType === 'crescent') {
    console.log('✅ Using special handling for crescent');
    return (
      <View style={styles.shapeWrapper}>
        <View style={[styles.crescentShape, { backgroundColor: '#3b82f6' }]}>
          <View style={{
            position: 'absolute',
            top: -10,
            right: -10,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#f8fafc', // background color to create crescent effect
          }} />
        </View>
      </View>
    );
  }

  // Special handling for heart shape - PRIORITY 2
  if (shapeType === 'heart') {
    console.log('✅ Using special handling for heart');
    return (
      <View style={styles.shapeWrapper}>
        <View style={{ position: 'relative', width: 80, height: 80 }}>
          <View style={{
            position: 'absolute',
            top: 20,
            left: 20,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#ef4444',
          }} />
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#ef4444',
          }} />
          <View style={{
            position: 'absolute',
            top: 20,
            left: 0,
            width: 60,
            height: 40,
            borderRadius: 30,
            backgroundColor: '#ef4444',
            transform: [{ rotate: '-45deg' }],
          }} />
        </View>
      </View>
    );
  }

  // Special handling for parallelogram shape - PRIORITY 3
  if (shapeType === 'parallelogram') {
    console.log('✅ Using special handling for parallelogram');
    return (
      <View style={styles.shapeWrapper}>
        <View style={{
          width: 100,
          height: 60,
          backgroundColor: '#8b5cf6',
          transform: [{ skewX: '-20deg' }],
        }} />
      </View>
    );
  }

  // Special handling for pentagon shape - PRIORITY 4
  if (shapeType === 'pentagon') {
    console.log('✅ Using special handling for pentagon');
    return (
      <View style={styles.shapeWrapper}>
        <View style={{ position: 'relative', width: 80, height: 80 }}>
          <View style={{
            position: 'absolute',
            top: 0,
            left: 20,
            width: 40,
            height: 40,
            backgroundColor: '#ef4444',
            transform: [{ rotate: '0deg' }],
          }} />
          <View style={{
            position: 'absolute',
            top: 20,
            left: 0,
            width: 40,
            height: 40,
            backgroundColor: '#ef4444',
            transform: [{ rotate: '72deg' }],
          }} />
          <View style={{
            position: 'absolute',
            top: 20,
            left: 40,
            width: 40,
            height: 40,
            backgroundColor: '#ef4444',
            transform: [{ rotate: '-72deg' }],
          }} />
          <View style={{
            position: 'absolute',
            top: 40,
            left: 10,
            width: 40,
            height: 40,
            backgroundColor: '#ef4444',
            transform: [{ rotate: '144deg' }],
          }} />
          <View style={{
            position: 'absolute',
            top: 40,
            left: 30,
            width: 40,
            height: 40,
            backgroundColor: '#ef4444',
            transform: [{ rotate: '-144deg' }],
          }} />
        </View>
      </View>
    );
  }

  // Special handling for hexagon shape - PRIORITY 5
  if (shapeType === 'hexagon') {
    console.log('✅ Using special handling for hexagon');
    return (
      <View style={styles.shapeWrapper}>
        <View style={{ position: 'relative', width: 80, height: 80 }}>
          <View style={{
            position: 'absolute',
            top: 0,
            left: 20,
            width: 40,
            height: 40,
            backgroundColor: '#f59e0b',
            transform: [{ rotate: '0deg' }],
          }} />
          <View style={{
            position: 'absolute',
            top: 15,
            left: 0,
            width: 40,
            height: 40,
            backgroundColor: '#f59e0b',
            transform: [{ rotate: '60deg' }],
          }} />
          <View style={{
            position: 'absolute',
            top: 15,
            left: 40,
            width: 40,
            height: 40,
            backgroundColor: '#f59e0b',
            transform: [{ rotate: '-60deg' }],
          }} />
          <View style={{
            position: 'absolute',
            top: 40,
            left: 20,
            width: 40,
            height: 40,
            backgroundColor: '#f59e0b',
            transform: [{ rotate: '180deg' }],
          }} />
          <View style={{
            position: 'absolute',
            top: 25,
            left: 0,
            width: 40,
            height: 40,
            backgroundColor: '#f59e0b',
            transform: [{ rotate: '120deg' }],
          }} />
          <View style={{
            position: 'absolute',
            top: 25,
            left: 40,
            width: 40,
            height: 40,
            backgroundColor: '#f59e0b',
            transform: [{ rotate: '-120deg' }],
          }} />
        </View>
      </View>
    );
  }

  // Special handling for star shape - PRIORITY 5
  if (shapeType === 'star') {
    console.log('✅ Using special handling for star');
    return (
      <View style={styles.shapeWrapper}>
        <View style={{ position: 'relative', width: 80, height: 80 }}>
          <View style={{
            position: 'absolute',
            top: 30,
            left: 40,
            width: 0,
            height: 0,
            borderLeftWidth: 20,
            borderRightWidth: 20,
            borderBottomWidth: 30,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: '#eab308',
            transform: [{ rotate: '0deg' }],
          }} />
          <View style={{
            position: 'absolute',
            top: 30,
            left: 40,
            width: 0,
            height: 0,
            borderLeftWidth: 20,
            borderRightWidth: 20,
            borderBottomWidth: 30,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: '#eab308',
            transform: [{ rotate: '72deg' }],
          }} />
          <View style={{
            position: 'absolute',
            top: 30,
            left: 40,
            width: 0,
            height: 0,
            borderLeftWidth: 20,
            borderRightWidth: 20,
            borderBottomWidth: 30,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: '#eab308',
            transform: [{ rotate: '144deg' }],
          }} />
          <View style={{
            position: 'absolute',
            top: 30,
            left: 40,
            width: 0,
            height: 0,
            borderLeftWidth: 20,
            borderRightWidth: 20,
            borderBottomWidth: 30,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: '#eab308',
            transform: [{ rotate: '216deg' }],
          }} />
          <View style={{
            position: 'absolute',
            top: 30,
            left: 40,
            width: 0,
            height: 0,
            borderLeftWidth: 20,
            borderRightWidth: 20,
            borderBottomWidth: 30,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: '#eab308',
            transform: [{ rotate: '288deg' }],
          }} />
        </View>
      </View>
    );
  }

  // Special handling for diamond shape - PRIORITY 5
  if (shapeType === 'diamond') {
    return (
      <View style={styles.shapeWrapper}>
        <View style={{
          width: 60,
          height: 60,
          backgroundColor: '#ec4899',
          transform: [{ rotate: '45deg' }],
        }} />
      </View>
    );
  }

  // Special handling for rhombus shape - PRIORITY 6
  if (shapeType === 'rhombus') {
    return (
      <View style={styles.shapeWrapper}>
        <View style={{
          width: 60,
          height: 60,
          backgroundColor: '#f97316',
          transform: [{ rotate: '45deg' }],
        }} />
      </View>
    );
  }

  // Fallback to styles-based rendering
  console.log('🔄 Using fallback styles-based rendering for:', shapeType);
  const shapeStyle = SHAPE_STYLES[shapeType];
  const shapeComponent = SHAPE_COMPONENTS[shapeType];

  console.log('📋 Shape Style:', shapeStyle);
  console.log('📋 Shape Component:', shapeComponent);

  if (!shapeStyle || !shapeComponent) {
    console.log('❌ Shape not found, using fallback square');
    return (
      <View style={styles.shapeWrapper}>
        <View style={[styles.squareShape, { backgroundColor: '#6b7280' }]} />
      </View>
    );
  }

  // Try to get the style component
  const styleComponent = (styles as any)[shapeComponent];
  
  if (!styleComponent) {
    console.log('❌ Style component not found, using fallback square');
    return (
      <View style={styles.shapeWrapper}>
        <View style={[styles.squareShape, { backgroundColor: '#6b7280' }]} />
      </View>
    );
  }

  console.log('✅ Rendering with styles:', { shapeComponent, shapeStyle });
  return (
    <View style={styles.shapeWrapper}>
      <View style={[styleComponent, shapeStyle]} />
    </View>
  );
};

// ============================================
// CUSTOM HOOK - useGeometryGame
// ============================================
const useGeometryGame = (level: number) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  const generateQuestion = useCallback((): Question => {
    let questionPool: typeof LEVEL_QUESTIONS.basic;

    if (level <= 3) {
      questionPool = LEVEL_QUESTIONS.basic;
    } else if (level <= 6) {
      questionPool = LEVEL_QUESTIONS.intermediate;
    } else if (level <= 8) {
      questionPool = LEVEL_QUESTIONS.complex;
    } else {
      questionPool = LEVEL_QUESTIONS.advanced;
    }

    const baseQuestion = questionPool[Math.floor(Math.random() * questionPool.length)];
    const shapeImage = getShapeImageForAnswer(baseQuestion.answer);
    
    return {
      ...baseQuestion,
      options: shuffle(baseQuestion.options),
      targetShape: baseQuestion.answer,
      shapeImage: shapeImage, // Ensure shapeImage matches answer
    };
  }, [level]);

  useEffect(() => {
    const newQuestions = Array.from({ length: 10 }, () => generateQuestion());
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setCorrectCount(0);
    setStartTime(Date.now());
  }, [level, generateQuestion]);

  const handleAnswer = useCallback((option: string, onCorrect: () => void, onWrong: () => void) => {
    if (answered || questions.length === 0) return;

    setSelectedAnswer(option);
    setAnswered(true);

    if (option === questions[currentIndex]?.answer) {
      setCorrectCount(count => count + 1);
      onCorrect();
    } else {
      onWrong();
    }
  }, [answered, questions, currentIndex]);

  const goToNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(index => index + 1);
      setSelectedAnswer(null);
      setAnswered(false);
      return false;
    }
    return true;
  }, [currentIndex, questions.length]);

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion?.answer;
  const progress = (currentIndex + 1) / 10;

  return {
    questions,
    currentQuestion,
    currentIndex,
    selectedAnswer,
    answered,
    correctCount,
    startTime,
    isCorrect,
    progress,
    handleAnswer,
    goToNext,
  };
};

// ============================================
// SUB COMPONENTS
// ============================================

// Header Component
interface HeaderProps {
  category: { title: string; color: string; key: string };
  level: number;
  currentIndex: number;
  startTime: number;
  answered: boolean;
  onBack: () => void;
  onTimeUpdate: (seconds: number) => void;
}

const PracticeHeader = React.memo(({
  category,
  level,
  currentIndex,
  startTime,
  answered,
  onBack,
  onTimeUpdate,
}: HeaderProps) => {
  const progressWidth = ((currentIndex + 1) / 10) * (Dimensions.get('window').width - 40);

  return (
    <>
      <View style={[styles.practiceHeader, { backgroundColor: category.color }]}>
        <View style={styles.practiceHeaderRow}>
          <TouchableOpacity style={styles.practiceBackButton} onPress={onBack}>
            <Ionicons name="chevron-back" size={28} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.practiceHeaderTextGroup}>
            <Text style={[styles.practiceHeaderTitle, { color: '#ffffff' }]}>
              {category.title}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.practiceMetaContainer}>
        <Text style={[styles.practiceMetaText, { color: category.color }]}>
          Level {level}
        </Text>
        <Text style={[styles.practiceMetaText, { color: category.color }]}>
          {currentIndex + 1}/10
        </Text>
        <GameTimer
          startTime={startTime}
          isRunning={!answered}
          onTimeUpdate={onTimeUpdate}
          color={category.color}
        />
      </View>

      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: progressWidth,
              backgroundColor: category.color,
            },
          ]}
        />
      </View>
    </>
  );
});

PracticeHeader.displayName = 'PracticeHeader';

// Shape Image Component
interface ShapeImageProps {
  shapeType: string;
  fadeAnim: Animated.Value;
}

const ShapeImage = React.memo(({ shapeType, fadeAnim }: ShapeImageProps) => {
  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {renderShapeImage(shapeType)}
    </Animated.View>
  );
});

ShapeImage.displayName = 'ShapeImage';


// ============================================
// MAIN COMPONENT
// ============================================
export function GeometryPracticeScreen({ route, navigation }: Props) {
  const level = route.params?.level ?? 1;
  const category = useMemo(
    () => categories.find(cat => cat.key === 'geometry')!,
    []
  );

  const {
    questions,
    currentQuestion,
    currentIndex,
    selectedAnswer,
    answered,
    correctCount,
    startTime,
    isCorrect,
    progress,
    handleAnswer,
    goToNext,
  } = useGeometryGame(level);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [isTransitioning, setIsTransitioning] = useState(false);

  const animateTransition = useCallback((callback: () => void) => {
    setIsTransitioning(true);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      callback();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        setIsTransitioning(false);
      });
    });
  }, [fadeAnim]);

  const handleAnswerPress = useCallback((option: string) => {
    handleAnswer(
      option,
      () => soundManager.playCorrectSound(),
      () => soundManager.playWrongSound()
    );
  }, [handleAnswer]);

  const handleNextPress = useCallback(async () => {
    if (!answered || isTransitioning) return;

    const isFinished = goToNext();

    if (isFinished) {
      const duration = Math.round((Date.now() - startTime) / 1000);
      await saveLevelResult(category.key, level, correctCount, duration);
      navigation.navigate('Result', {
        categoryKey: category.key,
        level,
        score: correctCount,
        duration,
      });
      return;
    }

    animateTransition(() => {
      // State updated by goToNext
    });
  }, [answered, isTransitioning, goToNext, startTime, category.key, level, correctCount, navigation, animateTransition]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  if (questions.length === 0 || !currentQuestion) return null;

  // Debug current question
  console.log('🎯 CURRENT QUESTION:', {
    prompt: currentQuestion.prompt,
    answer: currentQuestion.answer,
    shapeImage: currentQuestion.shapeImage,
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#f8fafc' }]}>
      <View style={styles.container}>
        <PracticeHeader
          category={category}
          level={level}
          currentIndex={currentIndex}
          startTime={startTime}
          answered={answered}
          onBack={handleBack}
          onTimeUpdate={setElapsedSeconds}
        />

        <ScrollView contentContainerStyle={styles.practiceScroll} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.questionCard, { opacity: fadeAnim }]}>
            <Text style={styles.questionText}>{currentQuestion.prompt}</Text>
            <View style={styles.shapeImageContainer}>
              <ShapeImage shapeType={currentQuestion.shapeImage} fadeAnim={fadeAnim} />
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
                  onPress={() => handleAnswerPress(option)}
                  disabled={answered}
                >
                  <Text style={[styles.optionLabel, { color: textColor }]}>
                    {String.fromCharCode(65 + idx)}
                  </Text>
                  <Text style={[styles.optionText, { color: textColor }]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {answered && (
            <FeedbackMessage
              isCorrect={isCorrect}
              correctAnswer={currentQuestion.answer}
            />
          )}
        </ScrollView>

        {answered && (
          <View style={styles.practiceNextButtonContainer}>
            <TouchableOpacity
              style={[styles.practiceNextButton, { backgroundColor: category.color }]}
              onPress={handleNextPress}
            >
              <Text style={styles.practiceNextButtonText}>
                {currentIndex === 9 ? 'Finish' : 'Next'}
              </Text>
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
