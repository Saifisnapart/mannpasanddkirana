import React, { createContext, useContext, useState } from 'react';
import { Location } from '@/types';

interface LocationContextType {
  userLocation: Location | null;
  setUserLocation: (location: Location | null) => void;
  areaName: string | null;
  setAreaName: (name: string | null) => void;
}

const LocationContext = createContext<LocationContextType | null>(null);

const PUNE_AREAS = [
  { name: 'Pimpri', lat: 18.6298, lng: 73.7997 },
  { name: 'Chinchwad', lat: 18.6186, lng: 73.8037 },
  { name: 'Wakad', lat: 18.5978, lng: 73.7644 },
  { name: 'Nigdi', lat: 18.6573, lng: 73.7604 },
  { name: 'Hinjewadi', lat: 18.5912, lng: 73.7389 },
  { name: 'Aundh', lat: 18.5593, lng: 73.8078 },
];

export { PUNE_AREAS };

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [areaName, setAreaName] = useState<string | null>(null);

  return (
    <LocationContext.Provider value={{ userLocation, setUserLocation, areaName, setAreaName }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
}
