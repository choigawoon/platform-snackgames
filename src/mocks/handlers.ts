import { http, HttpResponse } from 'msw'
import { type ZodError } from 'zod'
import {
  ItemSchema,
  ItemCreateSchema,
  ItemUpdateSchema,
  ItemsListResponseSchema,
  UserSchema,
  UserCreateSchema,
  UsersListResponseSchema,
  LoginRequestSchema,
  LoginResponseSchema,
  HealthCheckSchema,
  SearchResponseSchema,
  GameResponseSchema,
  GamesListResponseSchema,
  CategoriesResponseSchema,
  CommentCreateSchema,
  CommentResponseSchema,
  CommentsListResponseSchema,
  RatingCreateSchema,
  RatingResponseSchema,
  RatingSummaryResponseSchema,
  type Item,
  type User,
  type HealthCheck,
  type HTTPValidationError,
  type GameResponse,
  type CommentResponse,
} from '@/schemas'
import { db } from '@/db'

// Re-export types for convenience
export type { Item, User, GameResponse, CommentResponse } from '@/schemas'

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format Zod validation error to FastAPI-style validation error
 */
function formatValidationError(error: ZodError): HTTPValidationError {
  return {
    detail: error.issues.map((err) => ({
      loc: ['body', ...err.path.map(String)],
      msg: err.message,
      type: err.code,
    })),
  }
}

/**
 * Create validation error response (422 Unprocessable Entity)
 */
function validationErrorResponse(error: ZodError) {
  return HttpResponse.json(formatValidationError(error), { status: 422 })
}

/**
 * Create HTTP error response
 */
function httpErrorResponse(detail: string, status: number) {
  return HttpResponse.json({ detail }, { status })
}

