import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

// Impor kembali komponen UI Anda yang sudah bagus
import WeatherCard from './WeatherCard';
import THIChart from './THIChart';
import HeatStressAlert from './HeatStressAlert';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
// Komponen LocationSelector kita letakkan di sini agar file tetap rapi
const LocationSelector = ({ onProcess, isLoading }) => {
  const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY || ''; 
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [selected, setSelected] = useState({ prov: '', reg: '' });
  const [coordinates, setCoordinates] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(() => toast({ title: "Error", description: "Gagal memuat data provinsi.", variant: "destructive" }));
  }, []);

  const handleSelect = async (level, value) => {
    let newSelected = { ...selected };
    if (level === 'prov') {
      newSelected = { prov: value, reg: '' };
      setSelected(newSelected);
      setCoordinates(null);
      if (value) {
        setLoadingLocation(true);
        const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${value}.json`);
        const newRegencies = await res.json();
        setRegencies(newRegencies);
        setLoadingLocation(false);
      } else { setRegencies([]); }
    } else if (level === 'reg') {
      newSelected = { ...newSelected, reg: value };
      setSelected(newSelected);
      if (value) {
        if (!OPENCAGE_API_KEY) {
          toast({ title: "Konfigurasi Diperlukan", description: "VITE_OPENCAGE_API_KEY belum diatur.", variant: "destructive" });
          return;
        }
        setLoadingLocation(true);
        const provName = provinces.find(p => p.id === newSelected.prov)?.name;
        const regName = regencies.find(r => r.id === value)?.name;
        const query = `${regName}, ${provName}, Indonesia`;
        setLocationName(regName || 'Lokasi Pilihan');
        const geoRes = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${OPENCAGE_API_KEY}`);
        const geoData = await geoRes.json();
        if (geoData.results && geoData.results.length > 0) {
          const { lat, lng } = geoData.results[0].geometry;
          setCoordinates({ lat, lon: lng });
        } else {
          toast({ title: "Error", description: "Koordinat tidak ditemukan.", variant: "destructive" });
        }
        setLoadingLocation(false);
      }
    }
  };

  const handleSubmit = () => {
    if (coordinates) { onProcess({ ...coordinates, name: locationName }); }
  };
  
  return (
    <div className="glass-effect rounded-2xl p-6">
      <h3 className="text-xl font-semibold gradient-text mb-4 flex items-center"><MapPin className="w-5 h-5 mr-2" /> Pilih Lokasi Peternakan</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" onChange={(e) => handleSelect('prov', e.target.value)} value={selected.prov}>
          <option value="">-- Provinsi --</option>
          {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" onChange={(e) => handleSelect('reg', e.target.value)} value={selected.reg} disabled={!selected.prov}>
          <option value="">-- Kabupaten/Kota --</option>
          {regencies.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </div>
      {coordinates && <p className="text-sm text-gray-600 mb-3">Koordinat Perkiraan: Lat: {coordinates.lat.toFixed(4)}, Lon: {coordinates.lon.toFixed(4)}</p>}
      <Button onClick={handleSubmit} disabled={!coordinates || isLoading || loadingLocation}>
        <Search className="w-4 h-4 mr-2" />
        {isLoading ? 'Menganalisis...' : (loadingLocation ? 'Mencari Lokasi...' : 'Analisis Lokasi Ini')}
      </Button>
    </div>
  );
};

// --- Komponen Utama EggClimate (VERSI FINAL) ---
const EggClimate = () => {
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Helper function untuk menentukan level heat stress dari nilai THI
  const getHeatStressLevel = (thi) => {
    if (thi >= 81) return 'danger';
    if (thi >= 77) return 'medium';
    if (thi >= 73) return 'mild';
    return 'normal';
  };

  // Fungsi utama untuk memproses lokasi
  const handleProcessLocation = async (locationData) => {
    if (!locationData?.lat) return;
    setLoading(true);
    setAnalysisResult(null);
    try {
      const stationRes = await fetch('http://127.0.0.1:5000/api/find-station', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: locationData.lat, lon: locationData.lon }),
      });
      const stationData = await stationRes.json();
      if (stationData.status === 'error' || !stationRes.ok) throw new Error(stationData.message);
      
      toast({ title: "Info", description: `Menggunakan data dari stasiun: ${stationData.name}` });

      const sarimaxPayload = { lat: stationData.latitude, lon: stationData.longitude, name: stationData.name };
      const response = await fetch('http://127.0.0.1:5000/api/run-sarimax', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sarimaxPayload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.details);
      
      localStorage.setItem('eggcellent-last-location', JSON.stringify(locationData));
      
      // --- INI BAGIAN PENTING: Menerjemahkan data dari Python ke format yang dibutuhkan UI ---
      const forecast = data.forecastData.data.map(item => ({
        date: new Date(item.time),
        thi: parseFloat(item.thi_forecast.toFixed(1)),
        heatStressLevel: getHeatStressLevel(item.thi_forecast),
      }));
      
      const alerts = forecast
        .filter(item => item.heatStressLevel === 'medium' || item.heatStressLevel === 'danger')
        .slice(0, 3) // Ambil 3 peringatan paling awal
        .map((item, index) => ({
          id: index + 1,
          time: item.date.toLocaleTimeString('id-ID', { weekday: 'long', hour: '2-digit', minute: '2-digit' }),
          level: item.heatStressLevel,
          message: `Potensi Stres ${item.heatStressLevel === 'danger' ? 'Berat' : 'Sedang'} (THI: ${item.thi})`,
          action: 'Tingkatkan ventilasi & pastikan air minum cukup.',
        }));
      
      // Menyiapkan state dengan data yang sudah diolah
      setAnalysisResult({
        forecast,
        alerts,
        currentWeather: {
          // Ambil data langsung dari output JSON yang baru
          temperature: data.forecastData.current_weather.temp, 
          humidity: data.forecastData.current_weather.humidity,
          thi: forecast[0].thi,
          heatStressLevel: forecast[0].heatStressLevel,
        }
      });
      toast({ title: "Sukses", description: "Analisis peramalan cuaca berhasil." });

    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const savedLocationRaw = localStorage.getItem('eggcellent-last-location');
      if (savedLocationRaw) handleProcessLocation(JSON.parse(savedLocationRaw));
    } catch (error) {
      localStorage.removeItem('eggcellent-last-location');
    }
  }, []);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text">Analisis Iklim & Stres Panas</h1>
        <p className="text-gray-600 mt-1">Gunakan peramalan THI untuk mengantisipasi potensi stres panas pada ternak Anda.</p>
      </motion.div>

      <LocationSelector onProcess={handleProcessLocation} isLoading={loading} />
      
      {loading && <p className="text-center py-10">Harap tunggu, sedang menjalankan model peramalan SARIMAX...</p>}
      
      {analysisResult && (
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <WeatherCard weather={analysisResult.currentWeather} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <HeatStressAlert alerts={analysisResult.alerts} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <THIChart forecast={analysisResult.forecast} />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EggClimate;