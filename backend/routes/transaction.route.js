import express from "express"
import { addTransaction, deleteTransaction, fetchTransactions, updateTransaction } from "../controllers/transaction.controller.js"
import { isAuth } from "../middleware/isAuth.js"

const router = express.Router()

router.post('/add', isAuth, addTransaction)
router.get("/fetch/:year_month", isAuth, fetchTransactions)
router.put("/update/:transaction_id", isAuth, updateTransaction);
router.delete("/delete/:transaction_id", isAuth, deleteTransaction);

export default router