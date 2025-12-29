import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// ==============================
// PROPS
// ==============================
interface Props {
  value: number;
  onChange: (amount: number) => void;
}

// ==============================
// COMPONENT
// ==============================

/**
 * Sensitivity control component.
 */
export const SensitivityControl: React.FC<Props> = ({ value, onChange }) => (
  <View style={styles.container}>
    <Text style={styles.label}>Sensitivity Threshold</Text>
    <View style={styles.controls}>
      <TouchableOpacity style={styles.button} onPress={() => onChange(-1)}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.value}>{value}</Text>
      <TouchableOpacity style={styles.button} onPress={() => onChange(1)}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
    <Text style={styles.hint}>Lower = more sensitive</Text>
  </View>
);

// ==============================
// STYLES
// ==============================
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    width: "80%",
  },
  label: {
    color: "#888",
    marginBottom: 8,
    fontFamily: "Ace-Attorney",
    fontSize: 20,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginBottom: 4,
  },
  button: {
    backgroundColor: "#333",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 20, fontFamily: "Ace-Attorney" },
  value: {
    color: "#fff",
    fontSize: 24,
    marginHorizontal: 12,
    fontFamily: "Ace-Attorney",
  },
  hint: { color: "#666", fontSize: 16, fontFamily: "Ace-Attorney" },
});
