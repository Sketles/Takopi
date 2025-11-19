import { NextRequest, NextResponse } from 'next/server';
import { SearchContentUseCase } from '@/features/search/domain/usecases/search-content.usecase';
import { createSearchRepository } from '@/features/search/data/repositories/search.repository.factory';
import { SearchMapper } from '@/features/search/data/mappers/search.mapper';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔍 Search API: Procesando búsqueda', {
        params: Object.fromEntries(searchParams.entries())
      });
    }

    // Crear query desde parámetros URL
    const searchQuery = SearchMapper.fromUrlParams(searchParams);
    
    // Validar query
    const validation = SearchMapper.validateQuery(searchQuery);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Parámetros de búsqueda inválidos',
        details: validation.errors
      }, { status: 400 });
    }

    // Crear repository y usecase
    const repository = createSearchRepository();
    const usecase = new SearchContentUseCase(repository);

    // Ejecutar búsqueda
    const result = await usecase.execute(searchQuery);

    // Serializar resultado
    const serializedResult = SearchMapper.serializeSearchResult(result);

    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Search API: Búsqueda completada', {
        total: result.total,
        items: result.items.length,
        page: result.page
      });
    }

    return NextResponse.json({
      success: true,
      data: serializedResult
    });

  } catch (error) {
    console.error('❌ Search API: Error en búsqueda', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al realizar la búsqueda' 
      },
      { status: 500 }
    );
  }
}

// Método POST para búsquedas complejas (opcional)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔍 Search API: Búsqueda POST', { body });
    }

    // Crear query desde body
    const searchQuery = new (await import('@/features/search/domain/entities/search-query.entity')).SearchQueryEntity(
      body.text,
      body.tags,
      body.tagsOperator,
      body.categories,
      body.priceRange,
      body.isFree,
      body.authorId,
      body.sortBy,
      body.page,
      body.limit
    );
    
    // Validar query
    const validation = SearchMapper.validateQuery(searchQuery);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Parámetros de búsqueda inválidos',
        details: validation.errors
      }, { status: 400 });
    }

    // Crear repository y usecase
    const repository = createSearchRepository();
    const usecase = new SearchContentUseCase(repository);

    // Ejecutar búsqueda con sugerencias
    const result = await usecase.searchWithSuggestions(searchQuery);

    // Serializar resultado
    const serializedResult = SearchMapper.serializeSearchResult(result);

    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Search API: Búsqueda POST completada', {
        total: result.total,
        items: result.items.length,
        page: result.page
      });
    }

    return NextResponse.json({
      success: true,
      data: serializedResult
    });

  } catch (error) {
    console.error('❌ Search API: Error en búsqueda POST', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al realizar la búsqueda' 
      },
      { status: 500 }
    );
  }
}
