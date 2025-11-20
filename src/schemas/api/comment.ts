/**
 * Comment API Schemas
 *
 * Request/Response schemas for Comment API endpoints.
 */

import { z } from 'zod'

// =============================================================================
// Request Schemas
// =============================================================================

/**
 * Comment creation request (POST /api/games/:gameId/comments)
 */
export const CommentCreateSchema = z.object({
  nickname: z.string().min(1, 'Nickname is required').max(50),
  content: z.string().min(1, 'Content is required').max(500),
})

/**
 * Comment list query params
 */
export const CommentListQuerySchema = z.object({
  skip: z.number().int().nonnegative().default(0),
  limit: z.number().int().positive().max(100).default(20),
})

// =============================================================================
// Response Schemas
// =============================================================================

/**
 * Single comment response
 */
export const CommentResponseSchema = z.object({
  id: z.number().int().positive(),
  game_id: z.number().int().positive(),
  nickname: z.string(),
  content: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

/**
 * Comments list response with pagination
 */
export const CommentsListResponseSchema = z.object({
  comments: z.array(CommentResponseSchema),
  total: z.number().int().nonnegative(),
  skip: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
})

// =============================================================================
// Type Inference
// =============================================================================

export type CommentCreate = z.infer<typeof CommentCreateSchema>
export type CommentListQuery = z.infer<typeof CommentListQuerySchema>
export type CommentResponse = z.infer<typeof CommentResponseSchema>
export type CommentsListResponse = z.infer<typeof CommentsListResponseSchema>
