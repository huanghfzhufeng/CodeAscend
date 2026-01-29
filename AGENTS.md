# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

CodeAscend is a fun application that calculates a "Cultivation Realm" (修仙境界) based on GitHub profile data. Users can look up any GitHub username to see their "cultivation score" and rank, with results displayed on a leaderboard.

## Commands

### Backend (in `backend/` directory)
```bash
npm run dev          # Start dev server with hot reload (uses node --watch)
npm run start        # Production start
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database (for dev)
npm run db:migrate   # Create and apply migrations
npm run db:studio    # Open Prisma Studio GUI
```

### Frontend (in `frontend/` directory)
```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
```

### Docker
```bash
docker-compose up -d      # Start all services (postgres, backend, frontend)
docker-compose logs -f    # View logs
```

## Architecture

### Backend (`backend/`)
- **Runtime**: Node.js with ES modules (`"type": "module"`)
- **Framework**: Express.js
- **Database**: PostgreSQL via Prisma ORM

Key files:
- `src/index.js` - Express server entry point, route mounting, middleware
- `src/routes/users.js` - `GET /api/users/:username` fetches/caches GitHub data and calculates cultivation
- `src/routes/leaderboard.js` - Leaderboard, search history, and stats endpoints
- `src/services/github.js` - GitHub API client with optional token auth
- `src/services/cultivation.js` - **Core algorithm**: `calculateCultivation()` computes score and rank from user data
- `prisma/schema.prisma` - Database schema with 3 tables: `GithubUser`, `CultivationRecord`, `SearchHistory`

Data flow: GitHub API → cache in PostgreSQL (1-hour TTL) → calculate cultivation → return to client

### Frontend (`frontend/`)
- **Framework**: React 18 with Vite
- **Styling**: TailwindCSS (Chinese calligraphy aesthetic)
- **Charts**: Recharts (radar chart for stats visualization)

Key files:
- `src/App.jsx` - Single-page app with all UI (search, result card, leaderboard)
- `src/services/api.js` - API client functions (`fetchUser`, `fetchLeaderboard`, etc.)
- `vite.config.js` - Vite config with proxy to backend at port 3001

### Cultivation Algorithm (`backend/src/services/cultivation.js`)
The scoring algorithm computes 6 dimensions (修为, 名望, 因果, 心魔, 助阵, 信众) from GitHub stats, then determines rank from total score. There are 9 ranks from 凡人 (0) to 渡劫 (10000+).

## Environment Variables

Backend `.env`:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/github_xiuxian"
PORT=3001
GITHUB_TOKEN=""  # Optional, increases GitHub API rate limit
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/users/:username | Fetch user cultivation data |
| GET | /api/leaderboard | Get leaderboard |
| GET | /api/leaderboard/history | Get recent searches |
| GET | /api/leaderboard/stats | Get aggregate stats |
| GET | /api/health | Health check |
