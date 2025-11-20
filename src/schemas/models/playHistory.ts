/**
 * Play History Model Schema
 *
 * Schema for tracking game play history in the SnackGames platform
 */

import { z } from 'zod'

// =============================================================================
// Base Schema (shared fields)
// =============================================================================

export const PlayHistoryBaseSchema = z.object({
  gameId: z.number().int().positive(),
  visitorId: z.string().min(1), // Anonymous visitor identifier
  duration: z.number().int().nonnegative().optional(), // Play duration in seconds
})

// =============================================================================
// Full Model Schema (DB entity)
// =============================================================================

export const PlayHistorySchema = PlayHistoryBaseSchema.extend({
  id: z.number().int().positive(),
  playedAt: z.string().datetime(),
})

// =============================================================================
// Type Inference
// =============================================================================

export type PlayHistoryBase = z.infer<typeof PlayHistoryBaseSchema>
export type PlayHistory = z.infer<typeof PlayHistorySchema>
