# FlowMind AI System Architecture

This document details the frontend architecture for FlowMind AI.

## Directory Structure

We use a feature-focused modular structure under `src/features/`. Each feature module acts as an isolated bundle that contains its own UI components, state stores, page routers, query hooks, forms, schemas, and test specs.

```
src/
├── app/               # Root routing, query provider configuration, layouts
├── components/        # Shared core UI widgets and layout templates
├── features/          # Feature domains
│   ├── auth/          # Authentication & Registration
│   ├── dashboard/     # Organization overview
│   ├── workflows/     # Core engine definition & builder views
│   ├── executions/    # Monitored runs & realtime streams
│   ├── knowledge-bases/ # Document catalogs
│   ├── team/          # Members administration
│   ├── api-keys/      # Programmatic tokens management
│   ├── audit-logs/    # Event tracking logger
│   └── settings/      # User settings page
├── lib/               # Custom Axios clients, socket listeners, logs helper
├── routes/            # Role guards and layout protection layers
└── stores/            # Global Zustand stores (auth, organization, UI)
```

## Router Layout & Protection Scopes

We use React Router to define public and protected sub-routes:
1. **Public Auth Routes**: Wraps login, signup, and invite templates in `PublicRoute` preventing authenticated redirects.
2. **Protected App Routes**: Encased in `ProtectedRoute` ensuring active JWT tokens are mapped before rendering layout views.
3. **Role Guards (RBAC)**: Protects administrative pages `/audit-logs` and trigger key forms. Disallowed users (e.g. `VIEWER` or `MEMBER`) are blocked by `RoleGuard` checks.

## Bundle Splitting & Lazy Load

All major pages are lazy loaded via React's `lazy` wrapper inside `src/app/router/index.tsx`. The Vite build pipeline bundles pages into discrete code-split assets, ensuring that load performance remains high regardless of how many new features are added.
