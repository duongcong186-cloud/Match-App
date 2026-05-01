import React from 'react';
import { Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';
import { categories } from '../constants/categories';
import { Props } from '../types';

export function VideoLessonsIntroScreen({ navigation }: Props) {
  const category = categories.find(cat => cat.key === 'video')!;
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={[styles.introHeader, { backgroundColor: category.color }]}>
          <TouchableOpacity style={styles.headerBack} onPress={() => navigation.navigate('HomeMain')}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.introHeaderContent}>
            <View style={styles.screenHeaderIcon}>
              <Ionicons name={category.icon as any} size={26} color="#fff" />
            </View>
            <View style={styles.headerTitleGroup}>
              <Text style={styles.introTitle}>{category.title}</Text>
              <Text style={styles.introSubtitle}>{category.subtitle}</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.introScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard}>
            <View style={styles.videoPlayerContainer}>
              <View style={styles.videoPlaceholder}>
                <View style={styles.playButtonOverlay}>
                  <Ionicons name="play" size={48} color="#ffffff" />
                </View>
              </View>
              <View style={styles.bookStack}>
                <View style={[styles.book, { backgroundColor: '#3b82f6' }]} />
                <View style={[styles.book, { backgroundColor: '#ef4444', transform: [{ rotate: '15deg' }] }]} />
                <View style={[styles.book, { backgroundColor: '#10b981', transform: [{ rotate: '30deg' }] }]} />
              </View>
            </View>
            <View style={styles.heroDivider} />
            <Text style={styles.heroDescription}>{category.description}</Text>
          </View>

          <Text style={styles.sectionTitle}>Examples</Text>
          <View style={styles.examplesRow}>
            {category.examples.map((example: any, idx: any) => (
              <View key={idx} style={styles.exampleCard}>
                <Text style={styles.exampleText}>{example}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: category.color }]} onPress={() => navigation.navigate('VideoLessonsLevel')}>
            <Ionicons name="play" size={18} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Watch Lessons</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
