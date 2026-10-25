<script setup lang="ts">
import { PhChartLine, PhTable, PhInfo } from '@phosphor-icons/vue'
import { pairGroups, pairs, type PairGroup } from '~/data/site'

usePageSeo({
  title: 'Live Forex Quotes and Charts',
  description: 'Live forex prices and interactive charts for EUR/USD, GBP/USD, USD/JPY and 17 more currency pairs. Pick a pair and timeframe from 15 minutes to 1 day.',
  path: '/quotes',
  crumb: 'Live forex quotes',
})

const PERIODS = [
  { id: 'M15', label: '15 min' },
  { id: 'H1', label: '1 hour' },
  { id: 'H4', label: '4 hours' },
  { id: 'D1', label: '1 day' },
] as const

const groups = Object.keys(pairGroups) as PairGroup[]
const sym = ref(pairs[0]!)
const period = ref<(typeof PERIODS)[number]['id']>('H1')
const pretty = (s: string) => `${s.slice(0, 3)}/${s.slice(3)}`
</script>

<template>
  <div>
    <PageHero title="Live forex quotes" :accent="['Live']" lede="Real-time prices and charts for every pair you can trade on nTrader. Pick a pair and a timeframe to explore the market." />

    <div class="tape">
      <MqlWidget type="ticker" :symbols="pairs" :height="60" label="Live ticker for all currency pairs" marquee bare />
    </div>

    <section class="section">
      <div class="wrap chart-wrap">
        <div v-reveal="'left'" class="stack side">
          <span class="icon-chip icon-chip-lg"><PhChartLine :size="30" weight="duotone" /></span>
          <h2>Chart any pair</h2>
          <fieldset class="pick">
            <legend class="lbl">Currency pair</legend>
            <div v-for="g in groups" :key="g" class="grp">
              <p class="grp-name">{{ g }}</p>
              <div class="chips">
                <button v-for="s in pairGroups[g]" :key="s" type="button" class="chip mono" :aria-pressed="sym === s" @click="sym = s">{{ pretty(s) }}</button>
              </div>
            </div>
          </fieldset>
          <fieldset class="pick">
            <legend class="lbl">Timeframe</legend>
            <div class="chips">
              <button v-for="p in PERIODS" :key="p.id" type="button" class="chip" :aria-pressed="period === p.id" @click="period = p.id">{{ p.label }}</button>
            </div>
          </fieldset>
        </div>
        <div v-reveal="'right'" class="frame">
          <MqlWidget type="chart" :symbols="[sym]" :period="period" :height="560" :label="`${pretty(sym)} live chart, ${period} timeframe`" />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div v-reveal class="head">
          <span class="icon-chip icon-chip-lg"><PhTable :size="30" weight="duotone" /></span>
          <h2>Every pair at a glance</h2>
          <p class="lede">Bid, ask and daily change for all {{ pairs.length }} pairs, grouped the same way as on nTrader.</p>
        </div>
        <div v-reveal="'stagger'" class="tables">
          <article v-for="g in groups" :key="g" class="tbl">
            <h3>{{ g }}</h3>
            <MqlWidget type="overview" :symbols="pairGroups[g]" :height="380" :label="`Live quotes for ${g.toLowerCase()}`" />
          </article>
        </div>
      </div>
    </section>

    <section class="section top0">
      <div v-reveal class="wrap panel note">
        <span class="icon-chip"><PhInfo :size="22" weight="duotone" /></span>
        <p class="muted">Quotes on this page come from MQL5 and are for information only. Prices on nTrader can differ. Your order fills at the price nTrader shows when you trade.</p>
      </div>
    </section>

    <CtaBand title="Trade these prices on nTrader" />
  </div>
</template>

<style scoped>
.top0 { padding-block-start: 0; }
.tape { background: transparent; }
.chart-wrap { display: grid; grid-template-columns: minmax(0, 0.75fr) minmax(0, 1.6fr); gap: clamp(1.5rem, 1rem + 3vi, 4rem); align-items: start; }
.side { position: sticky; inset-block-start: calc(var(--nav-h) + 1.5rem); }
.frame { border-radius: var(--r); overflow: hidden; box-shadow: var(--shadow); }
.pick { border: 0; display: grid; gap: 0.75rem; }
.lbl { font-weight: 550; margin-block-end: 0.5rem; }
.grp { display: grid; gap: 0.4rem; }
.grp-name { font-size: 0.8rem; color: var(--faint); }
.chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.chip { min-block-size: 2.4rem; padding: 0 0.8rem; border-radius: var(--r-sm); border: 1px solid var(--line); background: var(--bg-2); color: var(--muted); font-size: 0.85rem; cursor: pointer; transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease, transform 160ms var(--ease-out); }
.chip:active { transform: scale(0.96); }
.chip[aria-pressed='true'] { background: var(--gold-grad); color: var(--gold-ink); border-color: transparent; font-weight: 600; }
@media (hover: hover) and (pointer: fine) {
  .chip:not([aria-pressed='true']):hover { color: var(--text); border-color: oklch(0.83 0.165 84 / 0.45); }
}
.head .icon-chip { margin-block-end: 0.25rem; }
.tables { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.tbl { display: grid; gap: 1rem; align-content: start; }
.tbl :deep(.frame) { border-radius: var(--r); }
.note { display: flex; align-items: flex-start; gap: 1rem; padding: 1.25rem 1.5rem; }
@media (max-width: 1100px) {
  .tables { grid-template-columns: 1fr; }
}
@media (max-width: 900px) {
  .chart-wrap { grid-template-columns: 1fr; }
  .side { position: static; }
}
</style>
