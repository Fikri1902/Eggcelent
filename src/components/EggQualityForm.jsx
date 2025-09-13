import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EggQualityForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    mutu1: 0,
    mutu2: 0,
    mutu3: 0,
    pecah: 0,
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Kirim hanya data entri baru
    const newEntry = {
      mutu1: parseInt(formData.mutu1) || 0,
      mutu2: parseInt(formData.mutu2) || 0,
      mutu3: parseInt(formData.mutu3) || 0,
      pecah: parseInt(formData.pecah) || 0,
      notes: formData.notes,
    };

    onSave(newEntry);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="glass-effect rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold gradient-text">Input Stok Telur Manual</h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mutu 1 (Premium)
            </label>
            <input
              type="number"
              min="0"
              value={formData.mutu1}
              onChange={(e) => handleChange('mutu1', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mutu 2 (Standar)
            </label>
            <input
              type="number"
              min="0"
              value={formData.mutu2}
              onChange={(e) => handleChange('mutu2', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mutu 3 (Ekonomis)
            </label>
            <input
              type="number"
              min="0"
              value={formData.mutu3}
              onChange={(e) => handleChange('mutu3', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telur Pecah
            </label>
            <input
              type="number"
              min="0"
              value={formData.pecah}
              onChange={(e) => handleChange('pecah', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catatan (Opsional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tambahkan catatan tentang kondisi telur atau sumber..."
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button 
            type="submit"
            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Simpan Data
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EggQualityForm;