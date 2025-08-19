// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import pool from "./db.js"; // PostgreSQL pool
import transactionsRouter from "./routes/transactions.js";
import accountsRouter from "./routes/accounts.js";

// ---------- LOAD ENV VARIABLES ----------
dotenv.config();

// ---------- APP SETUP ----------
const app = express();
const PORT = process.env.PORT || 5000;

// ---------- MIDDLEWARE ----------
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle invalid JSON gracefully
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("❌ Invalid JSON:", err.message);
    return res.status(400).json({ error: "Invalid JSON format" });
  }
  next();
});

// ---------- SOCKET.IO SETUP ----------
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

io.on("connection", (socket) => {
  console.log("✅ Client connected via Socket.IO");

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});

// Helper to emit dashboard updates
const emitDashboardUpdate = async () => {
  try {
    const monthlyIncome = 50000; // can make dynamic later

    const balanceResult = await pool.query(
      `SELECT COALESCE(SUM(balance),0) AS total_balance FROM accounts`
    );
    const totalBalance = parseFloat(balanceResult.rows[0].total_balance);

    const expenseResult = await pool.query(
      `SELECT COALESCE(SUM(amount),0) AS total_expenses FROM transactions`
    );
    const totalExpenses = parseFloat(expenseResult.rows[0].total_expenses);

    io.emit("dashboardUpdated", {
      monthlyIncome,
      totalBalance,
      totalExpenses,
    });
  } catch (err) {
    console.error("❌ Emit dashboard update failed:", err.message);
  }
};

// ---------- ROUTES ----------
app.use("/api/accounts", accountsRouter);
app.use("/api/transactions", transactionsRouter);

app.get("/", (_req, res) => {
  res.send("🚀 API is running and connected to PostgreSQL (Neon)");
});

// ---------- DASHBOARD ENDPOINT ----------
app.get("/api/dashboard", async (_req, res) => {
  try {
    const monthlyIncome = 50000;

    const balanceResult = await pool.query(
      `SELECT COALESCE(SUM(balance),0) AS total_balance FROM accounts`
    );
    const totalBalance = parseFloat(balanceResult.rows[0].total_balance);

    const expenseResult = await pool.query(
      `SELECT COALESCE(SUM(amount),0) AS total_expenses FROM transactions`
    );
    const totalExpenses = parseFloat(expenseResult.rows[0].total_expenses);

    res.json({
      success: true,
      monthlyIncome,
      balance: totalBalance,
      expenses: totalExpenses,
    });
  } catch (err) {
    console.error("❌ Dashboard error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------- DB TEST ROUTES ----------
app.get("/api/test-db-connection", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, now: result.rows[0].now });
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/test-db", async (_req, res) => {
  try {
    const tablesResult = await pool.query(
      `SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`
    );

    const accountsCols = await pool.query(
      `SELECT column_name, data_type, column_default, is_nullable
       FROM information_schema.columns 
       WHERE table_name = 'accounts'`
    );

    const transactionsCols = await pool.query(
      `SELECT column_name, data_type, column_default, is_nullable
       FROM information_schema.columns 
       WHERE table_name = 'transactions'`
    );

    res.json({
      success: true,
      tables: tablesResult.rows.map(t => t.table_name),
      accounts_table: accountsCols.rows,
      transactions_table: transactionsCols.rows,
    });
  } catch (err) {
    console.error("❌ DB test error:", err.message);
    res.status(500).json({
      success: false,
      error: err.message,
      hint: "Check if accounts and transactions tables exist in DB",
    });
  }
});

// Sample transactions
app.get("/api/test-transactions", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM transactions ORDER BY created_at DESC LIMIT 5"
    );
    res.json({ success: true, sample: result.rows });
  } catch (err) {
    console.error("❌ Transactions test failed:", err.message);
    res.status(500).json({ error: "DB test failed" });
  }
});

// ---------- SOCKET EMIT AFTER TRANSACTION/ACCOUNT CHANGE ----------
app.post("/api/transactions/emit-update", async (_req, res) => {
  await emitDashboardUpdate();
  res.json({ success: true });
});

app.post("/api/accounts/emit-update", async (_req, res) => {
  await emitDashboardUpdate();
  res.json({ success: true });
});

// ---------- START SERVER ----------
server.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`   GET  /api/test-db-connection`);
  console.log(`   GET  /api/test-db`);
  console.log(`   GET  /api/dashboard`);
  console.log(`   GET  /api/accounts`);
  console.log(`   POST /api/accounts`);
  console.log(`   PUT  /api/accounts/:id`);
  console.log(`   POST /api/accounts/add`);
  console.log(`   GET  /api/transactions`);
  console.log(`   POST /api/transactions`);
  console.log(`   GET  /api/test-transactions`);
});
