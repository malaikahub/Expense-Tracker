// App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Accounts from "./pages/Accounts";
import About from "./pages/About";
import Footer from "./components/Footer"; 
import "./App.css"; // ✅ Global styles
import "aos/dist/aos.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) setDarkMode(JSON.parse(savedMode));
  }, []);

  // Apply dark mode globally
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark-mode"); // ✅ Apply to root
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <Router>
      <div 
        className={`app-container ${darkMode ? "dark" : "light"}`} 
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        {/* ✅ Navbar */}
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* ✅ Main Content */}
        <main style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Dashboard darkMode={darkMode} />} />
            <Route path="/transactions" element={<Transactions darkMode={darkMode} />} />
            <Route path="/accounts" element={<Accounts darkMode={darkMode} />} />
            <Route path="/about" element={<About darkMode={darkMode} />} />
          </Routes>
        </main>

        {/* ✅ Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
