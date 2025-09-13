import numpy as np
import matplotlib.pyplot as plt
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
import json
import os
from datetime import datetime # <--- BARIS INI DITAMBAHKAN UNTUK MEMPERBAIKI ERROR

# --- FUNGSI-FUNGSI INTI (SEBAGIAN BESAR TIDAK BERUBAH) ---
def create_data_model():
    """Menyimpan data untuk masalah ini."""
    data = {}
    data['locations'] = [
        ('Peternakan Blitar (Depot)', (20, 40)),
        ('Pasar Wonokromo, Surabaya', (85, 82)),
        ('Pasar Turi, Surabaya', (82, 95)),
        ('Pasar Besar, Malang', (40, 25)),
        ('Pasar Induk Gadang, Malang', (42, 20)),
        ('Pasar Pahing, Kediri', (5, 55)),
        ('Pasar Setono Betek, Kediri', (8, 60)),
        ('Pasar Tanjung, Jember', (95, 5)),
        ('Pasar Induk, Jombang', (45, 75))
    ]
    data['demands'] = [0, 18, 25, 20, 15, 12, 10, 22, 16]
    data['num_vehicles'] = 3
    data['vehicle_capacities'] = [80, 70, 60]
    data['depot'] = 0
    return data

def compute_manhattan_distance_matrix(locations):
    """Membuat matriks jarak menggunakan Jarak Manhattan."""
    num_locations = len(locations)
    distance_matrix = {}
    for from_node in range(num_locations):
        distance_matrix[from_node] = {}
        for to_node in range(num_locations):
            if from_node == to_node:
                distance_matrix[from_node][to_node] = 0
            else:
                dist = (abs(locations[from_node][1][0] - locations[to_node][1][0]) +
                        abs(locations[from_node][1][1] - locations[to_node][1][1]))
                distance_matrix[from_node][to_node] = dist
    return distance_matrix

# --- FUNGSI YANG DIMODIFIKASI UNTUK OUTPUT JSON ---
def get_solution_dict(data, manager, routing, solution):
    """Mengembalikan solusi dalam format dictionary."""
    solution_data = {}
    solution_data['objective_value'] = solution.ObjectiveValue()
    solution_data['routes'] = []
    
    for vehicle_id in range(data['num_vehicles']):
        index = routing.Start(vehicle_id)
        route_nodes = []
        route_distance = 0
        route_load = 0
        
        while not routing.IsEnd(index):
            node_index = manager.IndexToNode(index)
            route_load += data['demands'][node_index]
            route_nodes.append({
                "name": data['locations'][node_index][0],
                "load": route_load
            })
            previous_index = index
            index = solution.Value(routing.NextVar(index))
            route_distance += routing.GetArcCostForVehicle(previous_index, index, vehicle_id)
            
        # Tambahkan node akhir (kembali ke depot)
        end_node_index = manager.IndexToNode(index)
        route_nodes.append({
            "name": data['locations'][end_node_index][0],
            "load": route_load
        })

        solution_data['routes'].append({
            "vehicle_id": vehicle_id + 1,
            "nodes": route_nodes,
            "distance": route_distance,
            "load": route_load,
            "capacity": data['vehicle_capacities'][vehicle_id]
        })
    return solution_data

# --- FUNGSI PLOT YANG DIMODIFIKASI UNTUK MENYIMPAN FILE ---
def plot_routes(data, manager, routing, solution, output_path):
    """Membuat visualisasi peta rute dan menyimpannya."""
    plt.figure(figsize=(12, 10))
    locations = data['locations']
    
    for i, (name, (x, y)) in enumerate(locations):
        if i == data['depot']:
            plt.scatter(x, y, c='red', s=200, marker='s', label='Depot (Peternakan)')
            plt.text(x, y + 2, name, ha='center', fontsize=9, weight='bold')
        else:
            plt.scatter(x, y, c='blue', s=100, label='Pasar' if i == 1 else "")
            plt.text(x, y + 2, name, ha='center', fontsize=9)

    colors = ['green', 'orange', 'purple', 'cyan']
    for vehicle_id in range(data['num_vehicles']):
        index = routing.Start(vehicle_id)
        color = colors[vehicle_id % len(colors)]
        while not routing.IsEnd(index):
            from_node = manager.IndexToNode(index)
            to_node = manager.IndexToNode(solution.Value(routing.NextVar(index)))
            start_x, start_y = locations[from_node][1]
            end_x, end_y = locations[to_node][1]
            plt.arrow(start_x, start_y, end_x - start_x, end_y - start_y,
                      color=color, length_includes_head=True, head_width=1.5, lw=1)
            index = solution.Value(routing.NextVar(index))

    for i in range(data['num_vehicles']):
         plt.plot([], [], color=colors[i], label=f'Rute Kendaraan {i+1}')

    plt.title('Peta Rute Distribusi Telur Optimal - EggSpedition', fontsize=16)
    plt.xlabel('Koordinat X')
    plt.ylabel('Koordinat Y')
    plt.grid(True, linestyle='--', alpha=0.6)
    plt.legend(loc='best')
    plt.savefig(output_path, bbox_inches='tight')
    plt.close()

def main():
    """Titik masuk utama untuk menyelesaikan CVRP."""
    # ... (Langkah 1-6 sama seperti sebelumnya) ...
    data = create_data_model()
    distance_matrix = compute_manhattan_distance_matrix(data['locations'])
    manager = pywrapcp.RoutingIndexManager(len(data['locations']), data['num_vehicles'], data['depot'])
    routing = pywrapcp.RoutingModel(manager)

    def distance_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return distance_matrix[from_node][to_node]

    transit_callback_index = routing.RegisterTransitCallback(distance_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    def demand_callback(from_index):
        from_node = manager.IndexToNode(from_index)
        return data['demands'][from_node]

    demand_callback_index = routing.RegisterUnaryTransitCallback(demand_callback)
    routing.AddDimensionWithVehicleCapacity(
        demand_callback_index, 0, data['vehicle_capacities'], True, 'Capacity')

    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC)
    search_parameters.local_search_metaheuristic = (
        routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH)
    search_parameters.time_limit.FromSeconds(5)
    
    solution = routing.SolveWithParameters(search_parameters)

    if solution:
        # Tentukan path output
        output_dir = 'public'
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        plot_path = os.path.join(output_dir, 'optimized_route_plot.png')
        
        # Simpan plot
        plot_routes(data, manager, routing, solution, plot_path)
        
        # Siapkan data JSON untuk output
        solution_dict = get_solution_dict(data, manager, routing, solution)
        solution_dict['plotUrl'] = f"/{os.path.basename(plot_path)}?v={datetime.now().timestamp()}" # Tambahkan timestamp untuk cache-busting
        
        # Cetak JSON ke stdout agar bisa ditangkap Flask
        print(json.dumps(solution_dict, indent=2))
    else:
        print(json.dumps({"error": "Tidak ditemukan solusi."}, indent=2))

if __name__ == '__main__':
    main()