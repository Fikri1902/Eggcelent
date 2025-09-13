import React from 'react';
import { BarChart2 } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const HistoricalProductionChart = ({ history }) => {
  // Proses data untuk mengelompokkan total telur per hari
  const processDataForChart = (data) => {
    if (!data || data.length === 0) return [];

    const dailyData = data.reduce((acc, entry) => {
      const date = new Date(entry.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' });
      
      if (!acc[date]) {
        acc[date] = { mutu1: 0, mutu2: 0, mutu3: 0, pecah: 0, total: 0 };
      }
      
      acc[date].mutu1 += entry.mutu1;
      acc[date].mutu2 += entry.mutu2;
      acc[date].mutu3 += entry.mutu3;
      acc[date].pecah += entry.pecah;
      acc[date].total += entry.mutu1 + entry.mutu2 + entry.mutu3 + entry.pecah;

      return acc;
    }, {});

    // Mengubah format dan mengurutkan data berdasarkan tanggal
    return Object.entries(dailyData)
      .map(([date, values]) => ({ date, ...values }))
      .sort((a, b) => {
          const dateA = new Date(a.date.split('/').reverse().join('-'));
          const dateB = new Date(b.date.split('/').reverse().join('-'));
          return dateA - dateB;
      })
      .slice(-7); // Ambil 7 hari terakhir
  };

  const chartData = processDataForChart(history);

  return (
    <div className="h-full">
      <h2 className="text-xl font-semibold gradient-text mb-4">Produksi Telur Harian</h2>
      
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" name="Total" stroke="#3B82F6" strokeWidth={2} />
            <Line type="monotone" dataKey="mutu1" name="Mutu 1" stroke="#10B981" strokeWidth={2} />
            <Line type="monotone" dataKey="mutu2" name="Mutu 2" stroke="#F59E0B" strokeWidth={2} />
            <Line type="monotone" dataKey="pecah" name="Pecah" stroke="#EF4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-center text-gray-500">
          <p>Belum ada data historis yang cukup untuk ditampilkan.</p>
        </div>
      )}
    </div>
  );
};

export default HistoricalProductionChart;