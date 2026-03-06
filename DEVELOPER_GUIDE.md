# SlideFlow – Developer Guide

> A simple guide to understanding how the SlideFlow codebase is organized so you can jump in quickly.

---

## Tech Stack at a Glance

| Technology | What It Does |
|---|---|
| **Next.js (App Router)** | React framework that handles pages, routing, and API routes |
| **TypeScript / TSX** | JavaScript with types — all `.tsx` files are React components, `.ts` files are plain logic |
| **Supabase** | Cloud database (PostgreSQL) + authentication + file storage |
| **Prisma** | ORM that defines the database structure in code (`schema.prisma`) |
| **Tailwind CSS** | Utility-first CSS framework used for styling |
| **shadcn/ui** | Pre-built UI components (buttons, cards, dialogs, etc.) inside `components/ui/` |
| **TanStack React Query** | Data-fetching/caching library, wrapped in `components/providers.tsx` |
| **Lucide React** | Icon library used throughout the app |

---

## Project Root – Important Files

| File | Purpose |
|---|---|
| `package.json` | Lists all dependencies and scripts (`npm run dev` to start) |
| `next.config.ts` | Next.js configuration |
| `tsconfig.json` | TypeScript compiler settings |
| `postcss.config.mjs` | PostCSS config (needed for Tailwind) |
| `.env` | **Environment variables** — contains Supabase URL, API keys, and database URL |
| `prisma/schema.prisma` | Database structure definition (see [Database section](#-database-prisma--supabase) below) |

---

## The `app/` Folder – Page by Page

Next.js uses **file-based routing**. Every folder inside `app/` becomes a URL route, and the `page.tsx` file inside it is what renders on that route.

### Root Files

| File | Route | What It Does |
|---|---|---|
| `app/layout.tsx` | — | **Root layout** that wraps every page. Loads the Inter font, imports `globals.css`, and wraps children in `<Providers>` (React Query). |
| `app/page.tsx` | `/` | Immediately **redirects** to `/auth/login`. Nobody sees this page. |
| `app/globals.css` | — | Global styles — imports Tailwind, defines CSS variables for light/dark themes and the color system. |
| `app/favicon.ico` | — | The browser tab icon. |

---

### 🔐 `app/auth/login/` — Login Page

**Route:** `/auth/login`

**File:** `page.tsx` (~467 lines)

**What it does:** The login screen with an animated particle canvas background. Users type a username and password to sign in.

**How it works:**
- Checks credentials against a hardcoded list (Admin/Password1, Admin2/Password2, etc.)
- On success, calls `supabase.auth.signInWithPassword()` to create an authenticated session
- Stores the username in `localStorage` for "Remember Me"
- Redirects to `/dashboard` on success

**Connections:**
- Uses `lib/supabase.ts` for authentication
- Redirects to `app/dashboard/` on success

---

### 📊 `app/dashboard/` — Dashboard (Main Hub)

**Route:** `/dashboard` and all sub-pages

#### `layout.tsx` — Dashboard Layout Shell

Wraps **all** dashboard pages with:
- **Auth guard** — checks if user is logged in via `supabase.auth.getSession()`, redirects to login if not
- **Sidebar** with the `<DashboardNav />` navigation component
- **Header** bar with dark mode toggle and user menu
- **Footer**

**Connections:** Uses `components/dashboard-nav.tsx`, `components/user-nav.tsx`, `components/dark-mode-toggle.tsx`, and `lib/supabase.ts`.

---

#### `app/dashboard/page.tsx` — Overview Page

**Route:** `/dashboard`

The main dashboard home. Shows at-a-glance stats:
- Total shows count
- Currently active show (scheduled or manually presented)
- Upcoming shows ("Up Next" section)
- Quick links to create/edit/present shows

**Connections:** Fetches data from `/api/shows/active` and `/api/shows`.

---

#### `app/dashboard/screens/page.tsx` — Screens

**Route:** `/dashboard/screens`

Manages all your **shows** (slide decks). You can:
- View all created shows as cards with live slide previews
- **Add** a new show (creates one via the API, then opens the editor)
- **Edit** a show (navigates to `/editor/[slideId]`)
- **Duplicate** or **Delete** shows
- **Present** a show (opens a slide picker dialog, then starts presenting via `/api/shows/present`)

**Connections:** Fetches from `/api/shows`, navigates to `app/editor/[slideId]/`.

---

#### `app/dashboard/templates/page.tsx` — Templates

**Route:** `/dashboard/templates`

Browse and use pre-designed **slide templates**. Features:
- Search by name
- Filter by genre (Announcements, Corporate, Safety, Education, Events, Social Media)
- Click "Use Template" to create a new show from that template

**Connections:** Imports `SLIDE_TEMPLATES` and `TEMPLATE_GENRES` from `lib/template-data.ts`. Creates shows via `/api/shows`.

---

#### `app/dashboard/content/page.tsx` — Content Manager

**Route:** `/dashboard/content`

A **file manager** for uploaded media (images, videos, documents). Features:
- Folder navigation with breadcrumbs
- Upload files (drag & drop supported)
- Create/rename/delete folders
- Move assets between folders
- Grid and list view modes

**Connections:** Uses the `useContent()` hook from `hooks/use-content.ts`, which calls `/api/content/assets`, `/api/content/folders`, and `/api/content/upload`.

---

#### `app/dashboard/schedules/page.tsx` — Schedules

**Route:** `/dashboard/schedules`

Create and manage **scheduled shows** with specific start and end times. Features:
- View all scheduled shows with status badges (Active, Upcoming, Ended)
- Create new schedules by picking a show and setting date/time range
- Edit or delete existing schedules

**Connections:** Fetches from `/api/shows` (filtered for scheduled shows) and `/api/content/assets`.

---

#### `app/dashboard/display/page.tsx` — Display Status

**Route:** `/dashboard/display`

A monitoring page that shows **what's currently on screen**:
- Currently active show (with live cycling slide preview)
- Manually presented show
- All upcoming scheduled shows
- Auto-refreshes every 15 seconds

**Connections:** Fetches from `/api/shows/active`.

---

#### `app/dashboard/credentials/page.tsx` — User Profile

**Route:** `/dashboard/credentials`

Manage the logged-in user's **profile**:
- Edit first name, last name, username
- Upload an avatar image
- Change password

**Connections:** Uses `lib/supabase.ts` to query/update the `credentials` table and Supabase auth.

---

#### `app/dashboard/settings/page.tsx` — Settings

**Route:** `/dashboard/settings`

A simple **notification preferences** page with toggle switches for:
- Slide updates
- Presentation alerts
- Weekly reports

> Note: This is mostly a static UI — toggles aren't wired to a backend yet.

---

### 🖥️ `app/display/` — Presentation Display

**Route:** `/display`

**File:** `page.tsx` (~376 lines)

**What it does:** The **full-screen presentation viewer**. This is the page you'd open on a TV or display screen. It:
- Polls `/api/shows/active` every 10 seconds to check for active shows
- Renders slides with all their elements (text, images, shapes, videos)
- Auto-advances slides based on their `duration` setting
- Supports keyboard controls (arrow keys, Escape, Space)
- Shows a minimal control bar on hover

**How slides render:** Each slide has a `backgroundColor` and an array of `elements`. Each element has position (`x`, `y`), size (`width`, `height`), a `type` (text/image/shape/video), and styling properties. The page renders these as absolutely positioned `<div>` elements inside a scaled container.

**Connections:** Fetches from `/api/shows/active` and `/api/shows/present`.

---

### ✏️ `app/editor/[slideId]/` — Slide Editor

**Route:** `/editor/123` (where `123` is the show ID)

**File:** `page.tsx` (~1889 lines — the biggest file in the app!)

**What it does:** A **full drag-and-drop slide editor** (like a simplified PowerPoint). Features:
- Add/edit/delete slides in a show
- Add elements: text boxes, images (upload or search Pexels), shapes (rectangle, circle, triangle, etc.), videos
- Drag to move elements, resize handles to resize
- Style elements: font, size, color, bold, italic, alignment, background color, border radius
- Set slide background color or image
- Set slide duration (how long it displays)
- Undo/redo history
- Schedule the show (set start/end time) and save
- Import templates from `lib/template-data.ts`
- Present directly from the editor

**How it saves:** The `saveSlide()` function sends a POST to `/api/shows` with the show name, slides data (as JSON), and optional schedule times. All slide data is stored as a JSON array in the `slides_data` column of the `show` table.

**Connections:** Uses `lib/supabase.ts` for storage uploads, `/api/shows` for CRUD, `/api/shows/present` for presenting, and `lib/template-data.ts` for templates.

---

## The `api/` Folder – Backend API Routes

Next.js API routes live in `app/api/`. Each `route.ts` file exports HTTP method handlers (`GET`, `POST`, `DELETE`, etc.). All API routes use the Supabase client from `lib/supabase.ts` to talk to the database.

### Shows API

| Route | Methods | What It Does |
|---|---|---|
| `/api/shows/` | GET, POST, DELETE | **CRUD for shows.** GET fetches all shows (or by ID/contentId). POST creates or updates a show. DELETE removes one. |
| `/api/shows/active` | GET | Returns the **currently active** show (based on schedule time), upcoming shows, and any manually presented show. |
| `/api/shows/present` | GET, POST, DELETE | Manages **manual presentation**. POST starts presenting a show (writes to `active_present` table). DELETE stops it. |

### Content API

| Route | Methods | What It Does |
|---|---|---|
| `/api/content/assets` | GET, PATCH, DELETE | **Manage uploaded files.** GET lists assets (optionally filtered by folder). PATCH moves an asset to a folder. DELETE removes an asset + its storage file. |
| `/api/content/folders` | GET, POST, PATCH, DELETE | **Manage folders.** Full CRUD for the folder system. Won't let you delete a folder that still has content. |
| `/api/content/upload` | POST | **Upload a file.** Uploads to Supabase Storage, creates a `content` row in the database, and links to a category. |

### Auth API

| Route | Methods | What It Does |
|---|---|---|
| `/api/auth/login` | POST | Server-side login. Maps username → email, then calls `supabase.auth.signInWithPassword()`. |
| `/api/auth/[...nextauth]` | — | NextAuth catch-all route (for OAuth flows if needed). |
| `/api/auth/create-credential` | — | Endpoint for creating new user credentials. |

---

## `components/` — Reusable UI Components

| File | What It Does |
|---|---|
| `providers.tsx` | Wraps the app in `<QueryClientProvider>` for React Query (data caching). Used in `app/layout.tsx`. |
| `dashboard-nav.tsx` | The **sidebar navigation** menu. Lists all dashboard pages (Overview, Screens, Templates, Content, Schedules, Display, Settings) with icons. Highlights the active page. |
| `user-nav.tsx` | The **user dropdown** in the header. Shows the logged-in user's name and logout option. |
| `dark-mode-toggle.tsx` | The **dark/light mode** toggle button in the header. |
| `ui/` | **15 shadcn/ui components** — pre-built, styled building blocks used everywhere: `button`, `card`, `dialog`, `dropdown-menu`, `input`, `label`, `badge`, `select`, `tabs`, `tooltip`, `switch`, `separator`, `slider`, `scroll-area`, `avatar`. |

---

## `lib/` — Shared Utilities & Config

| File | What It Does |
|---|---|
| `supabase.ts` | Creates and exports the **Supabase client** using env variables. Used by almost every API route and many frontend pages for auth and database queries. |
| `prisma.ts` | Creates and exports the **Prisma client** for direct database access. Uses a global singleton pattern so the connection isn't recreated on every request. |
| `utils.ts` | Exports the `cn()` helper — a utility for merging Tailwind CSS class names (from shadcn/ui). |
| `template-data.ts` | Contains all **20+ slide templates** as code (defined as arrays of slide objects). Used by the Templates page and the Editor's template import. |
| `data/mock-data.ts` | **Mock data** for playlists and assets — used by the Playlists page which hasn't been fully connected to the database yet. |
| `types/index.ts` | Shared **TypeScript type definitions** used across the app. |

---

## `hooks/` — Custom React Hooks

| File | What It Does |
|---|---|
| `use-content.ts` | The `useContent()` hook — manages all **content/file operations**: fetching assets, fetching folders, uploading files, creating/deleting folders, moving assets, and folder navigation. Used by the Content page. Calls `/api/content/*` routes internally. |

---

## 🗄️ Database (Prisma + Supabase)

The database is a **PostgreSQL** database hosted on **Supabase**. The schema is defined in `prisma/schema.prisma`, which serves as the single source of truth for the database structure.

### How Prisma Works

- **`schema.prisma`** defines all tables (called "models"), their columns, and relationships
- **`lib/prisma.ts`** creates the Prisma client for querying the database via code
- The `@@map("table_name")` lines map each Prisma model to its actual table name in the database
- You run `npx prisma generate` to create the TypeScript types from the schema
- You run `npx prisma db push` or migrations to sync the schema with the actual database

> **Note:** In this project, most API routes use the **Supabase client** (`lib/supabase.ts`) directly for queries rather than Prisma. Prisma is primarily used for schema management and type generation.

### Database Tables

```
┌─────────────────────────────────────────────────────────────────┐
│                        CORE TABLES                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  show ──────────── The main table. Each row is a "show"         │
│  │                 (slide deck) with a name, slides_data (JSON  │
│  │                 array of all slides), and optional schedule   │
│  │                 times (start_time, finish_time).              │
│  │                                                              │
│  ├── content ───── Uploaded media files (images, videos, docs). │
│  │                 Has name, file_url, mime_type, file_size,     │
│  │                 and optional folder_id.                       │
│  │                                                              │
│  ├── device ────── Display devices (TVs/screens) with a MAC     │
│  │   │             address and device type.                      │
│  │   └── dev_type  Lookup table for device types.               │
│  │                                                              │
│  ├── location ──── Physical locations where shows are displayed. │
│  │                 Stores WiFi credentials and OTP info.         │
│  │                                                              │
│  └── client ────── Clients/customers the shows are made for.    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                     SUPPORTING TABLES                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  credentials ──── User profiles. Links to Supabase auth.users   │
│  │                via UUID. Stores username, first/last name.    │
│  └── permission   Lookup table for user permission levels.      │
│                                                                 │
│  folders ──────── Folder hierarchy for organizing content.      │
│                   Self-referencing (parent_id → id) for nesting. │
│                                                                 │
│  category ─────── Content categories (images, videos, etc.).    │
│                   Self-referencing for sub-categories.           │
│                                                                 │
│  content_cat ──── Links content to categories (many-to-many).   │
│                                                                 │
│  active_present ─ Single-row table (id=1) that tracks which     │
│                   show is currently being manually presented.    │
│                   (Not in Prisma schema — managed via Supabase)  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Key Relationships

- A **Show** can optionally link to a **Content** item, **Device**, **Location**, and **Client**
- **Content** belongs to a **Folder** (optional — can be at root level)
- **Folders** can nest inside other folders (self-referencing `parent_id`)
- **Content ↔ Category** is a many-to-many relationship via the `content_cat` join table
- **Credentials** links to **Permission** for access control

---

## How Everything Connects – The Big Picture

```
User visits /  ──→  Redirects to /auth/login
                         │
                    Login with username + password
                         │
                    Supabase authenticates
                         │
                    ┌─────────────────────────────────────┐
                    │        /dashboard (layout.tsx)        │
                    │  ┌──────────┐  ┌──────────────────┐  │
                    │  │ Sidebar  │  │   Main Content    │  │
                    │  │ Nav      │  │                   │  │
                    │  │          │  │  /dashboard       │  │
                    │  │ Overview │  │  /screens         │  │
                    │  │ Screens  │  │  /templates       │  │
                    │  │ Templates│  │  /content         │  │
                    │  │ Content  │  │  /schedules       │  │
                    │  │ Schedules│  │  /display         │  │
                    │  │ Display  │  │  /credentials     │  │
                    │  │ Settings │  │  /settings        │  │
                    │  └──────────┘  └────────┬──────────┘  │
                    └─────────────────────────┼─────────────┘
                                              │
                         ┌────────────────────┼───────────────┐
                         │                    │               │
                    /editor/[id]         /api/* routes    /display
                    (Slide Editor)       (Backend)       (TV Screen)
                         │                    │               │
                         └────────────────────┼───────────────┘
                                              │
                                     Supabase Database
                                   (PostgreSQL + Storage)
```

### Data Flow Example: Creating and Presenting a Show

1. User clicks **"Add"** on the Screens page → `POST /api/shows` creates a new show → redirects to `/editor/[newId]`
2. User **edits slides** in the editor (drag & drop) → clicks **Save** → `POST /api/shows` updates `slides_data` JSON
3. User clicks **Present** → `POST /api/shows/present` writes slide data to the `active_present` table
4. The `/display` page **polls** `/api/shows/active` every 10 seconds → detects the manual present → renders the slides full-screen

---

## Quick Reference: File Locations

| If you need to... | Look in... |
|---|---|
| Change the login page | `app/auth/login/page.tsx` |
| Edit the sidebar navigation | `components/dashboard-nav.tsx` |
| Modify global styles/theme | `app/globals.css` |
| Add a new dashboard page | Create `app/dashboard/newpage/page.tsx` |
| Add a new API endpoint | Create `app/api/yourroute/route.ts` |
| Change the database schema | `prisma/schema.prisma` |
| Edit slide templates | `lib/template-data.ts` |
| Modify the slide editor | `app/editor/[slideId]/page.tsx` |
| Change how the display renders slides | `app/display/page.tsx` |
| Update Supabase/database config | `lib/supabase.ts` and `.env` |
