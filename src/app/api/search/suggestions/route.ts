import { NextRequest, NextResponse } from 'next/server';
import { GetSuggestionsUseCase } from '@/features/search/domain/usecases/get-suggestions.usecase';
import { createSearchRepository } from '@/features/search/data/repositories/search.repository.factory';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const partial = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');
    const structured = searchParams.get('structured') === 'true';

    // console.log('💡 Suggestions API: Obteniendo sugerencias', { partial, limit, structured });

    // Validar parámetros
    if (!partial || partial.length < 1) {
      return NextResponse.json({
        success: false,
        error: 'Se requiere el parámetro q con al menos 1 carácter'
      }, { status: 400 });
    }

    if (limit < 1 || limit > 20) {
      return NextResponse.json({
        success: false,
        error: 'El límite debe estar entre 1 y 20'
      }, { status: 400 });
    }

    // Crear repository y usecase
    const repository = createSearchRepository();
    const usecase = new GetSuggestionsUseCase(repository);

    if (structured) {
      // Obtener sugerencias estructuradas
      const structuredSuggestions = await usecase.getStructuredSuggestions(partial, limit);
      
      return NextResponse.json({
        success: true,
        data: {
          suggestions: structuredSuggestions,
          total: structuredSuggestions.length,
          query: partial
        }
      });
    } else {
      // Obtener sugerencias simples
      const suggestions = await usecase.execute(partial);
      
      return NextResponse.json({
        success: true,
        data: {
          tags: suggestions.tags.slice(0, limit),
          titles: suggestions.titles.slice(0, limit),
          total: suggestions.tags.length + suggestions.titles.length,
          query: partial
        }
      });
    }

  } catch (error) {
    console.error('❌ Suggestions API: Error obteniendo sugerencias', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al obtener sugerencias' 
      },
      { status: 500 }
    );
  }
}

// Método POST para autocompletado avanzado
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partial, context } = body;

    // console.log('⚡ Suggestions API: Autocompletado avanzado', { partial, context });

    // Validar parámetros
    if (!partial || partial.length < 1) {
      return NextResponse.json({
        success: false,
        error: 'Se requiere el parámetro partial con al menos 1 carácter'
      }, { status: 400 });
    }

    // Crear repository y usecase
    const repository = createSearchRepository();
    const usecase = new GetSuggestionsUseCase(repository);

    // Obtener sugerencias de autocompletado
    const autoCompleteSuggestions = await usecase.getAutoCompleteSuggestions(partial, context);

    return NextResponse.json({
      success: true,
      data: {
        suggestions: autoCompleteSuggestions,
        total: autoCompleteSuggestions.length,
        query: partial,
        context
      }
    });

  } catch (error) {
    console.error('❌ Suggestions API: Error en autocompletado', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor en autocompletado' 
      },
      { status: 500 }
    );
  }
}
