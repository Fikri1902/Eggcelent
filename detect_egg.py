# detect_egg.py (versi random)
import random
import json
import sys

def get_random_detection():
    """
    Menghasilkan hasil deteksi mutu telur secara acak.
    """
    try:
        # Daftar kemungkinan hasil mutu
        class_names = ['Mutu 1', 'Mutu 2', 'Mutu 3', 'Rusak']
        
        # Pilih satu mutu secara acak
        random_quality = random.choice(class_names)
        
        # Buat persentase keyakinan acak (antara 75% hingga 99%)
        random_confidence = random.uniform(75.0, 99.9)
        
        # Format hasil sesuai dengan yang diharapkan oleh frontend
        detection_result = {
            "quality": random_quality,
            "confidence": f"{random_confidence:.2f}%"
        }
        
        # Kembalikan dalam format JSON yang sama seperti model asli
        return {"status": "ok", "detections": [detection_result]}

    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    # Kita tidak lagi memerlukan image_path, tapi file tetap menerimanya
    # agar tidak error saat dipanggil oleh server.py
    # image_file_path = sys.argv[1] 
    
    final_result = get_random_detection()
    
    # Cetak hasil sebagai JSON
    print(json.dumps(final_result))