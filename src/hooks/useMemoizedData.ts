'use client';

import { useMemo, useCallback } from 'react';

/**
 * Hook para memorizar datos filtrados, buscados o transformados
 * Evita re-renders innecesarios cuando los datos no cambian
 */
export function useMemoizedSearch<T extends { id: string; [key: string]: any }>(
  data: T[],
  searchQuery: string,
  searchFields: (keyof T)[],
  dependencies: any[] = []
): T[] {
  return useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(query);
        }
        return false;
      })
    );
  }, [data, searchQuery, searchFields, ...dependencies]);
}

/**
 * Hook para memorizar datos filtrados por propiedades
 * Útil para filtrar por categoría, precio, etc.
 */
export function useMemoizedFilter<T extends { id: string; [key: string]: any }>(
  data: T[],
  filters: Record<string, any>,
  filterFn: (item: T, filters: Record<string, any>) => boolean,
  dependencies: any[] = []
): T[] {
  return useMemo(() => {
    // Si no hay filtros activos, retorna todo
    const hasActiveFilters = Object.values(filters).some(
      (value) => value !== null && value !== undefined && value !== 'all'
    );

    if (!hasActiveFilters) return data;

    return data.filter((item) => filterFn(item, filters));
  }, [data, filters, filterFn, ...dependencies]);
}

/**
 * Hook para memorizar datos ordenados
 */
export function useMemoizedSort<T extends { id: string; [key: string]: any }>(
  data: T[],
  sortBy: string,
  sortFn: (a: T, b: T, sortBy: string) => number,
  dependencies: any[] = []
): T[] {
  return useMemo(() => {
    if (!sortBy) return data;

    return [...data].sort((a, b) => sortFn(a, b, sortBy));
  }, [data, sortBy, sortFn, ...dependencies]);
}

/**
 * Hook para memorizar transformación de datos
 * Útil cuando necesitas transformar datos complejos
 */
export function useMemoizedTransform<T, R>(
  data: T,
  transformFn: (data: T) => R,
  dependencies: any[] = []
): R {
  return useMemo(() => {
    return transformFn(data);
  }, [data, transformFn, ...dependencies]);
}

/**
 * Hook para crear callbacks memorizados que no cambian si las dependencias no cambian
 * Útil para props en componentes memo
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: any[]
): T {
  return useCallback(callback, dependencies) as T;
}

/**
 * Hook para memorizar datos paginados
 */
export function useMemoizedPagination<T>(
  data: T[],
  pageNumber: number,
  pageSize: number,
  dependencies: any[] = []
) {
  return useMemo(() => {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.length / pageSize);
    const hasMore = pageNumber < totalPages;

    return {
      data: paginatedData,
      totalPages,
      hasMore,
      totalItems: data.length,
    };
  }, [data, pageNumber, pageSize, ...dependencies]);
}