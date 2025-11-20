/**
 * Game Model Schema
 *
 * Schema for game entities in the SnackGames platform
 */

import { z } from 'zod'

// =============================================================================
// Enums
// =============================================================================

export const GameCategorySchema = z.enum([
  'puzzle',
  'action',
  'education',
  'entertainment',
  'casual',
  'sports',
  'strategy',
])

export type GameCategory = z.infer<typeof GameCategorySchema>

// =============================================================================
// Base Schema (shared fields)
// =============================================================================

export const GameBaseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  url: z.string().url('Valid URL is required'),
  thumbnail: z.string().url().optional(),
  category: GameCategorySchema,
  tags: z.array(z.string()).default([]),
  embedAllowed: z.boolean().default(true),
})

// =============================================================================
// Full Model Schema (DB entity)
// =============================================================================

export const GameSchema = GameBaseSchema.extend({
  id: z.number().int().positive(),
  playCount: z.number().int().nonnegative().default(0),
  avgRating: z.number().min(0).max(5).default(0),
  ratingCount: z.number().int().nonnegative().default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

// =============================================================================
// Type Inference
// =============================================================================

export type GameBase = z.infer<typeof GameBaseSchema>
export type Game = z.infer<typeof GameSchema>
