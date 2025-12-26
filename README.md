# Music247 🎵

A **Spotify clone** built with Next.js, FastAPI, and PostgreSQL.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

## Features

- 🎨 **Spotify-themed dark UI** with Tailwind CSS
- 🔐 **JWT Authentication** (register, login, protected routes)
- 🎵 **Audio Player** with play/pause, skip, volume controls
- 📚 **Browse** songs, albums, and artists
- 🔍 **Search** with live results
- ❤️ **Liked Songs** and playlists
- 📱 **Responsive** design

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Zustand |
| Backend | FastAPI, SQLAlchemy (async), Pydantic v2 |
| Database | PostgreSQL 16 (Docker) |
| Auth | JWT (python-jose), bcrypt |

## Quick Start

### Prerequisites
- Docker Desktop
- Python 3.10+
- Node.js 18+

### 1. Start PostgreSQL
```bash
cd backend
docker-compose up -d
```

### 2. Run Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will be at http://localhost:8000 (Swagger docs at `/docs`)

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Project Structure

```
music247/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app
│   │   ├── database.py      # SQLAlchemy async
│   │   ├── seed.py          # Sample data
│   │   ├── models/          # Database models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── routers/         # API endpoints
│   │   └── auth/            # JWT utilities
│   ├── docker-compose.yml
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── app/             # Next.js pages
    │   ├── components/      # React components
    │   ├── store/           # Zustand stores
    │   └── utils/           # API client, types
    ├── package.json
    └── tailwind.config.js
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Create account |
| `/api/auth/login` | POST | Login (returns JWT) |
| `/api/songs` | GET | List songs |
| `/api/songs/featured` | GET | Popular tracks |
| `/api/albums/{id}` | GET | Album with tracks |
| `/api/artists/{id}` | GET | Artist discography |
| `/api/playlists` | GET/POST | User playlists |
| `/api/library/liked` | GET/POST | Liked songs |

## Sample Data

The database is seeded with demo content:

| Artist | Album |
|--------|-------|
| The Midnight | Endless Summer |
| ODESZA | A Moment Apart |
| Tycho | Dive |
| Bonobo | Migration |
| Flume | Hi This Is Flume |

## License

MIT
