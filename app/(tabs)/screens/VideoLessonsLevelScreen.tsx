import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Modal, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

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
  `https://www.youtube.com/embed/${videoId}?playsinline=1&controls=1&rel=0&modestbranding=1&fs=1`;

const getWatchUrl = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`;

export function VideoLessonsLevelScreen({ navigation }: Props) {
  const category = categories.find(cat => cat.key === 'video')!;
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson | null>(null);
  const [useWatchPage, setUseWatchPage] = useState(false);

  const openVideo = (video: VideoLesson) => {
    setUseWatchPage(true);
    setSelectedVideo(video);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
    setUseWatchPage(false);
  };

  const videoUrl = selectedVideo
    ? useWatchPage
      ? getWatchUrl(selectedVideo.videoId)
      : getEmbedUrl(selectedVideo.videoId)
    : undefined;

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
                  <Text style={styles.videoLessonPillText}>{video.id}</Text>
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

      <Modal
        visible={selectedVideo !== null}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closeVideoModal}
      >
        <SafeAreaView style={styles.videoModalSafeArea}>
          <View style={styles.videoModalHeader}>
            <TouchableOpacity style={styles.videoModalBackButton} activeOpacity={0.75} onPress={closeVideoModal}>
              <Ionicons name="chevron-back" size={28} color="#ffffff" />
            </TouchableOpacity>
            <Text numberOfLines={1} style={styles.videoModalTitle}>
              {selectedVideo?.title ?? 'Video Lesson'}
            </Text>
            <TouchableOpacity style={styles.videoModeButton} activeOpacity={0.75} onPress={() => setUseWatchPage(value => !value)}>
              <Text style={styles.videoModeButtonText}>
                {useWatchPage ? 'Embed' : 'YouTube'}
              </Text>
            </TouchableOpacity>
          </View>

          {videoUrl && (
            <WebView
              source={{ uri: videoUrl }}
              style={styles.videoWebView}
              originWhitelist={['https://*', 'http://*']}
              allowsFullscreenVideo
              javaScriptEnabled
              domStorageEnabled
              startInLoadingState
              allowsInlineMediaPlayback
              allowsAirPlayForMediaPlayback
              allowsPictureInPictureMediaPlayback
              setSupportMultipleWindows={false}
              mediaPlaybackRequiresUserAction={Platform.OS === 'ios'}
              mixedContentMode="compatibility"
              userAgent={
                Platform.OS === 'ios'
                  ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
                  : undefined
              }
              onShouldStartLoadWithRequest={request => {
                if (
                  request.url.startsWith('youtube://') ||
                  request.url.startsWith('vnd.youtube') ||
                  request.url.startsWith('intent://')
                ) {
                  setUseWatchPage(true);
                  return false;
                }

                return request.url.startsWith('http') || request.url.startsWith('about:blank');
              }}
              onHttpError={() => setUseWatchPage(true)}
              onError={() => setUseWatchPage(true)}
              renderLoading={() => (
                <View style={styles.videoLoadingContainer}>
                  <Text style={styles.videoLoadingText}>Loading video...</Text>
                </View>
              )}
              renderError={(errorName, errorCode) => (
                <View style={styles.videoErrorContainer}>
                  <Text style={styles.videoErrorText}>
                    Error loading video: {errorName} ({errorCode})
                  </Text>
                  <TouchableOpacity
                    style={styles.videoRetryButton}
                    activeOpacity={0.8}
                    onPress={() => setUseWatchPage(true)}
                  >
                    <Text style={styles.videoRetryButtonText}>Try YouTube page</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
