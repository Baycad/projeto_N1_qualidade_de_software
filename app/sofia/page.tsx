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
