import React, { useState, useRef } from 'react';

import { FaUserCircle, FaSun, FaMoon } from 'react-icons/fa';
import { GiPayMoney } from 'react-icons/gi';
import { IoMdClose } from 'react-icons/io';

import { Tab } from '@headlessui/react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ArrowLeft } from 'lucide-react';

const [darkMode, setDarkMode] = useState(false);
const [profilePhoto, setProfilePhoto] = useState('/professional-man-smiling.png');
const fileInputRef = useRef(null);

const toggleDarkMode = () => {
  setDarkMode(!darkMode);
};
