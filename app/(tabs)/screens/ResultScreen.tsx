import React from 'react';
import { Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';
import { categories } from '../constants/categories';
import { Props } from '../types';

interface ResultParams {
  categoryKey: string;
  level: number;
  score: number;
  duration: number;
}

const practiceScreenMap: Record<string, string> = {
  addition: 'AdditionPractice',
  multiplication: 'MultiplicationPractice',
  comparison: 'ComparisonPractice',
  ordering: 'OrderingPractice',
  sudoku: 'SudokuPractice',
  counting: 'CountingPractice',
  geometry: 'GeometryPractice',
  wordproblems: 'WordProblemsPractice',
  video: 'VideoLessonsPractice',
};

const levelScreenMap: Record<string, string> = {
  addition: 'AdditionLevel',
  multiplication: 'MultiplicationLevel',
  comparison: 'ComparisonLevel',
  ordering: 'OrderingLevel',
  sudoku: 'SudokuLevel',
  counting: 'CountingLevel',
  geometry: 'GeometryLevel',
  wordproblems: 'WordProblemsLevel',
  video: 'VideoLessonsLevel',
};

export function ResultScreen({ route, navigation }: Props) {
  const params = route.params as ResultParams;
  const category = categories.find(cat => cat.key === params.categoryKey);
  const trophy = params.score >= 8;
  const title = trophy ? 'Congratulations!' : 'Try Again';
  const subtitle = trophy
    ? 'Great job! Keep up the good work and keep practicing.'
    : 'You did not earn the trophy this time. Keep practicing and try again.';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.levelDetailScroll, styles.fullScreenScroll]} showsVerticalScrollIndicator={false}>
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>{title}</Text>
          <Text style={styles.resultSubtitle}>{subtitle}</Text>

          <View style={[styles.resultBadge, { backgroundColor: category?.color ?? '#3b82f6' }]}> 
            <Ionicons name={(trophy ? "trophy" : "sparkles") as any} size={32} color="#ffffff" />
            <Text style={styles.resultBadgeText}>{trophy ? 'Small Trophy' : 'Keep Trying'}</Text>
          </View>

          <View style={styles.resultSummary}>
            <Text style={styles.resultSummaryText}>Topic</Text>
            <Text style={styles.resultSummaryValue}>{category?.title ?? 'Math'}</Text>
          </View>
          <View style={styles.resultSummary}>
            <Text style={styles.resultSummaryText}>Level</Text>
            <Text style={styles.resultSummaryValue}>{params.level}</Text>
          </View>
          <View style={styles.resultSummary}>
            <Text style={styles.resultSummaryText}>Score</Text>
            <Text style={styles.resultSummaryValue}>{params.score}/10</Text>
          </View>
          <View style={styles.resultSummary}>
            <Text style={styles.resultSummaryText}>Time</Text>
            <Text style={styles.resultSummaryValue}>{params.duration}s</Text>
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: category?.color ?? '#3b82f6' }]}
            onPress={() => navigation.navigate(practiceScreenMap[params.categoryKey], { level: params.level, categoryKey: params.categoryKey })}
          >
            <Text style={styles.primaryButtonText}>Retry</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate(levelScreenMap[params.categoryKey])}
          >
            <Text style={styles.secondaryButtonText}>Choose another level</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('HomeMain')}
          >
            <Text style={styles.secondaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
