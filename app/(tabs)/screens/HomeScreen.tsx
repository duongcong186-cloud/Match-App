import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';
import { categories } from '../constants/categories';
import { Props } from '../types';

export function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.appTitle}>Math Practice</Text>
            <Text style={styles.pageSubtitle}>Choose a topic to start</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton} activeOpacity={0.7} onPress={() => navigation.navigate('Rankings')}>
            <Ionicons name="trophy-outline" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>

        {/* <View style={styles.pointsCard}>
          <Ionicons name="trophy" size={22} color="#fbbf24" />
          <View style={styles.pointsTextGroup}>
            <Text style={styles.pointsLabel}>Total Points</Text>
            <Text style={styles.pointsValue}>1,250</Text>
          </View>
        </View> */}

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.topicCard, { backgroundColor: cat.color }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate(cat.screen)}
            >
              <View style={styles.cardIconWrapper}>
                <Ionicons name={cat.icon as any} size={24} color="#fff" />
              </View>
              <View style={styles.cardTextGroup}>
                <Text style={styles.cardTitle}>{cat.title}</Text>
                <Text style={styles.cardSubtitle}>{cat.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.95)" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
