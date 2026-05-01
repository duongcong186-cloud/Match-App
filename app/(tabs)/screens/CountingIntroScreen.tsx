import React from 'react';
import { Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';
import { categories } from '../constants/categories';
import { Props } from '../types';

export function CountingIntroScreen({ navigation }: Props) {
  const category = categories.find(cat => cat.key === 'counting')!;
  const numbers = [1, 2, 3, 4, 5];
  const colors = ['#2563eb', '#1d4ed8', '#22c55e', '#ef4444', '#0ea5e9'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={[styles.introHeader, { backgroundColor: category.color }]}>
          <View style={styles.introHeaderContent}>
            <TouchableOpacity style={styles.headerBackInline} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.introHeaderTitleGroup}>
              <Text style={styles.introTitle} numberOfLines={1}>
                {category.title}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.introScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard}>
            <View style={styles.countingNumbersRow}>
              {numbers.map((num, idx) => (
                <Text key={idx} style={[styles.countingNumber, { color: colors[idx] }]}>{num}</Text>
              ))}
            </View>
            <View style={styles.applesRow}>
              {numbers.map((num, idx) => (
                <View key={idx} style={styles.appleBubble}>
                  <Text style={styles.appleEmoji}>🍎</Text>
                </View>
              ))}
            </View>
            <View style={styles.heroDivider} />
            <Text style={styles.heroDescription}>{category.description}</Text>
          </View>

          <Text style={styles.sectionTitle}>Examples</Text>
          <View style={styles.examplesRow}>
            <View style={[styles.exampleCard, styles.exampleCardLarge]}>
              <Text style={styles.exampleCardLabel}>Count the apples.</Text>
              <Text style={styles.exampleCardText}>How many are there?</Text>
              <View style={styles.exampleAppleRow}>
                {numbers.slice(0, 5).map((_, idx) => (
                  <Text key={idx} style={styles.appleEmojiSmall}>🍎</Text>
                ))}
              </View>
            </View>
            <View style={[styles.exampleCard, styles.exampleCardLarge]}>
              <Text style={styles.exampleCardLabel}>What comes next?</Text>
              <Text style={styles.exampleCardText}>2, 4, 6, 8, ...</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: category.color }]} onPress={() => navigation.navigate('CountingLevel')}>
            <Ionicons name="play" size={18} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Start Practice</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
