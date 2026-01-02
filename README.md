# Admin SPA Template

A reusable admin Single Page Application template built with React 18, TypeScript 5, Vite, Ant Design 5, and Ant Design Pro Components. It includes authentication flow, route guards, multi-tab navigation, i18n, and a reusable CRUD table skeleton.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `VITE_API_BASE_URL`: Base API endpoint. The app will target `${VITE_API_BASE_URL}/v1`.
- `VITE_ENABLE_MOCK`: Set to `true` to enable built-in mock responses for auth and user APIs.

## Project Structure

```
src/
  main.tsx                # App entry, initializes i18n first
  index.css               # Global styles (Tailwind directives placeholder)

  app/                    # Application assembly
    App.tsx               # Router + providers
    providers/            # Auth and Tab contexts
    router/               # Navigator helper + guards

  core/                   # Stable core utilities
    auth/                 # Token storage helpers
    http/                 # Axios instance with refresh handling
    types/                # Shared API types

  shared/                 # Cross-feature utilities and UI
    i18n/                 # i18next setup and helpers
    ui/                   # Layouts, CRUD component, error handling

  features/               # Feature modules
    dashboard/
    users/
    settings/
    auth/

  locales/                # Namespaced locale JSON resources
```

## Extending Features

- Add a new module under `src/features/<module>/` with `api/`, `types/`, `pages/`, and optional `components/` or `hooks/` folders.
- Register the route in `src/app/App.tsx` and add a menu item in `src/shared/ui/layouts/Sidebar.tsx` (via `APP_ROUTES`).
- Use `TabProvider.openTab(path, title)` in navigation actions to sync sidebar clicks with tab navigation.

## Using `ProCrudPage`

`ProCrudPage` wraps `ProTable` and `PageContainer` to provide a reusable CRUD list shell.

```tsx
<ProCrudPage
  title="Users"
  columns={userColumns}
  fetch={fetchUsers}
  onRemove={removeUser}
  onReady={(reload) => {/* store reload for external triggers */}}
/>
```

- `fetch` should return `{ data, total }`.
- `onRemove` is optional and will render a default remove action when provided.
- Use `onReady` to capture a reload callback for external refresh triggers.

