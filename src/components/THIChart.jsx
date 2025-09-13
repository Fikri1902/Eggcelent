import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const THIChart = ({ forecast }) => {
  const next24Hours = forecast.slice(0, 24);
  const next3Days = forecast.filter((item, index) => new Date(item.date).getHours() % 6 === 0).slice(0, 12);

  const formatTime = (date) => date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (date) => date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' });

  // --- PERUBAHAN DI SINI ---
  const getTHIColor = (level) => {
    switch (level) {
      case 'extreme': return 'bg-red-700';
      case 'severe': return 'bg-red-500';
      case 'moderate': return 'bg-orange-500';
      case 'mild': return 'bg-yellow-400';
      default: return 'bg-green-500';
    }
  };

  const getTHIGradient = (level) => {
     switch (level) {
      case 'extreme': return 'from-red-700 to-red-600';
      case 'severe': return 'from-red-600 to-orange-500';
      case 'moderate': return 'from-orange-500 to-yellow-500';
      case 'mild': return 'from-yellow-400 to-yellow-300';
      default: return 'from-green-500 to-emerald-500';
    }
  }
  // --- AKHIR PERUBAHAN ---

  const getTHIHeight = (thi) => {
    const minThi = 65;
    const maxThi = 90;
    return Math.max(0, Math.min(100, ((thi - minThi) / (maxThi - minThi)) * 100));
  };

  return (
    <div className="glass-effect rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-semibold gradient-text">Prediksi THI 3 Hari Ke Depan</h2>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Prediksi 24 Jam (Per Jam)</h3>
        <div className="overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-4">
            {next24Hours.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className="flex flex-col items-center min-w-[60px]"
              >
                <div className="text-xs text-gray-600 mb-1">{formatTime(item.date)}</div>
                <div className="relative w-6 h-24 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`absolute bottom-0 w-full transition-all duration-500 ${getTHIColor(item.heatStressLevel)}`}
                    style={{ height: `${getTHIHeight(item.thi)}%` }}
                    title={`THI: ${item.thi}`}
                  />
                </div>
                <div className="text-xs font-semibold mt-1 text-gray-700">{item.thi}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Prediksi 3 Hari (Per 6 Jam)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {next3Days.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`p-3 rounded-xl text-white bg-gradient-to-r ${getTHIGradient(item.heatStressLevel)}`}
            >
              <div className="text-center">
                <div className="text-xs opacity-90 mb-1">{formatDate(item.date)} {formatTime(item.date)}</div>
                <div className="text-lg font-bold mb-1">THI {item.thi}</div>
                <div className="text-sm uppercase text-xs font-bold">{item.heatStressLevel}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap justify-center gap-4 text-xs">
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded"></div><span>Nyaman (&le;72)</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-400 rounded"></div><span>Ringan (73-76)</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded"></div><span>Sedang (77-80)</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded"></div><span>Berat (81-84)</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-700 rounded"></div><span>Ekstrem (&ge;85)</span></div>
        </div>
      </div>
    </div>
  );
};

export default THIChart;