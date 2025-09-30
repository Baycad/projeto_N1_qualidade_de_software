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
  date: string;
  category: string;
}

export default function Page() {
  const [darkMode, setDarkMode] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('/professional-man-smiling.png');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const fileUrl = URL.createObjectURL(event.target.files[0]);
      setProfilePhoto(fileUrl);
    }
  };

  // Lista de transações simuladas
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, description: 'Pagamento de Luz', amount: 120.5, date: '2025-09-28', category: 'Conta' },
    { id: 2, description: 'Aluguel', amount: 1500, date: '2025-09-01', category: 'Moradia' },
    { id: 3, description: 'Freelance Design', amount: 800, date: '2025-09-20', category: 'Receita' },
  ]);

  // Estado do formulário
  const [newTransaction, setNewTransaction] = useState<Transaction>({
    id: 0,
    description: '',
    amount: 0,
    date: '',
    category: '',
  });

  const handleAddTransaction = () => {
    if (!newTransaction.description || !newTransaction.date || !newTransaction.category) return;

    const nextTransaction = {
      ...newTransaction,
      id: transactions.length + 1,
    };
    setTransactions([...transactions, nextTransaction]);

    // Resetar formulário
    setNewTransaction({ id: 0, description: '', amount: 0, date: '', category: '' });
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <header className="flex justify-between items-center p-4">
        <button onClick={toggleDarkMode}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        <img
          src={profilePhoto}
          alt="Profile"
          className="w-10 h-10 rounded-full cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />
      </header>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md relative w-80">
            <button
              className="absolute top-2 right-2"
              onClick={() => setIsModalOpen(false)}
            >
              <IoMdClose size={20} />
            </button>
            <h2 className="text-lg font-bold mb-4">Editar Perfil</h2>
            <input type="file" ref={fileInputRef} onChange={handleProfileChange} />
          </div>
        </div>
      )}

      <main className="p-4">
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Financeiro</TabsTrigger>
            <TabsTrigger value="tab2">Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="tab1">
            <Card className="p-4 mb-4">
              <GiPayMoney className="text-2xl mb-2" />
              <p>Resumo financeiro</p>
            </Card>

            {/* Formulário de nova transação */}
            <Card className="p-4 mb-4">
              <h3 className="font-bold mb-2">Adicionar Transação</h3>
              <input
                type="text"
                placeholder="Descrição"
                className="border p-1 mb-2 w-full"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              />
              <input
                type="number"
                placeholder="Valor"
                className="border p-1 mb-2 w-full"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
              />
              <input
                type="date"
                className="border p-1 mb-2 w-full"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              />
              <input
                type="text"
                placeholder="Categoria"
                className="border p-1 mb-2 w-full"
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
              />
              <Button onClick={handleAddTransaction}>Adicionar</Button>
            </Card>

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
                    <Button size="sm" variant="destructive">Excluir</Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="tab2">
            <Card className="p-4">
              <FaUserCircle className="text-2xl mb-2" />
              <p>Informações do perfil</p>
              <Button onClick={() => setIsModalOpen(true)}>Editar perfil</Button>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
