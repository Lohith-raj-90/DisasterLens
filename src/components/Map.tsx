'use client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

// Custom Map Panning Component
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 15, { animate: true });
  }, [center, map]);
  return null;
}

export default function Map({ signals, activeSignalId, onMarkerClick }: any) {
  const defaultCenter: [number, number] = [12.9716, 77.5946];

  let activeCenter = defaultCenter;
  if (activeSignalId) {
    const s = signals.find((x:any) => x.id === activeSignalId);
    if (s && s.location_lat && s.location_lng) {
      activeCenter = [s.location_lat, s.location_lng];
    }
  }

  // Define custom icons
  const createIcon = (priority: string | number) => {
    const p = Number(priority);
    const isCritical = p >= 60; // 60+ is Critical in our logic
    const isHigh = p >= 35 && p < 60;
    
    let color = isCritical ? '#ef4444' : (isHigh ? '#f97316' : '#eab308');
    
    return L.divIcon({
      className: '',
      html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; box-shadow: 0 0 10px ${color}; border: 2px solid white;"></div>`,
      iconSize: [20, 20]
    });
  };

  return (
    <MapContainer center={defaultCenter} zoom={12} style={{ height: '100%', width: '100%', zIndex: 10 }}>
      {/* Dark map variation using filter on CSS, or standardized tile layer */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
      />
      
      <MapUpdater center={activeCenter} />

      {signals.map((sig: any) => sig.location_lat && (
        <Marker 
          key={sig.id} 
          position={[sig.location_lat, sig.location_lng]} 
          icon={createIcon(sig.priority_score)}
          eventHandlers={{ click: () => onMarkerClick(sig.id) }}
        >
          <Popup className="text-black">
            <b>{sig.user.name}</b><br/>
            {sig.disaster_type} - Battery: {sig.battery_level}%
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
