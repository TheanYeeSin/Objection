import { View, Text, StyleSheet } from "react-native";

// ==============================
// PROPS
// ==============================
interface Props {
  title: string;
  value: string | number;
}

// ==============================
// COMPONENT
// ==============================

/**
 * Generic info box component.
 */
export const InfoBox: React.FC<Props> = ({ title, value }) => (
  <View style={styles.container}>
    <Text style={styles.label}>{title}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

// ==============================
// STYLES
// ==============================
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
    minWidth: 200,
  },
  label: { fontSize: 14, color: "#888", marginBottom: 8 },
  value: { fontSize: 24, fontWeight: "600", color: "#fff" },
});
