import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ==============================
// PROPS
// ==============================
interface Props {
  children: React.ReactNode;
}

// ==============================
// COMPONENT
// ==============================

/**
 * SafeAreaView component.
 */
export const SafeAreaView: React.FC<Props> = ({ children }) => {
  const insets = useSafeAreaInsets();

  return <View style={{ paddingTop: insets.top }}>{children}</View>;
};
