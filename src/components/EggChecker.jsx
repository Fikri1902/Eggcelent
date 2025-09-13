// src/components/EggChecker.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Egg, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import EggQualityForm from '@/components/EggQualityForm';
import EggStockTable from '@/components/EggStockTable';
import { useAuth } from '@/contexts/AuthContext';
import EggDetectionModal from './EggDetectionModal'; // IMPORT KOMPONEN BARU

const API_URL = 'http://127.0.0.1:5000/api/egg-stock';

const EggChecker = () => {
  const { token } = useAuth();
  const [eggData, setEggData] = useState({ total: 0, mutu1: 0, mutu2: 0, mutu3: 0, pecah: 0 });
  const [stockHistory, setStockHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // STATE BARU UNTUK MODAL

  const calculateTotals = (history) => {
    const totals = history.reduce((acc, curr) => {
      acc.mutu1 += curr.mutu1;
      acc.mutu2 += curr.mutu2;
      acc.mutu3 += curr.mutu3;
      acc.pecah += curr.pecah;
      acc.total += curr.mutu1 + curr.mutu2 + curr.mutu3 + curr.pecah;
      return acc;
    }, { total: 0, mutu1: 0, mutu2: 0, mutu3: 0, pecah: 0 });
    setEggData(totals);
  };
  
  const fetchStockHistory = useCallback(async () => {
    if (!token) {
        setLoading(false);
        return;
    }
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Gagal mengambil data dari server');
      const data = await response.json();
      setStockHistory(data);
      calculateTotals(data);
    } catch (error) {
      console.error("Error fetching stock history:", error);
      toast({ title: "Gagal memuat riwayat", description: error.message, variant: "destructive" });
    }
    setLoading(false);
  }, [token, toast]);

  useEffect(() => {
    fetchStockHistory();
  }, [fetchStockHistory]);

  const saveData = async (newEntry) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newEntry)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal menyimpan data ke server');
        }
        
        toast({ title: "✅ Data berhasil disimpan!", description: "Riwayat stok telah diperbarui." });
        setShowForm(false);
        fetchStockHistory();
    } catch (error) {
        console.error("Error saving data:", error);
        toast({ title: "Gagal menyimpan data", description: error.message, variant: "destructive" });
    }
  };

  return (
    // <> dan </> ini disebut React Fragment. Mereka dibutuhkan untuk "membungkus"
    // EggDetectionModal dan div utama menjadi satu elemen. Inilah yang menyebabkan error tadi.
    <>
      <EggDetectionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Egg Checker</h1>
            <p className="text-gray-600 mt-1">Deteksi mutu telur sesuai standar SNI dan kelola stok</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              <Search className="w-4 h-4 mr-2" />
              Deteksi Otomatis
            </Button>
            <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Input Manual
            </Button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="glass-effect rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Egg className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-semibold gradient-text">Stok Telur Saat Ini</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl"><div className="text-2xl font-bold text-blue-600">{eggData.total.toLocaleString()}</div><div className="text-sm text-blue-700">Total Telur</div></div>
            <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl"><div className="text-2xl font-bold text-emerald-600">{eggData.mutu1.toLocaleString()}</div><div className="text-sm text-emerald-700">Mutu 1</div></div>
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl"><div className="text-2xl font-bold text-blue-600">{eggData.mutu2.toLocaleString()}</div><div className="text-sm text-blue-700">Mutu 2</div></div>
            <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl"><div className="text-2xl font-bold text-yellow-600">{eggData.mutu3.toLocaleString()}</div><div className="text-sm text-yellow-700">Mutu 3</div></div>
            <div className="text-center p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl"><div className="text-2xl font-bold text-red-600">{eggData.pecah.toLocaleString()}</div><div className="text-sm text-red-700">Pecah</div></div>
          </div>
        </motion.div>
        
        {showForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <EggQualityForm 
              onSave={saveData}
              onCancel={() => setShowForm(false)}
            />
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <EggStockTable history={stockHistory} loading={loading} />
        </motion.div>
      </div>
    </>
  );
};

export default EggChecker;