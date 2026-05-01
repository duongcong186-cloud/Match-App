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
