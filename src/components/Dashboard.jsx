// src/components/Dashboard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Egg, TrendingUp, AlertTriangle, Route } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext'; // Gunakan AuthContext lokal
import StatsCard from '@/components/StatsCard';
import HistoricalProductionChart from '@/components/HistoricalProductionChart';
import HeatStressIndicator from '@/components/HeatStressIndicator';
import { Card } from '@/components/ui/card';

const API_URL = 'http://127.0.0.1:5000/api/egg-stock';

const Dashboard = () => {
  const [eggData, setEggData] = React.useState({ total: 0, mutu1: 0 });
  const [stockHistory, setStockHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [heatStressLevel, setHeatStressLevel] = React.useState('low');
  const { token } = useAuth(); // Ambil token untuk otorisasi
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchData = async () => {
      if (!token) return; // Jangan fetch jika belum ada token
      
      setLoading(true);
      try {
        const response = await fetch(API_URL, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Gagal memuat data dasbor');
        }

        const data = await response.json();
        setStockHistory(data);

        const totals = data.reduce((acc, curr) => {
          acc.mutu1 += curr.mutu1;
          const entryTotal = curr.mutu1 + curr.mutu2 + curr.mutu3 + curr.pecah;
          acc.total += entryTotal;
          return acc;
        }, { total: 0, mutu1: 0 });
        
        setEggData(totals);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({ title: "Gagal memuat data dasbor", description: error.message, variant: "destructive" });
      }
      setLoading(false);
    };

    fetchData();

    // Simulasi data heat stress
    const levels = ['low', 'medium', 'high'];
    setHeatStressLevel(levels[Math.floor(Math.random() * levels.length)]);
  }, [token, toast]);

  const statsData = [
    {
      title: 'Total Telur',
      value: loading ? '...' : eggData.total.toLocaleString(),
      icon: Egg,
      color: 'from-blue-500 to-indigo-600',
      trend: '+12%'
    },
    {
      title: 'Mutu 1 (Premium)',
      value: loading ? '...' : eggData.mutu1.toLocaleString(),
      icon: TrendingUp,
      color: 'from-emerald-500 to-green-600',
      trend: '+8%'
    },
    {
      title: 'Heat Stress Alert',
      value: heatStressLevel === 'high' ? 'Tinggi' : heatStressLevel === 'medium' ? 'Sedang' : 'Rendah',
      icon: AlertTriangle,
      color: heatStressLevel === 'high' ? 'from-red-500 to-orange-600' : heatStressLevel === 'medium' ? 'from-yellow-500 to-orange-400' : 'from-green-500 to-emerald-500',
      trend: heatStressLevel === 'high' ? '⚠️' : '✅'
    },
    {
      title: 'Rute Aktif',
      value: '5',
      icon: Route,
      color: 'from-purple-500 to-pink-600',
      trend: '+2'
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold gradient-text">Dashboard Utama</h1>
        <p className="text-gray-600 mt-1">Ringkasan lengkap operasional peternak telur Anda</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full">
            <HistoricalProductionChart history={stockHistory} />
          </Card>
        </motion.div>
        
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="h-full">
            <HeatStressIndicator level={heatStressLevel} />
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;