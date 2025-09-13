import React from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText } from 'lucide-react';

const EggStockTable = ({ history, loading }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>Memuat riwayat...</p>
        </div>
      );
    }

    if (history.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Belum ada riwayat input stok telur</p>
          <p className="text-sm">Klik "Input Manual" untuk menambahkan data baru.</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Tanggal</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Mutu 1</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Mutu 2</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Mutu 3</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Pecah</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Total</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Catatan</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, index) => (
              <motion.tr
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                  {formatDate(entry.created_at)}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    +{entry.mutu1}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    +{entry.mutu2}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    +{entry.mutu3}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    +{entry.pecah}
                  </span>
                </td>
                <td className="py-3 px-4 text-center font-semibold text-gray-800">
                  +{entry.mutu1 + entry.mutu2 + entry.mutu3 + entry.pecah}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                  {entry.notes || '-'}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="glass-effect rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold gradient-text">Riwayat Input Stok</h2>
      </div>
      {renderContent()}
    </div>
  );
};

export default EggStockTable;