import React, { useCallback, useState } from 'react';
import { Text, View, ScrollView, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';
import { categories } from '../constants/categories';
import { loadRankings, LevelResult } from '../utils/storage';

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const findCategoryTitle = (key: string) => categories.find(category => category.key === key)?.title ?? key;

export function RankingsScreen() {
  const [rankings, setRankings] = useState<Record<string, LevelResult>>({});

  useFocusEffect(
    useCallback(() => {
      loadRankings().then(setRankings);
    }, []),
  );

  const results = Object.values(rankings)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.level !== a.level) return b.level - a.level;
      if (a.duration !== b.duration) return a.duration - b.duration;
      return b.timestamp - a.timestamp;
    });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.levelDetailScroll, styles.fullScreenScroll]} showsVerticalScrollIndicator={false}>
        <View style={styles.rankingHeaderCard}>
          <View style={styles.rankingHeaderRow}>
            <View style={styles.rankingHeaderIconWrapper}>
              <Ionicons name="trophy" size={24} color="#1d4ed8" />
            </View>
            <View>
              <Text style={styles.rankingHeaderTitle}>Rankings</Text>
              <Text style={styles.rankingHeaderSubtitle}>Your best level results, sorted by score.</Text>
            </View>
          </View>
        </View>

        <View style={styles.rankingTableHeader}>
          <Text style={styles.rankingTableHeaderLabel}>SCORE</Text>
          <Text style={styles.rankingTableHeaderLabel}>TIME</Text>
          <Text style={styles.rankingTableHeaderLabel}>TOPIC</Text>
          <Text style={styles.rankingTableHeaderLabel}>DATE</Text>
        </View>

        {results.length === 0 ? (
          <Text style={styles.rankingEmpty}>No completed levels yet. Play a level to save your best score.</Text>
        ) : (
          results.map((result, index) => (
            <View key={`${result.topic}:${result.level}`} style={styles.rankingListItem}>
              <View style={styles.rankingBadge}>
                <Text style={styles.rankingBadgeText}>{index + 1}</Text>
              </View>
              <View style={styles.rankingInfo}>
                <View style={styles.rankingRow}>
                  <Text style={styles.rankingScore}>{result.score}/10</Text>
                  <Text style={styles.rankingTime}>{result.duration}s</Text>
                </View>
                <Text style={styles.rankingTopic}>
                  {findCategoryTitle(result.topic)} - Level {result.level}
                </Text>
              </View>
              <Text style={styles.rankingDate}>{formatDate(result.timestamp)}</Text>
              <Ionicons name="chevron-forward" size={18} color="#cbd5e1" style={styles.rankingIcon} />
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
