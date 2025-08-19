// About.jsx
import React from "react";
import "./About.css";

const About = () => {
  const features = [
    {
      title: "📊 Dashboard",
      description:
        "Displays an overview of balances, charts, and recent activities with real-time updates.",
    },
    {
      title: "💸 Transactions",
      description:
        "Manages income and expenses with filtering, sorting, and detailed history tracking.",
    },
    {
      title: "🏦 Accounts",
      description:
        "Shows all your accounts with balances and allows adding or managing accounts.",
    },
    {
      title: "⚙️ Settings",
      description:
        "Customize themes, switch dark/light mode, and personalize your experience.",
    },
    {
      title: "🌓 Dark Mode",
      description:
        "Toggle between light and dark themes for better visual comfort and aesthetics.",
    },
    {
      title: "📂 Reports",
      description:
        "Generate monthly or yearly financial reports with detailed analytics.",
    },
    {
      title: "🔒 Security",
      description:
        "Keeps your data safe with encrypted storage and secure login features.",
    },
    {
      title: "🔔 Notifications",
      description:
        "Stay updated with reminders and alerts about transactions or balance limits.",
    },
    {
      title: "🤝 Support",
      description:
        "Contact support or read FAQs to resolve issues and learn features quickly.",
    },
  ];

  return (
    <div className="about-container">
      <h1 className="about-title"> About Our Expence-Tracker</h1>
      <p className="about-subtitle">
        A modern, responsive, and secure finance management application designed
        to simplify your financial journey.
      </p>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
