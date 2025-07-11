# Personal Finance Visualizer
A simple and responsive web application to track and visualize your personal finances. Built with **Next.js**, **React**, **MongoDB**, **Recharts**, **Firebase Authentication**, and **shadcn/ui**.

Try it here : [financevisualizer.vercel.app](https://financevisualizer.vercel.app/)

---

## Features
- **User Authentication**: Secure sign-in/sign-up with Firebase Authentication
- **Protected Routes**: User-specific data with authentication-based access control
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
- **Database**: MongoDB
- **Authentication**: Firebase Authentication
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
Create a `.env` file in the root directory and add your configuration:

```bash
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_private_key
```

### Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and configure your preferred sign-in methods (In this project: Email/Password)
3. Get your Firebase configuration from Project Settings
4. Add the configuration to your `.env` file

### Run the App
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---
