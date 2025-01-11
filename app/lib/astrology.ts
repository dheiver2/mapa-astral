// app/lib/astrology.ts
import { swisseph, PLANETS } from './swisseph';

export const getJulianDay = (date: string, time: string): number => {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  
  return swisseph.swe_julday(
    year,
    month,
    day,
    hour + minute/60,
    swisseph.SE_GREG_CAL
  );
};

export const getSign = (position: number): string => {
  const signs = [
    'Áries', 'Touro', 'Gêmeos', 'Câncer',
    'Leão', 'Virgem', 'Libra', 'Escorpião',
    'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
  ];
  
  const signIndex = Math.floor(position / 30) % 12;
  return signs[signIndex];
};

export const getHouse = (position: number, ascendant: number): number => {
  let relativePos = position - ascendant;
  if (relativePos < 0) relativePos += 360;
  
  return Math.floor(relativePos / 30) + 1;
};

export const calculateChart = async (birthData: {
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
}) => {
  const julianDay = getJulianDay(birthData.birthDate, birthData.birthTime);
  
  // Calcular Ascendente
  const houses = swisseph.swe_houses(
    julianDay,
    birthData.latitude,
    birthData.longitude,
    'P', // Sistema Placidus
    [0]  // Apenas ascendente
  );
  
  const ascendant = houses[0];
  
  // Calcular posições planetárias
  const planets = await Promise.all(PLANETS.map(async planet => {
    const position = swisseph.swe_calc_ut(
      julianDay,
      planet.id,
      swisseph.SEFLG_SPEED
    )[0];
    
    return {
      name: planet.name,
      symbol: planet.symbol,
      position: position[0],
      sign: getSign(position[0]),
      house: getHouse(position[0], ascendant)
    };
  }));
  
  return {
    ascendant,
    planets
  };
};
