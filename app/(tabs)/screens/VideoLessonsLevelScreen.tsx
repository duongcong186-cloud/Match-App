import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { MascotCharacter } from '../../../components/MascotCharacter';
import { categories } from '../constants/categories';
import { styles } from '../styles';
import { Props } from '../types';

interface VideoLesson {
  id: number;
  title: string;
  shortTitle: string;
  videoId: string;
  description: string;
}

const videoList: VideoLesson[] = [
  {
    id: 1,
    title: 'Video 1: Basic Math Concepts',
    shortTitle: 'Basics',
    videoId: 'mAH1MudP8_g',
    description: 'Learn basic math concepts for beginners',
  },
  {
    id: 2,
    title: 'Video 2: Advanced Problem Solving',
    shortTitle: 'Problem Solving',
    videoId: 'oeUVlnsuYMg',
    description: 'Advanced techniques for problem solving',
  },
  {
    id: 3,
    title: 'Video 3: Mental Math Tricks',
    shortTitle: 'Math Tricks',
    videoId: 'jLddqiMcCns',
    description: 'Quick mental math tricks and shortcuts',
  },
  {
    id: 4,
    title: 'Video 4: Practice Exercises',
    shortTitle: 'Practice',
    videoId: 'QqGMpzLqflE',
    description: 'Practice exercises and solutions',
  },
];

const getYouTubeThumbnail = (videoId: string) => `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

const getEmbedUrl = (videoId: string) =>
  `https://www.youtube.com/embed/${videoId}?playsinline=1&controls=1&rel=0&modestbranding=1&fs=1&origin=https%3A%2F%2Fwww.youtube.com`;

export function VideoLessonsLevelScreen({ navigation }: Props) {
  const category = categories.find(cat => cat.key === 'video')!;
  const [openingVideoId, setOpeningVideoId] = useState<number | null>(null);

  const openVideo = async (video: VideoLesson) => {
    setOpeningVideoId(video.id);
    try {
      await WebBrowser.openBrowserAsync(getEmbedUrl(video.videoId), {
        controlsColor: category.color,
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      });
    } finally {
      setOpeningVideoId(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={[styles.practiceHeader, { backgroundColor: category.color }]}>
          <View style={styles.practiceHeaderRow}>
            <TouchableOpacity style={styles.practiceBackButton} activeOpacity={0.75} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={28} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.practiceHeaderTextGroup}>
              <Text style={[styles.practiceHeaderTitle, { color: '#ffffff' }]}>{category.title}</Text>
              <Text style={styles.practiceHeaderSubtitle}>Watch short lessons in-app</Text>
            </View>
            <MascotCharacter size="small" />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.videoScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.videoPageHeader}>
            <Text style={[styles.videoPageTitle, { color: category.color }]}>Watch & Play</Text>
          </View>

          {videoList.map(video => (
            <TouchableOpacity
              key={video.id}
              style={[styles.videoCard, { borderColor: category.color }]}
              activeOpacity={0.86}
              onPress={() => openVideo(video)}
              disabled={openingVideoId === video.id}
            >
              <View style={styles.videoThumbnailFrame}>
                <Image
                  source={{ uri: getYouTubeThumbnail(video.videoId) }}
                  style={styles.videoThumbnail}
                  resizeMode="cover"
                />
                <View style={styles.videoOverlay}>
                  <View style={styles.videoPlayButton}>
                    <Ionicons name="play" size={30} color="#ffffff" style={styles.videoPlayIcon} />
                  </View>
                </View>
                <View style={styles.videoLessonPill}>
                  <Text style={styles.videoLessonPillText}>
                    {openingVideoId === video.id ? '...' : video.id}
                  </Text>
                </View>
              </View>

              <View style={styles.videoCardBody}>
                <View style={styles.videoTitleRow}>
                  <Ionicons name="play-circle" size={21} color={category.color} />
                  <Text style={[styles.videoTitle, { color: category.color }]} numberOfLines={2}>
                    {video.shortTitle}
                  </Text>
                </View>
                <Text style={styles.videoDescription} numberOfLines={1}>
                  Tap to watch
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
