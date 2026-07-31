import dotenv from "dotenv";
import app from "./app.js";
import { intializeDatabase } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    intializeDatabase();
    console.log(`Server is listening to port ${PORT}`)
})
