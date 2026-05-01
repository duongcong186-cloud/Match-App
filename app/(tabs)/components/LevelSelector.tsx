import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';
import { Category } from '../types';

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
        {/* Header with back button and title */}
        <View style={[styles.levelGridHeader, { backgroundColor: category.color }]}>
          <View style={styles.levelGridHeaderRow}>
            <TouchableOpacity
              style={styles.levelGridHeaderBack}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.levelGridHeaderText}>
              <Text style={styles.levelGridTitle}>{category.title}</Text>
            </View>
          </View>
        </View>

        {/* Levels Grid */}
        <ScrollView contentContainerStyle={styles.levelGridScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.levelGridCard}>
            <Text style={styles.levelGridSelectTitle}>Select a Level</Text>
            
            {/* Levels Grid Layout */}
            <View style={styles.levelGridContainer}>
              {Array.from({ length: 10 }).map((_, index) => (
                <TouchableOpacity
                  key={index + 1}
                  style={styles.levelGridItem}
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate(practiceRouteName, { 
                      level: index + 1,
                      categoryKey: category.key 
                    })
                  }
                >
                  <View style={[styles.levelGridCircle, { backgroundColor: category.color }]}>
                    <Text style={styles.levelGridNumber}>{index + 1}</Text>
                  </View>
                  <Text style={styles.levelGridLabel}>Level {index + 1}</Text>
                  <View style={styles.levelGridStars}>
                    {Array.from({ length: 4 }).map((_, starIdx) => (
                      <Ionicons
                        key={starIdx}
                        name={starIdx < levelStars[index] ? 'star' : 'star-outline'}
                        size={12}
                        color={starIdx < levelStars[index] ? '#fbbf24' : '#e5e7eb'}
                      />
                    ))}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

                      </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
