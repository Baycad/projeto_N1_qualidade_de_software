'use client';

import React, { useState, useRef } from 'react';

import { FaUserCircle, FaSun, FaMoon } from 'react-icons/fa';
import { GiPayMoney } from 'react-icons/gi';
import { IoMdClose } from 'react-icons/io';

import { Tab } from '@headlessui/react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ArrowLeft } from 'lucide-react';

export default function Page() {
  const [darkMode, setDarkMode] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('/professional-man-smiling.png');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <header className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <ArrowLeft className="w-6 h-6" />
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
        <Button onClick={toggleDarkMode} variant="secondary">
          {darkMode ? <FaSun /> : <FaMoon />}
        </Button>
      </header>

      <main className="p-4">
        <Card className="p-4 flex items-center gap-4">
          <img
            src={profilePhoto}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
            onClick={() => fileInputRef.current?.click()}
          />
          <input type="file" ref={fileInputRef} className="hidden" />
          <h2 className="text-lg font-semibold">Olá, Usuário!</h2>
        </Card>

        <Tabs defaultValue="finances" className="mt-4">
          <TabsList>
            <TabsTrigger value="finances">Finanças</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>
          <TabsContent value="finances">
            <p>Conteúdo das finanças aqui</p>
          </TabsContent>
          <TabsContent value="profile">
            <p>Conteúdo do perfil aqui</p>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}