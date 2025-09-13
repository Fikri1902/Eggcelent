import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Truck, User } from 'lucide-react';

const DeliverySchedule = ({ schedule }) => {
  const formatDateTime = (dateString) => new Date(dateString).toLocaleString('id-ID');

  return (
    <div className="glass-effect rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-orange-600" />
        <h2 className="text-xl font-semibold gradient-text">Jadwal Pengiriman</h2>
      </div>

      <div className="space-y-4">
        {schedule.map((delivery, index) => (
          <motion.div
            key={delivery.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-4 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">
                  {delivery.route.from_location.region_name} → {delivery.route.to_location.region_name}
                </h3>
                <p className="text-sm text-gray-600">Berangkat: {formatDateTime(delivery.departure_time)}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600 capitalize">
                {delivery.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1"><User className="w-4 h-4" />{delivery.driver_name}</span>
              <span className="flex items-center gap-1"><Truck className="w-4 h-4" />{delivery.vehicle_plate}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {schedule.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Belum ada jadwal pengiriman.</p>
        </div>
      )}
    </div>
  );
};

export default DeliverySchedule;