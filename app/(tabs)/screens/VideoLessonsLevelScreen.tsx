import React from 'react';
import { LevelSelector } from '../../../components/LevelSelector';
import { categories } from '../constants/categories';
import { Props } from '../types';

export function VideoLessonsLevelScreen({ navigation }: Props) {
  const category = categories.find(cat => cat.key === 'video')!;
  return <LevelSelector category={category} navigation={navigation} practiceRouteName="VideoLessonsPractice" />;
}
