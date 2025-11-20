/**
 * Game API Schemas
 *
 * Request/Response schemas for Game API endpoints.
 */

import { z } from 'zod'
import { GameCategorySchema } from '../models/game'

// =============================================================================
// Request Schemas
// =============================================================================

/**
 * Game creation request (POST /api/games)
 */
export const GameCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  url: z.string().url('Valid URL is required'),
  thumbnail: z.string().url().optional(),
  category: GameCategorySchema,
  tags: z.array(z.string()).default([]),
  embed_allowed: z.boolean().default(true),
})

/**
 * Game update request (PUT /api/games/:id)
 */
export const GameUpdateSchema = GameCreateSchema.partial()

/**
 * Game list query params
 */
export const GameListQuerySchema = z.object({
  category: GameCategorySchema.optional(),
  search: z.string().optional(),
  sort_by: z.enum(['popular', 'latest', 'rating']).default('popular'),
  skip: z.number().int().nonnegative().default(0),
  limit: z.number().int().positive().max(100).default(20),
})

// =============================================================================
// Response Schemas
// =============================================================================

/**
 * Single game response
 */
export const GameResponseSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  description: z.string(),
  url: z.string(),
  thumbnail: z.string().nullable(),
  category: GameCategorySchema,
  tags: z.array(z.string()),
  embed_allowed: z.boolean(),
  play_count: z.number().int().nonnegative(),
  avg_rating: z.number().min(0).max(5),
  rating_count: z.number().int().nonnegative(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

/**
 * Games list response with pagination
 */
export const GamesListResponseSchema = z.object({
  games: z.array(GameResponseSchema),
  total: z.number().int().nonnegative(),
  skip: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
})

/**
 * Categories list response
 */
export const CategoriesResponseSchema = z.object({
  categories: z.array(
    z.object({
      id: GameCategorySchema,
      name: z.string(),
      count: z.number().int().nonnegative(),
    })
  ),
})

// =============================================================================
// Type Inference
// =============================================================================

export type GameCreate = z.infer<typeof GameCreateSchema>
export type GameUpdate = z.infer<typeof GameUpdateSchema>
export type GameListQuery = z.infer<typeof GameListQuerySchema>
export type GameResponse = z.infer<typeof GameResponseSchema>
export type GamesListResponse = z.infer<typeof GamesListResponseSchema>
export type CategoriesResponse = z.infer<typeof CategoriesResponseSchema>
