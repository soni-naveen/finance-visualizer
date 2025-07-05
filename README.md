# Personal Finance Visualizer

A simple and responsive web application to track and visualize your personal finances. Built with **Next.js**, **React**, **MongoDB**, **Recharts**, and **shadcn/ui**.

---

## Features

- Add, edit, and delete transactions (with amount, date, and description)
- Categorize transactions using predefined categories
- View a transaction list with recent activity
- Visualize monthly expenses using bar charts
- Category-wise expense breakdown using pie charts
- Set monthly budgets per category
- Compare actual spending vs budgeted amount
- Display summary cards for:
  - Total expenses
  - Category breakdown
  - Recent transactions
- Basic form validation and error handling
- Clean and responsive UI

---

## Tech Stack

- **Framework**: Next.js (App Router)
- **UI**: React, TailwindCSS, shadcn/ui
- **Data Visualization**: Recharts
- **Database**: MongoDB (via Mongoose or direct driver)
- **State Management**: React Hooks

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/soni-naveen/finance-visualizer.git
cd finance-visualizer
```

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create a .env file in the root directory and add your MongoDB connection string:

```bash
MONGODB_URI=your_mongodb_connection_string
```

### Run the app

```bash
npm run dev
```
