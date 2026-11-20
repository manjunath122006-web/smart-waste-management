import math
from typing import List, Dict, Any, Tuple
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Computes great-circle distance between two points in kilometers.
    """
    R = 6371.0  # Earth's radius in km
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def compute_distance_matrix(locations: List[Tuple[float, float]]) -> List[List[int]]:
    """
    Computes integer distance matrix in meters (required by OR-Tools integer solver).
    """
    matrix = []
    for from_lat, from_lon in locations:
        row = []
        for to_lat, to_lon in locations:
            dist_km = haversine_distance_km(from_lat, from_lon, to_lat, to_lon)
            row.append(int(round(dist_km * 1000)))  # meters
        matrix.append(row)
    return matrix

def calculate_path_distance_km(ordered_indices: List[int], locations: List[Tuple[float, float]]) -> float:
    total_km = 0.0
    for i in range(len(ordered_indices) - 1):
        idx_a = ordered_indices[i]
        idx_b = ordered_indices[i + 1]
        lat_a, lon_a = locations[idx_a]
        lat_b, lon_b = locations[idx_b]
        total_km += haversine_distance_km(lat_a, lon_a, lat_b, lon_b)
    return total_km

def solve_collection_route(
    depot: Tuple[float, float],
    complaints: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Solves Traveling Salesperson Problem (TSP) starting and ending at depot.
    """
    if not complaints:
        return {
            "baseline_distance_km": 0.0,
            "optimized_distance_km": 0.0,
            "distance_reduction_percent": 0.0,
            "ordered_stops": [],
            "geojson": {"type": "FeatureCollection", "features": []}
        }

    # Node 0 is Depot. Nodes 1..N are complaints
    locations = [depot] + [(c["latitude"], c["longitude"]) for c in complaints]
    num_nodes = len(locations)

    # 1. Baseline Route: Order of arrival (0 -> 1 -> 2 -> ... -> N -> 0)
    baseline_indices = list(range(num_nodes)) + [0]
    baseline_dist_km = calculate_path_distance_km(baseline_indices, locations)

    # If only 1 or 2 locations, optimization is trivial
    if len(complaints) <= 2:
        optimized_indices = baseline_indices
        optimized_dist_km = baseline_dist_km
    else:
        # 2. Build OR-Tools Routing Model
        distance_matrix = compute_distance_matrix(locations)
        manager = pywrapcp.RoutingIndexManager(num_nodes, 1, 0)
        routing = pywrapcp.RoutingModel(manager)

        def distance_callback(from_index, to_index):
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            return distance_matrix[from_node][to_node]

        transit_callback_index = routing.RegisterTransitCallback(distance_callback)
        routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        )
        search_parameters.local_search_metaheuristic = (
            routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
        )
        search_parameters.time_limit.seconds = 2

        solution = routing.SolveWithParameters(search_parameters)

        if solution:
            optimized_indices = []
            index = routing.Start(0)
            while not routing.IsEnd(index):
                optimized_indices.append(manager.IndexToNode(index))
                index = solution.Value(routing.NextVar(index))
            optimized_indices.append(manager.IndexToNode(index))
            optimized_dist_km = calculate_path_distance_km(optimized_indices, locations)
        else:
            optimized_indices = baseline_indices
            optimized_dist_km = baseline_dist_km

    # Calculate exact distance reduction percentage
    if baseline_dist_km > 0.001 and baseline_dist_km >= optimized_dist_km:
        reduction_percent = ((baseline_dist_km - optimized_dist_km) / baseline_dist_km) * 100.0
    else:
        reduction_percent = 0.0

    # Build ordered complaint stops list (excluding depot return for stop list)
    ordered_stops = []
    seq = 1
    for node_idx in optimized_indices:
        if node_idx != 0:
            c = complaints[node_idx - 1]
            ordered_stops.append({
                "stop_sequence": seq,
                "complaint_id": c["id"],
                "tracking_number": c["tracking_number"],
                "latitude": c["latitude"],
                "longitude": c["longitude"],
                "severity_level": c.get("severity_level", 3),
                "priority_score": c.get("priority_score", 0.0),
                "category": c.get("predicted_category", "waste"),
                "description": c.get("description", "")
            })
            seq += 1

    # Build GeoJSON route representation for Leaflet
    coordinates_path = [[locations[idx][1], locations[idx][0]] for idx in optimized_indices]
    geojson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": coordinates_path
                },
                "properties": {
                    "type": "optimized_route",
                    "distance_km": round(optimized_dist_km, 2),
                    "reduction_percent": round(reduction_percent, 2)
                }
            }
        ]
    }

    return {
        "baseline_distance_km": round(baseline_dist_km, 2),
        "optimized_distance_km": round(optimized_dist_km, 2),
        "distance_reduction_percent": round(reduction_percent, 2),
        "ordered_stops": ordered_stops,
        "geojson": geojson
    }
