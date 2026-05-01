import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { categories } from '../constants/categories';
import { styles } from '../styles';
import { Props } from '../types';

export function SudokuIntroScreen({ navigation }: Props) {
  const category = categories.find(cat => cat.key === 'sudoku')!;
  const sudokuGrid = [
    ['1', '3', '4'],
    ['4', '1', '2'],
    ['3', '4', '1'],
  ];
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={[styles.introHeader, { backgroundColor: category.color }]}>
          <View style={styles.introHeaderContent}>
            <TouchableOpacity style={styles.headerBackInline} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.introHeaderTitleGroup}>
              <Text style={styles.introTitle} numberOfLines={1}>
                {category.title}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.introScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard}>
            <View style={styles.sudokuContainer}>
              {sudokuGrid.map((row, i) => (
                <View key={i} style={styles.sudokuRow}>
                  {row.map((cell, j) => (
                    <View key={j} style={styles.sudokuCell}>
                      <Text style={styles.sudokuText}>{cell}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
            <View style={styles.heroDivider} />
            <Text style={styles.heroDescription}>{category.description}</Text>
          </View>

          <Text style={styles.sectionTitle}>Examples</Text>
          <View style={styles.examplesRow}>
            {category.examples.map((example: any, idx: any) => (
              <View key={idx} style={styles.exampleCard}>
                <Text style={styles.exampleText}>{example}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: category.color }]} onPress={() => navigation.navigate('SudokuLevel')}>
            <Ionicons name="play" size={18} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Start Practice</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
