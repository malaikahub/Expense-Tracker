// routes/transactions.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

// ------------------------------
// GET all transactions
// ------------------------------
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, a.name AS account_name
       FROM transactions t
       LEFT JOIN accounts a ON t.account_id = a.id
       ORDER BY t.created_at DESC`
    );
    res.json({ success: true, transactions: result.rows });
  } catch (err) {
    console.error("❌ Error fetching transactions:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------------------
// POST create new transaction
// ------------------------------
router.post("/", async (req, res) => {
  try {
    let { description, amount, type, account_id, status, source } = req.body;

    // Validation & defaults
    if (!description || !type || !account_id || amount === undefined) {
      return res.status(400).json({
        error: "Description, type, amount, and account_id are required",
      });
    }

    type = type.toLowerCase();
    if (!["credit", "debit"].includes(type)) {
      return res.status(400).json({ error: "Type must be 'credit' or 'debit'" });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: "Amount must be a positive number" });
    }

    status = status || "Pending";
    source = source || "manual";

    // Insert into database
    const result = await pool.query(
      `INSERT INTO transactions
        (description, amount, type, status, source, account_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [description, numericAmount, type, status, source, account_id]
    );

    res.status(201).json({ success: true, transaction: result.rows[0] });
  } catch (err) {
    console.error("❌ Error creating transaction:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------------------
// PUT update existing transaction
// ------------------------------
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let { description, amount, type, status, source, account_id } = req.body;

    // Validation & defaults
    if (!description || !type || amount === undefined) {
      return res.status(400).json({ error: "Description, type, and amount are required" });
    }

    type = type.toLowerCase();
    if (!["credit", "debit"].includes(type)) {
      return res.status(400).json({ error: "Type must be 'credit' or 'debit'" });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: "Amount must be a positive number" });
    }

    status = status || "Pending";
    source = source || "manual";
    account_id = account_id || 1;

    // Update in database
    const result = await pool.query(
      `UPDATE transactions
       SET description = $1,
           amount = $2,
           type = $3,
           status = $4,
           source = $5,
           account_id = $6
       WHERE id = $7
       RETURNING *`,
      [description, numericAmount, type, status, source, account_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json({ success: true, transaction: result.rows[0] });
  } catch (err) {
    console.error("❌ Error updating transaction:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
