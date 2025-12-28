import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ==============================
// PROPS
// ==============================
interface Props {
  bannerHeight: SharedValue<number>;
  visible: boolean;
  message: string;
}

// ==============================
// CONSTANTS
// ==============================
const BANNER_HEIGHT = 30;

// ==============================
// COMPONENT
// ==============================

/**
 * Status banner component.
 * Place this at the top of each screen, outside of SafeAreaView.
 */
export const StatusBanner: React.FC<Props> = ({
  bannerHeight,
  visible,
  message,
}) => {
  const insets = useSafeAreaInsets();
  const totalHeight = BANNER_HEIGHT + insets.top;

  // ANIMATIONS
  useEffect(() => {
    bannerHeight.value = withTiming(visible ? totalHeight : 0, {
      duration: 300,
    });
  }, [visible, bannerHeight, totalHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: bannerHeight.value,
  }));

  return (
    <Animated.View style={[styles.banner, animatedStyle]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

// ==============================
// STYLES
// ==============================
const styles = StyleSheet.create({
  banner: {
    alignItems: "center",
    justifyContent: "flex-end",
    left: 0,
    overflow: "hidden",
    position: "absolute",
    right: 0,
    top: 0,
    width: "100%",
    zIndex: 99999,
    backgroundColor: "#00ff00",
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
    paddingBottom: 4,
  },
});
