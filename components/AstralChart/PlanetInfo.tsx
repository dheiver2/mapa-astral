// components/AstralChart/PlanetInfo.tsx
import React from 'react';
import { Planet } from './types';

interface Props {
  planet: Planet;
}

export const PlanetInfo: React.FC<Props> = ({ planet }) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-bold">{planet.name}</h3>
      <p>Signo: {planet.sign}</p>
      <p>Casa: {planet.house}</p>
      <p>Grau: {planet.position.toFixed(2)}°</p>
    </div>
  );
};
