import sys
from ultralytics import YOLO
import json

def detect_quality(image_path):
    """
    Memuat model YOLOv8 dan melakukan deteksi pada gambar yang diberikan.
    """
    try:
        # Muat model best.pt Anda
        model = YOLO('best.pt') 

        # Lakukan prediksi pada gambar
        results = model(image_path)

        # Siapkan untuk menyimpan hasil
        detection_results = []
        
        # Iterasi melalui hasil deteksi
        for r in results:
            boxes = r.boxes
            for box in boxes:
                # Dapatkan nama kelas (Mutu1, Mutu2, dll.)
                class_id = int(box.cls[0])
                class_name = model.names[class_id]
                
                # Dapatkan confidence score
                confidence = float(box.conf[0])
                
                detection_results.append({
                    "quality": class_name,
                    "confidence": f"{confidence:.2%}" # Format ke persen
                })

        # Jika tidak ada telur yang terdeteksi
        if not detection_results:
            return {"status": "ok", "detections": [{"quality": "Tidak Terdeteksi", "confidence": "N/A"}]}

        return {"status": "ok", "detections": detection_results}

    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    # Ambil path gambar dari argumen command line
    image_file_path = sys.argv[1]
    
    # Jalankan deteksi
    final_result = detect_quality(image_file_path)
    
    # Cetak hasil sebagai JSON agar bisa ditangkap oleh server.py
    print(json.dumps(final_result))