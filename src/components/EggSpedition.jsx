// src/components/EggSpedition.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Route, MapPin, TrendingUp, Navigation, Truck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import RouteOptimizer from '@/components/RouteOptimizer';
import SupplyDemandMap from '@/components/SupplyDemandMap';
import DeliverySchedule from '@/components/DeliverySchedule';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EggSpedition = () => {
  const [routes, setRoutes] = useState([]);
  const [supplyDemandData, setSupplyDemandData] = useState([]);
  const [deliverySchedule, setDeliverySchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLoading(true);

      try {
        const [locationsRes, routesRes, deliveriesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/locations`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/routes`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/deliveries`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (!locationsRes.ok || !routesRes.ok || !deliveriesRes.ok) {
          throw new Error('Gagal memuat data ekspedisi');
        }
        
        const locationsData = await locationsRes.json();
        const routesData = await routesRes.json();
        const deliveriesData = await deliveriesRes.json();

        setSupplyDemandData(locationsData);
        setRoutes(routesData);
        setDeliverySchedule(deliveriesData);
        
      } catch (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const optimizeRoutes = () => {
    toast({
      title: "🚛 Rute sedang dioptimasi...",
      description: "Menghitung rute terbaik berdasarkan supply-demand (simulasi)"
    });
    setTimeout(() => {
      toast({
        title: "✅ Optimasi rute selesai!",
        description: "Rute optimal telah ditampilkan."
      });
    }, 1500);
  };

  if (loading) {
    return <p className="text-center">Memuat data ekspedisi...</p>;
  }

  // Kalkulasi ringkasan (contoh sederhana)
  const totalDistance = routes.reduce((sum, route) => sum + route.distance_km, 0);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Egg Spedition</h1>
          <p className="text-gray-600 mt-1">Optimasi rute distribusi dari surplus ke defisit telur</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={optimizeRoutes}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Optimasi Rute
          </Button>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div /* ... (bagian ini bisa dibiarkan) ... */ >
        <div className="glass-effect rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Route className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{totalDistance} km</div>
                <div className="text-sm text-gray-600">Total Jarak</div>
              </div>
            </div>
        </div>
        {/* Tambahkan stats card lain jika perlu */}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <SupplyDemandMap data={supplyDemandData} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <RouteOptimizer routes={routes} />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <DeliverySchedule schedule={deliverySchedule} />
        </motion.div>
      </div>
    </div>
  );
};

export default EggSpedition;