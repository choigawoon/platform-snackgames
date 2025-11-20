/**
 * Comment Model Schema
 *
 * Schema for comment entities in the SnackGames platform
 */

import { z } from 'zod'

// =============================================================================
// Base Schema (shared fields)
// =============================================================================

export const CommentBaseSchema = z.object({
  gameId: z.number().int().positive(),
  nickname: z.string().min(1, 'Nickname is required').max(50),
  content: z.string().min(1, 'Content is required').max(500),
})

// =============================================================================
// Full Model Schema (DB entity)
// =============================================================================

export const CommentSchema = CommentBaseSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

// =============================================================================
// Type Inference
// =============================================================================

export type CommentBase = z.infer<typeof CommentBaseSchema>
export type Comment = z.infer<typeof CommentSchema>
