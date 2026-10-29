# m3 — Nairobi Electric Transit & SACCO Mobility App

**m3** is an interactive public transport discovery, journey planning, and simulated fleet-tracking web application built for **Nairobi, Kenya**. It bridges Nairobi's cooperative public transit network (**SACCOs**) and emerging **electric bus (e-Bus) fleets** into a unified, accessible commuter interface.

---

## Overview

Navigating Nairobi's public transport network—spanning Central Business District (CBD) terminals like Kencom, Ambassadeur, Odeon, and Railways, out to corridors such as Waiyaki Way, Thika Superhighway, Ngong Road, and Mombasa Road—can be challenging for daily commuters and newcomers alike.

**m3** provides a prototype mobility experience that combines:
- **Road-Following Fleet Simulation**: Buses animate smoothly along multi-segment road geometry polylines using geodesic Haversine distance calculations and segment-level interpolation—never cutting across the map in straight lines.
- **Multi-Operator SACCO Filtering & Prioritization**: Browse, filter, and prioritize major Nairobi operators including **BasiGo Electric**, **Super Metro**, **Metro Trans**, **City Hoppa**, **Lopha Travels**, **Kenya Bus Service (KBS)**, and **2NK Sacco**.
- **Step-by-Step Commuter Directions**: Sequential boarding, intermediate stage, transfer hub, and alighting ("Shukisha") instructions derived directly from verified route stop sequences.
- **Persistent Personalization**: Client-side storage with runtime schema validation and automatic corruption recovery for **Saved Places**, **Recent Destination Searches**, **Preferred SACCOs**, and **Trip History**.
- **Newcomer Commuter Guide**: An in-app handbook covering Nairobi stages, route placards, M-Pesa/cash fare practices, local transit terminology, and commuter etiquette.

> **Prototype Disclaimer:** All vehicle telemetry, ETAs, seat occupancy counts, fares (KES), and digital M-Pesa boarding passes in `m3` are simulated for demonstration purposes.

---

## Key Features

### 1. Interactive Nairobi Transit Map & Road-Aligned Bus Simulation
- **Leaflet + MapTiler Integration**: Renders custom-styled vector/raster tiles centered on Nairobi with automatic OpenStreetMap fallback if no MapTiler key is configured.
- **Geodesic Segment Interpolation (`vehicleSimulation.ts`)**:
  - Pre-computes segment and cumulative distances in meters using the Haversine formula across ordered route waypoints (`>= 3` road coordinates).
  - Projects initial vehicle coordinates onto their assigned route polyline and advances each vehicle strictly within its active road segment with directional bearing calculations.
  - Preserves simulation progress and travel direction across React re-renders, tab switches, and SACCO filter toggles.
  - Rejects 2-point straight-line fallbacks and surfaces an explicit unavailable state if road geometry is missing.
- **Distinct Map Markers**: Visual differentiation between origin pins, destination pins, intermediate transit stages, and selectable live bus markers (with electric badges, route codes, occupancy bars, and battery percentages).

### 2. Journey Planner & Step-by-Step Directions
- **Origin & Destination Resolution**: Search across Nairobi terminals, stages, landmarks, and custom coordinates with one-tap origin/destination swapping.
- **Route Comparison & Sorting (`journeyHelper.ts`)**:
  - Compare candidate routes by **Recommended**, **Fastest**, **Cheapest**, or **Fewest Transfers**.
  - Safeguards against missing or null metrics so unavailable fares or durations are never treated as zero or falsely ranked first.
  - Optional **"e-Bus Only"** filter to restrict results to zero-emission electric fleets.
- **Sequential Directions**:
  - Clearly distinguishes the starting walk, boarding stage, ordered intermediate stops, CBD transfer hubs (when applicable), alighting stage, and final destination walk.

### 3. Saved Places & Recent Destination Searches
- **Saved Places**: Add, edit, rename, and delete frequently visited locations (`Home`, `Work`, `JKIA Terminal`, or custom stages) with geocoded coordinates and icons. Use any saved place as an origin or destination in one tap.
- **Recent Searches**: Automatically records the 10 most recent destination searches with timestamps, case-insensitive deduplication, and one-tap reuse—kept strictly separate from completed trip history.

