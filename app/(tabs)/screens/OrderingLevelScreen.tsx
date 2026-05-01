import React from 'react';
import { LevelSelector } from '../../../components/LevelSelector';
import { categories } from '../constants/categories';
import { Props } from '../types';

export function OrderingLevelScreen({ navigation }: Props) {
  const category = categories.find(cat => cat.key === 'ordering')!;
  return <LevelSelector category={category} navigation={navigation} practiceRouteName="OrderingPractice" />;
}
