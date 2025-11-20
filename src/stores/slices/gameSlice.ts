/**
 * Game Slice - Manages game-related UI state
 *
 * Purpose: Handle client-side game state (view modes, filters, visitor tracking)
 * Use cases: Toggle view mode, manage search/filters, track visitor for ratings/comments
 */

import type { StateCreator } from 'zustand'

export type ViewMode = 'grid' | 'swipe'
export type SortOption = 'popular' | 'latest' | 'rating'

export interface GameSlice {
  // State
  viewMode: ViewMode
  selectedCategory: string | null
  searchQuery: string
  sortOption: SortOption
  currentGameId: number | null
  visitorId: string
  recentGameIds: number[]

  // Actions
  setViewMode: (mode: ViewMode) => void
  setSelectedCategory: (category: string | null) => void
  setSearchQuery: (query: string) => void
  setSortOption: (option: SortOption) => void
  setCurrentGameId: (id: number | null) => void
  addToRecentGames: (gameId: number) => void
  clearRecentGames: () => void
  resetFilters: () => void
  reset: () => void
}

// Generate a unique visitor ID for anonymous users
const generateVisitorId = (): string => {
  const stored = localStorage.getItem('snackgames-visitor-id')
  if (stored) return stored

  const newId = `visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  localStorage.setItem('snackgames-visitor-id', newId)
  return newId
}

const initialState = {
  viewMode: 'grid' as ViewMode,
  selectedCategory: null as string | null,
  searchQuery: '',
  sortOption: 'popular' as SortOption,
  currentGameId: null as number | null,
  visitorId: generateVisitorId(),
  recentGameIds: [] as number[],
}

export const createGameSlice: StateCreator<GameSlice> = (set) => ({
  ...initialState,

  setViewMode: (mode) => {
    set({ viewMode: mode })
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category })
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query })
  },

  setSortOption: (option) => {
    set({ sortOption: option })
  },

  setCurrentGameId: (id) => {
    set({ currentGameId: id })
  },

  addToRecentGames: (gameId) => {
    set((state) => {
      // Remove if already exists and add to front
      const filtered = state.recentGameIds.filter(id => id !== gameId)
      const updated = [gameId, ...filtered].slice(0, 10) // Keep max 10 recent games
      return { recentGameIds: updated }
    })
  },

  clearRecentGames: () => {
    set({ recentGameIds: [] })
  },

  resetFilters: () => {
    set({
      selectedCategory: null,
      searchQuery: '',
      sortOption: 'popular',
    })
  },

  reset: () => set({
    ...initialState,
    visitorId: generateVisitorId(), // Keep visitor ID
  }),
})
