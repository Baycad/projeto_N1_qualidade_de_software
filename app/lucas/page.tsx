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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const fileUrl = URL.createObjectURL(event.target.files[0]);
      setProfilePhoto(fileUrl);
    }
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
              <Button onClick={() => setIsModalOpen(true)}>Editar perfil</Button>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
