import { Pressable, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../utils/styles";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useNavigation } from "@react-navigation/native";
import { APP_SCREENS } from "../../utils/constants";

dayjs.extend(advancedFormat);

function ExpenseItem({ id, description, amount, date }) {
  const navigation = useNavigation();

  function expensePressHandler() {
    navigation.navigate(APP_SCREENS?.MANAGE_EXPENSE, { expenseId: id });
  }

  return (
    <Pressable
      onPress={expensePressHandler}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={styles.expenseItem}>
        <View>
          <Text style={[styles.textBase, styles.description]}>
            {description}
          </Text>
          <Text style={styles.textBase}>
            {dayjs(date).format("Do MMM, YY")}
          </Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>{amount?.toFixed(2)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default ExpenseItem;

const styles = StyleSheet.create({
  expenseItem: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: GlobalStyles.colors.primary500,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 6,
    elevation: 3,
    shadowColor: GlobalStyles.colors.gray500,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
  },
  pressed: {
    opacity: 0.5,
  },
  textBase: {
    color: GlobalStyles.colors.primary50,
  },
  description: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: "bold",
  },
  amountContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    minWidth: 80,
  },
  amount: {
    color: GlobalStyles.colors.primary500,
    fontWeight: "bold",
  },
});
