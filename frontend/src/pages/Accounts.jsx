// src/pages/Accounts.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Accounts.css";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [showNewAccountBox, setShowNewAccountBox] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountType, setNewAccountType] = useState("cash");
  const [editingId, setEditingId] = useState(null);
  const [balanceInput, setBalanceInput] = useState("");

  const fetchAccounts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/accounts");
      const data = await res.json();
      if (data.success && Array.isArray(data.accounts)) {
        setAccounts(
          data.accounts.map((acc) => ({
            ...acc,
            balance: acc.balance != null ? parseFloat(acc.balance) : 0,
          }))
        );
      }
    } catch (err) {
      console.error("❌ Error fetching accounts:", err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleAddAccount = async () => {
    if (!newAccountName.trim()) return alert("Enter account name");

    try {
      const res = await fetch("http://localhost:5000/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newAccountName.trim(), type: newAccountType }),
      });

      const data = await res.json();
      if (res.status === 201 && data.success) {
        const newAcc = {
          ...data.account,
          balance: data.account.balance != null ? parseFloat(data.account.balance) : 0,
        };
        setAccounts([newAcc, ...accounts]);
        setNewAccountName("");
        setShowNewAccountBox(false);
      } else {
        alert(data.error || "Failed to create account");
      }
    } catch (err) {
      console.error("❌ Error creating account:", err);
      alert("Failed to create account. Check backend.");
    }
  };

  const handleAddMoney = (account) => {
    setEditingId(account.id);
    setBalanceInput("");
  };

  const handleSaveMoney = async (id) => {
    const amount = parseFloat(balanceInput);
    if (isNaN(amount) || amount <= 0) return alert("Enter valid amount");

    try {
      const res = await fetch("http://localhost:5000/api/accounts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, amount }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || "Failed to add money");

      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === id ? { ...acc, balance: parseFloat(data.account.balance) } : acc
        )
      );

      setEditingId(null);
      setBalanceInput("");
    } catch (err) {
      console.error("❌ Error adding money:", err);
      alert("Failed to add money. Check backend.");
    }
  };

  return (
    <div className="accounts-page">
      <button className="show-add-btn" onClick={() => setShowNewAccountBox(!showNewAccountBox)}>
        + Create New Account
      </button>

      <AnimatePresence>
        {showNewAccountBox && (
          <motion.div
            className="new-account-box"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <input
              type="text"
              placeholder="Account Name"
              value={newAccountName}
              onChange={(e) => setNewAccountName(e.target.value)}
            />
            <select value={newAccountType} onChange={(e) => setNewAccountType(e.target.value)}>
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
              <option value="credit">Credit</option>
              <option value="wallet">Wallet</option>
              <option value="other">Other</option>
            </select>
            <button onClick={handleAddAccount}>Create</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accounts Boxes */}
      <div className="accounts-box-container">
        {accounts.map((acc) => (
          <motion.div
            className="account-box"
            key={acc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3>{acc.name}</h3>
            <p>Type: {acc.type}</p>
            <p>
              Balance:{" "}
              {editingId === acc.id ? (
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={balanceInput}
                  onChange={(e) => setBalanceInput(e.target.value)}
                  placeholder="Enter amount"
                />
              ) : (
                `$${acc.balance.toFixed(2)}`
              )}
            </p>
            {editingId === acc.id ? (
              <div className="account-actions">
                <button onClick={() => handleSaveMoney(acc.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => handleAddMoney(acc)}>Add Money</button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Accounts;
