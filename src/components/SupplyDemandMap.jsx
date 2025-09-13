import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const SupplyDemandMap = ({ data }) => {
  const surplusRegions = data.filter(item => item.status === 'surplus');
  const deficitRegions = data.filter(item => item.status === 'defisit');

  return (
    <div className="glass-effect rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold gradient-text">Peta Supply & Demand (Data Kementan)</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Surplus Regions */}
        <div>
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Daerah Surplus
          </h3>
          <div className="space-y-3">
            {surplusRegions.map((region, index) => (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-green-800">{region.region_name}</h4>
                    <p className="text-sm text-green-600">
                      Surplus: {region.amount.toLocaleString()} ton
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-green-700">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">Rp {region.price_per_egg.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-green-600">per kg</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Deficit Regions */}
        <div>
          <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5" />
            Daerah Defisit
          </h3>
          <div className="space-y-3">
            {deficitRegions.map((region, index) => (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-red-800">{region.region_name}</h4>
                    <p className="text-sm text-red-600">
                      Kebutuhan: {Math.abs(region.amount).toLocaleString()} ton
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-red-700">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">Rp {region.price_per_egg.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-red-600">per kg</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyDemandMap;