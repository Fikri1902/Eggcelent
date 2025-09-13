import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Wind, Eye } from 'lucide-react';

const WeatherCard = ({ weather }) => {
  const getHeatStressColor = (level) => {
    switch (level) {
      case 'danger': return 'from-red-600 to-red-500';
      case 'medium': return 'from-orange-500 to-yellow-500';
      case 'mild': return 'from-yellow-400 to-yellow-300';
      default: return 'from-green-500 to-emerald-500';
    }
  };

  const getHeatStressText = (level) => {
    switch (level) {
      case 'danger': return 'BAHAYA';
      case 'medium': return 'STRES SEDANG';
      case 'mild': return 'STRES RINGAN';
      default: return 'NORMAL';
    }
  };

  return (
    <div className="glass-effect rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Eye className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold gradient-text">Kondisi Cuaca Terdekat</h2>
        <span className="text-sm text-gray-500">Berdasarkan Model SARIMAX</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Thermometer className="w-6 h-6 text-red-500" />
              <div>
                <div className="text-sm text-red-700">Suhu Udara</div>
                <div className="text-2xl font-bold text-red-600">
                  {weather.temperature ? `${weather.temperature}°C` : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Droplets className="w-6 h-6 text-blue-500" />
              <div>
                <div className="text-sm text-blue-700">Kelembaban</div>
                <div className="text-2xl font-bold text-blue-600">
                  {weather.humidity ? `${weather.humidity}%` : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`p-6 bg-gradient-to-r ${getHeatStressColor(weather.heatStressLevel)} rounded-xl text-white`}
          >
            <div className="text-center">
              <div className="text-sm opacity-90 mb-2">Prediksi Temperature Humidity Index (THI)</div>
              <div className="text-4xl font-bold mb-2">{weather.thi}</div>
              <div className="text-lg font-semibold">
                {getHeatStressText(weather.heatStressLevel)}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;