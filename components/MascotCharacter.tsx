import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

type MascotSize = 'small' | 'medium' | 'large';

interface MascotCharacterProps {
  size?: MascotSize;
  animated?: boolean;
  showBadge?: boolean;
  style?: StyleProp<ViewStyle>;
}

const sizeConfig = {
  small: {
    width: 40,
    height: 48,
    hairWidth: 25,
    hairHeight: 10,
    faceSize: 27,
    bodyWidth: 34,
    bodyHeight: 20,
    shirtWidth: 25,
    shirtHeight: 20,
    armWidth: 6,
    armHeight: 20,
    eyeGap: 7,
    eyeSize: 4,
    smileWidth: 13,
    smileHeight: 7,
    shirtText: 12,
    badgeSize: 16,
    badgeIcon: 9,
  },
  medium: {
    width: 82,
    height: 100,
    hairWidth: 52,
    hairHeight: 21,
    faceSize: 56,
    bodyWidth: 70,
    bodyHeight: 44,
    shirtWidth: 50,
    shirtHeight: 42,
    armWidth: 10,
    armHeight: 36,
    eyeGap: 12,
    eyeSize: 6,
    smileWidth: 24,
    smileHeight: 11,
    shirtText: 20,
    badgeSize: 28,
    badgeIcon: 15,
  },
  large: {
    width: 178,
    height: 204,
    hairWidth: 98,
    hairHeight: 36,
    faceSize: 100,
    bodyWidth: 132,
    bodyHeight: 80,
    shirtWidth: 92,
    shirtHeight: 76,
    armWidth: 18,
    armHeight: 58,
    eyeGap: 18,
    eyeSize: 10,
    smileWidth: 38,
    smileHeight: 18,
    shirtText: 28,
    badgeSize: 44,
    badgeIcon: 22,
  },
};

export function MascotCharacter({
  size = 'medium',
  animated = true,
  showBadge = true,
  style,
}: MascotCharacterProps) {
  const config = sizeConfig[size];
  const jumpAnim = useRef(new Animated.Value(0)).current;
  const armAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) {
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(jumpAnim, {
            toValue: size === 'large' ? -12 : size === 'medium' ? -8 : -5,
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
        Animated.delay(size === 'large' ? 520 : 700),
      ]),
    );

    loop.start();
    return () => loop.stop();
  }, [animated, armAnim, jumpAnim, size]);

  const leftArmRotate = armAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-18deg', '-44deg'],
  });
  const rightArmRotate = armAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['18deg', '44deg'],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        localStyles.character,
        { width: config.width, height: config.height, transform: [{ translateY: jumpAnim }] },
        style,
      ]}
    >
      <View
        style={[
          localStyles.hair,
          {
            width: config.hairWidth,
            height: config.hairHeight,
            borderTopLeftRadius: config.hairHeight,
            borderTopRightRadius: config.hairHeight,
            borderBottomLeftRadius: config.hairHeight / 2,
            borderBottomRightRadius: config.hairHeight / 2,
            marginBottom: -config.hairHeight * 0.6,
          },
        ]}
      />
      <View
        style={[
          localStyles.face,
          {
            width: config.faceSize,
            height: config.faceSize,
            borderRadius: config.faceSize * 0.38,
            borderWidth: size === 'small' ? 2 : 4,
          },
        ]}
      >
        <View
          style={[
            localStyles.hairLine,
            {
              width: config.faceSize * 0.8,
              height: config.faceSize * 0.22,
              borderBottomLeftRadius: config.faceSize * 0.18,
              borderBottomRightRadius: config.faceSize * 0.18,
            },
          ]}
        />
        <View style={[localStyles.eyeRow, { gap: config.eyeGap, marginBottom: config.eyeGap * 0.75 }]}>
          <View style={[localStyles.eye, { width: config.eyeSize, height: config.eyeSize, borderRadius: config.eyeSize / 2 }]} />
          <View style={[localStyles.eye, { width: config.eyeSize, height: config.eyeSize, borderRadius: config.eyeSize / 2 }]} />
        </View>
        <View
          style={[
            localStyles.smile,
            {
              width: config.smileWidth,
              height: config.smileHeight,
              borderBottomWidth: Math.max(2, Math.round(config.eyeSize * 0.45)),
            },
          ]}
        />
      </View>
      <View style={[localStyles.neck, { width: config.faceSize * 0.24, height: config.faceSize * 0.16 }]} />
      <View style={[localStyles.body, { width: config.bodyWidth, height: config.bodyHeight }]}>
        <Animated.View
          style={[
            localStyles.arm,
            {
              left: config.bodyWidth * 0.08,
              width: config.armWidth,
              height: config.armHeight,
              borderRadius: config.armWidth / 2,
              transform: [{ rotate: leftArmRotate }],
            },
          ]}
        />
        <View
          style={[
            localStyles.shirt,
            {
              width: config.shirtWidth,
              height: config.shirtHeight,
              borderTopLeftRadius: config.shirtWidth * 0.26,
              borderTopRightRadius: config.shirtWidth * 0.26,
              borderBottomLeftRadius: config.shirtWidth * 0.2,
              borderBottomRightRadius: config.shirtWidth * 0.2,
              borderWidth: size === 'small' ? 2 : 4,
            },
          ]}
        >
          <Text style={[localStyles.shirtText, { fontSize: config.shirtText }]}>M</Text>
        </View>
        <Animated.View
          style={[
            localStyles.arm,
            {
              right: config.bodyWidth * 0.08,
              width: config.armWidth,
              height: config.armHeight,
              borderRadius: config.armWidth / 2,
              transform: [{ rotate: rightArmRotate }],
            },
          ]}
        />
      </View>
      {showBadge && (
        <View
          style={[
            localStyles.badge,
            {
              right: size === 'small' ? 0 : 4,
              bottom: size === 'large' ? 16 : 4,
              width: config.badgeSize,
              height: config.badgeSize,
              borderRadius: config.badgeSize * 0.36,
              borderWidth: size === 'small' ? 2 : 4,
            },
          ]}
        >
          <Ionicons name="calculator" size={config.badgeIcon} color="#ffffff" />
        </View>
      )}
    </Animated.View>
  );
}

const localStyles = StyleSheet.create({
  character: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  hair: {
    backgroundColor: '#111827',
    zIndex: 2,
  },
  face: {
    backgroundColor: '#f7c59f',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    overflow: 'hidden',
  },
  hairLine: {
    position: 'absolute',
    top: 0,
    backgroundColor: '#111827',
  },
  eyeRow: {
    flexDirection: 'row',
  },
  eye: {
    backgroundColor: '#111827',
  },
  smile: {
    borderBottomColor: '#111827',
    borderRadius: 20,
  },
  neck: {
    backgroundColor: '#f7c59f',
    marginTop: -2,
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  arm: {
    position: 'absolute',
    top: 4,
    backgroundColor: '#f7c59f',
  },
  shirt: {
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#ffffff',
  },
  shirtText: {
    color: '#ffffff',
    fontWeight: '900',
  },
  badge: {
    position: 'absolute',
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ffffff',
  },
});

export default MascotCharacter;
