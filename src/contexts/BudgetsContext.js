import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from '../hooks/useLocalStorage'

const BudgetsContext = React.createContext();

export const UNCATEGORIZED_BUDGET_ID = "Uncategorized"

export function useBudgets() {
  return useContext(BudgetsContext);
}

export const BudgetsProvider = ({ children }) => {
  const [budgets, setBudgets] = useLocalStorage("budgets", [])
  const [expenses, setExpenses] = useLocalStorage("expenses", [])

  function getBudgetExpenses(budgetId) {
    return expenses.filter(expense => expense.budgetId === budgetId)
  }

  function addExpense ({ budgetId, amount, description }) {
    setExpenses(prevExpenses => {
      return [...prevExpenses, { id: uuidv4(), amount, description, budgetId}]
    })

  }

  function addBudget ({name, max}) {
    setBudgets(prevBudgets => {
      if (prevBudgets.find(budget => budget.name === name)) {
        return prevBudgets
      }
      return [...prevBudgets, { id: uuidv4(), name, max}]
    })
  }

  function deleteBudget ({id}) {
    setExpenses(prevExpenses => {
      return prevExpenses.map(expense => {
        if (expense.budgetId !== id) return expense
        return {...expense, budgetId : UNCATEGORIZED_BUDGET_ID}
      })
    })


    setBudgets(prevBudgets => {
      return prevBudgets.filter(budget => budget.id !== id)
    })
  }

  function deleteExpense({id}) {
    setExpenses(prevExpenses => {
      return prevExpenses.filter(expense => expense.id !== id)
    })
  }

  return (
    <BudgetsContext.Provider value={{
      budgets,
      expenses,
      getBudgetExpenses,
      addBudget,
      addExpense,
      deleteExpense,
      deleteBudget
    }}>
      {children}
    </BudgetsContext.Provider>
  )
}
