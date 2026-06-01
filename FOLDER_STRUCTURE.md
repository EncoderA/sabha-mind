# Folder Structure

This document describes the observed folder structure with focus on the API route at `src/app/api/visitors/route.ts`.

## High-level layout

```
.
├─ public/
├─ src/
│  ├─ app/
│  │  ├─ (app)/
│  │  ├─ (llms)/
│  │  ├─ api/
│  │  ├─ layout.tsx
│  │  ├─ manifest.ts
│  │  ├─ not-found.tsx
│  │  ├─ robots.ts
│  │  └─ sitemap.ts
│  ├─ components/
│  ├─ config/
│  ├─ db/
│  ├─ features/
│  ├─ lib/
│  ├─ styles/
│  └─ types/
└─ (root config files)
```

## API route placement

The API route for visitors is nested under `src/app/api/visitors/`:

```
src/
└─ app/
   └─ api/
      └─ visitors/
         └─ route.ts
```

## Conventions inferred from this structure

- App routes and API routes live under `src/app/`.
- API endpoints live under `src/app/api/<endpoint>/route.ts`.
- App-level scaffolding files like `layout.tsx`, `robots.ts`, and `sitemap.ts` live directly in `src/app/`.

## Detailed folder guidance

This section describes what each major folder should contain based on the current structure.

### `src/components/`

Shared, reusable UI components that are not tied to a single feature. Prefer stateless or lightly stateful building blocks.

Typical contents:

- Primitive UI (buttons, inputs, tabs, dialogs, tooltips).
- Layout wrappers and nav pieces that are used across multiple routes.
- Design system pieces and cross-feature widgets.

Guidelines:

- Keep feature-specific logic out of this folder.
- Use `src/features/<feature>/components/` for feature-only UI.

### `src/features/`

Feature-first modules. Each feature owns its data, types, UI, and content so it is easy to reason about and move.

Typical contents by feature:

```
src/features/<feature>/
├─ components/        # Feature UI only
├─ hooks/             # Feature hooks and state helpers
├─ data/              # Static data sources or adapters
├─ types/             # Feature-specific types
├─ content/           # MDX or markdown content
└─ utils/             # Feature-only helpers
```

Guidelines:

- If a type or helper is used by multiple features, promote it to `src/types/` or `src/lib/`.
- Keep feature APIs cohesive and small; avoid feature-level barrels that export everything.

### `src/lib/`

Shared utilities and framework-agnostic helpers used across multiple features and routes.

Typical contents:

- Date/math/string helpers.
- HTTP and API wrappers.
- Shared validation, parsing, or formatting helpers.
- Shared server-only modules (e.g., visitors tracking helpers).

Guidelines:

- Avoid UI components here; those belong in `src/components/`.
- Keep functions small and composable.

### `src/types/`

Global type definitions that are shared across features or represent app-wide contracts.

Typical contents:

- Navigation types.
- Global and shared API response shapes.
- Cross-feature model types.

Guidelines:

- If a type is only used inside one feature, keep it in that feature under `src/features/<feature>/types/`.

### `src/config/`

Centralized configuration and constants.

Typical contents:

- Site metadata.
- Feature flags.
- External integration config.

Guidelines:

- Avoid putting environment access logic in random modules. Keep it here or in `src/lib/`.

### `src/db/`

Database schema and data access setup.

Typical contents:

- Schema definitions.
- Database client initialization and helpers.

Guidelines:

- Keep database logic isolated here or in feature-level server helpers in `src/lib/`.

### `src/styles/`

Global styles and base theming.

Typical contents:

- `globals.css`.
- CSS variables and base resets.

Guidelines:

- Feature styles should be co-located with components when possible.

### `public/`

Static assets served as-is.

Typical contents:

- Images and icons.
- Open graph images.
- Public profile content.

Guidelines:

- Keep paths stable because they are public URLs.
