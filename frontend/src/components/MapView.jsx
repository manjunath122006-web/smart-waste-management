import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapView({ depot, stops = [], polylineCoords = [], height = '520px' }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapContainerRef.current._leaflet_id && !mapInstanceRef.current) {
      mapContainerRef.current._leaflet_id = null;
    }

    // Initialize Leaflet Map once
    if (!mapInstanceRef.current) {
      const defaultCenter = depot ? [depot.latitude, depot.longitude] : [12.9716, 77.5946];
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 13,
        zoomControl: true
      });

      // Dark / Clean OpenStreetMap Tile Provider
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      setTimeout(() => map.invalidateSize(), 200);
    }

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    const bounds = [];

    // 1. Plot Depot
    if (depot && depot.latitude && depot.longitude) {
      const depotLatLng = [depot.latitude, depot.longitude];
      bounds.push(depotLatLng);

      const depotIcon = L.divIcon({
        className: 'custom-depot-marker',
        html: `
          <div style="background: #3b82f6; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; border: 3px solid #ffffff; box-shadow: 0 0 14px rgba(59, 130, 246, 0.8);">
            🏢
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker(depotLatLng, { icon: depotIcon })
        .bindPopup(`<b>${depot.name || 'Municipal Depot'}</b><br>Dispatch Starting & Return Hub`)
        .addTo(layerGroup);
    }

    // 2. Plot Ordered Stops / Complaints
    stops.forEach((stop, index) => {
      const latLng = [stop.latitude, stop.longitude];
      bounds.push(latLng);

      const isCritical = (stop.priority_score || 0) >= 70;
      const markerColor = isCritical ? '#ef4444' : '#10b981';

      const stopIcon = L.divIcon({
        className: 'custom-stop-marker',
        html: `
          <div style="background: ${markerColor}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 700; font-size: 12px; border: 2px solid #ffffff; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
            ${stop.stop_sequence || index + 1}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      L.marker(latLng, { icon: stopIcon })
        .bindPopup(`
          <div style="font-family: sans-serif; font-size: 13px;">
            <b style="color: #0f172a;">Stop #${stop.stop_sequence || index + 1}</b><br/>
            <b>${stop.tracking_number}</b><br/>
            <span>Category: ${stop.category || stop.predicted_category || 'Waste'}</span><br/>
            <span>Priority: <b>${stop.priority_score}</b></span><br/>
            <p style="margin: 4px 0 0; color: #475569;">${stop.description || ''}</p>
          </div>
        `)
        .addTo(layerGroup);
    });

    // 3. Draw Route Polyline if provided
    if (polylineCoords && polylineCoords.length > 1) {
      const line = L.polyline(polylineCoords, {
        color: '#10b981',
        weight: 4,
        opacity: 0.85,
        dashArray: '4, 8'
      }).addTo(layerGroup);

      polylineCoords.forEach(c => bounds.push(c));
    }

    // Auto-fit map bounds to encompass all plotted points
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [depot, stops, polylineCoords]);

  return (
    <div 
      ref={mapContainerRef} 
      className="glass-panel" 
      style={{ height, width: '100%', position: 'relative' }} 
    />
  );
}
