import React from 'react';
import { motion } from 'framer-motion';
import { Route, Clock } from 'lucide-react';

const RouteOptimizer = ({ routes }) => {
  return (
    <div className="glass-effect rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Route className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-semibold gradient-text">Rute Teroptimasi</h2>
      </div>

      <div className="space-y-4">
        {routes.map((route, index) => (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-4 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl"
          >
            <h3 className="font-semibold text-gray-800 text-lg">
              {route.from_location.region_name} → {route.to_location.region_name}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              <span className="flex items-center gap-1"><Route className="w-4 h-4" />{route.distance_km} km</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{route.duration_hours} jam</span>
            </div>
          </motion.div>
        ))}
      </div>

      {routes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Route className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Belum ada rute yang dioptimasi.</p>
          <p className="text-sm">Klik tombol "Optimasi Rute" untuk memulai.</p>
        </div>
      )}
    </div>
  );
};

export default RouteOptimizer;