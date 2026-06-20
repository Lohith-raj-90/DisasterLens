# DisasterLens

AI-powered disaster intelligence platform that connects victims with rescue teams through real-time SOS signaling, explainable AI triage prioritization, live tactical maps, and offline-resilient mesh communication.

Built by 10 students from the Department of Computer Science & Engineering at **Kalpataru Institute of Technology, Tiptur**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

## Features

### AI-Powered Triage (MCDM Algorithm)
Multi-Criteria Decision Making engine that scores each SOS signal from 0–100 based on five weighted factors:
- **Battery Level** (25%) — low battery signals are prioritized
- **Disaster Type** (30%) — trapped/earthquake weighted highest
- **Injury Severity** (20%) — severe injuries score higher
- **Group Size** (15%) — larger groups get priority
- **Environment** (10%) — night, rain, extreme heat add urgency

Each signal receives a human-readable explanation alongside its priority rank (Critical / High / Medium / Low).

### Role-Based Dashboards

| Role | Dashboard | Capabilities |
|------|-----------|-------------|
| **Victim** | SOS form, own location map, two-way chat, offline toggle | Send SOS, communicate with rescuers |
| **Rescuer** | Tactical map, AI triage panel, SOS grid, comms panel | Dispatch units, resolve signals, send instructions |

### Live Tactical Maps
Dark-themed Leaflet maps with priority-colored markers (red = critical, orange = high, yellow = medium), auto-panning to selected signals.

### Offline Mesh Simulation
Toggle switch simulates network loss — messages and SOS signals queue locally and sync automatically when back online.

### Two-Way Communication
Real-time chat between victims and rescuers with automatic notifications on dispatch and resolution events.

### Secure Authentication
JWT-based sessions with HTTP-only cookies and middleware route protection.

## Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
git clone https://github.com/Lohith-raj-90/DisasterLens.git
cd DisasterLens
npm install
```

### Initialize Database

Click **"Initialize Database"** on the landing page, or visit:

```
GET http://localhost:3000/api/seed
```

This creates 10 demo users (2 rescuers, 8 victims) with locations around Bangalore.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo Credentials

| Name | Password | Role |
|------|----------|------|
| Arjun Mehta | `disaster123` | Rescuer |
| Sneha Reddy | `disaster123` | Rescuer |
| Vikram Rao | `disaster123` | Victim |
| Priya Sharma | `disaster123` | Victim |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Frontend | React 19, Tailwind CSS 4 |
| Language | TypeScript 5 |
| Database | JSON flat-file (`data_store.json`) |
| Auth | JWT (jsonwebtoken), bcryptjs, HTTP-only cookies |
| Maps | Leaflet 1.9.4, react-leaflet 5 |
| Icons | Lucide React, Font Awesome |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/page.tsx        # Login form
│   ├── victim/page.tsx       # Victim dashboard
│   ├── rescuer/page.tsx      # Rescuer command terminal
│   ├── globals.css           # Global styles & animations
│   └── api/
│       ├── auth/login/       # JWT authentication
│       ├── auth/logout/      # Session clear
│       ├── seed/             # Database seeding
│       ├── sos/create/       # SOS creation + MCDM triage
│       ├── sos/stream/       # Active signals feed
│       ├── sos/dispatch/     # Signal status updates
│       ├── messages/send/    # Message creation
│       └── messages/stream/  # Message retrieval
├── components/
│   └── Map.tsx               # Leaflet map component
├── lib/
│   ├── auth.ts               # JWT utilities
│   ├── db_json.ts            # JSON file database
│   └── db.ts                 # Prisma client (备用)
└── middleware.ts              # Route protection
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | None | Authenticate and set session cookie |
| POST | `/api/auth/logout` | None | Clear session |
| GET | `/api/seed` | None | Reset and seed demo data |
| POST | `/api/sos/create` | JWT | Create SOS signal, run triage |
| GET | `/api/sos/stream` | Rescuer | Get all active signals |
| POST | `/api/sos/dispatch` | Rescuer | Dispatch or resolve a signal |
| POST | `/api/messages/send` | JWT | Send a message |
| GET | `/api/messages/stream` | JWT | Get message history |

## Signal Workflow

```
PENDING → DISPATCHED → RESOLVED
```

Each transition automatically sends a notification message to the victim.

## License

Academic project — Kalpataru Institute of Technology, Tiptur.
