import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav style={{ padding: "10px", background: "inherit", display: "flex", alignItems: "center" }}>
      <h2 style={{ marginRight: "20px" }}>💰 Expense Tracker</h2>

      {/* Navigation links */}
      <div style={{ display: "flex", gap: "15px" }}>
        <Link to="/">Dashboard</Link>
        <Link to="/transactions">Transactions</Link>
        <Link to="/accounts">Accounts</Link>
        <Link to="/about">About</Link>
      </div>

      {/* Dark mode toggle */}
      <button 
        onClick={() => setDarkMode(!darkMode)} 
        style={{ marginLeft: "auto", padding: "6px 12px", cursor: "pointer" }}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
    </nav>
  );
}

