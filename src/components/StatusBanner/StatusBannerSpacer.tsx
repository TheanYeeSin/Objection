import React from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ==============================
// PROPS
// ==============================
interface Props {
  bannerHeight: SharedValue<number>;
}

// ==============================
// COMPONENT
// ==============================

/**
 * Spacer component that pushes content down when banner appears.
 * Place this at the top of each screen, right after SafeAreaView.
 */
export const StatusBannerSpacer: React.FC<Props> = ({ bannerHeight }) => {
  // HOOKS
  const insets = useSafeAreaInsets();

  // ANIMATIONS
  const animatedStyle = useAnimatedStyle(() => ({
    height: bannerHeight.value - insets.top,
  }));

  return <Animated.View style={animatedStyle} />;
};
