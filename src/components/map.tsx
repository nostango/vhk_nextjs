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

    // The coordinates of the Dojo. 41.043056943787406, -73.54143616313748
    const myLatitude = 41.043056943787406;
    const myLongitude =  -73.54143616313748; 
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
      `<b>VHK Dojo</b><br>804 Atlantic St, Stamford, CT 06902<br><a target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/dir//804+Atlantic+St,+Stamford,+CT+06902/@41.0427824,-73.5815171,13z/data=!4m9!4m8!1m0!1m5!1m1!1s0x89c29f5edd49c51d:0x4e9a1b808279735e!2m2!1d-73.5403176!2d41.0427897!3e0?entry=ttu&g_ep=EgoyMDI1MDkxNy4wIKXMDSoASAFQAw%3D%3D">${t('map.getDirections')}</a>`
  ).openPopup();

    // Cleanup the map when the component unmounts.
    return () => {
      map.off();
      map.remove();
    };
  });

  return <div ref={mapContainerRef} style={{ height: '400px', width: '100%' }} />;
};

export default MapComponent;
