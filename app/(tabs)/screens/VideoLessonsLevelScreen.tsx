import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Modal, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { categories } from '../constants/categories';
import { styles } from '../styles';
import { Props } from '../types';

// Conditionally import WebView only on native platforms
let WebView: any = null;
if (Platform.OS !== 'web') {
  WebView = require('react-native-webview').WebView;
}

const getYouTubeThumbnail = (embedUrl: string) => {
  const videoId = embedUrl.split('/embed/')[1];
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

const videoList = [
  {
    id: 1,
    title: 'Video 1: Basic Math Concepts',
    url: 'https://www.youtube.com/embed/mAH1MudP8_g',
    description: 'Learn basic math concepts for beginners'
  },
  {
    id: 2,
    title: 'Video 2: Advanced Problem Solving',
    url: 'https://www.youtube.com/embed/oeUVlnsuYMg',
    description: 'Advanced techniques for problem solving'
  },
  {
    id: 3,
    title: 'Video 3: Mental Math Tricks',
    url: 'https://www.youtube.com/embed/jLddqiMcCns',
    description: 'Quick mental math tricks and shortcuts'
  },
  {
    id: 4,
    title: 'Video 4: Practice Exercises',
    url: 'https://www.youtube.com/embed/QqGMpzLqflE',
    description: 'Practice exercises and solutions'
  }
];

export function VideoLessonsLevelScreen({ navigation }: Props) {
  const category = categories.find(cat => cat.key === 'video')!;
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const handleVideoPress = (url: string) => {
    setSelectedVideo(url);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  const getYouTubeHtml = (embedUrl: string) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { width: 100%; height: 100%; background-color: #000; overflow: hidden; }
            .video-container {
              position: relative;
              width: 100%;
              height: 0;
              padding-bottom: 56.25%;
            }
            .video-container iframe {
              position: absolute;
              top: 0; left: 0;
              width: 100%;
              height: 100%;
              border: 0;
            }
          </style>
        </head>
        <body>
          <div class="video-container">
            <iframe
              src="${embedUrl}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        </body>
      </html>
    `;
  };

  const renderVideoPlayer = () => {
    if (!selectedVideo) return null;

    if (Platform.OS === 'web') {
      // On web, use an iframe directly
      const iframeSrc = `${selectedVideo}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
      return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          {/* @ts-ignore - iframe is valid on web */}
          <iframe
            src={iframeSrc}
            style={{ width: '100%', height: '100%', border: 'none' } as any}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </View>
      );
    }

    // On native, use WebView with HTML wrapper
    return (
      <WebView
        source={{ html: getYouTubeHtml(selectedVideo) }}
        style={{ flex: 1 }}
        allowsFullscreenVideo={true}
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        allowsInlineMediaPlayback={true}
        mixedContentMode="compatibility"
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        <View style={[styles.practiceHeader, { backgroundColor: category.color }]}>
          <View style={styles.practiceHeaderRow}>
            <TouchableOpacity style={styles.practiceBackButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={28} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.practiceHeaderTextGroup}>
              <Text style={[styles.practiceHeaderTitle, { color: '#ffffff' }]}>{category.title}</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 12, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
          <Text style={{ 
            color: category.color, 
            marginBottom: 20,
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            Video Lessons
          </Text>
          
          {videoList.map((video) => (
            <TouchableOpacity
              key={video.id}
              style={{
                backgroundColor: '#ffffff',
                borderColor: category.color,
                borderWidth: 2,
                borderRadius: 12,
                padding: 16,
                marginBottom: 15,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              onPress={() => handleVideoPress(video.url)}
            >
              <View>
                {/* Thumbnail */}
                <View style={{
                  position: 'relative',
                  width: '100%',
                  borderRadius: 8,
                  overflow: 'hidden',
                  marginBottom: 12,
                  backgroundColor: '#1a1a2e',
                }}>
                  <Image
                    source={{ uri: getYouTubeThumbnail(video.url) }}
                    style={{
                      width: '100%',
                      aspectRatio: 16 / 9,
                      borderRadius: 8,
                    }}
                    resizeMode="cover"
                  />
                  {/* Play button overlay */}
                  <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.25)',
                  }}>
                    <View style={{
                      width: 56,
                      height: 56,
                      borderRadius: 28,
                      backgroundColor: 'rgba(255,0,0,0.85)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <Ionicons name="play" size={30} color="#ffffff" style={{ marginLeft: 3 }} />
                    </View>
                  </View>
                </View>

                {/* Title */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  <Ionicons name="play-circle" size={20} color={category.color} />
                  <Text style={{ 
                    color: category.color, 
                    marginLeft: 8, 
                    fontSize: 15, 
                    fontWeight: '700',
                    flex: 1
                  }}>
                    {video.title}
                  </Text>
                </View>

                {/* Description */}
                <Text style={{ 
                  color: '#6b7280', 
                  fontSize: 13, 
                  lineHeight: 18,
                }}>
                  {video.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* WebView Modal for Video */}
      <Modal
        visible={selectedVideo !== null}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closeVideoModal}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: '#000'
          }}>
            <TouchableOpacity onPress={closeVideoModal}>
              <Ionicons name="chevron-back" size={28} color="#ffffff" />
            </TouchableOpacity>
            <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '600' }}>
              Video Lesson
            </Text>
            <View style={{ width: 28 }} />
          </View>
          
          {renderVideoPlayer()}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
