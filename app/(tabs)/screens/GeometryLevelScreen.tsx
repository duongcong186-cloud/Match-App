import React from 'react';
import { LevelSelector } from '../../../components/LevelSelector';
import { categories } from '../constants/categories';
import { Props } from '../types';

export function GeometryLevelScreen({ navigation }: Props) {
  const category = categories.find(cat => cat.key === 'geometry')!;
  return <LevelSelector category={category} navigation={navigation} practiceRouteName="GeometryPractice" />;
}
