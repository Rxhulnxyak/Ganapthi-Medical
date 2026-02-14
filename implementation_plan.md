
# Architecture Strategy

We will structure the repository as a monorepo to house the various components of the Ganapathi Medical platform.

## Directory Structure
- `web`: The User/Customer facing Next.js application.
- `admin`: The Admin panel (Next.js).
- `backend`: The NestJS API server.
- `mobile`: The Flutter application (will be initialized later/separately).

## Initial Steps (Phase 1: Web UI) - [COMPLETED]
1. [x] Initialize `web` (Next.js) with Tailwind CSS.
2. [x] Configure Design System in `web`:
   - Colors: Primary `#279df1`, Backgrounds `#f6f7f8` / `#101b22`.
   - Font: Lexend.
   - Icons: Material Icons.
3. [x] Implement Pages based on provided HTML:
   - Login / Signup
   - Home
   - Medicine Store
   - Prescription Upload
   - Medicine Details
   - Orders Tracking
   - Cart

## Next Steps
- [x] Initialize `backend` (NestJS). [COMPLETED]
- [x] Initialize `admin` panel (Next.js). [COMPLETED]
- [ ] Initialize `mobile` (Flutter) - **Failed to locate Flutter installation**. Please ensure Flutter is installed and added to PATH, or provide the correct path.

## Admin Panel Setup (Phase 2) - [COMPLETED]
1. [x] Configure Tailwind CSS in `admin` to match `web` theme.
2. [x] Implement Admin Dashboard layout.
3. [x] Create basic Admin pages (Login, Dashboard, Orders, Inventory, Prescriptions).

## Backend API Setup (Phase 3) - [COMPLETED]
1. [x] Initialize NestJS project.
2. [x] Pivot to Supabase (PostgreSQL) architecture.
3. [x] Define Data Tables (User, Medicine, Order, Prescription).
4. [x] Implement Auth Module (Supabase Auth Proxy).
5. [x] Implement API Endpoints (via Supabase Client).
6. [x] Set up Supabase Storage for uploads.

## Frontend Integration (Phase 4) - [NEXT]
1. [ ] Connect Web App to Backend APIs.
2. [ ] Connect Admin Panel to Backend APIs.
3. [ ] Implement Authentication Logic on Client.


We will focus on the `web` directory first to demonstrate the UI.
