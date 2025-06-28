import * as Notifications from "expo-notifications";
import { Button, View } from "react-native";

export default function ButtonNotification() {
  async function sendNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📣 Test Notification",
        body: "This should appear if everything is configured.",
        data: { test: true },
      },
      trigger: { seconds: 2 }, // ✅ reliable trigger for Expo Go
    });
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Send Test Notification" onPress={sendNotification} />
    </View>
  );
}
