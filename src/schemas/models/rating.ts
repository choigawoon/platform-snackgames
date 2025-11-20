/**
 * Rating Model Schema
 *
 * Schema for rating entities in the SnackGames platform
 */

import { z } from 'zod'

// =============================================================================
// Base Schema (shared fields)
// =============================================================================

export const RatingBaseSchema = z.object({
  gameId: z.number().int().positive(),
  visitorId: z.string().min(1), // Anonymous visitor identifier
  score: z.number().int().min(1).max(5),
})

// =============================================================================
// Full Model Schema (DB entity)
// =============================================================================

export const RatingSchema = RatingBaseSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.string().datetime(),
})

// =============================================================================
// Type Inference
// =============================================================================

export type RatingBase = z.infer<typeof RatingBaseSchema>
export type Rating = z.infer<typeof RatingSchema>
