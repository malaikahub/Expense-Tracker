import React, { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import CountUp from "react-countup";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import "./Dashboard.css";

const COLORS = ["#16a34a", "#dc2626"];

export default function Dashboard({ darkMode }) {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    monthlyIncome: 0,
    totalBalance: 0,
    totalExpense: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // ===== Fetch transactions =====
  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/transactions");
      const data = await res.json();
      const cleanData = Array.isArray(data.transactions)
        ? data.transactions.map(t => ({ ...t, amount: parseFloat(t.amount) || 0 }))
        : [];
      setTransactions(cleanData);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setTransactions([]);
    }
  };

  // ===== Fetch accounts =====
  const fetchAccounts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/accounts");
      const data = await res.json();
      const cleanAccounts = Array.isArray(data.accounts)
        ? data.accounts.map(acc => ({ ...acc, balance: parseFloat(acc.balance) || 0 }))
        : [];
      setAccounts(cleanAccounts);
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
      setAccounts([]);
    }
  };

  // ===== Fetch dashboard totals =====
  const fetchDashboard = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/dashboard");
      const data = await res.json();
      if (data.success) {
        setDashboardData({
          monthlyIncome: parseFloat(data.monthlyIncome) || 0,
          totalBalance: parseFloat(data.balance) || 0,
          totalExpense: parseFloat(data.expenses) || 0,
        });
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  };

  // ===== Initial fetch & WebSocket setup =====
  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
    fetchDashboard();

    const socket = io("http://localhost:5000");
    socket.on("dashboardUpdate", () => {
      fetchTransactions();
      fetchAccounts();
      fetchDashboard();
    });

    return () => socket.disconnect();
  }, []);

  // ===== Line chart data =====
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const lineData = monthNames.map((m, i) => ({
    name: m,
    amount: transactions
      .filter(t => new Date(t.created_at).getMonth() === i)
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
  }));

  // ===== Pie chart data =====
  const pieData = [
    { name: "Income", value: dashboardData.monthlyIncome },
    { name: "Expenses", value: dashboardData.totalExpense }
  ];

  const lineStroke = "#2563eb";
  const gridStroke = darkMode ? "#555" : "#ccc";
  const textColor = darkMode ? "#f5f5f5" : "#000";

  // ===== Filter transactions =====
  const filteredTransactions = transactions.filter(
    t =>
      t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.source?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`dashboard-page ${darkMode ? "dark" : ""}`}>
      {/* ===== Dashboard Cards ===== */}
      <section className="dashboard-home">
        <div className="dashboard-box home-content">
          <h1 style={{ color: "#8b4513" }}>Dashboard</h1>
          <p style={{ color: "#8b4513" }}>Monitor your financial activities</p>

          <div className="row row-3">
            <div className={`card ${darkMode ? "dark" : ""}`}>
              <p className="card-title">Total Balance</p>
              <h2 className="card-value balance">
                GHS <CountUp end={dashboardData.totalBalance} duration={1.5} decimals={2} separator="," />
              </h2>
            </div>
            <div className={`card ${darkMode ? "dark" : ""}`}>
              <p className="card-title">Monthly Income</p>
              <h2 className="card-value income">
                GHS <CountUp end={dashboardData.monthlyIncome} duration={1.5} decimals={2} separator="," />
              </h2>
            </div>
            <div className={`card ${darkMode ? "dark" : ""}`}>
              <p className="card-title">Total Expense</p>
              <h2 className="card-value expense">
                GHS <CountUp end={dashboardData.totalExpense} duration={1.5} decimals={2} separator="," />
              </h2>
            </div>
          </div>

          <div className="row row-2">
            <div className={`chart-box graph-box ${darkMode ? "dark" : ""}`}>
              <h3 style={{ color: textColor }}>Transaction Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="name" stroke={textColor} />
                  <YAxis stroke={textColor} />
                  <Tooltip contentStyle={{ backgroundColor: darkMode ? "#333" : "#fff", color: textColor }} />
                  <Line type="monotone" dataKey="amount" stroke={lineStroke} strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className={`chart-box pie-box ${darkMode ? "dark" : ""}`}>
              <h3 style={{ color: textColor }}>Summary</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" outerRadius={100} label>
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Transactions & Accounts Table ===== */}
      <section className="dashboard-transactions">
        <div className={`dashboard-box ${darkMode ? "dark" : ""}`}>
          <h2 style={{ color: textColor }}>Transactions & Accounts</h2>
          <p style={{ color: textColor }}>Your latest transactions and accounts summary.</p>

          <div className="tables-horizontal">
            {/* Transactions Table */}
            <div className="table-section transactions-section">
              <h3 style={{ color: textColor }}>Transactions</h3>
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={darkMode ? "dark-input" : ""}
                style={{ marginBottom: "10px", width: "90%" }}
              />
              <div className="table-wrapper">
                <table className={`transactions-table ${darkMode ? "dark" : ""}`}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Source</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan="5">No transactions found</td>
                      </tr>
                    ) : (
                      filteredTransactions.map((t) => (
                        <motion.tr
                          key={t.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td>{t.created_at ? new Date(t.created_at).toLocaleDateString() : "—"}</td>
                          <td>{t.description || "—"}</td>
                          <td>
                            <span className={`status ${t.status?.toLowerCase() || "pending"}`}>
                              {t.status || "Pending"}
                            </span>
                          </td>
                          <td>{t.source || t.type || "—"}</td>
                          <td className={t.amount >= 0 ? "amount positive" : "amount negative"}>
                            {typeof t.amount === "number" ? t.amount.toFixed(2) : parseFloat(t.amount || 0).toFixed(2)}
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Accounts Table */}
            <div className="table-section accounts-section">
              <h3 style={{ color: textColor }}>Accounts</h3>
              <div className="table-wrapper">
                <table className={`accounts-table ${darkMode ? "dark" : ""}`}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Balance</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {accounts.length === 0 ? (
                        <tr>
                          <td colSpan="4">No accounts found</td>
                        </tr>
                      ) : (
                        accounts.map((acc) => (
                          <motion.tr
                            key={acc.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td>{acc.name}</td>
                            <td>{acc.type}</td>
                            <td>GHS {acc.balance.toFixed(2)}</td>
                            <td>{new Date(acc.created_at).toLocaleDateString()}</td>
                          </motion.tr>
                        ))
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
