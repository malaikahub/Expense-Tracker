// routes/accounts.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

// ------------------------------
// GET all accounts
// ------------------------------
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM accounts ORDER BY created_at DESC"
    );
    res.json({ success: true, accounts: result.rows });
  } catch (err) {
    console.error("❌ Error fetching accounts:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------------------
// POST create new account
// ------------------------------
router.post("/", async (req, res) => {
  try {
    const { name, type = "default", balance = 0 } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Account name is required" });
    }

    const numericBalance = parseFloat(balance);
    if (isNaN(numericBalance) || numericBalance < 0) {
      return res.status(400).json({ error: "Balance must be a non-negative number" });
    }

    const result = await pool.query(
      "INSERT INTO accounts (name, type, balance, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [name, type, numericBalance]
    );

    res.status(201).json({ success: true, account: result.rows[0] });
  } catch (err) {
    console.error("❌ Error creating account:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------------------
// PUT update account balance (overwrite)
// ------------------------------
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { balance } = req.body;

    if (balance === undefined) {
      return res.status(400).json({ error: "Balance is required" });
    }

    const numericBalance = parseFloat(balance);
    if (isNaN(numericBalance) || numericBalance < 0) {
      return res.status(400).json({ error: "Balance must be a non-negative number" });
    }

    const result = await pool.query(
      "UPDATE accounts SET balance = $1 WHERE id = $2 RETURNING *",
      [numericBalance, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.json({ success: true, account: result.rows[0] });
  } catch (err) {
    console.error("❌ Error updating balance:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------------------
// POST add money (increment balance)
// ------------------------------
router.post("/add", async (req, res) => {
  try {
    const { id, amount } = req.body;

    if (!id || amount === undefined) {
      return res.status(400).json({ error: "Account ID and amount are required" });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: "Amount must be a positive number" });
    }

    const result = await pool.query(
      "UPDATE accounts SET balance = balance + $1 WHERE id = $2 RETURNING *",
      [numericAmount, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.json({ success: true, account: result.rows[0] });
  } catch (err) {
    console.error("❌ Error adding money:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
