'use client';

import { useState, useCallback, useReducer } from 'react';

// ============ TYPES ============
export interface ContentItem {
  id: string;
  title: string;
  author: string;
  type: string;
  category: string;
  image: string;
  likes: number;
  price: string;
  license: string;
  downloads: number;
  tags: string[];
  views: number;
  createdAt: string;
  contentType: string;
  isFree: boolean;
  currency: string;
  description?: string;
  shortDescription?: string;
  files?: Array<{
    name: string;
    type: string;
    size: number;
    url: string;
    previewUrl?: string;
  }>;
  coverImage?: string;
  isLiked?: boolean;
  isPinned?: boolean;
}

export type PriceFilter = 'all' | 'free' | 'paid';
export type SortBy = 'newest' | 'popular' | 'price_asc' | 'price_desc';
export type LicenseFilter = 'all' | 'personal' | 'commercial';

// ============ STATE INTERFACE ============
export interface ExploreState {
  // Content data
  content: ContentItem[];
  trendingContent: ContentItem[];
  searchResults: ContentItem[];

  // UI state
  selectedItem: ContentItem | null;
  isModalOpen: boolean;
  showFilters: boolean;

  // Loading states
  loading: boolean;
  isSearching: boolean;
  isLoadingMore: boolean;
  error: string | null;

  // Search & filters
  searchQuery: string;
  searchSuggestions: Array<{ type: string; value: string }>;
  selectedCategory: string;
  priceFilter: PriceFilter;
  sortBy: SortBy;
  licenseFilter: LicenseFilter;

  // Pagination
  currentPage: number;
  hasMore: boolean;
}

// ============ ACTIONS ============
export type ExploreAction =
  | { type: 'SET_CONTENT'; payload: ContentItem[] }
  | { type: 'SET_TRENDING'; payload: ContentItem[] }
  | { type: 'SET_SEARCH_RESULTS'; payload: ContentItem[] }
  | { type: 'SET_SELECTED_ITEM'; payload: ContentItem | null }
  | { type: 'SET_MODAL_OPEN'; payload: boolean }
  | { type: 'SET_SHOW_FILTERS'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SEARCHING'; payload: boolean }
  | { type: 'SET_LOADING_MORE'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SUGGESTIONS'; payload: Array<{ type: string; value: string }> }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_PRICE_FILTER'; payload: PriceFilter }
  | { type: 'SET_SORT_BY'; payload: SortBy }
  | { type: 'SET_LICENSE_FILTER'; payload: LicenseFilter }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'RESET_FILTERS' };

// ============ REDUCER ============
const initialState: ExploreState = {
  content: [],
  trendingContent: [],
  searchResults: [],
  selectedItem: null,
  isModalOpen: false,
  showFilters: false,
  loading: true,
  isSearching: false,
  isLoadingMore: false,
  error: null,
  searchQuery: '',
  searchSuggestions: [],
  selectedCategory: 'Todo',
  priceFilter: 'all',
  sortBy: 'newest',
  licenseFilter: 'all',
  currentPage: 1,
  hasMore: true,
};

function exploreReducer(state: ExploreState, action: ExploreAction): ExploreState {
  switch (action.type) {
    case 'SET_CONTENT':
      return { ...state, content: action.payload };
    case 'SET_TRENDING':
      return { ...state, trendingContent: action.payload };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    case 'SET_SELECTED_ITEM':
      return { ...state, selectedItem: action.payload };
    case 'SET_MODAL_OPEN':
      return { ...state, isModalOpen: action.payload };
    case 'SET_SHOW_FILTERS':
      return { ...state, showFilters: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SEARCHING':
      return { ...state, isSearching: action.payload };
    case 'SET_LOADING_MORE':
      return { ...state, isLoadingMore: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SUGGESTIONS':
      return { ...state, searchSuggestions: action.payload };
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload, currentPage: 1 };
    case 'SET_PRICE_FILTER':
      return { ...state, priceFilter: action.payload, currentPage: 1 };
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload, currentPage: 1 };
    case 'SET_LICENSE_FILTER':
      return { ...state, licenseFilter: action.payload, currentPage: 1 };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_HAS_MORE':
      return { ...state, hasMore: action.payload };
    case 'RESET_FILTERS':
      return {
        ...state,
        priceFilter: 'all',
        sortBy: 'newest',
        licenseFilter: 'all',
        selectedCategory: 'Todo',
        currentPage: 1,
        searchQuery: '',
      };
    default:
      return state;
  }
}

// ============ HOOK ============
export function useExploreState() {
  const [state, dispatch] = useReducer(exploreReducer, initialState);

  // Memoized callbacks to prevent unnecessary re-renders
  const setContent = useCallback((content: ContentItem[]) => {
    dispatch({ type: 'SET_CONTENT', payload: content });
  }, []);

  const setTrending = useCallback((trending: ContentItem[]) => {
    dispatch({ type: 'SET_TRENDING', payload: trending });
  }, []);

  const setSearchResults = useCallback((results: ContentItem[]) => {
    dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
  }, []);

  const setSelectedItem = useCallback((item: ContentItem | null) => {
    dispatch({ type: 'SET_SELECTED_ITEM', payload: item });
  }, []);

  const setModalOpen = useCallback((isOpen: boolean) => {
    dispatch({ type: 'SET_MODAL_OPEN', payload: isOpen });
  }, []);

  const setShowFilters = useCallback((show: boolean) => {
    dispatch({ type: 'SET_SHOW_FILTERS', payload: show });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setSearching = useCallback((searching: boolean) => {
    dispatch({ type: 'SET_SEARCHING', payload: searching });
  }, []);

  const setLoadingMore = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING_MORE', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  const setSuggestions = useCallback((suggestions: Array<{ type: string; value: string }>) => {
    dispatch({ type: 'SET_SUGGESTIONS', payload: suggestions });
  }, []);

  const setCategory = useCallback((category: string) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  }, []);

  const setPriceFilter = useCallback((filter: PriceFilter) => {
    dispatch({ type: 'SET_PRICE_FILTER', payload: filter });
  }, []);

  const setSortBy = useCallback((sort: SortBy) => {
    dispatch({ type: 'SET_SORT_BY', payload: sort });
  }, []);

  const setLicenseFilter = useCallback((filter: LicenseFilter) => {
    dispatch({ type: 'SET_LICENSE_FILTER', payload: filter });
  }, []);

  const setCurrentPage = useCallback((page: number) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
  }, []);

  const setHasMore = useCallback((hasMore: boolean) => {
    dispatch({ type: 'SET_HAS_MORE', payload: hasMore });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  return {
    state,
    setContent,
    setTrending,
    setSearchResults,
    setSelectedItem,
    setModalOpen,
    setShowFilters,
    setLoading,
    setSearching,
    setLoadingMore,
    setError,
    setSearchQuery,
    setSuggestions,
    setCategory,
    setPriceFilter,
    setSortBy,
    setLicenseFilter,
    setCurrentPage,
    setHasMore,
    resetFilters,
  };
}