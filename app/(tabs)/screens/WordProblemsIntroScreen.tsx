import React from 'react';
import { Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';
import { categories } from '../constants/categories';
import { Props } from '../types';

export function WordProblemsIntroScreen({ navigation }: Props) {
  const category = categories.find(cat => cat.key === 'wordproblems')!;
  
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
            <View style={styles.wordProblemScene}>
              {/* Shopping Cart Icon */}
              <View style={styles.cartContainer}>
                <Ionicons name="cart" size={40} color="#ef4444" />
              </View>
              
              {/* Price Tags */}
              <View style={styles.priceTagsRow}>
                <View style={[styles.priceTag, { backgroundColor: '#3b82f6' }]}>
                  <Text style={styles.priceText}>$19</Text>
                </View>
                <View style={[styles.priceTag, { backgroundColor: '#7c3aed' }]}>
                  <Text style={styles.priceText}>$12</Text>
                </View>
              </View>
              
              {/* Question Mark */}
              <Text style={styles.questionMark}>?</Text>
            </View>
            <View style={styles.heroDivider} />
            <Text style={styles.heroDescription}>{category.description}</Text>
          </View>

          <Text style={styles.sectionTitle}>Examples</Text>
          <View style={styles.examplesRow}>
            {category.examples.map((example, idx) => (
              <View key={idx} style={styles.exampleCard}>
                <Text style={styles.exampleText}>{example}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: category.color }]} onPress={() => navigation.navigate('WordProblemsLevel')}>
            <Ionicons name="play" size={18} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Start Practice</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
