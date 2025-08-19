// src/services/expenseService.js
const API_URL = "http://localhost:5000/api/transactions";

export const fetchExpenses = async () => {
  const response = await fetch(API_URL);
  const data = await response.json();
  return data;
};

export const addExpense = async (expense) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
  const data = await response.json();
  return data;
};
