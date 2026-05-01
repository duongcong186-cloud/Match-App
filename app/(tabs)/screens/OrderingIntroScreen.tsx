import React from 'react';
import { Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';
import { categories } from '../constants/categories';
import { Props } from '../types';

export function OrderingIntroScreen({ navigation }: Props) {
  const category = categories.find(cat => cat.key === 'ordering')!;
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={[styles.introHeader, { backgroundColor: category.color }]}>
          <TouchableOpacity style={styles.headerBack} onPress={() => navigation.goBack()}>
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
            <View style={styles.orderingSequence}>
              <Text style={[styles.orderingNumber, { color: '#3b82f6' }]}>7</Text>
              <Text style={styles.orderingComma}>,</Text>
              <Text style={[styles.orderingNumber, { color: '#dc2626' }]}>3</Text>
              <Text style={styles.orderingComma}>,</Text>
              <Text style={[styles.orderingNumber, { color: '#fbbf24' }]}>9</Text>
              <Text style={styles.orderingComma}>,</Text>
              <Text style={[styles.orderingNumber, { color: '#111827' }]}>1</Text>
            </View>
            <View style={styles.orderingArrow}>
              <Ionicons name="arrow-down" size={24} color="#6b7280" />
            </View>
            <View style={styles.orderingSequence}>
              <Text style={[styles.orderingNumber, { color: '#111827' }]}>1</Text>
              <Text style={styles.orderingComma}>,</Text>
              <Text style={[styles.orderingNumber, { color: '#dc2626' }]}>3</Text>
              <Text style={styles.orderingComma}>,</Text>
              <Text style={[styles.orderingNumber, { color: '#3b82f6' }]}>7</Text>
              <Text style={styles.orderingComma}>,</Text>
              <Text style={[styles.orderingNumber, { color: '#fbbf24' }]}>9</Text>
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

          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: category.color }]} onPress={() => navigation.navigate('OrderingLevel')}>
            <Ionicons name="play" size={18} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Start Practice</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
