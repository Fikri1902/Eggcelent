import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, BarChart3 } from 'lucide-react';

const EggQualityChart = ({ data }) => {
  const total = data.total || 1;
  const qualities = [
    { name: 'Mutu 1', value: data.mutu1, color: 'from-emerald-500 to-green-600', percentage: ((data.mutu1 / total) * 100).toFixed(1) },
    { name: 'Mutu 2', value: data.mutu2, color: 'from-blue-500 to-indigo-600', percentage: ((data.mutu2 / total) * 100).toFixed(1) },
    { name: 'Mutu 3', value: data.mutu3, color: 'from-yellow-500 to-orange-500', percentage: ((data.mutu3 / total) * 100).toFixed(1) },
    { name: 'Pecah', value: data.pecah, color: 'from-red-500 to-pink-600', percentage: ((data.pecah / total) * 100).toFixed(1) }
  ];

  return (
    <div className="glass-effect rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <PieChart className="w-6 h-6 text-emerald-600" />
        <h2 className="text-xl font-semibold gradient-text">Distribusi Mutu Telur</h2>
      </div>

      <div className="space-y-4">
        {qualities.map((quality, index) => (
          <motion.div
            key={quality.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 bg-gradient-to-r ${quality.color} rounded-full`}></div>
              <span className="font-medium text-gray-700">{quality.name}</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-800">{quality.value.toLocaleString()}</div>
              <div className="text-sm text-gray-600">{quality.percentage}%</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Total Telur</span>
          <span className="text-2xl font-bold gradient-text">{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default EggQualityChart;