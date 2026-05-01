import React from 'react';
import { categories } from '../constants/categories';
import { LevelSelector } from '../components/LevelSelector';
import { Props } from '../types';

export function GeometryLevelScreen({ navigation }: Props) {
  const category = categories.find(cat => cat.key === 'geometry')!;
  return <LevelSelector category={category} navigation={navigation} practiceRouteName="GeometryPractice" />;
}
