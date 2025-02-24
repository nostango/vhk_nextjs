// components/MapComponent.tsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';

const MapComponent: React.FC = () => {
  const { t } = useTranslation('common');
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix Leaflet's default icon paths (optional, but useful to avoid 404 errors)
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    // The coordinates of the Dojo.
    const myLatitude = 41.07449909420177; 
    const myLongitude =  -73.52111546462568; 
    const zoomLevel = 16;

    // Initialize the map with your coordinates.
    const map = L.map(mapContainerRef.current).setView([myLatitude, myLongitude], zoomLevel);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Add a marker at the center.
    const marker = L.marker([myLatitude, myLongitude]).addTo(map);
    marker.bindPopup(
      `<b>VHK Dojo</b><br>48 Union Street, Stamford, CT 06906<br><a target="_blank" rel="noopener noreferrer" href="https://maps.app.goo.gl/HmeRzewUCBQm7QWH8">${t('map.getDirections')}</a>`
  ).openPopup();

    // Cleanup the map when the component unmounts.
    return () => {
      map.off();
      map.remove();
    };
  }, []);

  return <div ref={mapContainerRef} style={{ height: '400px', width: '100%' }} />;
};

export default MapComponent;
