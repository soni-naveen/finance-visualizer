"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  BarChart3,
  PieChart,
  Shield,
  Wallet,
  Target,
  ArrowRight,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import Footer from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/40 backdrop-blur-xl sticky top-0 w-full z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Wallet className="h-6 sm:h-8 w-6 sm:w-8 text-blue-600" />
              <h1 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900">
                Finance Visualizer
              </h1>
            </div>
            <div className="space-x-4">
              <Link href="/auth/signin">
                <Button variant="outline" className="hidden xs:inline">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pb-10 pt-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Master Your Finances Like Never Before
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Track expenses, set budgets, and visualize your financial journey
            with beautiful charts. Your personal finance management solution
            that grows with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 text-lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-3 text-lg border-gray-300 hover:bg-gray-50 bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto px-7 pt-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Smart Budgeting */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Smart Budgeting
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Set intelligent budgets for different categories and track your
                progress with real-time notifications and insights.
              </p>
            </CardContent>
          </Card>

          {/* Visual Analytics */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Visual Analytics
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Beautiful charts and graphs that make understanding your
                spending patterns intuitive and actionable.
              </p>
            </CardContent>
          </Card>

          {/* Expense Tracking */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <PieChart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Easy Tracking
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Effortlessly log transactions, categorize expenses, and monitor
                your financial health with our intuitive interface.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Finance Visualizer?
            </h3>
            <p className="text-gray-600 text-lg">
              Everything you need to take control of your financial future
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Real-time Insights
                </h4>
                <p className="text-gray-600">
                  Get instant feedback on your spending habits and financial
                  goals
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Category Management
                </h4>
                <p className="text-gray-600">
                  Organize expenses with smart categorization and custom labels
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Budget Alerts
                </h4>
                <p className="text-gray-600">
                  Stay on track with intelligent notifications and spending
                  limits
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Monthly Reports
                </h4>
                <p className="text-gray-600">
                  Comprehensive financial summaries to track your progress
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Snapshots Section */}
      <section className="container mx-auto flex flex-col items-center gap-10 justify-center pt-10 pb-20 px-2 xs:px-4">
        <Image
          src="/cover-01.png"
          alt="dashboard"
          className="object-cover rounded-lg shadow-lg"
          width={1000}
          height={1000}
        />
        <Image
          src="/cover-02.png"
          alt="add transactions"
          className="object-cover rounded-lg shadow-lg"
          width={1000}
          height={1000}
        />
        <Image
          src="/cover-03.png"
          alt="recent transactions"
          className="object-cover rounded-lg shadow-lg"
          width={1000}
          height={1000}
        />
      </section>

      {/* Security Section */}
      <section className="container mx-auto px-4 pt-10 pb-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Shield className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Your Financial Data is Secure
          </h3>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Each user has their own private space with bank-level encryption.
            You can only see and manage your own financial data. Your privacy
            and security are our top priorities.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-black text-white hover:bg-gray-600 px-8 py-3 text-lg"
            >
              Start Your Journey Today
              <TrendingUp className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
