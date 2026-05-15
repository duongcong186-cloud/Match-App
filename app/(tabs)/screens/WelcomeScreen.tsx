import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { MascotCharacter } from '../../../components/MascotCharacter';
import { styles } from '../styles';
import { Props } from '../types';

const characterName = 'Minh Khoi';

const welcomeLines = [
  'Ready for a math game?',
  'Solve, score, and level up.',
  'Numbers and puzzles are waiting.',
];

export function WelcomeScreen({ navigation }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const scaleAnim = useRef(new Animated.Value(0.94)).current;

  const welcomeLine = useMemo(
    () => welcomeLines[Math.floor(Math.random() * welcomeLines.length)],
    [],
  );

  const spokenText = `Hi, this is Minh Khoi. ${welcomeLine}`;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();

    const speechTimeout = setTimeout(() => {
      Speech.stop();
      Speech.speak(spokenText, {
        language: 'en-US',
        pitch: 1.04,
        rate: 0.75,
      });
    }, 350);

    return () => {
      clearTimeout(speechTimeout);
      Speech.stop();
    };
  }, [fadeAnim, scaleAnim, slideAnim, spokenText]);

  const handleNext = () => {
    Speech.stop();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -18,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.replace('HomeMain');
    });
  };

  return (
    <SafeAreaView style={styles.welcomeSafeArea}>
      <Animated.View
        style={[
          styles.welcomeContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <MascotCharacter size="large" style={styles.welcomeMascot} />

        <Text style={styles.welcomeEyebrow}>Math Quest</Text>
        <Text style={styles.welcomeTitle}>Play with {characterName}</Text>
        <Text style={styles.welcomeSubtitle}>{welcomeLine}</Text>

        <View style={styles.welcomeMiniGrid}>
          <View style={[styles.welcomeMiniTile, { backgroundColor: '#dbeafe' }]}>
            <Text style={[styles.welcomeMiniText, { color: '#1d4ed8' }]}>1+2</Text>
          </View>
          <View style={[styles.welcomeMiniTile, { backgroundColor: '#dcfce7' }]}>
            <Ionicons name="triangle" size={22} color="#16a34a" />
          </View>
          <View style={[styles.welcomeMiniTile, { backgroundColor: '#fee2e2' }]}>
            <Text style={[styles.welcomeMiniText, { color: '#dc2626' }]}>3x4</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.welcomeNextButton} activeOpacity={0.85} onPress={handleNext}>
          <Text style={styles.welcomeNextText}>Start</Text>
          <Ionicons name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}
