import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';
import { Props } from '../types';

const characterName = 'Minh Khôi';

const welcomeLines = [
  'Let us learn math together.',
  'Ready for fun math challenges?',
  'Pick a topic and learn one step at a time.',
  'Numbers, shapes, and puzzles are waiting.',
  'Practice with Minh Khôi and build your confidence.',
];

export function WelcomeScreen({ navigation }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const scaleAnim = useRef(new Animated.Value(0.94)).current;
  const jumpAnim = useRef(new Animated.Value(0)).current;
  const armAnim = useRef(new Animated.Value(0)).current;

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

    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(jumpAnim, {
            toValue: -12,
            duration: 340,
            useNativeDriver: true,
          }),
          Animated.timing(armAnim, {
            toValue: 1,
            duration: 340,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.spring(jumpAnim, {
            toValue: 0,
            friction: 4,
            tension: 95,
            useNativeDriver: true,
          }),
          Animated.timing(armAnim, {
            toValue: 0,
            duration: 260,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(520),
      ]),
    ).start();

    const speechTimeout = setTimeout(() => {
      Speech.stop();
      Speech.speak(spokenText, {
        language: 'en-US',
        pitch: 1.04,
        rate: 0.88,
      });
    }, 350);

    return () => {
      clearTimeout(speechTimeout);
      Speech.stop();
    };
  }, [armAnim, fadeAnim, jumpAnim, scaleAnim, slideAnim, spokenText]);

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

  const leftArmRotate = armAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-18deg', '-44deg'],
  });
  const rightArmRotate = armAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['18deg', '44deg'],
  });

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
        <Animated.View style={[styles.welcomeCharacter, { transform: [{ translateY: jumpAnim }] }]}>
          <View style={styles.welcomeHair} />
          <View style={styles.welcomeFace}>
            <View style={styles.welcomeBoyHairLine} />
            <View style={styles.welcomeEyeRow}>
              <View style={styles.welcomeEye} />
              <View style={styles.welcomeEye} />
            </View>
            <View style={styles.welcomeSmile} />
          </View>
          <View style={styles.welcomeNeck} />
          <View style={styles.welcomeBody}>
            <Animated.View
              style={[
                styles.welcomeArm,
                styles.welcomeLeftArm,
                { transform: [{ rotate: leftArmRotate }] },
              ]}
            />
            <View style={styles.welcomeShirt}>
              <Text style={styles.welcomeShirtText}>M</Text>
            </View>
            <Animated.View
              style={[
                styles.welcomeArm,
                styles.welcomeRightArm,
                { transform: [{ rotate: rightArmRotate }] },
              ]}
            />
          </View>
          <View style={styles.welcomeBadge}>
            <Ionicons name="calculator" size={22} color="#ffffff" />
          </View>
        </Animated.View>

        <Text style={styles.welcomeEyebrow}>Learn math together</Text>
        <Text style={styles.welcomeTitle}>Learn with {characterName}</Text>
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
          <Text style={styles.welcomeNextText}>Next</Text>
          <Ionicons name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}
