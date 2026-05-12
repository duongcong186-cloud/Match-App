import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MascotCharacter } from '../../../components/MascotCharacter';
import { categories } from '../constants/categories';
import { styles } from '../styles';
import { Props } from '../types';

export function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.topBarTitleGroup}>
            <Text style={styles.appTitle}>Math Quest</Text>
          </View>
          <View style={styles.topBarActions}>
            <TouchableOpacity style={styles.settingsButton} activeOpacity={0.7} onPress={() => navigation.navigate('Rankings')}>
              <Ionicons name="trophy-outline" size={24} color="#1f2937" />
            </TouchableOpacity>
          </View>
        </View>

        {/* <View style={styles.pointsCard}>
          <Ionicons name="trophy" size={22} color="#fbbf24" />
          <View style={styles.pointsTextGroup}>
            <Text style={styles.pointsLabel}>Total Points</Text>
            <Text style={styles.pointsValue}>1,250</Text>
          </View>
        </View> */}

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.homeHero}>
            <View style={styles.homeHeroTextGroup}>
              <Text style={styles.homeHeroEyebrow}>Ready?</Text>
              <Text style={styles.homeHeroTitle}>Choose a quest</Text>
              <View style={styles.homeBubbleRow}>
                <View style={[styles.homeBubble, { backgroundColor: '#dbeafe' }]}>
                  <Text style={[styles.homeBubbleText, { color: '#1d4ed8' }]}>1+2</Text>
                </View>
                <View style={[styles.homeBubble, { backgroundColor: '#dcfce7' }]}>
                  <Text style={[styles.homeBubbleText, { color: '#15803d' }]}>x4</Text>
                </View>
                <View style={[styles.homeBubble, { backgroundColor: '#fef3c7' }]}>
                  <Text style={[styles.homeBubbleText, { color: '#b45309' }]}>?</Text>
                </View>
              </View>
            </View>
            <MascotCharacter size="medium" style={styles.homeHeroMascot} />
          </View>

          <View style={styles.homeTopicGrid}>
            {categories.map((cat, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.topicCard, { backgroundColor: cat.color }]}
                activeOpacity={0.86}
                onPress={() => navigation.navigate(cat.screen)}
              >
                <View style={styles.cardIconWrapper}>
                  <Ionicons name={cat.icon as any} size={24} color="#fff" />
                </View>
                <View style={styles.cardTextGroup}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {cat.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
