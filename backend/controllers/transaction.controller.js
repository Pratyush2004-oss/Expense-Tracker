import { v4 as uuid } from "uuid";
import { sql } from "../config/db.js";

// add transaction
export const addTransaction = async (req, res) => {
    try {
        // check for id and user
        const id = req.user;
        if (!id) return res.status(400).json({ success: false, message: "Unauthorized: No id found" })
        const user = await sql`
        SELECT name , email, created_at, id FROM users WHERE id = ${id} limit 1
        `
        if (user.length == 0) {
            return res.status(400).json({ success: false, message: "User does not exist" })
        }

        // check for req.body
        if (!req.body) {
            return res.status(400).json({ success: false, message: "Bad request" })
        }
        const { title, transaction_type, payment_method, amount, category, transaction_date } = req.body;
        if (!(title && transaction_type && payment_method && amount && category && transaction_date)) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        // check for transaction_type
        const transactionOptions = ["Income", "Expense"];
        if (!transactionOptions.includes(transaction_type)) {
            return res.status(400).json({ success: false, message: "Invalid transaction type" })
        }

        // check for category according to transaction_type
        const IncomeCategoryOptions = ["Salary", "Refund", "Freelance", "Family", "Other"];
        const ExpenseCategoryOptions = ["Food", "Transport", "Entertainment", "Health", "Education", "Business" , "Family", "Other"];

        if (transaction_type == "Income" && !IncomeCategoryOptions.includes(category)) return res.status(400).json({ success: false, message: "Invalid income category" });
        if (transaction_type == "Expense" && !ExpenseCategoryOptions.includes(category)) return res.status(400).json({ success: false, message: "Invalid expense category" });

        // check for payment method
        const paymentMethodOptions = ['Cash', 'Debit Card', 'Credit Card', 'Net Banking', 'UPI', 'Other']
        if(!paymentMethodOptions.includes(payment_method)){
            return res.status(400).json({
                success: false,
                message:"Invalid Payment method"
            })
        }

        // create id for transaction with UUID
        const transaction_id = uuid();

        // create new transaction 
        const newTransaction = await sql`
        INSERT INTO transactions ( id, title, transaction_type, payment_method, amount, category, transaction_date, user_id)
        VALUES (${transaction_id}, ${title}, ${transaction_type}, ${payment_method}, ${amount}, ${category}, ${new Date(transaction_date)}, ${user[0].id})
        `

        return res.status(200).json({ success: true, message: "Transaction added successfully" })
    } catch (error) {
        console.log("Error in add transaction controller: ", error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

// fetch transcations
export const fetchTransactions = async (req, res) => {
    try {
        // check for id and user
        const id = req.user;
        if (!id) return res.status(400).json({ success: false, message: "Unauthorized: No id found" })
        const user = await sql`
        SELECT name , email, created_at, id FROM users WHERE id = ${id} limit 1
        `
        if (user.length == 0) {
            return res.status(400).json({ success: false, message: "User does not exist" })
        }

        // get the month
        const { year_month } = req.params;
        if (!year_month) return res.status(400).json({ success: false, message: "Parameter year_month is required" })
        const year = year_month.split("-")[0];
        const month = year_month.split("-")[1];
        // fetch transactions
        const transactions = await sql`
        SELECT * FROM transactions WHERE user_id = ${user[0].id} 
        AND EXTRACT(YEAR FROM transaction_date) = ${year}
        AND EXTRACT(MONTH FROM transaction_date) = ${month}
        ORDER BY transaction_date DESC
        `
        // group the transactions according to the transaction date
        const groupedTransactions = Object.entries(transactions.reduce((acc, transaction) => {
            const date = transaction.transaction_date
            if(!acc[date]) {
                acc[date] = []
            }
            acc[date].push(transaction)
            return acc
        }, {})).map(([date, transactions]) => ({ date, transactions }));

        return res.status(200).json({ success: true, groupedTransactions })
    } catch (error) {
        console.log("Error in fetch transaction controller: ", error);
        return res.status(400).json({
            message: "Internal server error",
            success: false
        })
    }
}

// update transaction
export const updateTransaction = async (req, res) => {
    try {
        // check for id and user
        const id = req.user;
        if (!id) return res.status(400).json({ success: false, message: "Unauthorized: No id found" })
        const user = await sql`
        SELECT name , email, created_at, id FROM users WHERE id = ${id} limit 1
        `
        if (user.length == 0) {
            return res.status(400).json({ success: false, message: "User does not exist" })
        }
        // check for transaction_id
        const { transaction_id } = req.params;
        if (!transaction_id) {
            return res.status(400).json({ success: false, message: "transaction_id is required" })
        }
        // check for req.body
        if (!req.body) {
            return res.status(400).json({ success: false, message: "Bad request" })
        }
        const { title, transaction_type, payment_method, amount, category, transaction_date } = req.body;
        if (!(title && transaction_type && payment_method && amount && category && transaction_date)) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        // check for transaction_type
        const transactionOptions = ["Income", "Expense"];
        if (!transactionOptions.includes(transaction_type)) {
            return res.status(400).json({ success: false, message: "Invalid transaction type" })
        }

        // check for payment_method
        const paymentMethodOptions = ["Cash", "Credit Card", "Debit Card", "Online Payment"];
        if (!paymentMethodOptions.includes(payment_method)) {
            return res.status(400).json({ success: false, message: "Invalid payment method" })
        }

        // check for category according to transaction_type
        const IncomeCategoryOptions = ["Salary", "Refund", "Freelance", "Family", "Other"];
        const ExpenseCategoryOptions = ["Food", "Transport", "Entertainment", "Health", "Education", "Family", "Business", "Other"];

        if (transaction_type == "Income" && !IncomeCategoryOptions.includes(category)) return res.status(400).json({ success: false, message: "Invalid income category" });
        if (transaction_type == "Expense" && !ExpenseCategoryOptions.includes(category)) return res.status(400).json({ success: false, message: "Invalid expense category" });

        // update transaction
        const updatedTransaction = await sql`
        UPDATE transactions 
        SET title = ${title}, transaction_type = ${transaction_type}, payment_method = ${payment_method}, amount = ${amount}, category = ${category}, transaction_date = ${new Date(transaction_date)}
        WHERE id = ${transaction_id} AND user_id = ${user[0].id}
        `
        if (updatedTransaction.length == 0) {
            return res.status(400).json({ success: false, message: "Transaction does not exist" })
        }

        return res.status(200).json({ success: true, message: "Transaction updated successfully" })
    } catch (error) {
        console.log("Error in update transaction controller: ", error);
        return res.status(400).json({
            message: "Internal server error",
            success: false
        })
    }
}
// delete transaction
export const deleteTransaction = async (req, res) => {
    try {
        // check for id and user
        const id = req.user;
        if (!id) return res.status(400).json({ success: false, message: "Unauthorized: No id found" })
        const user = await sql`
        SELECT name , email, created_at, id FROM users WHERE id = ${id} limit 1
        `
        if (user.length == 0) {
            return res.status(400).json({ success: false, message: "User does not exist" })
        }
        // check for transaction_id
        const { transaction_id } = req.params;
        if (!transaction_id) {
            return res.status(400).json({ success: false, message: "transaction_id is required" })
        }
        // delete transaction
        const deletedTransaction = await sql`
        DELETE FROM transactions WHERE id = ${transaction_id} AND user_id = ${user[0].id}
        `
        if (deletedTransaction.length == 0) {
            return res.status(400).json({ success: false, message: "Transaction does not exist" })
        }

        return res.status(200).json({ success: true, message: "Transaction deleted successfully" })
    } catch (error) {
        console.log("Error in delete transaction controller: ", error);
        return res.status(400).json({
            message: "Internal server error",
            success: false
        })
    }

}