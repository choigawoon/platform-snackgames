/**
 * IndexedDB Database Configuration
 *
 * Uses Dexie.js for IndexedDB wrapper.
 * This provides a mock database for frontend development.
 */

import Dexie, { type EntityTable } from 'dexie'

// =============================================================================
// Database Entity Types (stored in IndexedDB)
// =============================================================================

export interface ItemEntity {
  id?: number
  name: string
  description: string
  price: number
  category: string
  created_at: string
  updated_at: string
}

export interface UserEntity {
  id?: number
  email: string
  username: string
  full_name: string
  is_active: boolean
  created_at: string
}

export interface GameEntity {
  id?: number
  title: string
  description: string
  url: string
  thumbnail: string | null
  category: string
  tags: string[]
  embed_allowed: boolean
  play_count: number
  avg_rating: number
  rating_count: number
  created_at: string
  updated_at: string
}

export interface CommentEntity {
  id?: number
  game_id: number
  nickname: string
  content: string
  created_at: string
  updated_at: string
}

export interface RatingEntity {
  id?: number
  game_id: number
  visitor_id: string
  score: number
  created_at: string
}

export interface PlayHistoryEntity {
  id?: number
  game_id: number
  visitor_id: string
  duration: number | null
  played_at: string
}

// =============================================================================
// Database Class
// =============================================================================

export class AppDatabase extends Dexie {
  items!: EntityTable<ItemEntity, 'id'>
  users!: EntityTable<UserEntity, 'id'>
  games!: EntityTable<GameEntity, 'id'>
  comments!: EntityTable<CommentEntity, 'id'>
  ratings!: EntityTable<RatingEntity, 'id'>
  playHistory!: EntityTable<PlayHistoryEntity, 'id'>

  constructor() {
    super('SnackGamesDB')

    this.version(1).stores({
      items: '++id, name, category, created_at',
      users: '++id, email, username, created_at',
      games: '++id, title, category, play_count, avg_rating, created_at',
      comments: '++id, game_id, created_at',
      ratings: '++id, game_id, visitor_id, [game_id+visitor_id]',
      playHistory: '++id, game_id, visitor_id, played_at',
    })
  }
}

// =============================================================================
// Database Instance
// =============================================================================

export const db = new AppDatabase()

// =============================================================================
// Seed Data
// =============================================================================

