import { NextRequest, NextResponse } from 'next/server';
import { GetPopularTagsUseCase } from '@/features/search/domain/usecases/get-popular-tags.usecase';
import { createSearchRepository } from '@/features/search/data/repositories/search.repository.factory';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const withStats = searchParams.get('with_stats') === 'true';

    // console.log('🏷️ Tags API: Obteniendo tags populares', { limit, withStats });

    // Validar límite
    if (limit < 1 || limit > 100) {
      return NextResponse.json({
        success: false,
        error: 'El límite debe estar entre 1 y 100'
      }, { status: 400 });
    }

    // Crear repository y usecase
    const repository = createSearchRepository();
    const usecase = new GetPopularTagsUseCase(repository);

    let result;

    if (withStats) {
      // Obtener tags con estadísticas
      result = await usecase.executeWithStats(limit);
      
      return NextResponse.json({
        success: true,
        data: {
          tags: result.map(item => ({
            tag: item.tag,
            count: item.count,
            popularity: item.popularity
          })),
          total: result.length
        }
      });
    } else {
      // Obtener solo tags
      const tags = await usecase.execute(limit);
      
      return NextResponse.json({
        success: true,
        data: {
          tags,
          total: tags.length
        }
      });
    }

  } catch (error) {
    console.error('❌ Tags API: Error obteniendo tags', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al obtener tags' 
      },
      { status: 500 }
    );
  }
}

// Método POST para obtener tags contextuales
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentTags = [], limit = 10 } = body;

    // console.log('🎯 Tags API: Obteniendo tags contextuales', { currentTags, limit });

    // Validar parámetros
    if (!Array.isArray(currentTags)) {
      return NextResponse.json({
        success: false,
        error: 'currentTags debe ser un array'
      }, { status: 400 });
    }

    if (limit < 1 || limit > 50) {
      return NextResponse.json({
        success: false,
        error: 'El límite debe estar entre 1 y 50'
      }, { status: 400 });
    }

    // Crear repository y usecase
    const repository = createSearchRepository();
    const usecase = new GetPopularTagsUseCase(repository);

    // Obtener tags contextuales
    const contextualTags = await usecase.getContextualTags(currentTags, limit);

    return NextResponse.json({
      success: true,
      data: {
        tags: contextualTags,
        total: contextualTags.length,
        context: {
          currentTags,
          limit
        }
      }
    });

  } catch (error) {
    console.error('❌ Tags API: Error obteniendo tags contextuales', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al obtener tags contextuales' 
      },
      { status: 500 }
    );
  }
}
