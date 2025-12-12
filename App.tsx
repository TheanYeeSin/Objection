import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Images } from "./assets/images";
import { useAudioPlayer } from "expo-audio";
import { Audios } from "./assets/audios";

export default function App() {
  const player = useAudioPlayer(Audios.Objection);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          player.seekTo(0);
          player.play();
        }}
      >
        <Image source={Images.Objection} />
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
});
