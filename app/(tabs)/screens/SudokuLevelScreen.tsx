import React from 'react';
import { LevelSelector } from '../../../components/LevelSelector';
import { categories } from '../constants/categories';
import { Props } from '../types';

export function SudokuLevelScreen({ navigation }: Props) {
  const category = categories.find(cat => cat.key === 'sudoku')!;
  return <LevelSelector category={category} navigation={navigation} practiceRouteName="SudokuPractice" />;
}
