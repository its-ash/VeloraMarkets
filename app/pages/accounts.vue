<script setup lang="ts">
import { PhArrowRight, PhCheck, PhStar, PhCoins, PhLightning, PhCrown, PhGlobe, PhLockKey, PhPlayCircle, PhToolbox, PhHandCoins, PhHeadset } from '@phosphor-icons/vue'
import { accounts, SIGNUP_URL } from '~/data/site'

const TYPICAL = { standard: { spread: 1.1, comm: 0 }, raw: { spread: 0.1, comm: 3.5 }, pro: { spread: 0.1, comm: 2.5 } } as const
type Id = keyof typeof TYPICAL
const PIP_USD = 10
const MIN_LOTS = 0.01
const MAX_LOTS = 50

const lots = ref(1)
const size = computed(() => Math.min(Math.max(Number(lots.value) || 0, MIN_LOTS), MAX_LOTS))
const outOfRange = computed(() => !(Number(lots.value) >= MIN_LOTS && Number(lots.value) <= MAX_LOTS))
const cost = (id: Id) => TYPICAL[id].spread * PIP_USD * size.value + TYPICAL[id].comm * 2 * size.value
const cheapest = computed(() => (Object.keys(TYPICAL) as Id[]).reduce((a, b) => (cost(b) < cost(a) ? b : a)))
const share = (id: Id) => Math.max(cost(id) / Math.max(cost('standard'), 0.01), 0.02)

const icons = { standard: PhCoins, raw: PhLightning, pro: PhCrown } as const

const rows: { k: string, f: (a: typeof accounts[number]) => string }[] = [
  { k: 'Minimum deposit', f: a => a.deposit },
  { k: 'Spreads', f: a => a.spread },
  { k: 'Commission', f: a => a.commission },
  { k: 'Leverage', f: a => a.leverage },
  { k: 'Minimum trade', f: a => `${a.minLot} lots` },
  { k: 'Platform', f: () => 'nTrader' },
]

const included = [
  { icon: PhGlobe, t: 'Every forex pair we offer' },
  { icon: PhLockKey, t: 'Negative balance protection' },
  { icon: PhPlayCircle, t: 'Free demo account' },
  { icon: PhToolbox, t: 'The full nTrader toolset' },
  { icon: PhHandCoins, t: 'No deposit or withdrawal fees' },
  { icon: PhHeadset, t: 'Support 24/5' },
]

const faqs = [
  { q: 'Can I change my account type later?', a: 'Yes. Open a second account of a different type from your client portal, or ask support to convert your account when you have no open positions.' },
  { q: 'Is there an inactivity fee?', a: 'No. Valora Markets does not charge a fee for inactive accounts.' },
  { q: 'Do you offer swap-free accounts?', a: 'Swap-free trading is available on Standard and Raw accounts for clients who need it. Contact support to apply.' },
]

usePageSeo({
  title: 'Forex Account Types: Standard, Raw and Pro',
  description: 'Compare Valora Markets forex accounts. Standard with no commission, Raw from 0.0 pips, Pro for high volume. Minimum deposit from $100 on nTrader.',
  path: '/accounts',
  crumb: 'Account types',
  faq: faqs,
})
</script>

<template>
  <div>
    <PageHero title="Three accounts, one platform" lede="Every account trades on nTrader with the same tools and the same execution. Choose the pricing model that suits your strategy." />

    <section class="section top0">
      <div v-reveal="'stagger'" class="wrap cmp">
        <article v-for="(a, i) in accounts" :key="a.id" v-spotlight class="panel spot glow col" :data-featured="a.featured || undefined" :style="{ '--i': i }">
          <span class="shine" aria-hidden="true" />
          <header class="col-h">
            <div class="col-top">
              <span class="icon-chip icon-chip-lg"><component :is="icons[a.id as Id]" :size="30" weight="duotone" /></span>
              <p v-if="a.featured" class="tag"><PhStar :size="14" weight="fill" /> Most chosen</p>
            </div>
            <h2 class="col-name">{{ a.name }}</h2>
            <p class="muted">{{ a.pitch }}</p>
          </header>
          <dl class="col-spec">
            <div v-for="r in rows" :key="r.k" class="kv">
              <dt>{{ r.k }}</dt>
              <dd class="mono">{{ r.f(a) }}</dd>
            </div>
          </dl>
          <a :href="`${SIGNUP_URL}?account=${a.id}`" class="btn" :class="{ 'btn-gold': a.featured }">Choose {{ a.name }} <PhArrowRight :size="18" /></a>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="wrap calc-wrap">
        <div v-reveal="'left'" class="stack">
          <h2>What one trade costs you</h2>
          <p class="lede">Set a trade size to compare the round-turn cost on EUR/USD across all three accounts.</p>
          <div class="field">
            <label for="lots">Trade size in lots</label>
            <input id="lots" v-model.number="lots" class="input mono" type="number" :min="MIN_LOTS" :max="MAX_LOTS" step="0.01" inputmode="decimal" :aria-invalid="outOfRange" aria-describedby="lots-help lots-err">
            <p id="lots-help" class="help">Between {{ MIN_LOTS }} and {{ MAX_LOTS }} lots. One lot is 100,000 units of the base currency.</p>
            <p id="lots-err" class="err" aria-live="polite">{{ outOfRange ? `Enter a size from ${MIN_LOTS} to ${MAX_LOTS} lots. The cost below uses ${size} lots.` : '' }}</p>
          </div>
          <input v-model.number="lots" class="range" type="range" :min="MIN_LOTS" max="10" step="0.01" aria-label="Trade size slider">
        </div>
        <div v-reveal="'right'" class="panel glow bars" aria-live="polite">
          <span class="shine" aria-hidden="true" />
          <div v-for="a in accounts" :key="a.id" class="bar" :data-best="cheapest === a.id || undefined">
            <div class="bar-top">
              <span class="bar-name">{{ a.name }}</span>
              <span class="mono bar-val">${{ cost(a.id as Id).toFixed(2) }}</span>
            </div>
            <span class="bar-fill" :style="{ scale: `${share(a.id as Id)} 1` }" />
            <p v-if="cheapest === a.id" class="best"><PhCheck :size="14" weight="bold" /> Lowest cost at this size</p>
          </div>
          <p class="note">Example based on typical EUR/USD spreads of 1.1 pips (Standard) and 0.1 pips (Raw and Pro) plus commission. Real spreads vary with market conditions.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <h2 v-reveal class="head">Included with every account</h2>
        <ul v-reveal="'stagger'" class="inc">
          <li v-for="(x, i) in included" :key="x.t" class="panel glow inc-item" :style="{ '--i': i }">
            <span class="icon-chip"><component :is="x.icon" :size="22" weight="duotone" /></span>{{ x.t }}
          </li>
        </ul>
      </div>
    </section>

    <section class="section">
      <div class="wrap narrow">
        <h2 v-reveal class="head">Account questions</h2>
        <FaqList :items="faqs" group="acc" />
      </div>
    </section>

    <CtaBand />
  </div>
</template>

