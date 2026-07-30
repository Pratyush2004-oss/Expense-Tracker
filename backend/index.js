import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { intializeDatabase } from "./config/db.js";
dotenv.config();
const app = express()
app.use(express.json())
app.use(cors())
const PORT = process.env.PORT

import AuthRouter from "./routes/user.route.js";
import TransactionRouter from "./routes/transaction.route.js";

app.use('/api/auth', AuthRouter);
app.use('/api/transaction', TransactionRouter);

app.listen(PORT, () => {
    intializeDatabase();
    console.log(`Server is listening to port ${PORT}`)
})