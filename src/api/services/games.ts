/**
 * Games API Service
 *
 * This module provides React Query hooks for managing games, comments, and ratings.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import type {
  GameResponse,
  GamesListResponse,
  CategoriesResponse,
  CommentCreate,
  CommentResponse,
  CommentsListResponse,
  RatingSummaryResponse,
  RatingResponse,
} from '@/schemas'

// =============================================================================
// Query Keys
// =============================================================================

export const gamesKeys = {
  all: ['games'] as const,
  lists: () => [...gamesKeys.all, 'list'] as const,
  list: (params?: {
    skip?: number
    limit?: number
    category?: string
    search?: string
    sort_by?: 'popular' | 'latest' | 'rating'
  }) => [...gamesKeys.lists(), params] as const,
  details: () => [...gamesKeys.all, 'detail'] as const,
  detail: (id: number) => [...gamesKeys.details(), id] as const,
  categories: () => [...gamesKeys.all, 'categories'] as const,
}

export const commentsKeys = {
  all: ['comments'] as const,
  lists: () => [...commentsKeys.all, 'list'] as const,
  list: (gameId: number, params?: { skip?: number; limit?: number }) =>
    [...commentsKeys.lists(), gameId, params] as const,
}

export const ratingsKeys = {
  all: ['ratings'] as const,
  summary: (gameId: number, visitorId?: string) =>
    [...ratingsKeys.all, 'summary', gameId, visitorId] as const,
}

// =============================================================================
// Games Hooks
// =============================================================================

/**
 * Fetch games list
 */
export const useGames = (params?: {
  skip?: number
  limit?: number
  category?: string
  search?: string
  sort_by?: 'popular' | 'latest' | 'rating'
}) => {
  return useQuery({
    queryKey: gamesKeys.list(params),
    queryFn: () =>
      apiClient.get<GamesListResponse>('/api/games', { params }),
  })
}

/**
 * Fetch single game
 */
export const useGame = (id: number) => {
  return useQuery({
    queryKey: gamesKeys.detail(id),
    queryFn: () => apiClient.get<GameResponse>(`/api/games/${id}`),
    enabled: !!id,
  })
}

/**
 * Fetch game categories
 */
export const useCategories = () => {
  return useQuery({
    queryKey: gamesKeys.categories(),
    queryFn: () => apiClient.get<CategoriesResponse>('/api/games/categories'),
  })
}

/**
 * Record game play
 */
export const useRecordPlay = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      gameId,
      visitorId,
      duration,
    }: {
      gameId: number
      visitorId: string
      duration?: number
    }) =>
      apiClient.post<{ message: string }>(`/api/games/${gameId}/play`, {
        visitor_id: visitorId,
        duration,
      }),
    onSuccess: (_, variables) => {
      // Invalidate game detail to update play count
      queryClient.invalidateQueries({
        queryKey: gamesKeys.detail(variables.gameId),
      })
      // Invalidate games list to update play counts
      queryClient.invalidateQueries({ queryKey: gamesKeys.lists() })
    },
  })
}

// =============================================================================
// Comments Hooks
// =============================================================================

/**
 * Fetch comments for a game
 */
export const useGameComments = (
  gameId: number,
  params?: { skip?: number; limit?: number }
) => {
  return useQuery({
    queryKey: commentsKeys.list(gameId, params),
    queryFn: () =>
      apiClient.get<CommentsListResponse>(`/api/games/${gameId}/comments`, {
        params,
      }),
    enabled: !!gameId,
  })
}

/**
 * Create a comment
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ gameId, data }: { gameId: number; data: CommentCreate }) =>
      apiClient.post<CommentResponse>(`/api/games/${gameId}/comments`, data),
    onSuccess: () => {
      // Invalidate comments list for this game
      queryClient.invalidateQueries({
        queryKey: commentsKeys.lists(),
      })
    },
  })
}

/**
 * Delete a comment
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      apiClient.delete<{ message: string }>(`/api/comments/${id}`),
    onSuccess: () => {
      // Invalidate all comments lists
      queryClient.invalidateQueries({ queryKey: commentsKeys.lists() })
    },
  })
}

// =============================================================================
// Ratings Hooks
// =============================================================================

/**
 * Fetch rating summary for a game
 */
export const useGameRating = (gameId: number, visitorId?: string) => {
  return useQuery({
    queryKey: ratingsKeys.summary(gameId, visitorId),
    queryFn: () =>
      apiClient.get<RatingSummaryResponse>(`/api/games/${gameId}/rating`, {
        params: visitorId ? { visitor_id: visitorId } : undefined,
      }),
    enabled: !!gameId,
  })
}

/**
 * Create or update a rating
 */
export const useCreateRating = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      gameId,
      score,
      visitorId,
    }: {
      gameId: number
      score: number
      visitorId: string
    }) =>
      apiClient.post<RatingResponse>(`/api/games/${gameId}/rating`, {
        score,
        visitor_id: visitorId,
      }),
    onSuccess: (_, variables) => {
      // Invalidate rating summary
      queryClient.invalidateQueries({
        queryKey: ratingsKeys.summary(variables.gameId, variables.visitorId),
      })
      // Invalidate game detail to update avg_rating
      queryClient.invalidateQueries({
        queryKey: gamesKeys.detail(variables.gameId),
      })
      // Invalidate games list to update ratings
      queryClient.invalidateQueries({ queryKey: gamesKeys.lists() })
    },
  })
}
