import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import AuthRouter from "./routes/user.route.js";
import TransactionRouter from "./routes/transaction.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Health checks — handy for verifying the deployment is live
app.get("/", (req, res) => {
    res.json({ success: true, message: "Expense Tracker API is running" });
});
app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "OK", timestamp: new Date().toISOString() });
});

app.use("/api/auth", AuthRouter);
app.use("/api/transaction", TransactionRouter);

export default app;
