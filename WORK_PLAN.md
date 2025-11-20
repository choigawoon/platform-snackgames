# 스낵게임 플랫폼 개발 작업 계획서

**프로젝트명**: SnackGames Platform
**시작일**: 2025-11-20
**목표**: 미니게임/스낵게임을 즐길 수 있는 플랫폼 구축

---

## 프로젝트 개요

### 핵심 기능
- 🎮 iframe 기반 외부 게임 연동
- 📱 틱톡/쇼츠 형태 (1개씩 스와이프) 뷰
- 📺 넷플릭스/유튜브 형태 (그리드/캐러셀) 뷰
- 💬 댓글 시스템
- ⭐ 평점/좋아요 시스템
- 🔍 게임 검색 및 필터링

### 초기 게임 목록
| 순번 | 게임명 | URL | 카테고리 |
|------|--------|-----|----------|
| 1 | 수박게임 | https://suika-game.app/ko | 퍼즐 |
| 2 | 메이플퍼즐 블록매치 | https://maplepuzzle.nexon.com/welcome/index.html | 퍼즐 |
| 3 | 온라인 타자교실 | https://typing.zidell.me/ | 교육 |
| 4 | 이상형 월드컵 | https://www.piku.co.kr/ | 엔터테인먼트 |

---

## Phase 1: 데이터 구조 설계 (1일)

### 1.1 Zod 스키마 정의
- [ ] `src/schemas/models/game.ts` - 게임 모델 스키마
- [ ] `src/schemas/models/comment.ts` - 댓글 모델 스키마
- [ ] `src/schemas/models/rating.ts` - 평점 모델 스키마
- [ ] `src/schemas/api/game.ts` - 게임 API 요청/응답 스키마
- [ ] `src/schemas/api/comment.ts` - 댓글 API 스키마

### 1.2 IndexedDB 테이블 추가
- [ ] `src/db/index.ts` 수정
  - games 테이블 (id, title, description, url, thumbnail, category, tags, playCount, createdAt, updatedAt)
  - comments 테이블 (id, gameId, userId, content, createdAt, updatedAt)
  - ratings 테이블 (id, gameId, userId, score, createdAt)
  - playHistory 테이블 (id, gameId, userId, playedAt, duration)

### 1.3 시드 데이터
- [ ] 4개 초기 게임 데이터 입력
- [ ] 샘플 댓글 데이터
- [ ] 샘플 평점 데이터

---

## Phase 2: API 레이어 구축 (1일)

### 2.1 MSW 핸들러 구현
- [ ] `src/mocks/handlers.ts` 확장
  - GET `/api/games` - 게임 목록 (필터, 정렬, 페이지네이션)
  - GET `/api/games/:id` - 게임 상세
  - GET `/api/games/:id/comments` - 게임 댓글 목록
  - POST `/api/games/:id/comments` - 댓글 작성
  - DELETE `/api/comments/:id` - 댓글 삭제
  - POST `/api/games/:id/rating` - 평점 등록
  - GET `/api/games/:id/rating` - 평점 조회
  - POST `/api/games/:id/play` - 플레이 기록
  - GET `/api/games/categories` - 카테고리 목록

### 2.2 TanStack Query 서비스 훅
- [ ] `src/api/services/games.ts`
  - useGames() - 게임 목록 조회
  - useGame(id) - 게임 상세 조회
  - useGameComments(gameId) - 댓글 목록
  - useCreateComment() - 댓글 작성 뮤테이션
  - useDeleteComment() - 댓글 삭제 뮤테이션
  - useGameRating(gameId) - 평점 조회
  - useCreateRating() - 평점 등록 뮤테이션
  - useRecordPlay() - 플레이 기록 뮤테이션
  - useCategories() - 카테고리 목록

---

## Phase 3: 상태 관리 (0.5일)

