import { createFileRoute, Link } from '@tanstack/react-router'
import { Gamepad2, TrendingUp, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GameSection } from '@/components/games/GameGrid'
import { useGames } from '@/api/services/games'
import { useRecentGameIds } from '@/stores'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const recentGameIds = useRecentGameIds()

  // Fetch popular games
  const { data: popularData, isLoading: isLoadingPopular } = useGames({
    sort_by: 'popular',
    limit: 4,
  })

  // Fetch latest games
  const { data: latestData, isLoading: isLoadingLatest } = useGames({
    sort_by: 'latest',
    limit: 4,
  })

  // Fetch top rated games
  const { data: ratedData, isLoading: isLoadingRated } = useGames({
    sort_by: 'rating',
    limit: 4,
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-4">
            <Gamepad2 className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            SnackGames
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            간단하고 재미있는 미니게임을 즐겨보세요. 언제 어디서나 빠르게 플레이할 수 있는 스낵 같은 게임들!
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/explore">
              <Button size="lg" className="gap-2">
                <TrendingUp className="w-5 h-5" />
                게임 탐색
              </Button>
            </Link>
            <Link to="/swipe">
              <Button size="lg" variant="outline" className="gap-2">
                <Gamepad2 className="w-5 h-5" />
                스와이프 모드
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Popular Games */}
        <GameSection
          title="인기 게임"
          games={popularData?.games || []}
          isLoading={isLoadingPopular}
          showAll={() => window.location.href = '/explore?sort=popular'}
        />

        {/* Latest Games */}
        <GameSection
          title="최신 게임"
          games={latestData?.games || []}
          isLoading={isLoadingLatest}
          showAll={() => window.location.href = '/explore?sort=latest'}
        />

        {/* Top Rated Games */}
        <GameSection
          title="평점 높은 게임"
          games={ratedData?.games || []}
          isLoading={isLoadingRated}
          showAll={() => window.location.href = '/explore?sort=rating'}
        />

        {/* Recent Games (if any) */}
        {recentGameIds.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-xl font-bold">최근 플레이</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              최근에 플레이한 게임들이 여기에 표시됩니다.
            </p>
          </section>
        )}
      </main>
    </div>
  )
}
