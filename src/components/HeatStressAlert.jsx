import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const HeatStressAlert = ({ alerts }) => {
  const getAlertIcon = (level) => {
    switch (level) {
      case 'high':
        return AlertTriangle;
      case 'medium':
        return AlertTriangle;
      default:
        return CheckCircle;
    }
  };

  const getAlertColor = (level) => {
    switch (level) {
      case 'high':
        return 'from-red-500 to-orange-500';
      case 'medium':
        return 'from-yellow-500 to-orange-400';
      default:
        return 'from-green-500 to-emerald-500';
    }
  };

  const getAlertBg = (level) => {
    switch (level) {
      case 'high':
        return 'from-red-50 to-orange-50 border-red-200';
      case 'medium':
        return 'from-yellow-50 to-orange-50 border-yellow-200';
      default:
        return 'from-green-50 to-emerald-50 border-green-200';
    }
  };

  return (
    <div className="glass-effect rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="w-6 h-6 text-orange-600" />
        <h2 className="text-xl font-semibold gradient-text">Early Warning Heat Stress</h2>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
          <p className="text-gray-600">Tidak ada peringatan heat stress saat ini</p>
          <p className="text-sm text-gray-500">Kondisi kandang dalam keadaan normal</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, index) => {
            const Icon = getAlertIcon(alert.level);
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 bg-gradient-to-r ${getAlertBg(alert.level)} border rounded-xl`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 bg-gradient-to-r ${getAlertColor(alert.level)} rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-600">{alert.time}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.level === 'high' 
                          ? 'bg-red-100 text-red-800'
                          : alert.level === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {alert.level.toUpperCase()}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 mb-2">{alert.message}</h3>
                    <p className="text-sm text-gray-600">
                      <strong>Tindakan:</strong> {alert.action}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">Tindakan Cepat</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg text-left hover:from-blue-100 hover:to-cyan-100 transition-colors">
            <div className="font-medium text-blue-800">Nyalakan Kipas</div>
            <div className="text-sm text-blue-600">Tingkatkan sirkulasi udara</div>
          </button>
          
          <button className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg text-left hover:from-green-100 hover:to-emerald-100 transition-colors">
            <div className="font-medium text-green-800">Semprotkan Air</div>
            <div className="text-sm text-green-600">Dinginkan atap kandang</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeatStressAlert;