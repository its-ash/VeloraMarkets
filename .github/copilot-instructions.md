# Valora Markets website

Marketing site for Valora Markets, a forex broker that offers only the nTrader platform.

## Stack
- Nuxt 4 (`app/` directory), Vue 3, TypeScript.
- Three.js for the home hero background (`app/components/HeroScene.vue`).
- Plain CSS with design tokens in `app/assets/css/main.css`. No CSS framework.
- Icons: `@phosphor-icons/vue` only. Fonts: Space Grotesk (site, `--font`) and Geist Mono (`--mono`) from `@fontsource-variable`; Bricolage Grotesque (`--display`, hero headline only) from Google Fonts, subset to the headline text in `nuxt.config.ts`.

## Structure
- `app/data/site.ts`: all business content (URLs, accounts, pairs, FAQ, risk warning). Edit content here first.
- `app/components/MqlWidget.vue`: embeds MQL5 live quote widgets (ticker, overview, chart). Widget script settings live in `MQL5_WIDGET` in `site.ts`.
- `app/plugins/motion.ts`: `v-reveal`, `v-magnetic`, `v-spotlight` directives.
- `public/`: logo, favicon, payment logos.

## Rules
- Black and gold theme from the logo. Dark only. One accent: gold (`--gold`, `--gold-grad`). One radius scale: `--r` and `--r-sm`.
- No photos. Cards use Phosphor icons in `.icon-chip`. Animated cards use `.panel.glow` plus a `.shine` span. `app/plugins/bg-icons.client.ts` copies each card's `.icon-chip` icon into a large animated `.bg-icon` behind the content.
- Animate `transform`/`opacity`/`translate`/`scale` only. Respect `prefers-reduced-motion`.
- No em-dashes in visible copy. Prices come only from MQL5 widgets; never show made-up quotes.
- Mobile first: every section must collapse to one column at 768px.

## Commands
- `make run`: dev server.
- `make build`: static build into `docs/` with `.nojekyll` (GitHub Pages serves from `docs/` on `main`).
- `make deploy`: build, commit and push to `main`.
- Set `NUXT_APP_BASE_URL=/<repo>/` before `make build` when the site is served from a project path.
