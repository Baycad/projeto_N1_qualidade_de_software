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
  const [monthlyLimit, setMonthlyLimit] = useState(5000);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [installments, setInstallments] = useState<InstallmentItem[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [investment, setInvestment] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [quickExpense, setQuickExpense] = useState({
    amount: "",
    description: "",
    category: "Outros",
  });
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    date: "",
    description: "",
  });
  const [newFixedExpense, setNewFixedExpense] = useState({
    category: "",
    amount: "",
    description: "",
  });
  const [newIncome, setNewIncome] = useState({ amount: "" });
  const [newInvestment, setNewInvestment] = useState({ amount: "" });
  const [newInstallment, setNewInstallment] = useState({
    name: "",
    totalAmount: "",
    totalInstallments: "",
    remainingAmount: "",
  });

  const [profilePhoto, setProfilePhoto] = useState(
    "/professional-woman-smiling.png"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkMonthlyReset = () => {
      const today = new Date();
      const currentDate = today.getDate();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      // Check if it's the 1st of the month
      if (currentDate === 1) {
        const lastResetKey = "sofia-last-reset";
        const lastReset = localStorage.getItem(lastResetKey);
        const currentMonthKey = `${currentYear}-${currentMonth}`;

        // Only reset if we haven't reset this month yet
        if (lastReset !== currentMonthKey) {
          console.log("[v0] Performing monthly reset for Sofia");

          // Reset monthly limit to default
          setMonthlyLimit(5000);

          // Clear regular expenses and income
          setExpenses([]);
          setIncomes([]);

          // Reset paid status of fixed expenses for new month
          setFixedExpenses((prev) =>
            prev.map((expense) => ({ ...expense, isPaid: false }))
          );

          // Mark that we've reset for this month
          localStorage.setItem(lastResetKey, currentMonthKey);

          console.log("[v0] Monthly reset completed for Sofia");
        }
      }
    };

    // Check on component mount
    checkMonthlyReset();

    // Set up daily check at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      checkMonthlyReset();

      // Set up daily interval after first midnight
      const intervalId = setInterval(checkMonthlyReset, 24 * 60 * 60 * 1000);

      return () => clearInterval(intervalId);
    }, timeUntilMidnight);

    return () => clearTimeout(timeoutId);
  }, []);

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    if (!numericValue) return "";
    const number = Number.parseInt(numericValue) / 100;
    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const parseCurrencyToNumber = (value: string) => {
    const numericValue = value.replace(/[^\d,]/g, "").replace(",", ".");
    return Number.parseFloat(numericValue) || 0;
  };

  const totalInstallmentPayments = installments.reduce(
    (sum, item) =>
      sum + (item.isPaid ? 0 : item.totalAmount - item.remainingAmount),
    0
  );
  const totalInstallmentRemaining = installments.reduce(
    (sum, item) => sum + (item.isPaid ? 0 : item.remainingAmount),
    0
  );
  const totalInstallmentItems = installments.filter(
    (item) => !item.isPaid
  ).length;
  const totalPaidFixedExpenses = fixedExpenses.reduce(
    (sum, expense) => sum + (expense.isPaid ? expense.amount : 0),
    0
  );
  const totalUnpaidFixedExpenses = fixedExpenses.reduce(
    (sum, expense) => sum + (expense.isPaid ? 0 : expense.amount),
    0
  );
  const totalExpenses =
    expenses.reduce(
      (sum, expense) => sum + (expense.isPaid ? 0 : expense.amount),
      0
    ) +
    totalPaidFixedExpenses + // Add paid fixed expenses to total expenses
    totalInstallmentPayments;
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const progressPercentage = (totalExpenses / monthlyLimit) * 100;
  const remainingBudget = monthlyLimit - totalExpenses;
  const totalBalance = totalIncome - totalExpenses;

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addIncome = () => {
    if (newIncome.amount) {
      const numericAmount = parseCurrencyToNumber(newIncome.amount);
      const income: Income = {
        id: Date.now().toString(),
        description: "Entrada",
        amount: numericAmount,
        date: new Date().toISOString().split("T")[0],
      };
      setIncomes([...incomes, income]);
      setNewIncome({ amount: "" });
    }
  };

  const addInvestment = () => {
    if (newInvestment.amount) {
      const numericAmount = parseCurrencyToNumber(newInvestment.amount);
      setInvestment(investment + numericAmount);
      setNewInvestment({ amount: "" });
    }
  };

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
      };
      setExpenses([...expenses, newExp]);
      setQuickExpense({ amount: "", description: "", category: "Outros" });
    }
  };

  const addExpense = () => {
    if (newExpense.category && newExpense.amount && newExpense.date) {
      const numericAmount = parseCurrencyToNumber(newExpense.amount);
      const expense: Expense = {
        id: Date.now().toString(),
        category: newExpense.category,
        amount: numericAmount,
        date: newExpense.date,
        description: newExpense.description || "",
        isFixed: false,
        isPaid: false,
      };
      setExpenses([...expenses, expense]);
      setNewExpense({ category: "", amount: "", date: "", description: "" });
    }
  };

  const addFixedExpense = () => {
    if (newFixedExpense.category && newFixedExpense.amount) {
      const numericAmount = parseCurrencyToNumber(newFixedExpense.amount);
      const fixedExpense: FixedExpense = {
        id: Date.now().toString(),
        category: newFixedExpense.category,
        amount: numericAmount,
        description: newFixedExpense.description || "",
        isPaid: false,
      };
      setFixedExpenses([...fixedExpenses, fixedExpense]);
      setNewFixedExpense({ category: "", amount: "", description: "" });
    }
  };

  const addInstallment = () => {
    if (
      newInstallment.name &&
      newInstallment.totalAmount &&
      newInstallment.totalInstallments &&
      newInstallment.remainingAmount
    ) {
      const totalAmount = parseCurrencyToNumber(newInstallment.totalAmount);
      const totalInstallments = Number.parseInt(
        newInstallment.totalInstallments
      );
      const remainingAmount = parseCurrencyToNumber(
        newInstallment.remainingAmount
      );

      const installment: InstallmentItem = {
        id: Date.now().toString(),
        name: newInstallment.name,
        totalAmount: totalAmount,
        remainingAmount: remainingAmount,
        totalInstallments: totalInstallments,
        monthlyAmount: totalAmount / totalInstallments,
        startDate: new Date().toISOString().split("T")[0],
        isPaid: remainingAmount <= 0,
      };
      setInstallments([...installments, installment]);
      setNewInstallment({
        name: "",
        totalAmount: "",
        totalInstallments: "",
        remainingAmount: "",
      });
    }
  };

  const updateInstallmentPayment = (id: string, increment: boolean) => {
    setInstallments(
      installments.map((item) => {
        if (item.id === id) {
          const newRemainingAmount = increment
            ? Math.max(item.remainingAmount - item.monthlyAmount, 0)
            : Math.min(
                item.remainingAmount + item.monthlyAmount,
                item.totalAmount
              );
          const isPaid = newRemainingAmount <= 0;
          return { ...item, remainingAmount: newRemainingAmount, isPaid };
        }
        return item;
      })
    );
  };

  const toggleExpensePaid = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const toggleFixedExpensePaid = (id: string) => {
    setFixedExpenses(
      fixedExpenses.map((expense) =>
        expense.id === id ? { ...expense, isPaid: !expense.isPaid } : expense
      )
    );
  };

  const toggleInstallmentPaid = (id: string) => {
    setInstallments(installments.filter((item) => item.id !== id));
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-slate-50 to-blue-50"
      } p-4`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className={`px-4 py-2 border-2 font-medium transition-all duration-200 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:border-gray-500"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1
            className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-slate-800"
            }`}
          >
            Gestão Financeira - Sofia
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 border-2 transition-all duration-200 ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-yellow-400 hover:bg-gray-600 hover:border-gray-500"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            }`}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
            <span className="ml-2 text-sm font-medium">
              {isDarkMode ? "Claro" : "Escuro"}
            </span>
          </Button>
        </div>

        {/* User Profile & Progress */}
        <Card
          className={`${
            isDarkMode
              ? "bg-gray-800/80 border-gray-700"
              : "bg-white/80 border-slate-200"
          } backdrop-blur-sm`}
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-40 h-40 border-4 border-blue-200">
                  <AvatarImage src={profilePhoto || "/placeholder.svg"} />
                  <AvatarFallback className="text-4xl bg-blue-100 text-blue-700">
                    SF
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-4 h-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              <div className="w-full max-w-md space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    className={isDarkMode ? "text-gray-300" : "text-slate-700"}
                  >
                    Limite Mensal
                  </Label>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className={
                        isDarkMode ? "bg-gray-800 border-gray-700" : ""
                      }
                    >
                      <DialogHeader>
                        <DialogTitle className={isDarkMode ? "text-white" : ""}>
                          Editar Limite Mensal
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          type="number"
                          value={monthlyLimit}
                          onChange={(e) =>
                            setMonthlyLimit(Number(e.target.value))
                          }
                          placeholder="Limite mensal"
                          className={
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : ""
                          }
                        />
                        <Button onClick={() => {}} className="w-full">
                          Salvar
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <Progress
                  value={progressPercentage}
                  className="h-3"
                  style={{
                    background:
                      progressPercentage > 90
                        ? "#fee2e2"
                        : progressPercentage > 70
                        ? "#fef3c7"
                        : "#dcfce7",
                  }}
                />
                <div className="flex justify-between text-sm">
                  <span
                    className={isDarkMode ? "text-gray-400" : "text-slate-600"}
                  >
                    R$ {totalExpenses.toFixed(2)} gastos
                  </span>
                  <span
                    className={`font-medium ${
                      remainingBudget < 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    R$ {remainingBudget.toFixed(2)} restante
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-700 text-sm font-medium">
                    Saldo Total
                  </p>
                  <p className="text-2xl font-bold text-green-800">
                    R$ {totalBalance.toFixed(2)}
                  </p>
                </div>
                <Wallet className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 text-sm font-medium">Entradas</p>
                  <p className="text-2xl font-bold text-blue-800">
                    R$ {totalIncome.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className={
                        isDarkMode ? "bg-gray-800 border-gray-700" : ""
                      }
                    >
                      <DialogHeader>
                        <DialogTitle className={isDarkMode ? "text-white" : ""}>
                          Adicionar Entrada
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className={isDarkMode ? "text-gray-300" : ""}>
                            Valor
                          </Label>
                          <Input
                            value={newIncome.amount}
                            onChange={(e) =>
                              setNewIncome({
                                amount: formatCurrency(e.target.value),
                              })
                            }
                            placeholder="R$ 0,00"
                            className={
                              isDarkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : ""
                            }
                          />
                        </div>
                        <Button
                          onClick={addIncome}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          Adicionar Entrada
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-700 text-sm font-medium">Saídas</p>
                  <p className="text-2xl font-bold text-red-800">
                    R$ {totalExpenses.toFixed(2)}
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-700 text-sm font-medium">
                    Compras Parceladas
                  </p>
                  <p className="text-2xl font-bold text-orange-800">
                    R$ {totalInstallmentRemaining.toFixed(2)}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    {totalInstallmentItems}{" "}
                    {totalInstallmentItems === 1
                      ? "item restante"
                      : "itens restantes"}
                  </p>
                </div>
                <CreditCard className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-700 text-sm font-medium">
                    Investimentos
                  </p>
                  <p className="text-2xl font-bold text-purple-800">
                    R$ {investment.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-purple-600 hover:text-purple-700"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className={
                        isDarkMode ? "bg-gray-800 border-gray-700" : ""
                      }
                    >
                      <DialogHeader>
                        <DialogTitle className={isDarkMode ? "text-white" : ""}>
                          Adicionar Investimento
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className={isDarkMode ? "text-gray-300" : ""}>
                            Valor
                          </Label>
                          <Input
                            value={newInvestment.amount}
                            onChange={(e) =>
                              setNewInvestment({
                                amount: formatCurrency(e.target.value),
                              })
                            }
                            placeholder="R$ 0,00"
                            className={
                              isDarkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : ""
                            }
                          />
                        </div>
                        <Button
                          onClick={addInvestment}
                          className="w-full bg-purple-600 hover:bg-purple-700"
                        >
                          Adicionar Investimento
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="expenses" className="space-y-4">
          <TabsList
            className={`grid w-full grid-cols-3 ${
              isDarkMode ? "bg-gray-800/80" : "bg-white/80"
            }`}
          >
            <TabsTrigger value="expenses">Planilha de Gastos</TabsTrigger>
            <TabsTrigger value="fixed">Gastos Fixos</TabsTrigger>
            <TabsTrigger value="installments">Itens Parcelados</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses">
            <Card
              className={`${
                isDarkMode
                  ? "bg-gray-800/80 border-gray-700"
                  : "bg-white/80 border-slate-200"
              } backdrop-blur-sm`}
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle
                    className={isDarkMode ? "text-white" : "text-slate-800"}
                  >
                    Planilha de Gastos
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Gasto
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className={
                        isDarkMode ? "bg-gray-800 border-gray-700" : ""
                      }
                    >
                      <DialogHeader>
                        <DialogTitle className={isDarkMode ? "text-white" : ""}>
                          Adicionar Novo Gasto
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className={isDarkMode ? "text-gray-300" : ""}>
                            Categoria
                          </Label>
                          <Select
                            value={newExpense.category}
                            onValueChange={(value) =>
                              setNewExpense({ ...newExpense, category: value })
                            }
                          >
                            <SelectTrigger
                              className={
                                isDarkMode
                                  ? "bg-gray-700 border-gray-600 text-white"
                                  : ""
                              }
                            >
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent
                              className={
                                isDarkMode ? "bg-gray-700 border-gray-600" : ""
                              }
                            >
                              <SelectItem value="Alimentação">
                                Alimentação
                              </SelectItem>
                              <SelectItem value="Transporte">
                                Transporte
                              </SelectItem>
                              <SelectItem value="Lazer">Lazer</SelectItem>
                              <SelectItem value="Saúde">Saúde</SelectItem>
                              <SelectItem value="Educação">Educação</SelectItem>
                              <SelectItem value="Casa">Casa</SelectItem>
                              <SelectItem value="Outros">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className={isDarkMode ? "text-gray-300" : ""}>
                            Valor
                          </Label>
                          <Input
                            value={newExpense.amount}
                            onChange={(e) =>
                              setNewExpense({
                                ...newExpense,
                                amount: formatCurrency(e.target.value),
                              })
                            }
                            placeholder="R$ 0,00"
                            className={
                              isDarkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : ""
                            }
                          />
                        </div>
                        <div>
                          <Label className={isDarkMode ? "text-gray-300" : ""}>
                            Data
                          </Label>
                          <Input
                            type="date"
                            value={newExpense.date}
                            onChange={(e) =>
                              setNewExpense({
                                ...newExpense,
                                date: e.target.value,
                              })
                            }
                            className={
                              isDarkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : ""
                            }
                          />
                        </div>
                        <div>
                          <Label className={isDarkMode ? "text-gray-300" : ""}>
                            Descrição (opcional)
                          </Label>
                          <Textarea
                            value={newExpense.description}
                            onChange={(e) =>
                              setNewExpense({
                                ...newExpense,
                                description: e.target.value,
                              })
                            }
                            placeholder="Descrição do gasto (opcional)"
                            className={
                              isDarkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : ""
                            }
                          />
                        </div>
                        <Button
                          onClick={addExpense}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          Adicionar Gasto
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
                  <div
                    className={`text-center py-8 ${
                      isDarkMode ? "text-gray-400" : "text-slate-500"
                    }`}
                  >
                    Nenhum gasto registrado ainda. Adicione seu primeiro gasto!
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead
                          className={isDarkMode ? "text-gray-300" : ""}
                        >
                          Categoria
                        </TableHead>
                        <TableHead
                          className={isDarkMode ? "text-gray-300" : ""}
                        >
                          Valor
                        </TableHead>
                        <TableHead
                          className={isDarkMode ? "text-gray-300" : ""}
                        >
                          Data
                        </TableHead>
                        <TableHead
                          className={isDarkMode ? "text-gray-300" : ""}
                        >
                          Descrição
                        </TableHead>
                        <TableHead
                          className={isDarkMode ? "text-gray-300" : ""}
                        >
                          Ações
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell
                            className={`font-medium ${
                              isDarkMode ? "text-white" : ""
                            }`}
                          >
                            {expense.category}
                          </TableCell>
                          <TableCell className="text-red-600 font-medium">
                            R$ {expense.amount.toFixed(2)}
                          </TableCell>
                          <TableCell
                            className={isDarkMode ? "text-gray-300" : ""}
                          >
                            {new Date(expense.date).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell
                            className={isDarkMode ? "text-gray-300" : ""}
                          >
                            {expense.description || "Sem descrição"}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleExpensePaid(expense.id)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              Pago
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fixed">
            <Card
              className={`${
                isDarkMode
                  ? "bg-gray-800/80 border-gray-700"
                  : "bg-white/80 border-slate-200"
              } backdrop-blur-sm`}
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle
                    className={isDarkMode ? "text-white" : "text-slate-800"}
                  >
                    Gastos Fixos
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Gasto Fixo
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className={
                        isDarkMode ? "bg-gray-800 border-gray-700" : ""
                      }
                    >
                      <DialogHeader>
                        <DialogTitle className={isDarkMode ? "text-white" : ""}>
                          Adicionar Gasto Fixo
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className={isDarkMode ? "text-gray-300" : ""}>
                            Categoria
                          </Label>
                          <Select
                            value={newFixedExpense.category}
                            onValueChange={(value) =>
                              setNewFixedExpense({
                                ...newFixedExpense,
                                category: value,
                              })
                            }
                          >
                            <SelectTrigger
                              className={
                                isDarkMode
                                  ? "bg-gray-700 border-gray-600 text-white"
                                  : ""
                              }
                            >
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent
                              className={
                                isDarkMode ? "bg-gray-700 border-gray-600" : ""
                              }
                            >
                              <SelectItem value="Aluguel">Aluguel</SelectItem>
                              <SelectItem value="Financiamento">
                                Financiamento
                              </SelectItem>
                              <SelectItem value="Internet">Internet</SelectItem>
                              <SelectItem value="Energia">Energia</SelectItem>
                              <SelectItem value="Água">Água</SelectItem>
                              <SelectItem value="Telefone">Telefone</SelectItem>
                              <SelectItem value="Seguro">Seguro</SelectItem>
                              <SelectItem value="Academia">Academia</SelectItem>
                              <SelectItem value="Streaming">
                                Streaming
                              </SelectItem>
                              <SelectItem value="Outros">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className={isDarkMode ? "text-gray-300" : ""}>
                            Valor
                          </Label>
                          <Input
                            value={newFixedExpense.amount}
                            onChange={(e) =>
                              setNewFixedExpense({
                                ...newFixedExpense,
                                amount: formatCurrency(e.target.value),
                              })
                            }
                            placeholder="R$ 0,00"
                            className={
                              isDarkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : ""
                            }
                          />
                        </div>
                        <div>
                          <Label className={isDarkMode ? "text-gray-300" : ""}>
                            Descrição (opcional)
                          </Label>
                          <Textarea
                            value={newFixedExpense.description}
                            onChange={(e) =>
                              setNewFixedExpense({
                                ...newFixedExpense,
                                description: e.target.value,
                              })
                            }
                            placeholder="Descrição do gasto fixo (opcional)"
                            className={
                              isDarkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : ""
                            }
                          />
                        </div>
                        <Button
                          onClick={addFixedExpense}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          Adicionar Gasto Fixo
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {fixedExpenses.length === 0 ? (
                  <div
                    className={`text-center py-8 ${
                      isDarkMode ? "text-gray-400" : "text-slate-500"
                    }`}
                  >
                    Nenhum gasto fixo registrado ainda. Adicione seu primeiro
                    gasto fixo!
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead
                          className={isDarkMode ? "text-gray-300" : ""}
                        >
                          Categoria
                        </TableHead>
                        <TableHead
                          className={isDarkMode ? "text-gray-300" : ""}
                        >
                          Valor
                        </TableHead>
                        <TableHead
                          className={isDarkMode ? "text-gray-300" : ""}
                        >
                          Descrição
                        </TableHead>
                        <TableHead
                          className={isDarkMode ? "text-gray-300" : ""}
                        >
                          Ações
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fixedExpenses.map((expense) => (
                        <TableRow
                          key={expense.id}
                          className={expense.isPaid ? "opacity-60" : ""}
                        >
                          <TableCell
                            className={`font-medium ${
                              isDarkMode ? "text-white" : ""
                            }`}
                          >
                            {expense.category}
                          </TableCell>
                          <TableCell
                            className={`font-medium ${
                              expense.isPaid
                                ? "text-gray-500 line-through"
                                : "text-red-600"
                            }`}
                          >
                            R$ {expense.amount.toFixed(2)}
                          </TableCell>
                          <TableCell
                            className={isDarkMode ? "text-gray-300" : ""}
                          >
                            {expense.description || "Sem descrição"}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleFixedExpensePaid(expense.id)}
                              className={
                                expense.isPaid
                                  ? "text-gray-500 hover:text-gray-600 hover:bg-gray-50"
                                  : "text-green-600 hover:text-green-700 hover:bg-green-50"
                              }
                            >
                              {expense.isPaid ? "Pago ✓" : "Pago"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="installments">
            <Card
              className={`${
                isDarkMode
                  ? "bg-gray-800/80 border-gray-700"
                  : "bg-white/80 border-slate-200"
              } backdrop-blur-sm`}
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle
                    className={`flex items-center ${
                      isDarkMode ? "text-white" : "text-slate-800"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                    Compras Parceladas
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className={
                        isDarkMode ? "bg-gray-800 border-gray-700" : ""
                      }
                    >
                      <DialogHeader>
                        <DialogTitle className={isDarkMode ? "text-white" : ""}>
                          Adicionar Compra Parcelada
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className={isDarkMode ? "text-gray-300" : ""}>
                            Tipo/Descrição
                          </Label>
                          <Input
                            value={newInstallment.name}
                            onChange={(e) =>
                              setNewInstallment({
                                ...newInstallment,
                                name: e.target.value,
                              })
                            }
                            placeholder="Ex: Smartphone, Geladeira, etc."
                            className={
                              isDarkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : ""
                            }
                          />
                        </div>
                        <div>
                          <Label className={isDarkMode ? "text-gray-300" : ""}>
                            Valor Total
                          </Label>
                          <Input
                            value={newInstallment.totalAmount}
                            onChange={(e) =>
                              setNewInstallment({
                                ...newInstallment,
                                totalAmount: formatCurrency(e.target.value),
                              })
                            }
                            placeholder="R$ 0,00"
                            className={
                              isDarkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : ""
                            }
                          />
                        </div>
                        <div>
                          <Label className={isDarkMode ? "text-gray-300" : ""}>
                            Total de Parcelas
                          </Label>
                          <Input
                            type="number"
                            value={newInstallment.totalInstallments}
                            onChange={(e) =>
                              setNewInstallment({
                                ...newInstallment,
                                totalInstallments: e.target.value,
                              })
                            }
                            placeholder="Ex: 12"
                            min="1"
                            className={
                              isDarkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : ""
                            }
                          />
                        </div>
                        <div>
                          <Label className={isDarkMode ? "text-gray-300" : ""}>
                            Valor Restante
                          </Label>
                          <Input
                            value={newInstallment.remainingAmount}
                            onChange={(e) =>
                              setNewInstallment({
                                ...newInstallment,
                                remainingAmount: formatCurrency(e.target.value),
                              })
                            }
                            placeholder="R$ 0,00"
                            className={
                              isDarkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : ""
                            }
                          />
                        </div>
                        <Button
                          onClick={addInstallment}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          Adicionar Compra Parcelada
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {installments.length === 0 ? (
                  <div
                    className={`text-center py-8 ${
                      isDarkMode ? "text-gray-400" : "text-slate-500"
                    }`}
                  >
                    Nenhuma compra parcelada registrada ainda.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead
                          className={isDarkMode ? "text-gray-300" : ""}
                        >
                          Item
                        </TableHead>
                        <TableHead
                          className={isDarkMode ? "text-gray-300" : ""}
                        >
                          Valor Total
                        </TableHead>
                        <TableHead
                          className={isDarkMode ? "text-gray-300" : ""}
                        >
                          Parcela Mensal
                        </TableHead>
                        <TableHead
                          className={isDarkMode ? "text-gray-300" : ""}
                        >
                          Progresso
                        </TableHead>
                        <TableHead
                          className={isDarkMode ? "text-gray-300" : ""}
                        >
                          Status
                        </TableHead>
                        <TableHead
                          className={isDarkMode ? "text-gray-300" : ""}
                        >
                          Ações
                        </TableHead>
                        <TableHead
                          className={isDarkMode ? "text-gray-300" : ""}
                        >
                          Pago
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {installments.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell
                            className={`font-medium ${
                              isDarkMode ? "text-white" : ""
                            }`}
                          >
                            {item.name}
                          </TableCell>
                          <TableCell
                            className={isDarkMode ? "text-gray-300" : ""}
                          >
                            R$ {item.totalAmount.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-red-600 font-medium">
                            R$ {item.monthlyAmount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Progress
                                value={
                                  ((item.totalAmount - item.remainingAmount) /
                                    item.totalAmount) *
                                  100
                                }
                                className="h-3 [&>div]:bg-green-500"
                              />
                              <span
                                className={`text-xs ${
                                  isDarkMode
                                    ? "text-gray-400"
                                    : "text-slate-600"
                                }`}
                              >
                                R$ {item.remainingAmount.toFixed(2)} restante
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {item.remainingAmount <= 0 ? (
                              <Badge className="bg-green-100 text-green-800">
                                Quitado
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-orange-600 border-orange-300"
                              >
                                R$ {item.remainingAmount.toFixed(2)} restante
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateInstallmentPayment(item.id, false)
                                }
                                disabled={
                                  item.remainingAmount >= item.totalAmount
                                }
                                className="h-8 w-8 p-0"
                              >
                                -
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateInstallmentPayment(item.id, true)
                                }
                                disabled={item.remainingAmount <= 0}
                                className="h-8 w-8 p-0"
                              >
                                +
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleInstallmentPaid(item.id)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              Pago
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
