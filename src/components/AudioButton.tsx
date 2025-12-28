import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { useAudioPlayer } from "expo-audio";

// ==============================
// PROPS
// ==============================
interface Props {
  source: any;
  audio: any;
}

// ==============================
// COMPONENT
// ==============================

/**
 * Button that plays audio when pressed.
 */
export const AudioButton: React.FC<Props> = ({ source, audio }) => {
  const player = useAudioPlayer(audio);

  const play = () => {
    player.seekTo(0);
    player.play();
  };

  return (
    <TouchableOpacity onPress={play} style={styles.button}>
      <Image source={source} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { marginVertical: 20, alignItems: "center" },
});
