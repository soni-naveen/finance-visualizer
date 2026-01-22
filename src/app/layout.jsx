import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/firebase/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Finance Visualizer – Personal Finance Tracker & Insights",
  description:
    "Finance Visualizer helps you track your income and expenses, visualize spending patterns, and gain insights into your personal finances. Simple, secure, and powerful.",
  keywords: [
    "personal finance tracker",
    "budget planner",
    "income tracker",
    "expense tracker",
    "money management",
    "finance dashboard",
    "financial insights",
    "spending tracker",
    "savings tracker",
    "financial planner",
  ],
  openGraph: {
    title: "Finance Visualizer – Personal Finance Tracker & Insights",
    description:
      "Finance Visualizer helps you track your income and expenses, visualize spending patterns, and gain insights into your personal finances. Simple, secure, and powerful.",
    url: "https://financevisualizer.vercel.app/",
    siteName: "Finance Visualizer",
    images: [
      {
        url: "https://financevisualizer.vercel.app/Logo.png",
        width: 800,
        height: 800,
        alt: "Finance Visualizer",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finance Visualizer – Personal Finance Tracker & Insights",
    description:
      "Finance Visualizer helps you track your income and expenses, visualize spending patterns, and gain insights into your personal finances. Simple, secure, and powerful.",
    images: ["https://financevisualizer.vercel.app/Logo.png"],
  },
  metadataBase: new URL("https://financevisualizer.vercel.app/"),
  alternates: {
    canonical: "https://financevisualizer.vercel.app/",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="index, follow" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <main className="min-h-screen bg-slate-100">{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
