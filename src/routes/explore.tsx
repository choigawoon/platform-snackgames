import { createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { GameGrid } from '@/components/games/GameGrid'
import { CategoryFilter, SortFilter } from '@/components/games/CategoryFilter'
import { useGames, useCategories } from '@/api/services/games'
import {
  useSelectedCategory,
  useSearchQuery,
  useSortOption,
  useGameActions,
} from '@/stores'

export const Route = createFileRoute('/explore')({
  component: ExplorePage,
})

function ExplorePage() {
  const selectedCategory = useSelectedCategory()
  const searchQuery = useSearchQuery()
  const sortOption = useSortOption()
  const { setSelectedCategory, setSearchQuery, setSortOption } = useGameActions()

  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories()

  const { data: gamesData, isLoading: isLoadingGames } = useGames({
    category: selectedCategory || undefined,
    search: searchQuery || undefined,
    sort_by: sortOption,
    limit: 100,
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">게임 탐색</h1>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="게임 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="space-y-3">
            <CategoryFilter
              categories={categoriesData?.categories || []}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
              isLoading={isLoadingCategories}
            />
            <div className="flex items-center justify-between">
              <SortFilter sortOption={sortOption} onSelect={setSortOption} />
              <span className="text-sm text-muted-foreground">
                {gamesData?.total || 0}개의 게임
              </span>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <GameGrid
          games={gamesData?.games || []}
          isLoading={isLoadingGames}
          emptyMessage={
            searchQuery
              ? `"${searchQuery}"에 대한 검색 결과가 없습니다.`
              : '게임이 없습니다.'
          }
        />
      </div>
    </div>
  )
}
