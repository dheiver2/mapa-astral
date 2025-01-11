// components/AstralChart/ChartVisualization.tsx
import React from 'react';
import { ChartData } from './types';

interface Props {
  chartData: ChartData;
}

export const ChartVisualization: React.FC<Props> = ({ chartData }) => {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full max-w-xl mx-auto">
      {/* Círculo do zodíaco */}
      <circle cx="200" cy="200" r="180" fill="none" stroke="#000" strokeWidth="2"/>
      
      {/* Divisões do zodíaco */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30) * Math.PI / 180;
        const x1 = 200 + 180 * Math.cos(angle);
        const y1 = 200 + 180 * Math.sin(angle);
        const x2 = 200 + 160 * Math.cos(angle);
        const y2 = 200 + 160 * Math.sin(angle);
        
        return (
          <line 
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#000"
            strokeWidth="1"
          />
        );
      })}

      {/* Símbolos dos planetas */}
      {chartData.planets.map((planet, i) => {
        const angle = (planet.position - 90) * Math.PI / 180;
        const r = 140;
        const x = 200 + r * Math.cos(angle);
        const y = 200 + r * Math.sin(angle);
        
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="12"
          >
            {planet.symbol}
          </text>
        );
      })}
    </svg>
  );
};
