import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { io } from "socket.io-client";
import "./transactions.css";

const Transactions = ({ darkMode }) => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [socket, setSocket] = useState(null);

  // Initialize WebSocket
  useEffect(() => {
    const s = io("http://localhost:5000");
    setSocket(s);

    s.on("transactionUpdated", () => {
      fetchTransactions();
    });

    return () => s.disconnect();
  }, []);

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/transactions");
      const data = await res.json();
      if (data.success && Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setTransactions([]);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Add a new empty row
  const handleAddRow = () => {
    const newRow = {
      id: `new-${Date.now()}`,
      description: "",
      amount: 0,
      type: "credit",
      status: "Pending",
      source: "",
      account_id: 1,
      isNew: true,
      created_at: new Date().toISOString(),
    };
    setTransactions([newRow, ...transactions]);
  };

  // Edit a field
  const handleEditField = (id, field, value) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  // Save transaction
  const handleSaveTransaction = async (t) => {
    try {
      const payload = {
        description: t.description,
        amount: parseFloat(t.amount),
        type: t.type,
        status: t.status,
        source: t.source,
        account_id: t.account_id,
      };

      let res;
      if (t.isNew) {
        res = await fetch("http://localhost:5000/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`http://localhost:5000/api/transactions/${t.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        console.error("Error saving transaction:", data);
        return alert(data.error || "Failed to save transaction");
      }

      setTransactions((prev) =>
        prev.map((tr) =>
          tr.id === t.id || (t.isNew && tr.id === t.id)
            ? { ...data.transaction, isNew: false }
            : tr
        )
      );

      if (socket) socket.emit("transactionUpdated", data.transaction);
    } catch (err) {
      console.error("Failed to save transaction:", err);
      alert("Failed to save transaction. Check backend connection.");
    }
  };

  // Export to Excel
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(transactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "transactions.xlsx");
  };

  const filteredTransactions = transactions.filter(
    (t) =>
      t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.source?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`transactions-page ${darkMode ? "dark" : ""}`}>
      <div className={`transactions-header ${darkMode ? "dark" : ""}`}>
        <h2>Transactions Activity</h2>
        <div className="actions">
          <input
            type="text"
            placeholder="Search now..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={darkMode ? "dark-input" : ""}
          />
          <button
            className={`export-btn ${darkMode ? "dark-btn" : ""}`}
            onClick={handleExport}
          >
            Export
          </button>
          <button
            className={`pay-btn ${darkMode ? "dark-btn" : ""}`}
            onClick={handleAddRow}
          >
            + Add
          </button>
        </div>
      </div>

      <table className={`transactions-table ${darkMode ? "dark-table" : ""}`}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Status</th>
            <th>Source</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((t, index) => (
            <tr
              key={t.id}
              style={{
                animation: `fadeIn 0.3s ease forwards`,
                animationDelay: `${index * 0.05}s`,
                opacity: 0,
              }}
            >
              <td>
                <input
                  type="date"
                  value={
                    t.created_at
                      ? new Date(t.created_at).toISOString().substr(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    handleEditField(t.id, "created_at", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={t.description || ""}
                  onChange={(e) =>
                    handleEditField(t.id, "description", e.target.value)
                  }
                />
              </td>
              <td>
                <select
                  value={t.status || "Pending"}
                  onChange={(e) =>
                    handleEditField(t.id, "status", e.target.value)
                  }
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={t.source || ""}
                  onChange={(e) =>
                    handleEditField(t.id, "source", e.target.value)
                  }
                />
              </td>
              <td>
                <select
                  value={t.type || "credit"}
                  onChange={(e) =>
                    handleEditField(t.id, "type", e.target.value)
                  }
                >
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
              </td>
              <td>
                <input
                  type="number"
                  value={t.amount || 0}
                  onChange={(e) =>
                    handleEditField(t.id, "amount", e.target.value)
                  }
                />
              </td>
              <td>
                <button onClick={() => handleSaveTransaction(t)}>Save</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
