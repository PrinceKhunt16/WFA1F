# Wind Analytics Frontend

This folder is the complete Next.js dashboard project. It is intentionally separate from the FastAPI project in `../backend/` so each project can be opened and started independently. The UI uses the local Averta font in `fonts/Averta-Regular.woff2`.

## Flow

1. The App Router renders the dashboard shell, navigation, charts, KPI cards, tables, and source pages.
2. `lib/api.ts` calls the FastAPI backend using `NEXT_PUBLIC_API_URL`.
3. TypeScript interfaces in `types/api.ts` match the backend Pydantic response schemas.
4. Loading, unavailable, empty, and missing-data states remain visible; the frontend never invents analytics.
5. Recharts visualizes real comparison records, and Accuracy Reports exports the displayed records as CSV.

## Start locally

Run these commands from this `frontend/` directory:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The FastAPI backend should be running separately at `http://localhost:8000`.

To stop the development server, press `Ctrl+C`.

## Validate

```bash
npm run build
npm run start
```

The production server runs at `http://localhost:3000`; stop it with `Ctrl+C`.

## Configuration

`.env.example` contains:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Change this value when the backend runs on another host or port.

## Structure

```text
frontend/
|-- app/
|   |-- page.tsx                    # Overview dashboard
|   |-- forecast-analysis/          # Delivery-date analysis
|   |-- accuracy-reports/           # Range metrics and CSV export
|   |-- actual-generation/          # Actual-generation workspace
|   |-- data-sources/               # Elexon source documentation
|   |-- settings/                   # Active evaluation policy
|   `-- layout.tsx                  # Lato font and application shell
|-- components/                     # Navigation, charts, cards, tables, states
|-- lib/api.ts                      # Reusable backend API client
|-- lib/format.ts                   # UK/UTC display formatting
|-- fonts/Averta-Regular.woff2     # Local application font
|-- types/api.ts                    # Backend response interfaces
|-- package.json
|-- next.config.ts
|-- tailwind.config.ts
|-- .env.example
`-- README.md
```
