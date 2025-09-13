import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, FileUp, X, Loader2, UploadCloud } from 'lucide-react';
import { Button } from './ui/button';
import EggLogo from './EggLogo';
import { useAuth } from '@/contexts/AuthContext'; // Impor useAuth untuk token
import { toast } from '@/components/ui/use-toast';

const EggDetectionModal = ({ isOpen, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const { token } = useAuth();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null); // Reset hasil sebelumnya
    }
  };

  const handleDetect = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setResult(null);
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
        const response = await fetch('http://127.0.0.1:5000/api/detect', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.details || 'Gagal mendeteksi gambar.');
        }
        
        setResult(data.detections[0]); // Ambil hasil deteksi pertama
    } catch (error) {
        toast({ title: "Error Deteksi", description: error.message, variant: "destructive" });
    } finally {
        setIsProcessing(false);
    }
  };
  
  const handleClose = () => {
    setResult(null);
    setPreview(null);
    setSelectedFile(null);
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl p-6 w-full max-w-lg relative"
          >
            <Button variant="ghost" size="icon" className="absolute top-3 right-3" onClick={handleClose}>
              <X className="w-5 h-5" />
            </Button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold gradient-text">Deteksi Mutu Telur Otomatis</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Kolom Kiri: Upload & Preview */}
              <div>
                <div 
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
                    onClick={() => fileInputRef.current.click()}
                >
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-48 object-contain rounded" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <UploadCloud className="w-12 h-12 mb-2" />
                      <p>Klik untuk mengunggah gambar</p>
                    </div>
                  )}
                </div>
                <Button className="w-full mt-4" onClick={handleDetect} disabled={!selectedFile || isProcessing}>
                  {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menganalisis...</> : 'Deteksi Gambar Ini'}
                </Button>
              </div>

              {/* Kolom Kanan: Hasil */}
              <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6">
                {isProcessing ? (
                  <>
                    <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
                    <p className="mt-4 text-gray-600">Memproses dengan model AI...</p>
                  </>
                ) : result ? (
                  <div className="text-center">
                      <p className="text-gray-600">Hasil Deteksi:</p>
                      <p className="text-3xl font-bold text-purple-700 my-2">{result.quality}</p>
                      <p className="text-sm text-gray-500">Tingkat Keyakinan: {result.confidence}</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <EggLogo className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Hasil deteksi akan muncul di sini.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EggDetectionModal;