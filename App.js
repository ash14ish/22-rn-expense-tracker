import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { APP_SCREENS } from "./utils/constants";
import AllExpenses from "./screens/AllExpenses";
import RecentExpenses from "./screens/RecentExpenses";
import ManageExpenses from "./screens/ManageExpense";
import { GlobalStyles } from "./utils/styles";
import { Ionicons } from "@expo/vector-icons";
import IconButton from "./components/UI/IconButton";
import ExpensesContextProvider from "./store/expenses-context";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Alert, Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function ExpensesOverview() {
  return (
    <BottomTabs.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: "white",
        tabBarStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        tabBarActiveTintColor: GlobalStyles.colors.accent500,
        headerRight: ({ tintColor }) => (
          <IconButton
            icon="add"
            size={24}
            color={tintColor}
            onPress={() => navigation.navigate(APP_SCREENS?.MANAGE_EXPENSE)}
          />
        ),
      })}
    >
      <BottomTabs.Screen
        name={APP_SCREENS?.RECENT_EXPENSES}
        component={RecentExpenses}
        options={{
          title: "Recent Expenses",
          tabBarLabel: "Recent",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hourglass" color={color} size={size} />
          ),
        }}
      />

      <BottomTabs.Screen
        name={APP_SCREENS?.ALL_EXPENSES}
        component={AllExpenses}
        options={{
          title: "All Expenses",
          tabBarLabel: "All",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    const subscription1 = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log(
          "notification received:: ",
          notification.request.content.data
        );
      }
    );
    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(
          "notification interacted:: ",
          response.notification.request.content.data
        );
      }
    );

    return () => {
      subscription1.remove();
      subscription2.remove();
    };
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

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    }

    configureNotificationsPermissions();
  }, []);

  return (
    <>
      <StatusBar style="light" />

      <ExpensesContextProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
              headerTintColor: "white",
            }}
          >
            <Stack.Screen
              name={APP_SCREENS?.EXPENSES_OVERVIEW}
              component={ExpensesOverview}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name={APP_SCREENS?.MANAGE_EXPENSE}
              component={ManageExpenses}
              options={{
                presentation: "modal",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ExpensesContextProvider>
    </>
  );
}
