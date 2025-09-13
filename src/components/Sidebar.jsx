import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Egg, CloudRain, Route, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'egg-checker',
      label: 'Egg Checker',
      icon: Egg,
      color: 'from-emerald-500 to-green-600'
    },
    {
      id: 'egg-climate',
      label: 'Egg Climate',
      icon: CloudRain,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'egg-spedition',
      label: 'Egg Spedition',
      icon: Route,
      color: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 top-0 h-full w-64 glass-effect z-50"
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Egg className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Eggcelent</h1>
            <p className="text-sm text-gray-600">Sistem Peternak Telur</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 h-12 ${
                    isActive 
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                      : 'hover:bg-white/50'
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Button>
              </motion.div>
            );
          })}
        </nav>

        <div className="mt-8 p-4 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-xl">
          <h3 className="font-semibold text-emerald-800 mb-2">Tips Hari Ini</h3>
          <p className="text-sm text-emerald-700">
            Periksa suhu kandang secara rutin untuk mencegah heat stress pada ayam petelur.
          </p>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;