import { Platform, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles } from "../../utils/styles";

function IconButton({ icon, size, color, onPress }) {
  return (
    <View style={styles.rootContainer}>
      <Pressable
        android_ripple={{ color: GlobalStyles.colors.primary100 }}
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={styles.buttonContainer}>
          <Ionicons name={icon} size={size} color={color} />
        </View>
      </Pressable>
    </View>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  rootContainer: {
    borderRadius: "50%",
    ...(Platform.OS === "android" ? { overflow: "hidden" } : {}),
  },
  buttonContainer: {
    padding: 6,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  pressed: {
    opacity: 0.75,
  },
});
