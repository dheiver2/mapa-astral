// app/api/chart/route.ts
import { NextResponse } from 'next/server';
import { calculateChart } from '@/app/lib/astrology';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { birthDate, birthTime, latitude, longitude } = body;

    // Validação básica
    if (!birthDate || !birthTime || !latitude || !longitude) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    const chartData = await calculateChart({
      birthDate,
      birthTime,
      latitude: Number(latitude),
      longitude: Number(longitude)
    });

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Erro ao calcular mapa astral:', error);
    return NextResponse.json(
      { error: 'Erro ao calcular mapa astral' },
      { status: 500 }
    );
  }
}
