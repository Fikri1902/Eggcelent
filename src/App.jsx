// src/App.jsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import EggChecker from '@/components/EggChecker';
import EggClimate from '@/components/EggClimate';
import EggSpedition from '@/components/EggSpedition';

import { useAuth } from '@/contexts/AuthContext';
import AuthScreen from '@/components/AuthScreen';
import LoadingScreen from '@/components/LoadingScreen';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, loading } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'egg-checker':
        return <EggChecker />;
      case 'egg-climate':
        return <EggClimate />;
      case 'egg-spedition':
        return <EggSpedition />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <>
      <Helmet>
        <title>Eggcelent - Sistem Manajemen Peternak Telur</title>
        <meta name="description" content="Platform lengkap untuk manajemen peternak telur dengan fitur deteksi mutu, monitoring cuaca, dan optimasi distribusi" />
      </Helmet>
      
      <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-6 ml-64">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </>
  );
}

export default App;