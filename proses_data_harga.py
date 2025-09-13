import pandas as pd
import json
import os

def proses_harga_telur(input_csv, output_json):
    """
    Membersihkan dan memproses data harga telur dari CSV ke JSON.
    """
    print(f"Membaca data dari {input_csv}...")
    try:
        # Membaca CSV dan memilih kolom yang relevan
        df = pd.read_csv(input_csv)
        # Asumsi kolom harga relevan adalah 'v1' (harga hari ini)
        df_clean = df[['region', 'v1']].copy()
        df_clean = df_clean.rename(columns={'region': 'provinsi', 'v1': 'harga'})

        # Menghapus baris yang tidak memiliki data harga
        df_clean.dropna(subset=['harga'], inplace=True)
        
        # Mengambil data hanya untuk level provinsi (menghindari duplikat kota/pasar)
        # Ini asumsi berdasarkan struktur data, mungkin perlu penyesuaian
        provinsi_list = [
            "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Jambi", "Sumatera Selatan",
            "Bengkulu", "Lampung", "Kep. Bangka Belitung", "Kep. Riau", "DKI Jakarta",
            "Jawa Barat", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur", "Banten", "Bali",
            "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Kalimantan Barat", "Kalimantan Tengah",
            "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara", "Sulawesi Utara",
            "Sulawesi Tengah", "Sulawesi Selatan", "Sulawesi Tenggara", "Gorontalo",
            "Sulawesi Barat", "Maluku", "Maluku Utara", "Papua Barat", "Papua"
        ]
        df_provinsi = df_clean[df_clean['provinsi'].isin(provinsi_list)]
        
        # Mengubah ke format dictionary
        data_json = df_provinsi.to_dict(orient='records')
        
        # Memastikan folder 'public' ada
        if not os.path.exists('public'):
            os.makedirs('public')
            
        # Menyimpan ke file JSON
        with open(output_json, 'w') as f:
            json.dump(data_json, f, indent=2)
            
        print(f"✅ Data harga berhasil diproses dan disimpan di {output_json}")
        
    except FileNotFoundError:
        print(f"❌ Error: File {input_csv} tidak ditemukan.")
    except Exception as e:
        print(f"❌ Terjadi error: {e}")

if __name__ == "__main__":
    # Nama file input dan output
    csv_file = 'harga_telur_indonesia.csv'
    json_file = 'public/data_harga_telur.json'
    
    proses_harga_telur(csv_file, json_file)