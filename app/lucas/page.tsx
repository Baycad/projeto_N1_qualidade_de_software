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

  const toggleDarkMode = () => setDarkMode(!darkMode);

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
          onClick={() => fileInputRef.current?.click()}
        />
        <input type="file" ref={fileInputRef} className="hidden" />
      </header>

      <main className="p-4">
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Financeiro</TabsTrigger>
            <TabsTrigger value="tab2">Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="tab1">
            <Card className="p-4">
              <GiPayMoney className="text-2xl mb-2" />
              <p>Resumo financeiro</p>
              <Button>Ver detalhes</Button>
            </Card>
          </TabsContent>

          <TabsContent value="tab2">
            <Card className="p-4">
              <FaUserCircle className="text-2xl mb-2" />
              <p>Informações do perfil</p>
              <Button>Editar perfil</Button>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
