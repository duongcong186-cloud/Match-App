import React from 'react';
import { Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';
import { categories } from '../constants/categories';
import { Props } from '../types';

export function ComparisonIntroScreen({ navigation }: Props) {
  const category = categories.find(cat => cat.key === 'comparison')!;
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
            <Text style={[styles.heroEquation, { marginBottom: 8 }]}>
              <Text style={{ color: '#3b82f6' }}>25</Text>
              <Text style={{ color: '#8b5cf6' }}> {String.fromCharCode(62)} </Text>
              <Text style={{ color: '#111827' }}>18</Text>
            </Text>
            <Text style={[styles.heroEquation, { marginBottom: 8 }]}>
              <Text style={{ color: '#ef4444' }}>34</Text>
              <Text style={{ color: '#8b5cf6' }}> {String.fromCharCode(60)} </Text>
              <Text style={{ color: '#111827' }}>50</Text>
            </Text>
            <Text style={[styles.heroEquation, { marginBottom: 16 }]}>
              <Text style={{ color: '#111827' }}>27</Text>
              <Text style={{ color: '#8b5cf6' }}> = </Text>
              <Text style={{ color: '#111827' }}>27</Text>
            </Text>
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

          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: category.color }]} onPress={() => navigation.navigate('ComparisonLevel')}>
            <Ionicons name="play" size={18} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Start Practice</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
