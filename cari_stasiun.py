import sys
from meteostat import Stations
import json

try:
    lat = float(sys.argv[1])
    lon = float(sys.argv[2])

    # Cari stasiun terdekat dari koordinat yang diberikan
    stations = Stations()
    stations = stations.nearby(lat, lon)
    
    # Ambil 1 stasiun teratas
    station = stations.fetch(1)

    if not station.empty:
        # Jika stasiun ditemukan, kembalikan datanya sebagai JSON
        result = {
            "status": "success",
            "id": station.index[0],
            "name": station.iloc[0]['name'],
            "latitude": station.iloc[0]['latitude'],
            "longitude": station.iloc[0]['longitude'],
            "distance_km": station.iloc[0]['distance'] / 1000 # konversi meter ke km
        }
        print(json.dumps(result))
    else:
        # Jika tidak ada stasiun sama sekali
        result = {
            "status": "error",
            "message": "Tidak ada stasiun cuaca Meteostat yang ditemukan di dekat lokasi ini."
        }
        print(json.dumps(result))
        sys.exit(1)

except Exception as e:
    result = {
        "status": "error",
        "message": str(e)
    }
    print(json.dumps(result))
    sys.exit(1)