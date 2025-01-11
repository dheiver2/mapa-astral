// app/components/AstralChart/types.ts
export interface FormData {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: string;
  longitude: string;
}

export interface Planet {
  name: string;
  symbol: string;
  position: number;
  sign: string;
  house: number;
}

export interface ChartData {
  ascendant: number;
  planets: Planet[];
}

// app/components/AstralChart/AstralForm.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { FormData } from './types';

interface Props {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AstralForm: React.FC<Props> = ({ formData, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        type="date"
        name="birthDate"
        value={formData.birthDate}
        onChange={onChange}
        placeholder="Data de Nascimento"
      />
      <Input
        type="time"
        name="birthTime"
        value={formData.birthTime}
        onChange={onChange}
        placeholder="Hora de Nascimento"
      />
      <Input
        type="text"
        name="birthPlace"
        value={formData.birthPlace}
        onChange={onChange}
        placeholder="Local de Nascimento"
        className="md:col-span-2"
      />
      <Input
        type="number"
        name="latitude"
        value={formData.latitude}
        onChange={onChange}
        placeholder="Latitude"
        step="0.000001"
      />
      <Input
        type="number"
        name="longitude"
        value={formData.longitude}
        onChange={onChange}
        placeholder="Longitude"
        step="0.000001"
      />
    </div>
  );
};

// app/components/AstralChart/ChartVisualization.tsx
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

// app/components/AstralChart/PlanetInfo.tsx
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

// app/components/AstralChart/AstralChart.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { AstralForm } from './AstralForm';
import { ChartVisualization } from './ChartVisualization';
import { PlanetInfo } from './PlanetInfo';
import { FormData, ChartData } from './types';

export const AstralChart: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    latitude: '',
    longitude: ''
  });
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCalculateChart = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao calcular o mapa astral');
      }

      const data = await response.json();
      setChartData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao calcular o mapa astral');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Mapa Astral</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <AstralForm formData={formData} onChange={handleInputChange} />

          <Button 
            onClick={handleCalculateChart} 
            disabled={loading}
            className="w-full"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Calcular Mapa Astral
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {chartData && (
            <div className="space-y-6">
              <div className="aspect-square">
                <ChartVisualization chartData={chartData} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chartData.planets.map((planet, i) => (
                  <PlanetInfo key={i} planet={planet} />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
