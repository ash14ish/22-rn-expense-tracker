import { StyleSheet, View, Text, Button } from "react-native";
import { GlobalStyles } from "../../utils/styles";
import ExpensesList from "./ExpensesList";
import ExpensesSummary from "./ExpensesSummary";
import Loader from "../UI/Loader";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";

function ExpensesOutput({ expenses, expensesPeriod, fallbackText }) {
  const [isFetching, setIsFetching] = useState(true);
  const [pushToken, setPushToken] = useState(null);

  let content = <Text style={styles.infoText}>{fallbackText}</Text>;

  useEffect(() => {
    setTimeout(() => setIsFetching(false), 1500);
  }, []);

  useEffect(() => {
    async function configureNotificationsPermissions() {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;
      if (finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        let finalStatus = status;
        if (finalStatus !== "granted") {
          Alert.alert(
            "Permissions Required",
            "Permissions for notifications will be required for expense management notifications."
          );
          return;
        }
      }

      try {
        const pushTokenData = await Notifications.getExpoPushTokenAsync();
        setPushToken(pushTokenData.data);
      } catch (error) {
        console.error("Failed to get push token:", error);
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
          sound: "default",
        });
      }
    }

    configureNotificationsPermissions();
  }, []);

  if (expenses.length > 0) {
    content = <ExpensesList expenses={expenses} />;
  }

  function sendPushNotificationHandler() {
    if (!pushToken) {
      return;
    }

    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        to: pushToken,
        title: "Push Notification",
        body: "This is to test the push notification",
      }),
    });
  }

  return (
    <Loader isFetching={isFetching}>
      <View style={styles.container}>
        <ExpensesSummary expenses={expenses} periodName={expensesPeriod} />
        {content}
        <View style={styles.pushButton}>
          <Button
            title="Push Notifications"
            color={GlobalStyles.colors.error500}
            onPress={sendPushNotificationHandler}
          />
        </View>
      </View>
    </Loader>
  );
}

export default ExpensesOutput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 0,
    backgroundColor: GlobalStyles.colors.primary700,
  },
  infoText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
  },
  pushButton: {
    marginVertical: 12,
    alignItems: "end",
    justifyContent: "flex-end",
  },
});
