/**
 * Rating API Schemas
 *
 * Request/Response schemas for Rating API endpoints.
 */

import { z } from 'zod'

// =============================================================================
// Request Schemas
// =============================================================================

/**
 * Rating creation request (POST /api/games/:gameId/rating)
 */
export const RatingCreateSchema = z.object({
  score: z.number().int().min(1).max(5),
  visitor_id: z.string().min(1),
})

// =============================================================================
// Response Schemas
// =============================================================================

/**
 * Rating summary response
 */
export const RatingSummaryResponseSchema = z.object({
  game_id: z.number().int().positive(),
  avg_rating: z.number().min(0).max(5),
  rating_count: z.number().int().nonnegative(),
  user_rating: z.number().int().min(1).max(5).nullable(),
})

/**
 * Rating creation response
 */
export const RatingResponseSchema = z.object({
  id: z.number().int().positive(),
  game_id: z.number().int().positive(),
  visitor_id: z.string(),
  score: z.number().int().min(1).max(5),
  created_at: z.string().datetime(),
})

// =============================================================================
// Type Inference
// =============================================================================

export type RatingCreate = z.infer<typeof RatingCreateSchema>
export type RatingSummaryResponse = z.infer<typeof RatingSummaryResponseSchema>
export type RatingResponse = z.infer<typeof RatingResponseSchema>
