import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MascotCharacter } from './MascotCharacter';
import { styles } from '../app/(tabs)/styles';
import { Category } from '../app/(tabs)/types';

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
        <View style={[styles.practiceHeader, { backgroundColor: category.color }]}>
          <View style={styles.practiceHeaderRow}>
            <TouchableOpacity
              style={styles.practiceBackButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.practiceHeaderTextGroup}>
              <Text style={styles.practiceHeaderTitle}>{category.title}</Text>
            </View>
            <MascotCharacter size="small" />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.levelGridScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.levelGridCard}>
            <View style={styles.levelGridPromptRow}>
              <Text style={styles.levelGridSelectTitle}>Pick Level</Text>
              <Ionicons name="sparkles" size={20} color={category.color} />
            </View>

            <View style={styles.levelGridContainer}>
              {Array.from({ length: 10 }).map((_, index) => (
                <TouchableOpacity
                  key={index + 1}
                  style={[styles.levelGridItem, { borderColor: category.color }]}
                  activeOpacity={0.84}
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
