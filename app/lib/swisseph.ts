// app/lib/swisseph.ts
import * as swisseph from 'swisseph';
import path from 'path';

// Configurar caminho para as efemérides
const ephePath = path.join(process.cwd(), 'public', 'ephe');
swisseph.swe_set_ephe_path(ephePath);

// Constantes astronômicas
export const PLANETS = [
  { id: swisseph.SE_SUN, name: 'Sol', symbol: '☉', color: '#FFD700' },
  { id: swisseph.SE_MOON, name: 'Lua', symbol: '☽', color: '#C0C0C0' },
  { id: swisseph.SE_MERCURY, name: 'Mercúrio', symbol: '☿', color: '#B87333' },
  { id: swisseph.SE_VENUS, name: 'Vênus', symbol: '♀', color: '#FFB6C1' },
  { id: swisseph.SE_MARS, name: 'Marte', symbol: '♂', color: '#FF0000' },
  { id: swisseph.SE_JUPITER, name: 'Júpiter', symbol: '♃', color: '#FFA500' },
  { id: swisseph.SE_SATURN, name: 'Saturno', symbol: '♄', color: '#808080' },
  { id: swisseph.SE_URANUS, name: 'Urano', symbol: '♅', color: '#40E0D0' },
  { id: swisseph.SE_NEPTUNE, name: 'Netuno', symbol: '♆', color: '#000080' },
  { id: swisseph.SE_PLUTO, name: 'Plutão', symbol: '♇', color: '#800080' }
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

// Aspectos astrológicos
export const ASPECTS = [
  { name: 'Conjunção', angle: 0, orb: 8, symbol: '☌', color: '#FF0000' },
  { name: 'Sextil', angle: 60, orb: 6, symbol: '*', color: '#00FF00' },
  { name: 'Quadratura', angle: 90, orb: 8, symbol: '□', color: '#FF0000' },
  { name: 'Trígono', angle: 120, orb: 8, symbol: '△', color: '#00FF00' },
  { name: 'Oposição', angle: 180, orb: 8, symbol: '☍', color: '#FF0000' }
];

// Sistemas de casas suportados
export const HOUSE_SYSTEMS = {
  PLACIDUS: 'P',
  KOCH: 'K',
  PORPHYRIUS: 'O',
  REGIOMONTANUS: 'R',
  CAMPANUS: 'C',
  EQUAL: 'E',
  WHOLE_SIGN: 'W',
  MERIDIAN: 'X',
  MORINUS: 'M',
  HORIZONTAL: 'H',
  POLICH_PAGE: 'T',
  ALCABITIUS: 'B'
};

// Funções auxiliares para cálculos astrológicos
export function calculateAspects(positions: number[]): Array<{
  planet1: number;
  planet2: number;
  aspect: typeof ASPECTS[0];
  exactitude: number;
}> {
  const aspects = [];

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      let diff = Math.abs(positions[i] - positions[j]);
      if (diff > 180) diff = 360 - diff;

      for (const aspect of ASPECTS) {
        const orb = Math.abs(diff - aspect.angle);
        if (orb <= aspect.orb) {
          aspects.push({
            planet1: i,
            planet2: j,
            aspect,
            exactitude: orb
          });
        }
      }
    }
  }

  return aspects;
}

// Função para converter graus em coordenadas x,y para renderização
export function degreeToXY(degree: number, radius: number, centerX: number, centerY: number) {
  const radian = (degree - 90) * Math.PI / 180;
  return {
    x: centerX + radius * Math.cos(radian),
    y: centerY + radius * Math.sin(radian)
  };
}

// Função para calcular dignidades essenciais
export function calculateDignities(planet: typeof PLANETS[0], degree: number) {
  const sign = Math.floor(degree / 30);
  const signDegree = degree % 30;
  
  return {
    domicile: ZODIAC_SIGNS[sign].ruler === planet.name,
    exaltation: getExaltation(planet.name, sign),
    detriment: getDetriment(planet.name, sign),
    fall: getFall(planet.name, sign),
    term: getTerm(planet.name, sign, signDegree),
    face: getFace(planet.name, sign, signDegree)
  };
}

// Funções internas de suporte para dignidades
function getExaltation(planetName: string, sign: number): boolean {
  const exaltations = {
    'Sol': 1,      // Áries
    'Lua': 2,      // Touro
    'Mercúrio': 6, // Virgem
    'Vênus': 12,   // Peixes
    'Marte': 10,   // Capricórnio
    'Júpiter': 4,  // Câncer
    'Saturno': 7   // Libra
  };
  return exaltations[planetName as keyof typeof exaltations] === sign + 1;
}

function getDetriment(planetName: string, sign: number): boolean {
  const detriments = {
    'Sol': 7,      // Libra
    'Lua': 8,      // Escorpião
    'Mercúrio': [9, 3], // Sagitário e Gêmeos
    'Vênus': [8, 2],    // Escorpião e Touro
    'Marte': [7, 1],    // Libra e Áries
    'Júpiter': [6, 12], // Virgem e Peixes
    'Saturno': [4, 10]  // Câncer e Capricórnio
  };
  const planetDetriments = detriments[planetName as keyof typeof detriments];
  return Array.isArray(planetDetriments) 
    ? planetDetriments.includes(sign + 1)
    : planetDetriments === sign + 1;
}

function getFall(planetName: string, sign: number): boolean {
  const falls = {
    'Sol': 7,      // Libra
    'Lua': 8,      // Escorpião
    'Mercúrio': 12,// Peixes
    'Vênus': 6,    // Virgem
    'Marte': 4,    // Câncer
    'Júpiter': 10, // Capricórnio
    'Saturno': 1   // Áries
  };
  return falls[planetName as keyof typeof falls] === sign + 1;
}

// Exportar swisseph para uso em outros módulos
export { swisseph };
