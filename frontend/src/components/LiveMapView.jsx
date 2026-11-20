import React, { useState } from 'react';
import EnterpriseMapView from './EnterpriseMapView';
import { Layers, MapPin, Truck, Filter, RefreshCw, Navigation } from 'lucide-react';

export default function LiveMapView({
  bins = [],
  vehicles = [],
  routes = [],
  latestRoute = null,
  activeZone = 'ALL',
  onRefresh = () => {}
}) {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedBin, setSelectedBin] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div className="page-title-block">
          <h2>GIS Metropolitan Live Fleet & Bin Map</h2>
          <p>
            Interactive GIS geospatial intelligence tracking container overflow thresholds, dynamic truck telemetry, and collection paths.
          </p>
        </div>
        <div className="header-action-group">
          <button className="btn-secondary btn-sm" onClick={onRefresh}>
            <RefreshCw size={13} />
            <span>Refresh Coordinates</span>
          </button>
        </div>
      </div>

      <div style={{ height: 'calc(100vh - 190px)', minHeight: 600 }}>
        <EnterpriseMapView
          depot={{ name: 'Central Municipal Waste Depot', latitude: 12.9716, longitude: 77.5946 }}
          bins={bins}
          vehicles={vehicles}
          routes={routes.length > 0 ? routes : (latestRoute ? [{
            name: latestRoute.route_name || 'Active Route',
            coords: latestRoute?.geojson?.features?.[0]?.geometry?.coordinates
              ? latestRoute.geojson.features[0].geometry.coordinates.map(c => [c[1], c[0]])
              : [],
            distance_km: latestRoute.total_optimized_distance_km,
            efficiency: `${latestRoute.distance_reduction_percent}%`
          }] : [])}
          activeZone={activeZone}
          selectedVehicleId={selectedVehicle?.id}
          onSelectBin={setSelectedBin}
          onSelectVehicle={setSelectedVehicle}
          height="100%"
          isSimulationPlaying={isPlaying}
          onToggleSimulation={() => setIsPlaying(!isPlaying)}
        />
      </div>
    </div>
  );
}