const initialItems: Omit<ItemEntity, 'id'>[] = [
  {
    name: '노트북',
    description: '고성능 노트북',
    price: 1500000,
    category: '전자제품',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    name: '마우스',
    description: '무선 마우스',
    price: 30000,
    category: '전자제품',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    name: '키보드',
    description: '기계식 키보드',
    price: 150000,
    category: '전자제품',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
]

const initialUsers: Omit<UserEntity, 'id'>[] = [
  {
    email: 'user1@example.com',
    username: 'user1',
    full_name: '홍길동',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    email: 'user2@example.com',
    username: 'user2',
    full_name: '김철수',
    is_active: true,
    created_at: '2024-01-02T00:00:00Z',
  },
]

const initialGames: Omit<GameEntity, 'id'>[] = [
  {
    title: '메모리 게임',
    description: '카드를 뒤집어 같은 그림 2개를 찾는 기억력 게임입니다. 가능한 적은 횟수로 모든 카드를 맞춰보세요!',
    url: 'internal://memory-game',
    thumbnail: null,
    category: 'puzzle',
    tags: ['퍼즐', '기억력', '카드', '두뇌'],
    embed_allowed: true,
    play_count: 0,
    avg_rating: 0,
    rating_count: 0,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
  },
  {
    title: '수박게임',
    description: '과일을 합쳐서 큰 수박을 만드는 중독성 있는 퍼즐 게임입니다. 같은 과일끼리 합치면 더 큰 과일이 되고, 최종 목표는 수박을 만드는 것입니다.',
    url: 'https://suika-game.app/ko',
    thumbnail: 'https://suika-game.app/game/img/suika_512_green.png',
    category: 'puzzle',
    tags: ['퍼즐', '캐주얼', '과일', '합치기'],
    embed_allowed: true,
    play_count: 1520,
    avg_rating: 4.5,
    rating_count: 324,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    title: '메이플퍼즐 블록매치',
    description: '메이플스토리 캐릭터들과 함께하는 블록 매치 퍼즐 게임입니다. 같은 블록을 3개 이상 연결하여 제거하고 스테이지를 클리어하세요.',
    url: 'https://maplepuzzle.nexon.com/welcome/index.html',
    thumbnail: 'https://maplepuzzle.nexon.com/common/img/og_image.jpg',
    category: 'puzzle',
    tags: ['퍼즐', '메이플스토리', '블록매치', '넥슨'],
    embed_allowed: true,
    play_count: 892,
    avg_rating: 4.2,
    rating_count: 156,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    title: '온라인 타자교실',
    description: '한글과 영어 타자 연습을 할 수 있는 온라인 타자 연습 프로그램입니다. 다양한 연습 모드와 게임으로 타자 실력을 향상시키세요.',
    url: 'https://typing.zidell.me/',
    thumbnail: null,
    category: 'education',
    tags: ['교육', '타자', '연습', '한글', '영어'],
    embed_allowed: true,
    play_count: 2341,
    avg_rating: 4.7,
    rating_count: 512,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
  {
    title: '이상형 월드컵',
    description: '나만의 이상형을 찾아가는 재미있는 토너먼트 게임입니다. 다양한 주제의 월드컵으로 취향을 테스트해보세요.',
    url: 'https://www.piku.co.kr/',
    thumbnail: 'https://www.piku.co.kr/images/piku_og.png',
    category: 'entertainment',
    tags: ['엔터테인먼트', '이상형', '월드컵', '토너먼트'],
    embed_allowed: true,
    play_count: 3156,
    avg_rating: 4.3,
    rating_count: 721,
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-04T00:00:00Z',
  },
]

const initialComments: Omit<CommentEntity, 'id'>[] = [
  {
    game_id: 1,
    nickname: '과일러버',
    content: '정말 중독성 있어요! 한번 시작하면 멈출 수가 없네요 ㅋㅋ',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    game_id: 1,
    nickname: '게임고수',
    content: '수박 만들기 진짜 어렵다... 아직도 못 만들어봄',
    created_at: '2024-01-16T14:20:00Z',
    updated_at: '2024-01-16T14:20:00Z',
  },
  {
    game_id: 2,
    nickname: '메이플팬',
    content: '메이플 캐릭터들이 귀여워서 더 재밌어요!',
    created_at: '2024-01-17T09:15:00Z',
    updated_at: '2024-01-17T09:15:00Z',
  },
  {
    game_id: 3,
    nickname: '타자초보',
    content: '덕분에 타자 실력이 많이 늘었습니다. 추천!',
    created_at: '2024-01-18T16:45:00Z',
    updated_at: '2024-01-18T16:45:00Z',
  },
  {
    game_id: 4,
    nickname: '월드컵마니아',
    content: '이상형 월드컵 진짜 재밌어요! 시간 가는 줄 모름',
    created_at: '2024-01-19T11:00:00Z',
    updated_at: '2024-01-19T11:00:00Z',
  },
]

const initialRatings: Omit<RatingEntity, 'id'>[] = [
  { game_id: 1, visitor_id: 'visitor-001', score: 5, created_at: '2024-01-15T10:30:00Z' },
  { game_id: 1, visitor_id: 'visitor-002', score: 4, created_at: '2024-01-16T14:20:00Z' },
  { game_id: 2, visitor_id: 'visitor-001', score: 4, created_at: '2024-01-17T09:15:00Z' },
  { game_id: 3, visitor_id: 'visitor-003', score: 5, created_at: '2024-01-18T16:45:00Z' },
  { game_id: 4, visitor_id: 'visitor-002', score: 4, created_at: '2024-01-19T11:00:00Z' },
]

// =============================================================================
// Database Initialization
// =============================================================================

/**
 * Initialize the database with seed data if empty
 */
export async function initializeDatabase(): Promise<void> {
  try {
    // Check if items table is empty
    const itemCount = await db.items.count()
    if (itemCount === 0) {
      await db.items.bulkAdd(initialItems)
      console.log('[IndexedDB] Seeded items table with initial data')
    }

    // Check if users table is empty
    const userCount = await db.users.count()
    if (userCount === 0) {
      await db.users.bulkAdd(initialUsers)
      console.log('[IndexedDB] Seeded users table with initial data')
    }

    // Check if games table is empty
    const gameCount = await db.games.count()
    if (gameCount === 0) {
      await db.games.bulkAdd(initialGames)
      console.log('[IndexedDB] Seeded games table with initial data')
    }

    // Check if comments table is empty
    const commentCount = await db.comments.count()
    if (commentCount === 0) {
      await db.comments.bulkAdd(initialComments)
      console.log('[IndexedDB] Seeded comments table with initial data')
    }

    // Check if ratings table is empty
    const ratingCount = await db.ratings.count()
    if (ratingCount === 0) {
      await db.ratings.bulkAdd(initialRatings)
      console.log('[IndexedDB] Seeded ratings table with initial data')
    }

    console.log('[IndexedDB] Database initialized successfully')
  } catch (error) {
    console.error('[IndexedDB] Failed to initialize database:', error)
    throw error
  }
}

/**
 * Clear all data from the database
 */
export async function clearDatabase(): Promise<void> {
  await db.items.clear()
  await db.users.clear()
  await db.games.clear()
  await db.comments.clear()
  await db.ratings.clear()
  await db.playHistory.clear()
  console.log('[IndexedDB] Database cleared')
}

/**
 * Reset database to initial state
 */
export async function resetDatabase(): Promise<void> {
  await clearDatabase()
  await initializeDatabase()
  console.log('[IndexedDB] Database reset to initial state')
}