### 4. Preferred SACCOs & Operator Prioritization
- **Account Preferences**: Select multiple favorite SACCOs in the **Account** tab and toggle **"Prioritize Preferred SACCOs"**.
- **Cross-Screen Sync**: Preferred operators are badged and surfaced first on the **Home** carousel and **Activity** route comparison lists while keeping all other operators accessible.

### 5. Prototype Trip Lifecycle & Digital Boarding Pass
- **Trip History States**: Track journeys across `Planned`, `In progress`, `Completed`, and `Cancelled` statuses (capped at 50 validated records with rapid-click deduplication).
- **Repeat Journey**: Re-launch any historical trip in the Activity planner with its exact origin, destination, and route restored.
- **Simulated Ticket Modal**: Generates a prototype QR boarding pass with simulated M-Pesa transaction references and CO₂ savings estimates.

### 6. Built-In Nairobi Commuter Guide
- Accessible from both the **Home** and **Account** screens, providing structured guidance on:
  1. Understanding SACCOs and public transport operators
  2. Finding the correct CBD boarding stage (Kencom, Ambassadeur, Odeon, Railways)
  3. Reading route numbers and express placards
  4. Essential Kenyan transit terminology (*Stage*, *Makanga*, *Shukisha*, *Tao*, *Squad*)
  5. M-Pesa (*Lipa na M-Pesa* / *Pochi la Biashara*) and cash fare tips
  6. Commuter etiquette and safety
  7. Handling missed stops and CBD transfers
  8. Using `m3`'s search and planner tools

---

## Application Architecture & Screens

The interface is organized around three primary navigation tabs:

| Tab | Component | Responsibilities |
| :--- | :--- | :--- |
| **Home** | `src/components/home/HomeScreen.tsx` | Quick `"Where to?"` destination search, Saved Places strip, Recent Destination Searches, SACCO operator carousel (with preferred prioritization), featured electric corridors, and Commuter Guide launcher. |
| **Activity** | `src/components/activity/ActivityScreen.tsx` | Interactive `NairobiMap` canvas, Origin/Destination planner, SACCO & e-Bus filters, three sub-views (**Nearby Fleet**, **Route Planner & Step-by-Step Directions**, **Trip History**), and live vehicle inspection cards. |
| **Account** | `src/components/account/AccountScreen.tsx` | Commuter profile & sustainability stats (CO₂ saved, trips taken), **Preferred SACCOs** selector and prioritization toggle, Saved Places manager, accessibility/language settings, and Commuter Guide access. |

---

## Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`) with custom design tokens (`#00e575` electric mint, `#0b1b3d` deep transit navy, `#f6f8fa` off-white surface) and `prefers-reduced-motion` support
- **Mapping**: [Leaflet 1.9](https://leafletjs.com/) with MapTiler vector/raster tile support and OpenStreetMap fallback
- **Icons & UI Motion**: [Lucide React](https://lucide.dev/) & [Motion](https://motion.dev/)
- **Persistence**: Typed `localStorage` layer (`src/utils/storage.ts`) with in-memory fallback, schema validators, and custom cross-component synchronization events (`m3_storage_update`)
- **Testing**: Automated TypeScript regression suites executed via `tsx`

---

## Project Structure

```text
├── index.html                        # Entry HTML with Leaflet CSS & Google Fonts (Plus Jakarta Sans, Space Grotesk, JetBrains Mono)
├── metadata.json                     # Application metadata
├── package.json                      # Scripts and dependencies
├── tsconfig.json                     # TypeScript compiler configuration
├── vite.config.ts                    # Vite bundler configuration
├── src/
│   ├── App.tsx                       # Root application state & 3-tab navigation controller
│   ├── main.tsx                      # React DOM entry point
│   ├── index.css                     # Tailwind CSS imports, custom Leaflet styles, and accessibility rules
│   ├── types/
│   │   └── transit.ts                # Core TypeScript interfaces (Sacco, TransitStop, Vehicle, RouteOption, PastTrip, etc.)
│   ├── data/
│   │   ├── mockData.ts               # Nairobi SACCOs, transit stops, road-following route waypoints, and fleet dataset
│   │   └── commuterGuideData.ts      # Structured content for the 8-section Nairobi Commuter Guide
│   ├── utils/
│   │   ├── vehicleSimulation.ts      # Haversine distance, waypoint validation, route projection, and segment interpolation
│   │   ├── routingService.ts         # Route lookup service with in-memory caching and request throttling
│   │   ├── journeyHelper.ts          # Step-by-step direction builder and safe route sorting comparators
│   │   └── storage.ts                # Validated localStorage helpers for Saved Places, Recent Searches, Preferences, and Trips
│   └── components/
│       ├── common/
│       │   └── Header.tsx            # Top navigation bar with m3 branding and active SACCO status badge
│       ├── layout/
│       │   └── BottomNav.tsx         # Persistent 3-tab bottom navigation bar (Home, Activity, Account)
│       ├── home/
│       │   └── HomeScreen.tsx        # Home discovery view
│       ├── activity/
│       │   └── ActivityScreen.tsx    # Map, live fleet tracker, route planner, and trip history view
│       ├── account/
│       │   └── AccountScreen.tsx     # User preferences, preferred SACCOs, and saved places management
│       ├── map/
│       │   └── NairobiMap.tsx        # Interactive Leaflet map with smooth vehicle markers, polylines, and stop popups
│       └── modals/
│           ├── CommuterGuideModal.tsx # Multi-section Nairobi Commuter Guide modal
│           ├── SavedPlaceModal.tsx    # Add/Edit Saved Place modal with stage lookup
│           └── TicketModal.tsx        # Simulated digital boarding pass & M-Pesa receipt modal
└── tests/
    ├── mapRegression.test.ts         # Regression suite for location accuracy, route geometry, and vehicle simulation
    └── storageRegression.test.ts     # Regression suite for persistence, deduplication, sorting, and corruption recovery
```

---

## Getting Started

### Prerequisites
- **Node.js** (v18+ recommended) or **Bun**

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional)
Copy `.env.example` to `.env` if you wish to use custom MapTiler map tiles:
```bash
cp .env.example .env
```
| Variable | Description |
| :--- | :--- |
| `VITE_MAPTILER_API_KEY` | *(Optional)* Public MapTiler API key for custom vector/raster map tiles. Falls back to OpenStreetMap tiles automatically if omitted. |

### 3. Start the Development Server
```bash
npm run dev
```
The app will start on `http://localhost:3000`.

### 4. Run Type-Checking & Regression Tests
Verify TypeScript types and run the automated map, routing, and storage regression suites:
```bash
npm run lint
npm test
```

### 5. Build for Production
```bash
npm run build
```

---

## Automated Regression Test Suites

The repository includes two comprehensive test suites in `tests/` runnable via `npm test`:

1. **`tests/mapRegression.test.ts`**:
   - **Location Accuracy**: Verifies origin/destination selection, endpoint swapping, and coordinate preservation across Nairobi stages (Kencom, Sarit Centre, Yaya Centre, JKIA, Roysambu, Karen).
   - **Route Geometry**: Ensures all routes contain valid multi-segment road waypoints (`>= 3` coordinates) and rejects 2-point straight lines.
   - **Bus Simulation**: Validates Haversine cumulative distances, interior segment interpolation, turnaround behavior at route terminals, and state persistence across SACCO filter changes.
   - **Routing Cache**: Confirms cache hits, misses, and request deduplication in `routingService`.

2. **`tests/storageRegression.test.ts`**:
   - **Saved Places & Recent Searches**: Tests CRUD operations, 10-item cap, case-insensitive deduplication, and recovery from corrupted JSON payloads.
   - **Transport Preferences**: Verifies SACCO ID validation and preference toggling.
   - **Journey Directions & Route Sorting**: Confirms sequential step generation and ensures routes with `null` fares or durations never sort ahead of valid positive metrics.
   - **Trip Lifecycle**: Validates recording, status transitions (`Planned` → `In progress` → `Completed` / `Cancelled`), 50-record cap, and strict separation from recent destination searches.

---

## License

Licensed under the **Apache-2.0** License.