### 3.1 Zustand Slice 추가
- [ ] `src/stores/slices/gameSlice.ts`
  - currentGame: 현재 선택된 게임
  - viewMode: 'grid' | 'swipe' (화면 모드)
  - selectedCategory: 선택된 카테고리
  - searchQuery: 검색어
  - recentGames: 최근 플레이 게임 (로컬)

### 3.2 Store 통합
- [ ] `src/stores/index.ts` 업데이트

---

## Phase 4: UI 컴포넌트 개발 (2일)

### 4.1 게임 카드 컴포넌트
- [ ] `src/components/games/GameCard.tsx` - 게임 카드 (썸네일, 제목, 평점)
- [ ] `src/components/games/GameCardSkeleton.tsx` - 로딩 스켈레톤

### 4.2 게임 플레이어 컴포넌트
- [ ] `src/components/games/GamePlayer.tsx` - iframe 래퍼
  - 전체화면 지원
  - 로딩 상태
  - 에러 처리 (X-Frame-Options 대응)

### 4.3 댓글 컴포넌트
- [ ] `src/components/comments/CommentList.tsx` - 댓글 목록
- [ ] `src/components/comments/CommentItem.tsx` - 개별 댓글
- [ ] `src/components/comments/CommentForm.tsx` - 댓글 작성 폼

### 4.4 평점 컴포넌트
- [ ] `src/components/ratings/RatingStars.tsx` - 별점 표시/입력
- [ ] `src/components/ratings/RatingSummary.tsx` - 평점 요약

### 4.5 레이아웃 컴포넌트
- [ ] `src/components/layout/GameGrid.tsx` - 넷플릭스/유튜브 스타일 그리드
- [ ] `src/components/layout/GameSwiper.tsx` - 틱톡/쇼츠 스타일 스와이퍼
- [ ] `src/components/layout/CategoryFilter.tsx` - 카테고리 필터 바
- [ ] `src/components/layout/SearchBar.tsx` - 검색창

### 4.6 공통 컴포넌트
- [ ] `src/components/ui/skeleton.tsx` - shadcn 스켈레톤 추가
- [ ] `src/components/ui/tabs.tsx` - shadcn 탭 추가
- [ ] `src/components/ui/avatar.tsx` - shadcn 아바타 추가
- [ ] `src/components/ui/textarea.tsx` - shadcn 텍스트에어리어 추가

---

## Phase 5: 페이지 구현 (2일)

### 5.1 홈페이지 리뉴얼
- [ ] `src/routes/index.tsx` 수정
  - 추천 게임 섹션
  - 인기 게임 섹션
  - 카테고리별 게임 섹션
  - 최근 플레이 게임 섹션

### 5.2 그리드 뷰 페이지
- [ ] `src/routes/explore.tsx` - 탐색 페이지
  - 카테고리 필터
  - 정렬 옵션 (인기순, 최신순, 평점순)
  - 무한 스크롤 or 페이지네이션

### 5.3 스와이프 뷰 페이지
- [ ] `src/routes/swipe.tsx` - 틱톡/쇼츠 스타일 페이지
  - 세로 스와이프 네비게이션
  - 전체화면 게임 플레이
  - 좋아요/댓글 오버레이

### 5.4 게임 상세/플레이 페이지
- [ ] `src/routes/games/$gameId.tsx` - 게임 상세 페이지
  - 게임 플레이어 (iframe)
  - 게임 정보
  - 평점
  - 댓글 섹션
  - 관련 게임 추천

### 5.5 카테고리 페이지
- [ ] `src/routes/category/$categoryId.tsx` - 카테고리별 게임 목록

### 5.6 검색 결과 페이지
- [ ] `src/routes/search.tsx` - 검색 결과 페이지

---

## Phase 6: 네비게이션 및 헤더 (0.5일)

### 6.1 헤더 수정
- [ ] `src/components/Header.tsx` 수정
  - 로고/브랜드명
  - 검색창
  - 뷰 모드 토글 (그리드/스와이프)
  - 언어 선택
  - 모바일 메뉴

