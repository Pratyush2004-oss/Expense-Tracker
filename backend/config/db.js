import { neon } from "@neondatabase/serverless"
import dotenv from "dotenv"

dotenv.config();

const { PGUSER, PGHOST, PGDATABASE, PGPASSWORD } = process.env;

// create a SQL connectionusing ENV variables
export const sql = neon(
    `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
);

export const intializeDatabase = async () => {
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `
        //SCHEMA FOR TRANSACTIONS
        await sql`
        CREATE TABLE IF NOT EXISTS transactions(
        id VARCHAR(255) PRIMARY KEY,
        amount DECIMAL(10, 2) NOT NULL,
        transaction_type VARCHAR(255) NOT NULL CHECK (transaction_type IN ('Income', 'Expense')),
        category VARCHAR(255) NOT NULL
        CHECK (category IN ('Food', 'Transport', 'Entertainment', 'Health', 'Education', 'Other', 'Salary', 'Family', 'Refund', 'Freelance', 'Business')),
        title VARCHAR(255) NOT NULL,
        transaction_date DATE NOT NULL,
        payment_method VARCHAR(255) NOT NULL CHECK (payment_method IN ('Cash', 'Debit Card', 'Credit Card', 'Net Banking', 'UPI', 'Other')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id VARCHAR(255) NOT NULL,
        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
        `
        console.log("Database Initialized successfully")
    } catch (error) {
        console.log("Error in initializing database : ", error);
    }
}