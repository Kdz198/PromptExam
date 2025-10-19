# Copilot Instructions

## Project Snapshot
- Single-page React + TypeScript app bootstrapped by Vite; `src/pages/ExamAssistantPage.tsx` owns almost all UI state.
- Styling is Tailwind 4 via `@tailwindcss/vite`; prefer composing utility classes in JSX rather than editing raw CSS.
- Legacy static markup lives in `src/index.html` but the build serves `index.html` at repo root -> `src/main.tsx`; treat the static file as reference only.

## Data & State Flow
- All HTTP traffic goes through `src/services/api.ts`; extend the `request` helper instead of calling `fetch` directly and keep the `API_BASE_URL` consistent (`http://localhost:8080/api`).
- Shared domain types are in `src/types/api.ts`; import these to keep subject/lesson/question/matrix payloads typed.
- `ExamAssistantPage` tracks subject/grade/lesson selection separately for structure, question bank, and matrix bank; ensure new effects reset dependent state the same way (e.g. changing subject clears grade and lesson IDs).
- Grade selectors store strings for UI bindings, but payloads sent to the API need numbers—mirror existing conversions with `Number.parseInt`.
- Question lists rely on `useMemo` filtering and `window.MathJax?.typesetPromise()` to re-render math; call that helper after injecting new question HTML.
- Structure items use `crypto.randomUUID()` and the `StructureItem` type; include subject/lesson labels so the preview table stays accurate.

## UI Patterns
- Reuse `components/ui/Modal.tsx` for dialogs; it handles the `modal-root` portal and body scroll locking—new modals should follow the existing `components/modals/*Modal.tsx` pattern.
- Dangerously rendered question text (`dangerouslySetInnerHTML`) assumes backend-sanitized HTML; maintain that pathway for MathJax compatibility.
- `MatrixBankAccordion` and `QuestionBankAccordion` expect filtered data arrays; pass only already-filtered lists instead of embedding new fetches in children.
- `ResultSection` is currently placeholder UI; when wiring data, prefer lifting state into `ExamAssistantPage` and threading props in.

## Dev Workflow
- Install deps with `npm install`; key scripts: `npm run dev` (Vite dev server), `npm run build` (type-check + bundle), `npm run lint` (ESLint), `npm run preview` (serve build).
- Strict TS compiler flags (`strict`, `noUncheckedSideEffectImports`, etc.) are enabled; fix type warnings immediately to keep builds green.
- MathJax is injected once via a `useEffect` in `ExamAssistantPage`; avoid duplicating script tags to prevent double loads.
- When adding API calls or types, update both the service module and relevant modals/forms so optimistic UI and validation copy stays consistent.