### 6.2 하단 네비게이션 (모바일)
- [ ] `src/components/BottomNav.tsx`
  - 홈
  - 탐색
  - 스와이프
  - 내 기록

---

## Phase 7: i18n 번역 (0.5일)

### 7.1 번역 파일 업데이트
- [ ] `src/locales/en.json` - 영어 번역
- [ ] `src/locales/ko.json` - 한국어 번역
- [ ] `src/locales/ja.json` - 일본어 번역

주요 번역 키:
- games (게임 관련)
- comments (댓글 관련)
- ratings (평점 관련)
- categories (카테고리명)
- common (공통 UI)
- navigation (네비게이션)

---

## Phase 8: 스타일링 및 반응형 (1일)

### 8.1 전역 스타일
- [ ] `src/styles.css` 업데이트
  - 게임 플랫폼 테마 색상
  - 다크모드 지원
  - 애니메이션

### 8.2 반응형 디자인
- [ ] 모바일 (< 640px)
- [ ] 태블릿 (640px - 1024px)
- [ ] 데스크톱 (> 1024px)

---

## Phase 9: 테스트 및 최적화 (1일)

### 9.1 컴포넌트 테스트
- [ ] GameCard 테스트
- [ ] GamePlayer 테스트
- [ ] CommentForm 테스트

### 9.2 성능 최적화
- [ ] 이미지 최적화 (썸네일)
- [ ] 코드 스플리팅
- [ ] React.lazy 적용

### 9.3 접근성
- [ ] 키보드 네비게이션
- [ ] 스크린 리더 지원
- [ ] ARIA 레이블

---

## Phase 10: 마무리 (0.5일)

### 10.1 문서화
- [ ] README.md 업데이트
- [ ] 컴포넌트 사용법 문서

### 10.2 최종 검토
- [ ] 크로스 브라우저 테스트
- [ ] 모바일 테스트
- [ ] 버그 수정

---

## 기술적 고려사항

### iframe 관련
```typescript
// X-Frame-Options 대응
// 일부 사이트는 iframe 임베딩을 차단할 수 있음
// 대안: 새 탭에서 열기 옵션 제공

interface Game {
  url: string;
  embedAllowed: boolean; // iframe 가능 여부
}
```

### 스와이프 구현
```typescript
// 터치 이벤트 처리
// - touchstart, touchmove, touchend
// - 또는 라이브러리 사용 (swiper.js)
```

### 댓글 시스템
```typescript
// 익명/닉네임 기반 (로그인 없이)
// 또는 간단한 로컬 사용자 식별
```

---

## 예상 일정

| Phase | 작업 내용 | 예상 소요 |
|-------|----------|----------|
| Phase 1 | 데이터 구조 설계 | 1일 |
| Phase 2 | API 레이어 구축 | 1일 |
| Phase 3 | 상태 관리 | 0.5일 |
| Phase 4 | UI 컴포넌트 개발 | 2일 |
| Phase 5 | 페이지 구현 | 2일 |
| Phase 6 | 네비게이션 및 헤더 | 0.5일 |
| Phase 7 | i18n 번역 | 0.5일 |
| Phase 8 | 스타일링 및 반응형 | 1일 |
| Phase 9 | 테스트 및 최적화 | 1일 |
| Phase 10 | 마무리 | 0.5일 |
| **총계** | | **10일** |

---

## 현재 진행 상황

### ✅ 완료
- [x] 작업 계획서 작성

### 🔄 진행 중
- [ ] Phase 1: 데이터 구조 설계

### ⏳ 대기
- [ ] Phase 2 ~ Phase 10

---

## 참고 자료

- [TanStack Router Docs](https://tanstack.com/router)
- [TanStack Query Docs](https://tanstack.com/query)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2025-11-20 | 초기 작업 계획서 작성 |
