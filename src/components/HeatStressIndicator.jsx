import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, AlertTriangle, CheckCircle, AlertCircle, ShieldAlert } from 'lucide-react';

const HeatStressIndicator = ({ level }) => {
  const getIndicatorData = () => {
    switch (level) {
      case 'danger':
        return {
          title: 'Stres Berat (Bahaya)',
          description: 'Segera ambil tindakan mitigasi darurat!',
          icon: ShieldAlert,
          bgColor: 'from-red-600 to-red-500',
          temperature: '35°C+',
          thi: '> 80'
        };
      case 'medium':
        return {
          title: 'Stres Sedang',
          description: 'Produksi dan kualitas telur mulai menurun',
          icon: AlertTriangle,
          bgColor: 'from-orange-500 to-yellow-500',
          temperature: '32-35°C',
          thi: '77 - 80'
        };
      case 'mild':
        return {
          title: 'Stres Ringan',
          description: 'Ayam mulai mengurangi konsumsi pakan',
          icon: AlertCircle,
          bgColor: 'from-yellow-400 to-yellow-300',
          temperature: '30-32°C',
          thi: '73 - 76'
        };
      default:
        return {
          title: 'Kondisi Nyaman',
          description: 'Ayam dalam performa optimal',
          icon: CheckCircle,
          bgColor: 'from-green-500 to-emerald-500',
          temperature: '<30°C',
          thi: '< 72'
        };
    }
  };

  const indicator = getIndicatorData();
  const Icon = indicator.icon;

  return (
    <div className="glass-effect rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Thermometer className="w-6 h-6 text-orange-600" />
        <h2 className="text-xl font-semibold gradient-text">Status Heat Stress</h2>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`bg-gradient-to-r ${indicator.bgColor} rounded-xl p-6 text-white mb-4`}
      >
        <div className="flex items-center gap-4 mb-4">
          <Icon className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">{indicator.title}</h3>
            <p className="text-sm opacity-90">{indicator.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{indicator.temperature}</div>
            <div className="text-sm opacity-90">Suhu</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{indicator.thi}</div>
            <div className="text-sm opacity-90">THI Index</div>
          </div>
        </div>
      </motion.div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Update Terakhir</span>
          <span className="font-medium">Baru saja</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Prediksi 3 Jam</span>
          <span className="font-medium text-orange-600">Cenderung Naik</span>
        </div>
      </div>
    </div>
  );
};

export default HeatStressIndicator;