import React from 'react';
import { categories } from '../constants/categories';
import { LevelSelector } from '../components/LevelSelector';
import { Props } from '../types';

export function SudokuLevelScreen({ navigation }: Props) {
  const category = categories.find(cat => cat.key === 'sudoku')!;
  return <LevelSelector category={category} navigation={navigation} practiceRouteName="SudokuPractice" />;
}
