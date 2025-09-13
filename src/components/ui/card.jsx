import React from 'react';

// Komponen sederhana untuk membungkus konten dengan style yang konsisten
export const Card = ({ children, className = '' }) => (
  <div className={`glass-effect rounded-2xl p-6 ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-6 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h2 className={`text-xl font-semibold gradient-text ${className}`}>
    {children}
  </h2>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);