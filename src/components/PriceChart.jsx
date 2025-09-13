import React from 'react';
import { DollarSign } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const PriceChart = ({ priceData }) => {
  // Urutkan data dari harga terendah ke tertinggi untuk visualisasi yang lebih baik
  const sortedData = [...priceData].sort((a, b) => a.harga - b.harga);

  return (
    <div className="glass-effect rounded-2xl p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold gradient-text">Harga Telur Rata-Rata per Provinsi (PIHPS)</h2>
      </div>
      
      {sortedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3}/>
            <XAxis type="number" />
            <YAxis 
              type="category" 
              dataKey="provinsi" 
              width={100} 
              tick={{ fontSize: 12 }} 
            />
            <Tooltip formatter={(value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)} />
            <Legend />
            <Bar dataKey="harga" name="Harga (Rp/kg)" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center py-10 text-gray-500">
          <p>Data harga tidak ditemukan.</p>
        </div>
      )}
    </div>
  );
};

export default PriceChart;