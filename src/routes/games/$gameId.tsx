import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { GamePlayer } from '@/components/games/GamePlayer'
import { RatingSummary } from '@/components/games/RatingStars'
import { CommentList } from '@/components/comments/CommentList'
import {
  useGame,
  useGameComments,
  useGameRating,
  useCreateComment,
  useCreateRating,
  useRecordPlay,
} from '@/api/services/games'
import { useVisitorId, useGameActions } from '@/stores'

export const Route = createFileRoute('/games/$gameId')({
  component: GameDetailPage,
})

function GameDetailPage() {
  const { gameId } = Route.useParams()
  const visitorId = useVisitorId()
  const { addToRecentGames } = useGameActions()

  const gameIdNum = parseInt(gameId, 10)

  const { data: game, isLoading: isLoadingGame } = useGame(gameIdNum)
  const { data: commentsData, isLoading: isLoadingComments } = useGameComments(
    gameIdNum
  )
  const { data: ratingData } = useGameRating(gameIdNum, visitorId)

  const createComment = useCreateComment()
  const createRating = useCreateRating()
  const recordPlay = useRecordPlay()

  const categoryLabels: Record<string, string> = {
    puzzle: '퍼즐',
    action: '액션',
    education: '교육',
    entertainment: '엔터테인먼트',
    casual: '캐주얼',
    sports: '스포츠',
    strategy: '전략',
  }

  const handlePlay = () => {
    recordPlay.mutate({
      gameId: gameIdNum,
      visitorId,
    })
    addToRecentGames(gameIdNum)
  }

  const handleRate = (score: number) => {
    createRating.mutate({
      gameId: gameIdNum,
      score,
      visitorId,
    })
  }

  const handleComment = (data: { nickname: string; content: string }) => {
    createComment.mutate({
      gameId: gameIdNum,
      data,
    })
  }

  const handleShare = async () => {
    if (navigator.share && game) {
      try {
        await navigator.share({
          title: game.title,
          text: game.description,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (isLoadingGame) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="aspect-video bg-muted rounded-lg" />
          <div className="h-6 w-3/4 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <h1 className="text-2xl font-bold mb-4">게임을 찾을 수 없습니다</h1>
        <Link to="/">
          <Button>홈으로 돌아가기</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-4 flex items-center justify-between">
          <Link to="/explore">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              뒤로 가기
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Game Player */}
        <div className="mb-6">
          <GamePlayer
            url={game.url}
            title={game.title}
            embedAllowed={game.embed_allowed}
            onPlay={handlePlay}
          />
        </div>

        {/* Game Info */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Description */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">
                  {categoryLabels[game.category] || game.category}
                </Badge>
                {game.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-2xl font-bold mb-2">{game.title}</h1>
              <p className="text-muted-foreground">{game.description}</p>
            </div>

            <Separator />

            {/* Comments Section */}
            <CommentList
              comments={commentsData?.comments || []}
              total={commentsData?.total || 0}
              isLoading={isLoadingComments}
              onSubmit={handleComment}
              isSubmitting={createComment.isPending}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Rating Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">평점</CardTitle>
              </CardHeader>
              <CardContent>
                <RatingSummary
                  avgRating={ratingData?.avg_rating || game.avg_rating}
                  ratingCount={ratingData?.rating_count || game.rating_count}
                  userRating={ratingData?.user_rating}
                  onRate={handleRate}
                />
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">게임 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">플레이 횟수</span>
                  <span className="font-medium">
                    {game.play_count.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">카테고리</span>
                  <span className="font-medium">
                    {categoryLabels[game.category] || game.category}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">등록일</span>
                  <span className="font-medium">
                    {new Date(game.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
