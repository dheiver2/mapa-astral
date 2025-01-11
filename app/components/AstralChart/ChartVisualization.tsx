// app/components/AstralChart/ChartVisualization.tsx
import React from 'react';
import { ChartData } from './types';

interface Props {
  chartData: ChartData;
}

export const ChartVisualization: React.FC<Props> = ({ chartData }) => {
  const ZODIAC_SIGNS = [
    '♈', '♉', '♊', '♋', '♌', '♍', 
    '♎', '♏', '♐', '♑', '♒', '♓'
  ];

  return (
    <svg viewBox="0 0 400 400" className="w-full h-full max-w-xl mx-auto">
      {/* Círculo base do zodíaco */}
      <circle 
        cx="200" 
        cy="200" 
        r="180" 
        fill="none" 
        stroke="#000" 
        strokeWidth="2"
      />
      
      {/* Divisões do zodíaco */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30) * Math.PI / 180;
        const x1 = 200 + 180 * Math.cos(angle);
        const y1 = 200 + 180 * Math.sin(angle);
        const x2 = 200 + 160 * Math.cos(angle);
        const y2 = 200 + 160 * Math.sin(angle);
        
        // Posição do símbolo do signo
        const symbolX = 200 + 195 * Math.cos(angle + (15 * Math.PI / 180));
        const symbolY = 200 + 195 * Math.sin(angle + (15 * Math.PI / 180));
        
        return (
          <g key={i}>
            <line 
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#000"
              strokeWidth="1"
            />
            <text
              x={symbolX}
              y={symbolY}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="14"
              fill="#666"
            >
              {ZODIAC_SIGNS[i]}
            </text>
          </g>
        );
      })}

      {/* Símbolos dos planetas */}
      {chartData.planets.map((planet, i) => {
        const angle = (planet.position - 90) * Math.PI / 180;
        const r = 140;
        const x = 200 + r * Math.cos(angle);
        const y = 200 + r * Math.sin(angle);
        
        return (
          <g key={i}>
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="16"
              fill="#000"
            >
              {planet.symbol}
            </text>
            <text
              x={x}
              y={y + 16}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="8"
              fill="#666"
            >
              {planet.position.toFixed(1)}°
            </text>
          </g>
        );
      })}

      {/* Linha do Ascendente */}
      {chartData.ascendant !== undefined && (
        <line
          x1={200}
          y1={200}
          x2={200 + 180 * Math.cos((chartData.ascendant - 90) * Math.PI / 180)}
          y2={200 + 180 * Math.sin((chartData.ascendant - 90) * Math.PI / 180)}
          stroke="#FF0000"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      )}
    </svg>
  );
};
