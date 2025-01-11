// components/AstralChart/types.ts
export interface BirthFormData {
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
