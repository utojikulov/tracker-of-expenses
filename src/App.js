import { useState } from "react"
import { Button, Stack } from "react-bootstrap"
import Container from "react-bootstrap/Container"
import AddBudgetModal  from "./components/AddBudgetModal.js"
import AddExpenseModal  from "./components/AddExpenseModal.js"
import ViewExpensesModal from "./components/ViewExpensesModal.js"
import BudgetCard from "./components/BudgetCard.js"
import { useBudgets, UNCATEGORIZED_BUDGET_ID } from "./contexts/BudgetsContext.js"
import UncategorizedBudgetCard from "./components/UncategorizedBudgetCard.js"
import TotalBudgetCard from "./components/TotalBudgetCard.js"

function App() {
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false)
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)
  const [addExpenseModalBudgetId, setAddExpenseModalBudgetId] = useState()
  const [viewExpensesModalBudgetId, setViewExpensesModalBudgetId] = useState()
  const {budgets, getBudgetExpenses} = useBudgets()


  function openAddExpenseModal(budgetId) {
    setShowAddExpenseModal(true)
    setAddExpenseModalBudgetId(budgetId)
  }

  return (
    <>
      <Container className="my-4">
       <Stack direction="horizontal" gap="2" className="mb-4">
          <h1 className="me-auto">Budgets</h1>
          <Button variant="primary" onClick={() => setShowAddBudgetModal(true)}>Add Budget</Button>
          <Button variant="outline-primary 2" onClick={openAddExpenseModal}>Add Expense</Button>
        </Stack>

          <div
            style={{
            display:"grid",
              gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",
              gap:"1rem",
              alignItems:"flex-start",
            }}
          >
            {budgets.map(budget => {
              const amount = getBudgetExpenses(budget.id).reduce((total, expense) => total + expense.amount, 0)
              return (
                <BudgetCard
                  key={budget.id}
                  name={budget.name}
                  amount={amount}
                  max={budget.max}
                  onAddExpenseClick={() => openAddExpenseModal(budget.id)}
                  onViewExpensesClick={() => setViewExpensesModalBudgetId(budget.id)}
                />
              )
            })}
            <UncategorizedBudgetCard
              onAddExpenseClick={() => openAddExpenseModal}
              onViewExpensesClick={() => setViewExpensesModalBudgetId(UNCATEGORIZED_BUDGET_ID)}
            />
            <TotalBudgetCard />
          </div>
      </Container>

    <AddBudgetModal
      show={showAddBudgetModal}
      handleClose={() => setShowAddBudgetModal(false) }
    />

    <AddExpenseModal
      show={showAddExpenseModal}
      defaultBudgetId={addExpenseModalBudgetId}
      handleClose={() => setShowAddExpenseModal(false) }
    />

    <ViewExpensesModal
      budgetId={viewExpensesModalBudgetId}
      handleClose={() => setViewExpensesModalBudgetId()}
    />
  </>
  )
} export default App