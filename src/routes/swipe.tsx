import { createFileRoute } from '@tanstack/react-router'
import { GameSwiper } from '@/components/games/GameSwiper'
import { useGames } from '@/api/services/games'

export const Route = createFileRoute('/swipe')({
  component: SwipePage,
})

function SwipePage() {
  const { data, isLoading } = useGames({
    sort_by: 'popular',
    limit: 50,
  })

  return (
    <GameSwiper
      games={data?.games || []}
      isLoading={isLoading}
    />
  )
}
