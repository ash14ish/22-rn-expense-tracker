import { StyleSheet, View, Text } from "react-native";
import { GlobalStyles } from "../../utils/styles";
import ExpensesList from "./ExpensesList";
import ExpensesSummary from "./ExpensesSummary";
import Loader from "../UI/Loader";
import { useEffect, useState } from "react";

function ExpensesOutput({ expenses, expensesPeriod, fallbackText }) {
  const [isFetching, setIsFetching] = useState(true);

  let content = <Text style={styles.infoText}>{fallbackText}</Text>;

  useEffect(() => {
    setTimeout(() => setIsFetching(false), 1500);
  }, []);

  if (expenses.length > 0) {
    content = <ExpensesList expenses={expenses} />;
  }

  return (
    <Loader isFetching={isFetching}>
      <View style={styles.container}>
        <ExpensesSummary expenses={expenses} periodName={expensesPeriod} />
        {content}
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
});
