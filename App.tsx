import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Images } from "./assets/images";

export default function App() {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          console.log("Objection!");
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
