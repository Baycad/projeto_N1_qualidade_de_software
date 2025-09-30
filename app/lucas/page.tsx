import React, { useState, useRef } from 'react';
import { FaUserCircle, FaSun, FaMoon } from 'react-icons/fa';
import { GiPayMoney } from 'react-icons/gi';
import { IoMdClose } from 'react-icons/io';
import { Tab } from '@headlessui/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export default function FinanceApp() {
  const [darkMode, setDarkMode] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('/professional-man-smiling.png');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleAddTransaction = () => {
    if (!description || !category || !date) return;
    const newTransaction: Transaction = {
      id: Date.now(),
      description,
      amount,
      category,
      date,
    };
    setTransactions([...transactions, newTransaction]);
    setDescription('');
    setAmount(0);
    setCategory('');
    setDate('');
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter(tx => tx.id !== id));
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <header className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <FaUserCircle size={32} />
          <img
            src={profilePhoto}
            alt="Profile"
            className="w-10 h-10 rounded-full"
            onClick={() => fileInputRef.current?.click()}
          />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setProfilePhoto(URL.createObjectURL(file));
            }}
          />
        </div>
        <Button onClick={toggleDarkMode}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </Button>
      </header>

      <main className="p-4">
        <Tabs defaultValue="transactions">
          <TabsList>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="add">Adicionar</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            {transactions.map((tx) => (
              <Card key={tx.id} className="p-4 mb-2 flex justify-between items-center">
                <div>
                  <p className="font-bold">{tx.description}</p>
                  <p className="text-sm text-gray-500">{tx.category} • {tx.date}</p>
                </div>
                <div className="text-right">
                  <p className={tx.amount < 0 ? 'text-red-500' : 'text-green-500'}>
                    R$ {tx.amount.toFixed(2)}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <Button size="sm">Editar</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteTransaction(tx.id)}>
                      Excluir
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="add">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Valor"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Categoria"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="p-2 border rounded"
              />
              <Button onClick={handleAddTransaction}>Adicionar</Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
