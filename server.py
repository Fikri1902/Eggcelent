from flask import Flask, request, jsonify, g
from flask_cors import CORS
import subprocess
import os
import json
from datetime import datetime
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='public', static_url_path='')
CORS(app)

DB_PATH = os.path.join('data', 'db.json')

def read_db():
    if not os.path.exists(DB_PATH):
        with open(DB_PATH, 'w') as f:
            json.dump({"egg_stock_entries": [], "users": [], "locations": [], "routes": [], "deliveries": []}, f)
    with open(DB_PATH, 'r') as f:
        return json.load(f)

def write_db(data):
    with open(DB_PATH, 'w') as f:
        json.dump(data, f, indent=2)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token:
            return jsonify({'message': 'Token tidak ada!'}), 401
        
        db_data = read_db()
        current_user = None
        for user in db_data.get('users', []):
            if user.get('sessionToken') == token:
                current_user = user
                break
        
        if not current_user:
            return jsonify({'message': 'Token tidak valid!'}), 401
        
        g.current_user = current_user
        return f(*args, **kwargs)
    return decorated

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email dan password dibutuhkan'}), 400

    db_data = read_db()
    if any(u['email'] == email for u in db_data.get('users', [])):
        return jsonify({'message': 'Email sudah terdaftar'}), 409
    
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = {
        'id': str(uuid.uuid4()),
        'email': email,
        'password': hashed_password
    }
    db_data.get('users', []).append(new_user)
    write_db(db_data)
    
    return jsonify({'message': 'Registrasi berhasil'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email dan password dibutuhkan'}), 400

    db_data = read_db()
    user = next((u for u in db_data.get('users', []) if u['email'] == email), None)

    if not user or not check_password_hash(user['password'], password):
        return jsonify({'message': 'Email atau password salah'}), 401
    
    token = str(uuid.uuid4())
    for u in db_data['users']:
        if u['id'] == user['id']:
            u['sessionToken'] = token
            break
    write_db(db_data)
    
    user_data_to_return = {'id': user['id'], 'email': user['email']}
    
    return jsonify({'message': 'Login berhasil', 'token': token, 'user': user_data_to_return})


@app.route('/api/egg-stock', methods=['GET'])
@token_required
def get_egg_stock():
    db_data = read_db()
    user_id = g.current_user['id']
    user_entries = [entry for entry in db_data.get('egg_stock_entries', []) if entry.get('userId') == user_id]
    sorted_entries = sorted(user_entries, key=lambda x: x['created_at'], reverse=True)
    return jsonify(sorted_entries)


@app.route('/api/egg-stock', methods=['POST'])
@token_required
def add_egg_stock():
    new_entry = request.get_json()
    db_data = read_db()
    
    new_entry['id'] = str(uuid.uuid4())
    new_entry['created_at'] = datetime.utcnow().isoformat() + 'Z'
    new_entry['userId'] = g.current_user['id']
    
    db_data['egg_stock_entries'].append(new_entry)
    write_db(db_data)
    return jsonify(new_entry), 201

@app.route('/api/locations', methods=['GET'])
@token_required
def get_locations():
    db_data = read_db()
    user_id = g.current_user['id']
    user_data = [d for d in db_data.get('locations', []) if d.get('userId') == user_id]
    return jsonify(user_data)

@app.route('/api/routes', methods=['GET'])
@token_required
def get_routes():
    db_data = read_db()
    user_id = g.current_user['id']
    user_data = [d for d in db_data.get('routes', []) if d.get('userId') == user_id]
    return jsonify(user_data)

@app.route('/api/deliveries', methods=['GET'])
@token_required
def get_deliveries():
    db_data = read_db()
    user_id = g.current_user['id']
    user_data = [d for d in db_data.get('deliveries', []) if d.get('userId') == user_id]
    return jsonify(user_data)

@app.route('/api/find-station', methods=['POST'])
def find_station():
    data = request.get_json()
    lat = data.get('lat')
    lon = data.get('lon')

    if lat is None or lon is None:
        return jsonify({"status": "error", "message": "Latitude dan Longitude dibutuhkan."}), 400

    try:
        command = ['python', 'cari_stasiun.py', str(lat), str(lon)]
        result = subprocess.run(
            command, 
            check=True, 
            capture_output=True, 
            text=True,
            encoding='utf-8'
        )
        
        station_data = json.loads(result.stdout)
        return jsonify(station_data)
        
    except subprocess.CalledProcessError as e:
        try:
            error_details = json.loads(e.stdout)
            return jsonify(error_details), 404
        except:
            return jsonify({"status": "error", "message": f"Gagal mencari stasiun: {e.stderr}"}), 500


@app.route('/api/run-sarimax', methods=['POST'])
def run_sarimax():
    data = request.get_json()
    lat = data.get('lat')
    lon = data.get('lon')
    location_name = data.get('name', f"Lat {lat}, Lon {lon}")

    if lat is None or lon is None:
        return jsonify({"error": "Latitude (lat) dan Longitude (lon) dibutuhkan."}), 400

    try:
        command = [
            'python', 
            'metodologi_sarimax.py', 
            str(lat), 
            str(lon),
            location_name
        ]
        
        print(f"Executing command: {' '.join(command)}")

        result = subprocess.run(
            command, 
            check=True, 
            capture_output=True, 
            text=True,
            encoding='utf-8'
        )
        
        print("Script STDOUT:", result.stdout)
        
        json_path = os.path.join('public', 'forecast.json')
        with open(json_path, 'r') as f:
            forecast_data = json.load(f)

        return jsonify({
            "message": "Analisis SARIMAX berhasil.",
            "forecastData": forecast_data,
            "plotUrl": "/forecast_plot.png", 
            "historicalPlotUrl": "/historical_data_plot.png"
        })

    except subprocess.CalledProcessError as e:
        print("Error executing script:", e)
        print("Script STDERR:", e.stderr)
        return jsonify({
            "error": "Gagal menjalankan analisis.",
            "details": e.stderr or "Data cuaca untuk lokasi ini mungkin tidak tersedia."
        }), 500
    except FileNotFoundError:
        return jsonify({"error": "File 'public/forecast.json' tidak ditemukan setelah eksekusi."}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "Terjadi kesalahan internal pada server."}), 500
    
# Ganti fungsi ini di dalam file server.py

@app.route('/api/detect', methods=['POST'])
@token_required # Lindungi endpoint ini
def detect_egg_quality():
    # Karena kita sekarang menghasilkan data acak, kita tidak perlu lagi
    # menyimpan atau memproses file yang diunggah.
    # Cukup pastikan ada file yang dikirim untuk menjaga alur kerja frontend.
    if 'file' not in request.files:
        return jsonify({"error": "Tidak ada file gambar yang diunggah."}), 400

    try:
        # Jalankan skrip deteksi versi random
        # Kita tetap memberikan argumen palsu 'image_path' agar antarmuka sama
        command = ['python', 'detect_egg.py', 'placeholder.jpg']
        result = subprocess.run(
            command,
            check=True,
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        
        detection_data = json.loads(result.stdout)
        
        if detection_data.get('status') == 'error':
             return jsonify({"error": "Gagal melakukan deteksi.", "details": detection_data.get('message')}), 500

        return jsonify(detection_data)

    except Exception as e:
        return jsonify({"error": "Terjadi kesalahan internal.", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)