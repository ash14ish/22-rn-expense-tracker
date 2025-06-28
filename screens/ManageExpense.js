import { useContext, useLayoutEffect } from "react";
import { StyleSheet, View } from "react-native";
import IconButton from "../components/UI/IconButton";
import { GlobalStyles } from "../utils/styles";
import { ExpensesContext } from "../store/expenses-context";
import ExpenseForm from "../components/ExpensesOutput/ManageExpense/ExpenseForm";
import Loader from "../components/UI/Loader";
import { useState } from "react";
import * as Notifications from "expo-notifications";

function ManageExpense({ route, navigation }) {
  const [isFetching, setIsFetching] = useState(false);
  const expensesCtx = useContext(ExpensesContext);

  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;

  const selectedExpense = expensesCtx.expenses.find(
    (expense) => expense.id === editedExpenseId
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  async function deleteExpenseHandler() {
    setIsFetching(true);
    expensesCtx.deleteExpense(editedExpenseId);
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Expense Deleted",
        body: `Expense - ${selectedExpense?.description}`,
        data: selectedExpense,
      },
      trigger: { seconds: 1 },
    });

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsFetching(false);
    navigation.goBack();
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler(expenseData) {
    setIsFetching(true);
    if (isEditing) {
      expensesCtx.updateExpense(editedExpenseId, expenseData);
    } else {
      expensesCtx.addExpense(expenseData);
    }

    Notifications.scheduleNotificationAsync({
      content: {
        title: `Expense ${isEditing ? "Updated" : "Added"}`,
        body: `Expense - ${expenseData?.description}`,
        data: isEditing ? selectedExpense : expenseData,
      },
      trigger: { seconds: 1 },
    });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsFetching(false);
    navigation.goBack();
  }

  return (
    <Loader isFetching={isFetching}>
      <View style={styles.container}>
        <ExpenseForm
          submitButtonLabel={isEditing ? "Update" : "Add"}
          onSubmit={confirmHandler}
          onCancel={cancelHandler}
          defaultValues={selectedExpense}
        />

        {isEditing && (
          <View style={styles.deleteContainer}>
            <IconButton
              icon="trash"
              color={GlobalStyles.colors.error500}
              size={36}
              onPress={deleteExpenseHandler}
            />
          </View>
        )}
      </View>
    </Loader>
  );
}

export default ManageExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});
