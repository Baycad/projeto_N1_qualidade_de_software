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