<style scoped>
.top0 { padding-block-start: 0; }
.cmp { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; align-items: stretch; }
.col { display: grid; grid-template-rows: subgrid; grid-row: span 3; gap: 1.5rem; padding: clamp(1.4rem, 1rem + 1.5vi, 2.2rem); }
.col[data-featured] { border-color: oklch(0.83 0.165 84 / 0.5); background: linear-gradient(170deg, oklch(0.83 0.165 84 / 0.12), var(--bg-2) 45%); }
.col[data-featured]::after { opacity: 0.8; }
.col-h { display: grid; gap: 0.75rem; align-content: start; }
.col-top { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.tag { display: inline-flex; gap: 0.35rem; align-items: center; padding: 0.3rem 0.65rem; border-radius: var(--r-sm); background: oklch(0.83 0.165 84 / 0.14); color: var(--gold); font-size: 0.82rem; font-weight: 550; }
.col-name { font-size: clamp(1.8rem, 1.5rem + 1vi, 2.4rem); }
.kv { display: flex; justify-content: space-between; gap: 1rem; padding-block: 0.8rem; }
.kv + .kv { border-block-start: 1px solid var(--line); }
dt { color: var(--faint); font-size: 0.9rem; }
dd { text-align: end; }
.col .btn { align-self: end; }

.calc-wrap { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: clamp(2rem, 1rem + 4vi, 5rem); align-items: center; }
.calc-wrap .input { max-inline-size: 14rem; font-size: 1.2rem; }
.range { inline-size: 100%; accent-color: var(--gold); block-size: 2rem; }
.bars { padding: clamp(1.4rem, 1rem + 1.5vi, 2.2rem); display: grid; gap: 1.5rem; }
.bar { display: grid; gap: 0.5rem; }
.bar-top { display: flex; justify-content: space-between; }
.bar-name { font-weight: 550; }
.bar-val { font-size: 1.3rem; }
.bar-fill { display: block; block-size: 0.6rem; border-radius: 0.3rem; background: var(--surface-2); transform-origin: 0 50%; transition: scale 500ms var(--ease-out), background-color 300ms ease; }
.bar[data-best] .bar-fill { background: var(--gold-grad); box-shadow: 0 0 16px oklch(0.83 0.165 84 / 0.5); }
.bar[data-best] .bar-val { color: var(--gold); }
.best { display: inline-flex; gap: 0.35rem; align-items: center; font-size: 0.82rem; color: var(--gold); }
.note { font-size: 0.8rem; color: var(--faint); }

.inc { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr)); gap: 1rem; }
.inc-item { display: flex; gap: 1rem; align-items: center; padding: 1.1rem 1.25rem; font-weight: 500; }
.narrow { max-inline-size: 52rem; }

@media (max-width: 960px) {
  .cmp { grid-template-columns: 1fr; }
  .col { grid-template-rows: auto; grid-row: auto; }
  .calc-wrap { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .cmp { gap: 0.75rem; }
  .col { --pad-m: 1rem; --gap-m: 0.8rem; }
  .col-h { grid-template-columns: auto 1fr; column-gap: 0.75rem; row-gap: 0.35rem; align-items: center; }
  .col-top { display: contents; }
  .col-top .icon-chip { grid-row: span 2; }
  .tag { grid-column: 2; grid-row: 2; justify-self: start; padding: 0.15rem 0.5rem; font-size: 0.72rem; }
  .col-name { grid-column: 2; grid-row: 1; font-size: 1.35rem; }
  .col-h .muted { grid-column: 1 / -1; font-size: 0.85rem; }
  .col-spec { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.4rem; }
  .kv { flex-direction: column; gap: 0.1rem; padding: 0.5rem 0.6rem; border-radius: var(--r-sm); background: oklch(1 0 0 / 0.03); }
  .kv + .kv { border: 0; }
  dt { font-size: 0.7rem; }
  dd { text-align: start; font-size: 0.82rem; }
  .col .btn { min-block-size: 2.6rem; font-size: 0.9rem; }

  .calc-wrap { gap: 1.25rem; }
  .calc-wrap .input { max-inline-size: none; font-size: 1rem; min-block-size: 2.75rem; }
  .bars { --gap-m: 0.9rem; }
  .bar-name { font-size: 0.9rem; }
  .bar-val { font-size: 1rem; }
  .note { font-size: 0.75rem; }

  .inc { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.5rem; }
  .inc-item { --pad-m: 0.8rem; --gap-m: 0.5rem; flex-direction: column; align-items: flex-start; font-size: 0.82rem; line-height: 1.3; }
  .inc-item .icon-chip { inline-size: 2rem; block-size: 2rem; }
}
</style>
