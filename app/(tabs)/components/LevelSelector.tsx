import React from 'react';
import { Text, View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';
import { LevelButton } from './LevelButton';
import { Props, Category } from '../types';

interface LevelSelectorProps {
  category: Category;
  navigation: any;
  practiceRouteName: string;
}

const levelStars = [1, 1, 2, 2, 3, 3, 3, 3, 4, 4];

export function LevelSelector({ 
  category, 
  navigation, 
  practiceRouteName 
}: LevelSelectorProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.levelHeader, { backgroundColor: category.color }]}>
          <TouchableOpacity 
            style={styles.headerBack} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerTitleGroup}>
            <Text style={styles.levelSelectorTitle}>{category.title}</Text>
            <Text style={styles.levelSelectorSubtitle}>{category.description}</Text>
          </View>
        </View>

        {/* Levels Grid */}
        <ScrollView 
          contentContainerStyle={styles.levelScroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.selectLevelTitle}>Select a Level</Text>
          
          <View style={styles.levelGrid}>
            {Array.from({ length: 10 }).map((_, index) => (
              <LevelButton
                key={index + 1}
                level={index + 1}
                stars={levelStars[index]}
                color={category.color}
                onPress={() => 
                  navigation.navigate(practiceRouteName, { 
                    level: index + 1,
                    categoryKey: category.key 
                  })
                }
              />
            ))}
          </View>

          {/* Difficulty indicator */}
          <View style={styles.difficultyIndicator}>
            <Text style={styles.easiestSelectorLabel}>Easiest</Text>
            <Text style={styles.hardestSelectorLabel}>Hardest</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
