'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Campground } from '@/lib/data'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icon issue in Next.js
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface MapViewProps {
  campgrounds: Campground[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function MapView({ campgrounds, selectedId, onSelect }: MapViewProps) {
  return (
    <MapContainer
      center={[38.94, -119.98]}
      zoom={11}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {campgrounds.map(camp => (
        <Marker
          key={camp.id}
          position={[camp.lat, camp.lng]}
          icon={camp.available ? greenIcon : redIcon}
          eventHandlers={{ click: () => onSelect(camp.id) }}
        >
          <Popup>
            <div className="min-w-[200px]">
              <img src={camp.images[0]} alt={camp.name} className="w-full h-24 object-cover rounded-lg mb-2" />
              <h3 className="font-semibold text-gray-900 text-sm">{camp.name}</h3>
              <p className="text-xs text-gray-500 mb-1">{camp.location}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-green-700">${camp.price_per_night}/night</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${camp.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {camp.available ? 'Available' : 'Booked'}
                </span>
              </div>
              <a
                href={camp.booking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 text-center bg-green-700 text-white text-xs py-1.5 rounded-lg font-medium hover:bg-green-800 transition-colors"
              >
                Book Now →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
