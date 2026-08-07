export const calculateBalance = (incomes = [], expenses = []) => {
  const totalIncome = incomes.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalExpense = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  return totalIncome - totalExpense;
};

export const isValidAmount = (amount) => {
  if (typeof amount !== 'number') return false;
  if (isNaN(amount)) return false;
  return amount >= 0;
};
