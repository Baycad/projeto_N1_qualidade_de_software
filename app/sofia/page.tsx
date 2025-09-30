"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Plus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  Edit,
  Camera,
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  isFixed: boolean;
  isPaid: boolean;
}

interface FixedExpense {
  id: string;
  category: string;
  amount: number;
  description: string;
  isPaid: boolean;
}

interface InstallmentItem {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  totalInstallments: number;
  monthlyAmount: number;
  startDate: string;
  isPaid: boolean;
}

interface Income {
  id: string;
  description: string;
  amount: number;
  date: string;
}
 export default function SofiaPage() {
  const [monthlyLimit, setMonthlyLimit] = useState(5000)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([])
  const [installments, setInstallments] = useState<InstallmentItem[]>([])
  const [incomes, setIncomes] = useState<Income[]>([])
  const [investment, setInvestment] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const [quickExpense, setQuickExpense] = useState({ amount: "", description: "", category: "Outros" })
  const [newExpense, setNewExpense] = useState({ category: "", amount: "", date: "", description: "" })
  const [newFixedExpense, setNewFixedExpense] = useState({ category: "", amount: "", description: "" })
  const [newIncome, setNewIncome] = useState({ amount: "" })
  const [newInvestment, setNewInvestment] = useState({ amount: "" })
  const [newInstallment, setNewInstallment] = useState({
    name: "",
    totalAmount: "",
    totalInstallments: "",
    remainingAmount: "",
  })

  const [profilePhoto, setProfilePhoto] = useState("/professional-woman-smiling.png")
  const fileInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const checkMonthlyReset = () => {
      const today = new Date()
      const currentDate = today.getDate()
      const currentMonth = today.getMonth()
      const currentYear = today.getFullYear()

      if (currentDate === 1) {
        const lastResetKey = "sofia-last-reset"
        const lastReset = localStorage.getItem(lastResetKey)
        const currentMonthKey = `${currentYear}-${currentMonth}`

        if (lastReset !== currentMonthKey) {
          console.log("[v0] Performing monthly reset for Sofia")
          setMonthlyLimit(5000)
          setExpenses([])
          setIncomes([])
          setFixedExpenses((prev) => prev.map((expense) => ({ ...expense, isPaid: false })))
          localStorage.setItem(lastResetKey, currentMonthKey)
          console.log("[v0] Monthly reset completed for Sofia")
        }
      }
    }
    checkMonthlyReset()

    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const timeUntilMidnight = tomorrow.getTime() - now.getTime()

    const timeoutId = setTimeout(() => {
      checkMonthlyReset()
      const intervalId = setInterval(checkMonthlyReset, 24 * 60 * 60 * 1000)
      return () => clearInterval(intervalId)
    }, timeUntilMidnight)

    return () => clearTimeout(timeoutId)
  }, [])
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, "")
    if (!numericValue) return ""
    const number = Number.parseInt(numericValue) / 100
    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const parseCurrencyToNumber = (value: string) => {
    const numericValue = value.replace(/[^\d,]/g, "").replace(",", ".")
    return Number.parseFloat(numericValue) || 0
  }
  const totalInstallmentPayments = installments.reduce(
    (sum, item) => sum + (item.isPaid ? 0 : item.totalAmount - item.remainingAmount),
    0,
  )
  const totalInstallmentRemaining = installments.reduce(
    (sum, item) => sum + (item.isPaid ? 0 : item.remainingAmount),
    0,
  )
  const totalInstallmentItems = installments.filter((item) => !item.isPaid).length
  const totalPaidFixedExpenses = fixedExpenses.reduce((sum, expense) => sum + (expense.isPaid ? expense.amount : 0), 0)
  const totalUnpaidFixedExpenses = fixedExpenses.reduce(
    (sum, expense) => sum + (expense.isPaid ? 0 : expense.amount),
    0,
  )
  const totalExpenses =
    expenses.reduce((sum, expense) => sum + (expense.isPaid ? 0 : expense.amount), 0) +
    totalPaidFixedExpenses + totalInstallmentPayments
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)
  const progressPercentage = (totalExpenses / monthlyLimit) * 100
  const remainingBudget = monthlyLimit - totalExpenses
  const totalBalance = totalIncome - totalExpenses
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePhoto(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  const addIncome = () => {
    if (newIncome.amount) {
      const numericAmount = parseCurrencyToNumber(newIncome.amount)
      const income: Income = {
        id: Date.now().toString(),
        description: "Entrada",
        amount: numericAmount,
        date: new Date().toISOString().split("T")[0],
      }
      setIncomes([...incomes, income])
      setNewIncome({ amount: "" })
    }
  }

  const addInvestment = () => {
    if (newInvestment.amount) {
      const numericAmount = parseCurrencyToNumber(newInvestment.amount)
      setInvestment(investment + numericAmount)
      setNewInvestment({ amount: "" })
    }
  }

  const addQuickExpense = () => {
    if (quickExpense.amount && quickExpense.description) {
      const newExp: Expense = {
        id: Date.now().toString(),
        category: quickExpense.category,
        amount: Number.parseFloat(quickExpense.amount),
        date: new Date().toISOString().split("T")[0],
        description: quickExpense.description,
        isFixed: false,
        isPaid: false,
      }
      setExpenses([...expenses, newExp])
      setQuickExpense({ amount: "", description: "", category: "Outros" })
    }
  }
  const addExpense = () => {
    if (newExpense.category && newExpense.amount && newExpense.date) {
      const numericAmount = parseCurrencyToNumber(newExpense.amount)
      const expense: Expense = {
        id: Date.now().toString(),
        category: newExpense.category,
        amount: numericAmount,
        date: newExpense.date,
        description: newExpense.description || "",
        isFixed: false,
        isPaid: false,
      }
      setExpenses([...expenses, expense])
      setNewExpense({ category: "", amount: "", date: "", description: "" })
    }
  }

  const addFixedExpense = () => {
    if (newFixedExpense.category && newFixedExpense.amount) {
      const numericAmount = parseCurrencyToNumber(newFixedExpense.amount)
      const fixedExpense: FixedExpense = {
        id: Date.now().toString(),
        category: newFixedExpense.category,
        amount: numericAmount,
        description: newFixedExpense.description || "",
        isPaid: false,
      }
      setFixedExpenses([...fixedExpenses, fixedExpense])
      setNewFixedExpense({ category: "", amount: "", description: "" })
    }
  }

  const addInstallment = () => {
    if (
      newInstallment.name &&
      newInstallment.totalAmount &&
      newInstallment.totalInstallments &&
      newInstallment.remainingAmount
    ) {
      const totalAmount = parseCurrencyToNumber(newInstallment.totalAmount)
      const totalInstallments = Number.parseInt(newInstallment.totalInstallments)
      const remainingAmount = parseCurrencyToNumber(newInstallment.remainingAmount)

      const installment: InstallmentItem = {
        id: Date.now().toString(),
        name: newInstallment.name,
        totalAmount: totalAmount,
        remainingAmount: remainingAmount,
        totalInstallments: totalInstallments,
        monthlyAmount: totalAmount / totalInstallments,
        startDate: new Date().toISOString().split("T")[0],
        isPaid: remainingAmount <= 0,
      }
      setInstallments([...installments, installment])
      setNewInstallment({ name: "", totalAmount: "", totalInstallments: "", remainingAmount: "" })
    }
  }
  const updateInstallmentPayment = (id: string, increment: boolean) => {
    setInstallments(
      installments.map((item) => {
        if (item.id === id) {
          const newRemainingAmount = increment
            ? Math.max(item.remainingAmount - item.monthlyAmount, 0)
            : Math.min(item.remainingAmount + item.monthlyAmount, item.totalAmount)
          const isPaid = newRemainingAmount <= 0
          return { ...item, remainingAmount: newRemainingAmount, isPaid }
        }
        return item
      }),
    )
  }

  const toggleExpensePaid = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  const toggleFixedExpensePaid = (id: string) => {
    setFixedExpenses(
      fixedExpenses.map((expense) => (expense.id === id ? { ...expense, isPaid: !expense.isPaid } : expense)),
    )
  }

  const toggleInstallmentPaid = (id: string) => {
    setInstallments(installments.filter((item) => item.id !== id))
  }
