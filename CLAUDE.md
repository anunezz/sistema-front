# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Quasar 2 + Vue 3 SPA ("Impedimentos" / SISTEMA) for SRE (Secretaría de Relaciones Exteriores). Frontend only — it consumes an external Laravel API (base URL set via `API_URL` in `.env`); the API's source lives in a separate repository not present here.

## Commands

```bash
npm install              # install deps (postinstall runs `quasar prepare`)
npm run dev               # quasar dev — dev server on 0.0.0.0:9000
npm run build              # quasar build — production build, then obfuscates dist/spa/assets/*.js (see below)
npm run lint                # eslint over src*/**/*.{js,cjs,mjs,vue}
npm run format               # prettier --write
```

There is no test suite (`npm run test` is a no-op placeholder).

Before first run, copy `.env.example` to `.env` and point `API_URL` at a running backend.

### Docker

- Dev: `docker compose -f docker-compose.yml up` — nginx + supervisor + node, hot reload, mounts repo into `/app`, host port from `APP_HOST_PORT`.
- Prod: `docker compose -f docker-compose.prod.yml up` — same base image, different nginx conf/ports, no live mount of source into hot-reload mode.

Both share `docker/dockerfile` (Ubuntu 20.04 + Node 20 + `@quasar/cli`).

## Architecture

### Auth & session

- Token lives in `sessionStorage` (`sistema_token`, `sistema_hash`, `sistema_token_expiration`) — **not** in Pinia state. Only the `user` object is persisted (via Pinia plugin, see below).
- Login: `LoginView.vue` → `composables/useSession.js` → `services/AuthServices.js` (`POST /login`) → on success calls `store.setUser()` + `store.setSession()`.
- On app boot (`boot/user.js`), if a token exists, `AuthUser` store's `sessionInfo()` fetches `/user/{sistema_hash}` to rehydrate the user.
- `App.vue` also re-hydrates on `onMounted` and runs a 25-minute idle timer (`@vueuse/core` `useIdle`) that shows a 30s countdown dialog before forcing logout.
- Global 401 handling lives in the axios response interceptor (`boot/axios.js`): clears the token and does `location.reload()`.

### Routing & permission guards

- `router/routes.js` composes route modules by spreading imports (`{...servicios}`, `{...users}`, etc.) — each domain module lives in `router/administration/<Domain>.js` and defines its own path segment + children + `beforeEnter` guard.
- Two distinct guards, used at different levels:
  - `auth-guard.js` (`isAuthenticatedGuard`) — only checks a token exists in `sessionStorage`. Applied once, at the top of the whole `/administracion` layout block.
  - `permission-guard.js` (`hasPermissionGuard`) — checks a route's `meta.requiredPermission` against `AuthUser` store's `hasPermission()` getter. Applied per-module (`beforeEnter: hasPermissionGuard` in each `router/administration/*.js` file), not globally — when adding a new admin module, wire this guard explicitly, it is not inherited automatically.
- Login/forgot-password routes redirect to `AdministrationMenu` if a token is already present (checked inline in each route's own `beforeEnter`, not via the shared guards).

### State (Pinia) — two competing setups, only one is live

- `src/stores/index.js` is the **active** Pinia bootstrap (Quasar's app-vite auto-wires this file). It registers `pinia-plugin-persistedstate-2` with a custom storage adapter: LocalForage (IndexedDB, DB name `IMPEDIMENTOS`) wrapped in AES encryption (`crypto-js`, key = `ENCRYPT_KEY` env var).
- `src/boot/pinia.js` (using `pinia-plugin-persistedstate`, unencrypted) is **dead code** — `'pinia'` is commented out of the `boot` array in `quasar.config.js`. Don't assume it runs. `boot/pinia.js_old` is also leftover/unused.
- Stores declare persistence per-store via a `persist: { key, storage: LocalForage, paths: [...] }` block (see `stores/AuthUser.js` — only `user` is persisted, not the token).

### API layer & optional payload encryption

- Single axios instance in `boot/axios.js` (`$api` / exported `axiosInstance`), baseURL from `API_URL`.
- Request interceptor attaches `Authorization: Bearer <sistema_token>` from `sessionStorage`.
- Optional full-payload encryption channel controlled by `ENCRYPT_CHANNEL` env var (currently `false`): when enabled, request `data`/`params` get AES-encrypted into `{ encrypt: ... }` / `{ encryptParams: ... }` and responses are transparently decrypted (except `responseType: 'blob'` — file downloads bypass decryption). Any request that must skip encryption individually sets header `Accept-C: 'false'`.
- Domain services live under `src/services/administration/**` (one file per resource: catalogs, binnacle, reports, users, etc.), plain functions wrapping `axiosInstance` calls. Most are `.js`; a couple (`service.api.ts`, `interfaces/service.ts`, the "the_planet" feature) are TypeScript — the codebase is mid-migration, not consistently typed.

### Domain modules

Business domain is impediment/case-file management ("impedimentos"). The largest module, `views/administration/discharge_of_impediments/`, implements a multi-stage inbox/approval workflow — each stage ships as a `Form_*.vue` (the editable form) paired with an `Inbox_*.vue` (the list/queue view): request → low/high validation → authorization → work assignment → verification → rejection. Other admin modules: `catalogs` (causales, entidades, municipios, oficinas, perfiles — CRUD-style reference data, each with its own `composables/administration/catalogs/useCat*.js`), `users`, `binnacle`/`impediment_binnacle`/`application_binnacle` (audit logs), `reports`/`report-statistics`, `servicios`.

### Build-time obfuscation

`quasar.config.js` runs an `afterBuild` hook that obfuscates every emitted JS file in `dist/spa/assets` with `javascript-obfuscator`. Several transform options are deliberately disabled (`controlFlowFlattening`, `selfDefending`, `debugProtection`) with inline comments noting they break Quasar's `q-editor` — don't re-enable without checking that component still works. This only affects `npm run build` output, not dev.

### Global input directives

`boot/directives.js` registers several custom `v-*` directives used across forms: `v-uppercase`, `v-alfanumerico` (strips to letters/numbers/accents/ñ), `v-max` / `v-max1000` (character limits, the latter also handling `contenteditable` q-editor fields), `v-no-spaces`. Mexico-specific validators (CURP, RFC) live as global mixin methods in `boot/validation-rules.js` alongside generic ones (`isRequired`, `isValidEmail`, password strength rules), available on any component via Options API-style `this.methodName` even though the rest of the app is Composition API.
