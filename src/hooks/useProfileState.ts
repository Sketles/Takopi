'use client';

import { useState, useCallback, useReducer } from 'react';

// ============ TYPES ============
export interface UserProfile {
  id: string;
  username: string;
  avatar?: string;
  bio?: string;
  location?: string;
  createdAt: Date;
  stats: {
    contentCount: number;
    purchaseCount: number;
    followersCount: number;
    followingCount: number;
    collectionsCount: number;
    totalLikes: number;
  };
}

export interface CreatedContent {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  contentType: string;
  price: number;
  views: number;
  downloads: number;
  isPublished: boolean;
  createdAt: Date;
}

export interface UserPurchase {
  id: string;
  contentId: string;
  title: string;
  coverImage?: string;
  purchaseDate: Date;
  price: number;
}

// ============ STATE INTERFACE ============
export interface ProfileState {
  // User data
  profile: UserProfile | null;
  createdContent: CreatedContent[];
  purchases: UserPurchase[];

  // UI state
  activeTab: 'about' | 'creations' | 'purchases' | 'collections';
  selectedItem: CreatedContent | UserPurchase | null;
  isModalOpen: boolean;
  showEditModal: boolean;

  // Loading states
  loading: boolean;
  contentLoading: boolean;
  purchasesLoading: boolean;
  error: string | null;

  // Pagination
  contentPage: number;
  purchasesPage: number;
  hasMoreContent: boolean;
  hasMorePurchases: boolean;
}

// ============ ACTIONS ============
export type ProfileAction =
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'SET_CREATED_CONTENT'; payload: CreatedContent[] }
  | { type: 'SET_PURCHASES'; payload: UserPurchase[] }
  | { type: 'SET_ACTIVE_TAB'; payload: ProfileState['activeTab'] }
  | { type: 'SET_SELECTED_ITEM'; payload: CreatedContent | UserPurchase | null }
  | { type: 'SET_MODAL_OPEN'; payload: boolean }
  | { type: 'SET_EDIT_MODAL_OPEN'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CONTENT_LOADING'; payload: boolean }
  | { type: 'SET_PURCHASES_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CONTENT_PAGE'; payload: number }
  | { type: 'SET_PURCHASES_PAGE'; payload: number }
  | { type: 'SET_HAS_MORE_CONTENT'; payload: boolean }
  | { type: 'SET_HAS_MORE_PURCHASES'; payload: boolean };

// ============ REDUCER ============
const initialState: ProfileState = {
  profile: null,
  createdContent: [],
  purchases: [],
  activeTab: 'about',
  selectedItem: null,
  isModalOpen: false,
  showEditModal: false,
  loading: true,
  contentLoading: false,
  purchasesLoading: false,
  error: null,
  contentPage: 1,
  purchasesPage: 1,
  hasMoreContent: true,
  hasMorePurchases: true,
};

function profileReducer(state: ProfileState, action: ProfileAction): ProfileState {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload, loading: false };
    case 'SET_CREATED_CONTENT':
      return { ...state, createdContent: action.payload, contentLoading: false };
    case 'SET_PURCHASES':
      return { ...state, purchases: action.payload, purchasesLoading: false };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_SELECTED_ITEM':
      return { ...state, selectedItem: action.payload };
    case 'SET_MODAL_OPEN':
      return { ...state, isModalOpen: action.payload };
    case 'SET_EDIT_MODAL_OPEN':
      return { ...state, showEditModal: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CONTENT_LOADING':
      return { ...state, contentLoading: action.payload };
    case 'SET_PURCHASES_LOADING':
      return { ...state, purchasesLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CONTENT_PAGE':
      return { ...state, contentPage: action.payload };
    case 'SET_PURCHASES_PAGE':
      return { ...state, purchasesPage: action.payload };
    case 'SET_HAS_MORE_CONTENT':
      return { ...state, hasMoreContent: action.payload };
    case 'SET_HAS_MORE_PURCHASES':
      return { ...state, hasMorePurchases: action.payload };
    default:
      return state;
  }
}

// ============ HOOK ============
export function useProfileState() {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  const setProfile = useCallback((profile: UserProfile) => {
    dispatch({ type: 'SET_PROFILE', payload: profile });
  }, []);

  const setCreatedContent = useCallback((content: CreatedContent[]) => {
    dispatch({ type: 'SET_CREATED_CONTENT', payload: content });
  }, []);

  const setPurchases = useCallback((purchases: UserPurchase[]) => {
    dispatch({ type: 'SET_PURCHASES', payload: purchases });
  }, []);

  const setActiveTab = useCallback((tab: ProfileState['activeTab']) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
  }, []);

  const setSelectedItem = useCallback((item: CreatedContent | UserPurchase | null) => {
    dispatch({ type: 'SET_SELECTED_ITEM', payload: item });
  }, []);

  const setModalOpen = useCallback((isOpen: boolean) => {
    dispatch({ type: 'SET_MODAL_OPEN', payload: isOpen });
  }, []);

  const setEditModalOpen = useCallback((isOpen: boolean) => {
    dispatch({ type: 'SET_EDIT_MODAL_OPEN', payload: isOpen });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setContentLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_CONTENT_LOADING', payload: loading });
  }, []);

  const setPurchasesLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_PURCHASES_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const setContentPage = useCallback((page: number) => {
    dispatch({ type: 'SET_CONTENT_PAGE', payload: page });
  }, []);

  const setPurchasesPage = useCallback((page: number) => {
    dispatch({ type: 'SET_PURCHASES_PAGE', payload: page });
  }, []);

  const setHasMoreContent = useCallback((hasMore: boolean) => {
    dispatch({ type: 'SET_HAS_MORE_CONTENT', payload: hasMore });
  }, []);

  const setHasMorePurchases = useCallback((hasMore: boolean) => {
    dispatch({ type: 'SET_HAS_MORE_PURCHASES', payload: hasMore });
  }, []);

  return {
    state,
    setProfile,
    setCreatedContent,
    setPurchases,
    setActiveTab,
    setSelectedItem,
    setModalOpen,
    setEditModalOpen,
    setLoading,
    setContentLoading,
    setPurchasesLoading,
    setError,
    setContentPage,
    setPurchasesPage,
    setHasMoreContent,
    setHasMorePurchases,
  };
}