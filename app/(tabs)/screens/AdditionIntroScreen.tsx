import React from 'react';
import { Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';
import { categories } from '../constants/categories';
import { Props } from '../types';

export function AdditionIntroScreen({ navigation }: Props) {
  const category = categories.find(cat => cat.key === 'addition') as any;
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
          {/* Hero Equation */}
          <View style={styles.heroCard}>
            <Text style={styles.heroEquation}>
              <Text style={{ color: '#1d4ed8' }}>23</Text>
              <Text style={{ color: '#111827' }}> + </Text>
              <Text style={{ color: '#dc2626' }}>15</Text>
              <Text style={{ color: '#111827' }}> = </Text>
              <Text style={{ color: '#059669' }}>38</Text>
            </Text>
            
            {/* Colored Boxes */}
            <View style={styles.equationBoxRow}>
              <View style={[styles.numberBox, { backgroundColor: '#1d4ed8' }]}>
                <Text style={styles.numberBoxText}>23</Text>
              </View>
              <Text style={styles.operatorText}>+</Text>
              <View style={[styles.numberBox, { backgroundColor: '#dc2626' }]}>
                <Text style={styles.numberBoxText}>15</Text>
              </View>
              <Text style={styles.operatorText}>=</Text>
              <View style={[styles.numberBox, { backgroundColor: '#059669' }]}>
                <Text style={styles.numberBoxText}>38</Text>
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

          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: category.color }]} onPress={() => navigation.navigate('AdditionLevel')}>
            <Ionicons name="play" size={18} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Start Practice</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