// MSW Request Handlers (FastAPI-style with IndexedDB)
export const handlers = [
  // Health Check
  http.get('/api/health', () => {
    const response: HealthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    }
    // Validate response with Zod
    const validated = HealthCheckSchema.parse(response)
    return HttpResponse.json(validated)
  }),

  // Items - List all items
  http.get('/api/items', async ({ request }) => {
    const url = new URL(request.url)
    const skip = parseInt(url.searchParams.get('skip') || '0')
    const limit = parseInt(url.searchParams.get('limit') || '100')
    const category = url.searchParams.get('category')

    let items = await db.items.toArray()

    if (category) {
      items = items.filter((item) => item.category === category)
    }

    const total = items.length
    const paginatedItems = items.slice(skip, skip + limit)

    // Map to response format with required id
    const responseItems: Item[] = paginatedItems.map((item) => ({
      id: item.id!,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }))

    const response = {
      items: responseItems,
      total,
      skip,
      limit,
    }

    // Validate response with Zod
    const validated = ItemsListResponseSchema.parse(response)
    return HttpResponse.json(validated)
  }),

  // Items - Get single item
  http.get('/api/items/:id', async ({ params }) => {
    const { id } = params
    const item = await db.items.get(Number(id))

    if (!item) {
      return httpErrorResponse('Item not found', 404)
    }

    const responseItem: Item = {
      id: item.id!,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }

    // Validate response with Zod
    const validated = ItemSchema.parse(responseItem)
    return HttpResponse.json(validated)
  }),

  // Items - Create new item
  http.post('/api/items', async ({ request }) => {
    const body = await request.json()

    // Validate request body with Zod (FastAPI-style)
    const result = ItemCreateSchema.safeParse(body)

    if (!result.success) {
      return validationErrorResponse(result.error)
    }

    const validatedData = result.data
    const now = new Date().toISOString()

    // Add to IndexedDB
    const id = (await db.items.add({
      ...validatedData,
      created_at: now,
      updated_at: now,
    })) as number

    const newItem: Item = {
      id,
      ...validatedData,
      created_at: now,
      updated_at: now,
    }

    // Validate response with Zod
    const validated = ItemSchema.parse(newItem)
    return HttpResponse.json(validated, { status: 201 })
  }),

  // Items - Update item
  http.put('/api/items/:id', async ({ params, request }) => {
    const { id } = params
    const body = await request.json()

    // Validate request body with Zod
    const result = ItemUpdateSchema.safeParse(body)

    if (!result.success) {
      return validationErrorResponse(result.error)
    }

    const validatedData = result.data
    const itemId = Number(id)
    const existingItem = await db.items.get(itemId)

    if (!existingItem) {
      return httpErrorResponse('Item not found', 404)
    }

    const updatedItem = {
      ...existingItem,
      ...validatedData,
      updated_at: new Date().toISOString(),
    }

    // Update in IndexedDB
    await db.items.put(updatedItem)

    const responseItem: Item = {
      id: updatedItem.id!,
      name: updatedItem.name,
      description: updatedItem.description,
      price: updatedItem.price,
      category: updatedItem.category,
      created_at: updatedItem.created_at,
      updated_at: updatedItem.updated_at,
    }

    // Validate response with Zod
    const validated = ItemSchema.parse(responseItem)
    return HttpResponse.json(validated)
  }),

  // Items - Delete item
  http.delete('/api/items/:id', async ({ params }) => {
    const { id } = params
    const itemId = Number(id)
    const existingItem = await db.items.get(itemId)

    if (!existingItem) {
      return httpErrorResponse('Item not found', 404)
    }

    await db.items.delete(itemId)

    return HttpResponse.json({ message: 'Item deleted successfully' })
  }),

  // Users - List all users
  http.get('/api/users', async ({ request }) => {
    const url = new URL(request.url)
    const skip = parseInt(url.searchParams.get('skip') || '0')
    const limit = parseInt(url.searchParams.get('limit') || '100')

    const users = await db.users.toArray()
    const total = users.length
    const paginatedUsers = users.slice(skip, skip + limit)

    // Map to response format
    const responseUsers: User[] = paginatedUsers.map((user) => ({
      id: user.id!,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      is_active: user.is_active,
      created_at: user.created_at,
    }))

    const response = {
      users: responseUsers,
      total,
      skip,
      limit,
    }

    // Validate response with Zod
    const validated = UsersListResponseSchema.parse(response)
    return HttpResponse.json(validated)
  }),

  // Users - Get single user
  http.get('/api/users/:id', async ({ params }) => {
    const { id } = params
    const user = await db.users.get(Number(id))

    if (!user) {
      return httpErrorResponse('User not found', 404)
    }

    const responseUser: User = {
      id: user.id!,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      is_active: user.is_active,
      created_at: user.created_at,
    }

    // Validate response with Zod
    const validated = UserSchema.parse(responseUser)
    return HttpResponse.json(validated)
  }),

  // Users - Create new user
  http.post('/api/users', async ({ request }) => {
    const body = await request.json()

    // Validate request body with Zod
    const result = UserCreateSchema.safeParse(body)

    if (!result.success) {
      return validationErrorResponse(result.error)
    }

    const validatedData = result.data
    const now = new Date().toISOString()

    // Add to IndexedDB
    const id = (await db.users.add({
      email: validatedData.email,
      username: validatedData.username,
      full_name: validatedData.full_name,
      is_active: validatedData.is_active,
      created_at: now,
    })) as number

    const newUser: User = {
      id,
      email: validatedData.email,
      username: validatedData.username,
      full_name: validatedData.full_name,
      is_active: validatedData.is_active,
      created_at: now,
    }

    // Validate response with Zod
    const validated = UserSchema.parse(newUser)
    return HttpResponse.json(validated, { status: 201 })
  }),

  // Auth - Login (FastAPI-style)
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json()

    // Validate request body with Zod
    const result = LoginRequestSchema.safeParse(body)

    if (!result.success) {
      return validationErrorResponse(result.error)
    }

    const validatedData = result.data

    // Mock authentication logic
    if (
      validatedData.username === 'admin' &&
      validatedData.password === 'admin'
    ) {
      const response = {
        access_token: 'mock-jwt-token-12345',
        token_type: 'bearer' as const,
        user: {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          full_name: '관리자',
        },
      }

      // Validate response with Zod
      const validated = LoginResponseSchema.parse(response)
      return HttpResponse.json(validated)
    }

    return httpErrorResponse('Incorrect username or password', 401)
  }),

  // Search endpoint (FastAPI-style)
  http.get('/api/search', async ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q') || ''

    const items = await db.items.toArray()
    const results = items.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    )

    // Map to response format
    const responseResults: Item[] = results.map((item) => ({
      id: item.id!,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }))

    const response = {
      query,
      results: responseResults,
      total: responseResults.length,
    }

    // Validate response with Zod
    const validated = SearchResponseSchema.parse(response)
    return HttpResponse.json(validated)
  }),

  // ============================================================================
  // Games API Handlers
  // ============================================================================

  // Games - List all games
  http.get('/api/games', async ({ request }) => {
    const url = new URL(request.url)
    const skip = parseInt(url.searchParams.get('skip') || '0')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const category = url.searchParams.get('category')
    const search = url.searchParams.get('search')
    const sortBy = url.searchParams.get('sort_by') || 'popular'

    let games = await db.games.toArray()

    // Filter by category
    if (category) {
      games = games.filter((game) => game.category === category)
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase()
      games = games.filter(
        (game) =>
          game.title.toLowerCase().includes(searchLower) ||
          game.description.toLowerCase().includes(searchLower) ||
          game.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      )
    }

    // Sort games
    switch (sortBy) {
      case 'popular':
        games.sort((a, b) => b.play_count - a.play_count)
        break
      case 'latest':
        games.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'rating':
        games.sort((a, b) => b.avg_rating - a.avg_rating)
        break
    }

    const total = games.length
    const paginatedGames = games.slice(skip, skip + limit)

    // Map to response format
    const responseGames: GameResponse[] = paginatedGames.map((game) => ({
      id: game.id!,
      title: game.title,
      description: game.description,
      url: game.url,
      thumbnail: game.thumbnail,
      category: game.category as GameResponse['category'],
      tags: game.tags,
      embed_allowed: game.embed_allowed,
      play_count: game.play_count,
      avg_rating: game.avg_rating,
      rating_count: game.rating_count,
      created_at: game.created_at,
      updated_at: game.updated_at,
    }))

    const response = {
      games: responseGames,
      total,
      skip,
      limit,
    }

    const validated = GamesListResponseSchema.parse(response)
    return HttpResponse.json(validated)
  }),

  // Games - Get single game
  http.get('/api/games/:id', async ({ params }) => {
    const { id } = params
    const game = await db.games.get(Number(id))

    if (!game) {
      return httpErrorResponse('Game not found', 404)
    }

    const responseGame: GameResponse = {
      id: game.id!,
      title: game.title,
      description: game.description,
      url: game.url,
      thumbnail: game.thumbnail,
      category: game.category as GameResponse['category'],
      tags: game.tags,
      embed_allowed: game.embed_allowed,
      play_count: game.play_count,
      avg_rating: game.avg_rating,
      rating_count: game.rating_count,
      created_at: game.created_at,
      updated_at: game.updated_at,
    }

    const validated = GameResponseSchema.parse(responseGame)
    return HttpResponse.json(validated)
  }),

  // Games - Get categories
  http.get('/api/games/categories', async () => {
    const games = await db.games.toArray()

    // Count games per category
    const categoryCounts = games.reduce((acc, game) => {
      acc[game.category] = (acc[game.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const categoryNames: Record<string, string> = {
      puzzle: '퍼즐',
      action: '액션',
      education: '교육',
      entertainment: '엔터테인먼트',
      casual: '캐주얼',
      sports: '스포츠',
      strategy: '전략',
    }

    const categories = Object.entries(categoryCounts).map(([id, count]) => ({
      id: id as GameResponse['category'],
      name: categoryNames[id] || id,
      count,
    }))

    const response = { categories }
    const validated = CategoriesResponseSchema.parse(response)
    return HttpResponse.json(validated)
  }),

  // Games - Record play
  http.post('/api/games/:id/play', async ({ params, request }) => {
    const { id } = params
    const gameId = Number(id)
    const game = await db.games.get(gameId)

    if (!game) {
      return httpErrorResponse('Game not found', 404)
    }

    const body = await request.json() as { visitor_id: string; duration?: number }
    const now = new Date().toISOString()

    // Record play history
    await db.playHistory.add({
      game_id: gameId,
      visitor_id: body.visitor_id,
      duration: body.duration || null,
      played_at: now,
    })

    // Increment play count
    await db.games.update(gameId, {
      play_count: game.play_count + 1,
    })

    return HttpResponse.json({ message: 'Play recorded successfully' })
  }),

  // ============================================================================
  // Comments API Handlers
  // ============================================================================

  // Comments - List comments for a game
  http.get('/api/games/:gameId/comments', async ({ params, request }) => {
    const { gameId } = params
    const url = new URL(request.url)
    const skip = parseInt(url.searchParams.get('skip') || '0')
    const limit = parseInt(url.searchParams.get('limit') || '20')

    const comments = await db.comments
      .where('game_id')
      .equals(Number(gameId))
      .reverse()
      .toArray()

    const total = comments.length
    const paginatedComments = comments.slice(skip, skip + limit)

    const responseComments: CommentResponse[] = paginatedComments.map((comment) => ({
      id: comment.id!,
      game_id: comment.game_id,
      nickname: comment.nickname,
      content: comment.content,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
    }))

    const response = {
      comments: responseComments,
      total,
      skip,
      limit,
    }

    const validated = CommentsListResponseSchema.parse(response)
    return HttpResponse.json(validated)
  }),

  // Comments - Create comment
  http.post('/api/games/:gameId/comments', async ({ params, request }) => {
    const { gameId } = params
    const body = await request.json()

    const result = CommentCreateSchema.safeParse(body)
    if (!result.success) {
      return validationErrorResponse(result.error)
    }

    const game = await db.games.get(Number(gameId))
    if (!game) {
      return httpErrorResponse('Game not found', 404)
    }

    const validatedData = result.data
    const now = new Date().toISOString()

    const id = await db.comments.add({
      game_id: Number(gameId),
      nickname: validatedData.nickname,
      content: validatedData.content,
      created_at: now,
      updated_at: now,
    }) as number

    const newComment: CommentResponse = {
      id,
      game_id: Number(gameId),
      nickname: validatedData.nickname,
      content: validatedData.content,
      created_at: now,
      updated_at: now,
    }

    const validated = CommentResponseSchema.parse(newComment)
    return HttpResponse.json(validated, { status: 201 })
  }),

  // Comments - Delete comment
  http.delete('/api/comments/:id', async ({ params }) => {
    const { id } = params
    const commentId = Number(id)
    const existingComment = await db.comments.get(commentId)

    if (!existingComment) {
      return httpErrorResponse('Comment not found', 404)
    }

    await db.comments.delete(commentId)
    return HttpResponse.json({ message: 'Comment deleted successfully' })
  }),

  // ============================================================================
  // Ratings API Handlers
  // ============================================================================

  // Ratings - Get rating summary for a game
  http.get('/api/games/:gameId/rating', async ({ params, request }) => {
    const { gameId } = params
    const url = new URL(request.url)
    const visitorId = url.searchParams.get('visitor_id')

    const game = await db.games.get(Number(gameId))
    if (!game) {
      return httpErrorResponse('Game not found', 404)
    }

    let userRating = null
    if (visitorId) {
      const rating = await db.ratings
        .where('[game_id+visitor_id]')
        .equals([Number(gameId), visitorId])
        .first()
      userRating = rating?.score || null
    }

    const response = {
      game_id: game.id!,
      avg_rating: game.avg_rating,
      rating_count: game.rating_count,
      user_rating: userRating,
    }

    const validated = RatingSummaryResponseSchema.parse(response)
    return HttpResponse.json(validated)
  }),

  // Ratings - Create or update rating
  http.post('/api/games/:gameId/rating', async ({ params, request }) => {
    const { gameId } = params
    const body = await request.json()

    const result = RatingCreateSchema.safeParse(body)
    if (!result.success) {
      return validationErrorResponse(result.error)
    }

    const game = await db.games.get(Number(gameId))
    if (!game) {
      return httpErrorResponse('Game not found', 404)
    }

    const validatedData = result.data
    const now = new Date().toISOString()

    // Check if user already rated
    const existingRating = await db.ratings
      .where('[game_id+visitor_id]')
      .equals([Number(gameId), validatedData.visitor_id])
      .first()

    let ratingId: number
    if (existingRating) {
      // Update existing rating
      await db.ratings.update(existingRating.id!, {
        score: validatedData.score,
        created_at: now,
      })
      ratingId = existingRating.id!
    } else {
      // Create new rating
      ratingId = await db.ratings.add({
        game_id: Number(gameId),
        visitor_id: validatedData.visitor_id,
        score: validatedData.score,
        created_at: now,
      }) as number
    }

    // Recalculate average rating
    const allRatings = await db.ratings
      .where('game_id')
      .equals(Number(gameId))
      .toArray()

    const avgRating = allRatings.reduce((sum, r) => sum + r.score, 0) / allRatings.length

    await db.games.update(Number(gameId), {
      avg_rating: Math.round(avgRating * 10) / 10,
      rating_count: allRatings.length,
    })

    const response = {
      id: ratingId,
      game_id: Number(gameId),
      visitor_id: validatedData.visitor_id,
      score: validatedData.score,
      created_at: now,
    }

    const validated = RatingResponseSchema.parse(response)
    return HttpResponse.json(validated, { status: existingRating ? 200 : 201 })
  }),
]
