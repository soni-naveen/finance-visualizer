import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/firebase/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Personal Finance Visualizer",
  description: "Track your personal finances with beautiful visualizations",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <main className="min-h-screen bg-slate-50">{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
