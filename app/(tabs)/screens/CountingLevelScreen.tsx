import React from 'react';
import { Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';
import { categories } from '../constants/categories';
import { Props } from '../types';

const levelStars = [1, 1, 2, 2, 3, 3, 3, 3, 4, 4];

export function CountingLevelScreen({ navigation }: Props) {
  const category = categories.find(cat => cat.key === 'counting')!;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.levelDetailScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.levelDetailCard}>
                    <View style={[styles.levelDetailHeader, { backgroundColor: category.color }]}>
            <TouchableOpacity 
              style={styles.levelDetailHeaderBack} 
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.headerContentGroup}>
              <View style={styles.screenHeaderIcon}>
                <Ionicons name={category.icon as any} size={26} color="#fff" />
              </View>
              <View style={styles.levelDetailHeaderTitleGroup}>
                <Text style={styles.levelTitle}>{category.title}</Text>
                <Text style={styles.levelSubtitle}>{category.description}</Text>
              </View>
            </View>
          </View>
          <View style={styles.levelBody}>
            <View style={styles.levelBodyHeader}>
              <Text style={styles.selectLevelTitle}>Select a Level</Text>
              <View style={styles.easiestBadge}>
                <Text style={styles.easiestLabel}>Easiest</Text>
              </View>
            </View>

            {Array.from({ length: 10 }).map((_, index) => (
              <TouchableOpacity
                key={index + 1}
                style={styles.levelDetailButton}
                activeOpacity={0.7}
                onPress={() => 
                  navigation.navigate('CountingPractice', {
                    level: index + 1,
                    categoryKey: category.key,
                  })
                }
              >
                <View style={[styles.levelDetailCircle, { backgroundColor: category.color }]}> 
                  <Text style={styles.levelDetailNumber}>{index + 1}</Text>
                </View>

                <View style={styles.levelDetailInfo}>
                  <Text style={styles.levelDetailLabel}>Level {index + 1}</Text>
                  <View style={styles.levelDetailStars}>
                    {Array.from({ length: 4 }).map((_, starIdx) => (
                      <Ionicons
                        key={starIdx}
                        name={starIdx < levelStars[index] ? 'star' : 'star-outline'}
                        size={18}
                        color={starIdx < levelStars[index] ? '#fbbf24' : '#e5e7eb'}
                        style={starIdx > 0 ? styles.starSpacing : undefined}
                      />
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            <View style={styles.levelBodyFooter}>
              <View />
              <View style={styles.hardestBadge}>
                <Text style={styles.hardestLabel}>Hardest</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
