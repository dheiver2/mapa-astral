// app/components/AstralChart/AstralChart.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { BirthFormData, ChartData } from './types';
import { AstralForm } from './AstralForm';
import { ChartVisualization } from './ChartVisualization';
import { PlanetInfo } from './PlanetInfo';

export const AstralChart: React.FC = () => {
  const [formData, setFormData] = useState<BirthFormData>({
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
