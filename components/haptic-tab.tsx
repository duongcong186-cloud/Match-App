import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        try {
          // Add haptic feedback for both iOS and Android
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
            // Ignore haptic errors to prevent app crash
          });
        } catch (error) {
          // Ignore any errors to prevent app crash
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
