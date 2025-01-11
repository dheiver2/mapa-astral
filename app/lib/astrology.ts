// app/lib/astrology.ts
export const PLANETS = [
  { id: 0, name: 'Sol', symbol: '☉', color: '#FFD700' },
  { id: 1, name: 'Lua', symbol: '☽', color: '#C0C0C0' },
  { id: 2, name: 'Mercúrio', symbol: '☿', color: '#B87333' },
  { id: 3, name: 'Vênus', symbol: '♀', color: '#FFB6C1' },
  { id: 4, name: 'Marte', symbol: '♂', color: '#FF0000' },
  { id: 5, name: 'Júpiter', symbol: '♃', color: '#FFA500' },
  { id: 6, name: 'Saturno', symbol: '♄', color: '#808080' },
  { id: 7, name: 'Urano', symbol: '♅', color: '#40E0D0' },
  { id: 8, name: 'Netuno', symbol: '♆', color: '#000080' },
  { id: 9, name: 'Plutão', symbol: '♇', color: '#800080' }
];

export const ZODIAC_SIGNS = [
  { name: 'Áries', symbol: '♈', element: 'Fogo', quality: 'Cardinal', ruler: 'Marte' },
  { name: 'Touro', symbol: '♉', element: 'Terra', quality: 'Fixo', ruler: 'Vênus' },
  { name: 'Gêmeos', symbol: '♊', element: 'Ar', quality: 'Mutável', ruler: 'Mercúrio' },
  { name: 'Câncer', symbol: '♋', element: 'Água', quality: 'Cardinal', ruler: 'Lua' },
  { name: 'Leão', symbol: '♌', element: 'Fogo', quality: 'Fixo', ruler: 'Sol' },
  { name: 'Virgem', symbol: '♍', element: 'Terra', quality: 'Mutável', ruler: 'Mercúrio' },
  { name: 'Libra', symbol: '♎', element: 'Ar', quality: 'Cardinal', ruler: 'Vênus' },
  { name: 'Escorpião', symbol: '♏', element: 'Água', quality: 'Fixo', ruler: 'Plutão' },
  { name: 'Sagitário', symbol: '♐', element: 'Fogo', quality: 'Mutável', ruler: 'Júpiter' },
  { name: 'Capricórnio', symbol: '♑', element: 'Terra', quality: 'Cardinal', ruler: 'Saturno' },
  { name: 'Aquário', symbol: '♒', element: 'Ar', quality: 'Fixo', ruler: 'Urano' },
  { name: 'Peixes', symbol: '♓', element: 'Água', quality: 'Mutável', ruler: 'Netuno' }
];

// Função simplificada para cálculo de posições planetárias
export function calculatePlanetPositions(birthDate: string, birthTime: string): number[] {
  const date = new Date(`${birthDate}T${birthTime}`);
  const timestamp = date.getTime();
  
  // Usando um algoritmo simplificado para demonstração
  // Em uma versão real, você usaria cálculos astronômicos precisos
  return PLANETS.map((_, index) => {
    // Cada planeta tem uma velocidade orbital diferente
    const speed = (12 - index) * 30; // velocidade em graus por dia
    const basePosition = (timestamp / (1000 * 60 * 60 * 24)) * speed;
    return basePosition % 360;
  });
}

// Função para calcular o signo baseado na posição
export function getSign(position: number): string {
  const signIndex = Math.floor(position / 30) % 12;
  return ZODIAC_SIGNS[signIndex].name;
}

// Função para calcular a casa baseada na posição
export function getHouse(position: number, ascendant: number): number {
  let relativePos = position - ascendant;
  if (relativePos < 0) relativePos += 360;
  return Math.floor(relativePos / 30) + 1;
}

// Função principal para calcular o mapa astral
export function calculateChart(data: {
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
}) {
  // Calcular ascendente (simplificado)
  const ascendant = (new Date(`${data.birthDate}T${data.birthTime}`).getHours() * 15) % 360;
  
  // Calcular posições planetárias
  const positions = calculatePlanetPositions(data.birthDate, data.birthTime);
  
  // Montar resultado
  const planets = positions.map((position, index) => ({
    name: PLANETS[index].name,
    symbol: PLANETS[index].symbol,
    position,
    sign: getSign(position),
    house: getHouse(position, ascendant)
  }));

  return {
    ascendant,
    planets
  };
}

// Função para converter graus em coordenadas x,y
export function degreeToXY(degree: number, radius: number, centerX: number, centerY: number) {
  const radian = (degree - 90) * Math.PI / 180;
  return {
    x: centerX + radius * Math.cos(radian),
    y: centerY + radius * Math.sin(radian)
  };
}
