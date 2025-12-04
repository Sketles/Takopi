import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route para obtener códigos postales de Chile
 * Usa la API de PuduPostal: https://pudupostal.com/docs
 */

const PUDUPOSTAL_BASE_URL = 'https://api.pudupostal.com';

interface PostalCodeResponse {
  success: boolean;
  data?: {
    postalCode: string;
    comuna: string;
    region: string;
  }[];
  error?: string;
}

/**
 * GET /api/shipping/postal-codes?comuna=Quilicura
 * Obtiene los códigos postales de una comuna
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const comuna = searchParams.get('comuna');
    
    if (!comuna) {
      return NextResponse.json(
        { success: false, error: 'El parámetro "comuna" es requerido' },
        { status: 400 }
      );
    }

    // Llamar a la API de PuduPostal
    const response = await fetch(
      `${PUDUPOSTAL_BASE_URL}/postal-codes?comuna=${encodeURIComponent(comuna)}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        next: { revalidate: 86400 } // Cache por 24 horas
      }
    );

    if (!response.ok) {
      // Si la API falla, usar fallback con códigos estimados
      const fallbackCode = await getFallbackPostalCode(comuna);
      
      return NextResponse.json({
        success: true,
        data: fallbackCode ? [{ 
          postalCode: fallbackCode, 
          comuna, 
          region: '' 
        }] : [],
        source: 'fallback'
      });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data,
      source: 'pudupostal'
    });

  } catch (error) {
    console.error('Error fetching postal codes:', error);
    
    // Intentar fallback
    const { searchParams } = new URL(request.url);
    const comuna = searchParams.get('comuna');
    
    if (comuna) {
      const fallbackCode = await getFallbackPostalCode(comuna);
      if (fallbackCode) {
        return NextResponse.json({
          success: true,
          data: [{ postalCode: fallbackCode, comuna, region: '' }],
          source: 'fallback'
        });
      }
    }
    
    return NextResponse.json(
      { success: false, error: 'Error al obtener códigos postales' },
      { status: 500 }
    );
  }
}

/**
 * Códigos postales de fallback para las comunas más comunes
 * Se usa cuando la API de PuduPostal no está disponible
 */
async function getFallbackPostalCode(comuna: string): Promise<string | null> {
  const comunaNormalized = comuna.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  const fallbackCodes: Record<string, string> = {
    // Región Metropolitana
    'santiago': '8320000',
    'providencia': '7500000',
    'las condes': '7550000',
    'vitacura': '7630000',
    'lo barnechea': '7690000',
    'nunoa': '7750000',
    'la reina': '7850000',
    'penalolen': '7910000',
    'la florida': '8240000',
    'macul': '7810000',
    'san joaquin': '8940000',
    'la granja': '8780000',
    'la pintana': '8820000',
    'san ramon': '8860000',
    'el bosque': '8010000',
    'la cisterna': '7970000',
    'san miguel': '8900000',
    'pedro aguirre cerda': '8460000',
    'lo espejo': '9120000',
    'cerrillos': '9200000',
    'maipu': '9250000',
    'estacion central': '9160000',
    'quinta normal': '8500000',
    'lo prado': '8580000',
    'pudahuel': '9020000',
    'cerro navia': '9060000',
    'renca': '8640000',
    'quilicura': '8700000',
    'huechuraba': '8580000',
    'conchal': '8540000',
    'recoleta': '8420000',
    'independencia': '8380000',
    'puente alto': '8150000',
    'san bernardo': '8050000',
    'colina': '9340000',
    'lampa': '9380000',
    'tiltil': '9420000',
    'buin': '9500000',
    'paine': '9540000',
    'calera de tango': '9580000',
    'peñaflor': '9750000',
    'talagante': '9660000',
    'padre hurtado': '9710000',
    'isla de maipo': '9790000',
    'el monte': '9810000',
    'melipilla': '9580000',
    'curacavi': '9620000',
    
    // Valparaíso
    'valparaiso': '2340000',
    'vina del mar': '2520000',
    'quilpue': '2430000',
    'villa alemana': '2460000',
    'concon': '2510000',
    'quillota': '2260000',
    'san antonio': '2660000',
    
    // Biobío
    'concepcion': '4030000',
    'talcahuano': '4260000',
    'chillan': '3780000',
    'los angeles': '4440000',
    
    // La Araucanía
    'temuco': '4780000',
    'villarrica': '4930000',
    'pucon': '4920000',
    
    // Los Lagos
    'puerto montt': '5480000',
    'osorno': '5290000',
    'castro': '5700000',
    
    // Otros
    'antofagasta': '1240000',
    'la serena': '1700000',
    'coquimbo': '1780000',
    'rancagua': '2820000',
    'talca': '3460000',
    'arica': '1000000',
    'iquique': '1100000',
    'copiapo': '1530000',
    'valdivia': '5090000',
    'punta arenas': '6200000',
  };
  
  return fallbackCodes[comunaNormalized] || null;
}
