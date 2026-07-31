import app from "../app.js";
import { intializeDatabase } from "../config/db.js";

// Ensure tables exist when the serverless function boots (idempotent).
// Top-level await guarantees tables exist before the first request is served
// (avoids a cold-start race where the first query hits a missing table).
await intializeDatabase();

// Vercel serverless entry — export the Express app, do NOT call app.listen().
export default app;
