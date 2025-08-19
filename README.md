# Expense-Tracker

A modern, responsive, and secure finance management application designed to help users track income, expenses, and manage accounts efficiently.

#Project Overview
The Expense Tracker Web App allows users to monitor their finances in real-time. Users can:

Track income and expenses

Manage multiple accounts

View dashboard summaries with graphs and charts

Export transactions

Enable dark mode for better user experience

<img width="1583" height="755" alt="image" src="https://github.com/user-attachments/assets/507849aa-40e6-4466-b10f-6e0578d1241b" />

#Features
**Dashboard:** Overview of balances, monthly income, total expenses, and recent transactions.

**Transactions:** Add, edit, save, filter, and export transaction data.

**Accounts:** Create accounts, add money, and manage balances.

#Frontend

Built with React for a responsive and dynamic user interface. Key frontend functionalities:

Libraries Used:

**React** – Component-based UI framework

**Framer Motion **– Smooth animations for tables and UI elements

**Recharts** – Line and pie charts for dashboard visualizations

**CountUp** – Animated counter for balances

**Socket.io-client** – Real-time updates for transactions

**XLSX** – Export transactions to Excel

**About Section:****** Overview of app features.

**Dark Mode:****** Toggle between light and dark themes.

#Components:

Navbar – Navigation menu with links to Dashboard, Transactions, Accounts, About.

<img width="1586" height="100" alt="image" src="https://github.com/user-attachments/assets/396e65c6-8843-44bb-8754-9040d1a475a0" />

Footer – Footer with basic info and copyright.

<img width="1586" height="411" alt="image" src="https://github.com/user-attachments/assets/acf9376f-8ca1-4410-ab09-d284b44ef194" />

Dashboard – Displays graphs, pie charts, and financial summaries.

<img width="1581" height="749" alt="image" src="https://github.com/user-attachments/assets/ad2da796-2a68-4250-af54-ae0495b0a75d" />

Transactions – Table view for transactions, search, export, and add/edit functionality.

<img width="1582" height="615" alt="image" src="https://github.com/user-attachments/assets/56af1063-47fe-4eb5-85dd-e8ffeb549f23" />

Accounts – Account boxes with balance management and adding new accounts.

<img width="1585" height="521" alt="image" src="https://github.com/user-attachments/assets/9fc984eb-4451-4e41-b946-e8ee62530d1d" />

About – Displays app features and description.

<img width="1585" height="737" alt="image" src="https://github.com/user-attachments/assets/bc6e471e-c2b0-4026-b254-76922c871905" />

Dark Mode – Toggle feature affecting all pages.

<img width="1579" height="751" alt="image" src="https://github.com/user-attachments/assets/0d2672cd-a61c-4a71-bcc9-300c5aea0bcb" />

#Backend

The backend is powered by Node.js with Express.js, handling all database operations and API endpoints.

****Libraries Used:****

Express – Server-side routing and API endpoints

PostgreSQL – Relational database for storing accounts and transactions

pg – PostgreSQL client for Node.js

**Socket.io** – Real-time updates for frontend

**Cors** – Handle cross-origin requests

**Dotenv** – Manage environment variables

****API Endpoints:****

**/api/transactions** – CRUD operations for transactions

**/api/accounts** – Create and manage accounts

**/api/accounts/add** – Add money to accounts

**/api/dashboard** – Fetch aggregated dashboard data

#Technologies Used

**Frontend:** React, Recharts, Framer Motion, CountUp, Socket.io-client, XLSX

**Backend:** Node.js, Express.js, PostgreSQL, pg, Socket.io, Cors, Dotenv

**Styling:** CSS modules with custom styles for dark mode, tables, cards, and charts


Graphs and Charts: Line chart for monthly transactions and pie chart for income vs. expenses.
