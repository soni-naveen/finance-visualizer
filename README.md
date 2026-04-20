# 💰 Personal Finance Visualizer

A simple, clean, and responsive web application to **track**, **categorize**, and **visualize** your personal finances. Built using **Next.js**, **React**, **MongoDB**, **Recharts**, and **Firebase Authentication**, and deployed on **Vercel**.

🔗 **Live Demo**: [financevisualizer.vercel.app(https://financevisualizer.vercel.app/)

---

## ✨ Features

- 🔐 **User Authentication** using Firebase (Email & Password)
- 🔒 **Protected Routes** for user-specific data access
- ➕ Add, 📝 Edit, and ❌ Delete transactions (amount, date, description)
- 🗂️ Categorize transactions using predefined categories
- 📃 View recent transactions in a list format
- 📊 Visualize monthly expenses using **bar charts**
- 🥧 Breakdown expenses by category using **pie charts**
- 🎯 Set monthly **budgets per category**
- 📉 Compare **actual spending vs. budget**
- 📋 Summary cards for:
  - Total Expenses  
  - Category-wise Breakdown  
  - Recent Transactions
- ✅ Basic form validation and error handling
- 📱 Fully responsive and accessible UI

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI**: [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/products/auth)
- **State Management**: React Hooks
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### 1. Clone the Repository

``bash
git clone https://github.com/soni-naveen/finance-visualizer.git
cd finance-visualizer

### 2. Install Dependencies
npm install

### 3. Configure Environment Variables
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string 

# Firebase Client-Side Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Firebase Admin SDK Configuration (for server-side use if needed)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key

### 4. 🔧 Firebase Setup
Go to the Firebase Console and create a new project.

Enable Authentication → Sign-in method → Enable Email/Password.

Go to Project Settings → General → copy your Firebase config keys.

Go to Service Accounts → Generate a new private key (for server-side use if needed).

Add the config to your .env file as shown above.

### 5. Run the Development Server
npm run dev
Visit http://localhost:3000 in your browser to see the app.




