import { Link } from '@tanstack/react-router'
import { Home, Menu, Compass, Smartphone, Gamepad2 } from 'lucide-react'
import LanguageSelector from './LanguageSelector'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useSidebar, useUiActions } from '@/stores'

export default function Header() {
  const isSidebarOpen = useSidebar()
  const { setSidebarOpen } = useUiActions()

  return (
    <header className="sticky top-0 z-50 h-16 px-4 flex items-center justify-between bg-background border-b">
      <div className="flex items-center">
        <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="text-xl font-bold flex items-center gap-2">
                <Gamepad2 className="w-6 h-6 text-primary" />
                SnackGames
              </SheetTitle>
            </SheetHeader>

            <nav className="flex-1 p-4 overflow-y-auto">
              <Link
                to="/"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors mb-2"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mb-2',
                }}
                onClick={() => setSidebarOpen(false)}
              >
                <Home size={20} />
                <span className="font-medium">홈</span>
              </Link>

              <Link
                to="/explore"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors mb-2"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mb-2',
                }}
                onClick={() => setSidebarOpen(false)}
              >
                <Compass size={20} />
                <span className="font-medium">게임 탐색</span>
              </Link>

              <Link
                to="/swipe"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors mb-2"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mb-2',
                }}
                onClick={() => setSidebarOpen(false)}
              >
                <Smartphone size={20} />
                <span className="font-medium">스와이프</span>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 ml-2 md:ml-0">
          <Gamepad2 className="w-7 h-7 text-primary" />
          <span className="text-xl font-bold hidden sm:inline">SnackGames</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 ml-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              홈
            </Button>
          </Link>
          <Link to="/explore">
            <Button variant="ghost" size="sm">
              게임 탐색
            </Button>
          </Link>
          <Link to="/swipe">
            <Button variant="ghost" size="sm">
              스와이프
            </Button>
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSelector />
      </div>
    </header>
  )
}
