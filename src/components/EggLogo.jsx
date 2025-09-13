import { Egg } from 'lucide-react';
import React from 'react';

// Ini adalah komponen sederhana untuk menampilkan logo telur
// Kita menggunakan ikon yang sudah ada agar konsisten
const EggLogo = ({ className }) => {
  return <Egg className={className} />;
};

export default EggLogo;