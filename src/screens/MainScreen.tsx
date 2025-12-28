import { StatusBar } from "expo-status-bar";
import {
  Animated,
  EventSubscription,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Images } from "../../assets/images";
import { Audios } from "../../assets/audios";
import { useRef, useState } from "react";
import { SafeAreaView } from "../components/SafeAreaView";
import { Colors } from "../colors";
import { StatusBanner } from "../components/StatusBanner/StatusBanner";
import { useSharedValue } from "react-native-reanimated";
import { StatusBannerSpacer } from "../components/StatusBanner/StatusBannerSpacer";
import { useAccelerometerListener } from "../hooks/useAccelerometerListener";
import { AudioButton } from "../components/AudioButton";
import { InfoBox } from "../components/InfoBox";
import { SensitivityControl } from "../components/SensitivityControl";
import { Button } from "../components/Button";
import { useAudioPlayer } from "expo-audio";

// ==============================
// CONSTANTS
// ==============================
const DEBOUNCE_TIME = 1000;

export default function MainScreen() {
  // ==============================
  // STATES & REFS
  // ==============================
  const [sensitivity, setSensitivity] = useState(5);
  const [slamCount, setSlamCount] = useState(0);
  const resetCounter = () => setSlamCount(0);

  // ==============================
  // AUDIO PLAYERS
  // ==============================
  const player = useAudioPlayer(Audios.Objection);
  const playAudio = () => {
    player.seekTo(0);
    player.play();
  };

  // ==============================
  // ACCELEROMETER LISTENER
  // ==============================
  const { magnitude, highest, start, stop, isListening } =
    useAccelerometerListener(sensitivity, () => {
      setSlamCount((prev) => prev + 1);
      animateSlam();
      playAudio();
    });
  const bannerHeight = useSharedValue(0);

  // ==============================
  // ANIMATIONS
  // ==============================
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const animateSlam = () => {
    // RESET ANIMATIONS
    scaleAnim.setValue(1);
    opacityAnim.setValue(1);
    // PULSING ANIMATION
    Animated.parallel([
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.3,
          useNativeDriver: true,
          speed: 50,
          bounciness: 20,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 50,
        }),
      ]),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <>
      <StatusBanner
        visible={isListening}
        message="Listening for slams..."
        bannerHeight={bannerHeight}
      />
      <SafeAreaView>
        <StatusBannerSpacer bannerHeight={bannerHeight} />
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={{ fontSize: 32, color: "#fff" }}>Objection!</Text>
          <AudioButton source={Images.Objection} audio={Audios.Objection} />
          <View style={styles.counterContainer}>
            <Animated.View
              style={[
                styles.slamIndicator,
                { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
              ]}
            />
            <Text style={styles.counterLabel}>Objection Detected</Text>
            <Text style={styles.counterValue}>{slamCount}</Text>
          </View>
          <InfoBox
            title="Current Magnitude"
            value={`${magnitude.toFixed(2)} m/s²`}
          />
          <InfoBox
            title="Highest Magnitude"
            value={`${highest.toFixed(2)} m/s²`}
          />
          <SensitivityControl
            value={sensitivity}
            onChange={(amount) =>
              setSensitivity((prev) => Math.max(1, Math.min(50, prev + amount)))
            }
          />
          {/* CONTROL BUTTONS */}
          <View style={styles.buttonContainer}>
            <Button
              style={isListening ? styles.buttonActive : undefined}
              onPress={isListening ? stop : start}
            >
              {isListening ? "Stop Listening" : "Start Listening"}
            </Button>
            <Button style={styles.buttonSecondary} onPress={resetCounter}>
              Reset Counter
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  counterContainer: {
    alignItems: "center",
    marginBottom: 40,
    position: "relative",
  },
  slamIndicator: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.ObjectionRed,
    top: -20,
  },
  counterLabel: {
    fontSize: 16,
    color: "#888",
    marginBottom: 8,
  },
  counterValue: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#ff3b30",
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 20,
  },
  buttonActive: {
    backgroundColor: "#ff3b30",
  },
  buttonSecondary: {
    backgroundColor: "#1a1a1a",
  },
});
