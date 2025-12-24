import { StatusBar } from "expo-status-bar";
import {
  Animated,
  EventSubscription,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Images } from "../../assets/images";
import { useAudioPlayer } from "expo-audio";
import { Audios } from "../../assets/audios";
import { Accelerometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";
import { Button } from "../components/Button/Button";
import { SafeAreaView } from "../components/SafeAreaView/SafeAreaView";
import { Colors } from "../colors";
import { StatusBanner } from "../components/StatusBanner/StatusBanner";
import { useSharedValue } from "react-native-reanimated";
import { StatusBannerSpacer } from "../components/StatusBanner/StatusBannerSpacer";
// ==============================
// CONSTANTS
// ==============================
const DEBOUNCE_TIME = 1000;

export default function MainScreen() {
  // ==============================
  // STATES & REFS
  // ==============================
  const [isListening, setIsListening] = useState(false);
  const [sensitivity, setSensitivity] = useState(5);
  const [lastMagnitude, setLastMagnitude] = useState(0);
  const [slamCount, setSlamCount] = useState(0);
  const resetCounter = () => setSlamCount(0);
  const highestMagnitudeRef = useRef(0);
  const lastSlamTime = useRef(0);
  const subscription = useRef<EventSubscription | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const bannerHeight = useSharedValue(0);
  // ==============================
  // AUDIO PLAYERS
  // ==============================
  const player = useAudioPlayer(Audios.Objection);
  const playAudio = () => {
    player.seekTo(0);
    player.play();
  };
  // ==============================
  // ANIMATIONS
  // ==============================
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
  // ==============================
  // ACCELEROMETER LISTENER
  // ==============================
  const startListening = () => {
    Accelerometer.setUpdateInterval(50);
    subscription.current = Accelerometer.addListener(({ x, y, z }) => {
      const gMagnitude = Math.sqrt(x * x + y * y + z * z);
      const linearAcceleration = Math.abs(gMagnitude - 1) * 9.81;
      const formattedAcceleration = Number(linearAcceleration.toFixed(2));
      setLastMagnitude(formattedAcceleration);
      if (formattedAcceleration > highestMagnitudeRef.current) {
        highestMagnitudeRef.current = formattedAcceleration;
      }
      const now = Date.now();
      // Detect slam: high magnitude + debounce check
      if (
        linearAcceleration > sensitivity &&
        now - lastSlamTime.current > DEBOUNCE_TIME
      ) {
        lastSlamTime.current = now;
        setSlamCount((prev) => prev + 1);
        animateSlam();
        playAudio();
      }
    });
    setIsListening(true);
  };
  const stopListening = () => {
    subscription.current && subscription.current.remove();
    subscription.current = null;
    setIsListening(false);
  };
  const adjustSensitivity = (amount) => {
    setSensitivity((prev) => Math.max(1, Math.min(50, prev + amount)));
  };
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);
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
          {/* APP TITLE */} <Text style={styles.title}>Objection!</Text>
          <Text style={styles.subtitle}>
            This app calculates the magnitude of your phone's acceleration and
            play the Objection audio when a "slam" is detected.
          </Text>
          {/* OBJECTION IMAGE BUTTON */}
          <TouchableOpacity onPress={() => playAudio()}>
            <Image source={Images.Objection} />
          </TouchableOpacity>
          {/* OBJECTION COUNTER */}
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
          {/* CURRENT MAGNITUDE */}
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Current Magnitude</Text>
            <Text style={styles.infoValue}>{lastMagnitude} m/s²</Text>
            <Text style={styles.infoLabel}>Highest Magnitude</Text>
            <Text style={styles.infoValue}>
              {highestMagnitudeRef.current} m/s²
            </Text>
          </View>
          {/* SENSITIVITY CONTROLS */}
          <View style={styles.sensitivityContainer}>
            <Text style={styles.infoLabel}>Sensitivity Threshold</Text>
            <View style={styles.sensitivityControls}>
              <TouchableOpacity
                style={styles.sensitivityButton}
                onPress={() => adjustSensitivity(-1)}
              >
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.sensitivityValue}>{sensitivity} m/s²</Text>
              <TouchableOpacity
                style={styles.sensitivityButton}
                onPress={() => adjustSensitivity(1)}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sensitivityHint}>Lower = more sensitive</Text>
          </View>
          {/* CONTROL BUTTONS */}
          <View style={styles.buttonContainer}>
            <Button
              style={isListening ? styles.buttonActive : undefined}
              onPress={isListening ? stopListening : startListening}
            >
              {isListening ? "Stop Listening" : "Start Listening"}
            </Button>
            <Button style={styles.buttonSecondary} onPress={resetCounter}>
              Reset Counter
            </Button>
          </View>
          <StatusBar style="dark" />
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
  title: { fontSize: 32, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 40,
    textAlign: "center",
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
  counterLabel: { fontSize: 16, color: "#888", marginBottom: 8 },
  counterValue: { fontSize: 72, fontWeight: "bold", color: "#ff3b30" },
  infoBox: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
    minWidth: 200,
  },
  infoLabel: { fontSize: 14, color: "#888", marginBottom: 8 },
  infoValue: { fontSize: 24, fontWeight: "600", color: "#fff" },
  sensitivityContainer: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
    minWidth: 250,
  },
  sensitivityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 12,
  },
  sensitivityButton: {
    backgroundColor: "#333",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  sensitivityValue: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
    minWidth: 100,
    textAlign: "center",
  },
  sensitivityHint: { fontSize: 12, color: "#666", marginTop: 8 },
  buttonContainer: { width: "100%", gap: 12, marginBottom: 20 },
  button: {
    backgroundColor: "#333",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonActive: { backgroundColor: "#ff3b30" },
  buttonSecondary: { backgroundColor: "#1a1a1a" },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#333" },
  statusText: { color: "#888", fontSize: 14 },
});
