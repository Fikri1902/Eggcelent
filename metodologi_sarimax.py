import pandas as pd
from datetime import datetime, timedelta
import statsmodels.api as sm
import matplotlib.pyplot as plt
import json
from meteostat import Point, Hourly
import warnings
from sklearn.metrics import mean_squared_error, mean_absolute_percentage_error
import numpy as np
import sys
import os

warnings.filterwarnings("ignore")

print("--- MODEL PERAMALAN THI MENGGUNAKAN SARIMAX ---")

try:
    lat = float(sys.argv[1])
    lon = float(sys.argv[2])
    location_name_simple = sys.argv[3] if len(sys.argv) > 3 else f"Lokasi Lat {lat:.2f}, Lon {lon:.2f}"
except IndexError:
    print("ERROR: Latitude, Longitude, dan Nama Lokasi dibutuhkan.")
    sys.exit(1)

print(f"Menggunakan lokasi: {location_name_simple} ({lat}, {lon})")

# --- 1. Mengambil & Mempersiapkan Data ---
print("\n[Tahap 1 & 2] Mengambil & mempersiapkan data THI...")
try:
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    location_point = Point(lat, lon)
    
    data = Hourly(location_point, start_date, end_date)
    df = data.fetch()

    if df.empty:
        print(f"ERROR: Stasiun cuaca '{location_name_simple}' tidak memiliki data historis.")
        sys.exit(1)
except Exception as e:
    print(f"ERROR: Gagal mengambil data historis: {e}")
    sys.exit(1)

df = df[['temp', 'rhum']].dropna()
if df.empty:
    print(f"ERROR: Data temperatur atau kelembaban historis tidak valid.")
    sys.exit(1)

# === PERUBAHAN DI SINI: Ekstrak data cuaca terbaru ===
latest_weather = df.iloc[-1]
current_weather_data = {
    "temp": latest_weather['temp'],
    "humidity": latest_weather['rhum']
}
# === AKHIR PERUBAHAN ===

def calculate_thi(temp, humidity):
    temp_f = temp * 1.8 + 32
    return temp_f - (0.55 - 0.0055 * humidity) * (temp_f - 58)
df['thi'] = calculate_thi(df['temp'], df['rhum'])
df_thi = df[['thi']]

print(f"SUCCESS: Berhasil mempersiapkan {len(df_thi)} baris data THI.")
# ... (Sisa dari skrip Anda tidak berubah sama sekali sampai bagian akhir) ...

# ... (Kode untuk plot historis, melatih model, dan plot peramalan tetap sama)
output_dir = 'public'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)
plt.figure(figsize=(15, 7))
plt.plot(df_thi.index, df_thi['thi'], label='Data THI Historis')
plt.title(f'Data THI Historis Asli - {location_name_simple}')
plt.xlabel('Tanggal')
plt.ylabel('Nilai THI')
plt.legend()
plt.grid(True, linestyle='--', alpha=0.6)
plt.tight_layout()
historical_plot_path = os.path.join(output_dir, 'historical_data_plot.png')
plt.savefig(historical_plot_path)
plt.close()
train_data = df_thi.iloc[:-72]
test_data = df_thi.iloc[-72:]
model = sm.tsa.SARIMAX(train_data['thi'], order=(1, 1, 1), seasonal_order=(1, 1, 1, 24))
results = model.fit(disp=False)
predictions = results.get_prediction(start=test_data.index[0], end=test_data.index[-1])
predicted_mean = predictions.predicted_mean
rmse = np.sqrt(mean_squared_error(test_data['thi'], predicted_mean))
mape = mean_absolute_percentage_error(test_data['thi'], predicted_mean) * 100
final_model = sm.tsa.SARIMAX(df_thi['thi'], order=(1, 1, 1), seasonal_order=(1, 1, 1, 24))
final_results = final_model.fit(disp=False)
forecast = final_results.get_forecast(steps=72)
forecast_df = forecast.summary_frame()
plt.figure(figsize=(15, 7))
plt.plot(df_thi['thi'][-72:], label='Data Historis (3 Hari Terakhir)')
plt.plot(forecast_df['mean'], label='Peramalan SARIMAX', color='orange')
plt.fill_between(forecast_df.index, forecast_df['mean_ci_lower'], forecast_df['mean_ci_upper'], color='orange', alpha=0.2, label='Interval Kepercayaan 95%')
plt.axhline(y=77, color='r', linestyle='--', label='Ambang Batas Stres Sedang (THI=77)')
plt.title(f'Peramalan THI 72 Jam ke Depan - {location_name_simple}')
plt.ylabel('Nilai THI')
plt.legend()
plt.grid(True, linestyle='--', alpha=0.6)
forecast_plot_path = os.path.join(output_dir, 'forecast_plot.png')
plt.savefig(forecast_plot_path)
plt.close()


# === PERUBAHAN PADA OUTPUT JSON ===
forecast_output = {
    'model': 'SARIMAX(1,1,1)(1,1,1)24',
    'location': {'lat': lat, 'lon': lon, 'name': location_name_simple},
    'current_weather': current_weather_data, # <-- Data baru disertakan di sini
    'evaluation_metrics': {'rmse': rmse, 'mape': f"{mape:.4f}%"},
    'generated_at': pd.Timestamp.now().isoformat(),
    'data': [{'time': idx.isoformat(), 'thi_forecast': row['mean']} for idx, row in forecast_df.iterrows()]
}

json_path = os.path.join(output_dir, 'forecast.json')
with open(json_path, 'w') as f:
    json.dump(forecast_output, f, indent=2)
print(f"SUCCESS: File '{json_path}' berhasil diperbarui dengan data cuaca saat ini.")
print("\nDONE: Proses selesai!")