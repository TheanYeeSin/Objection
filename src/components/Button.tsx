import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

// ==============================
// PROPS
// ==============================
interface Props {
  style?: ViewStyle;
  onPress: () => void;
  children: React.ReactNode;
}

// ==============================
// COMPONENT
// ==============================

/**
 * Generic button component.
 */
export const Button: React.FC<Props> = ({ style, onPress, children }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
};

// ==============================
// STYLES
// ==============================
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#333",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Ace-Attorney",
    color: "#fff",
    fontSize: 20,
  },
});
