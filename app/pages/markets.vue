<script setup lang="ts">
import { PhCurrencyDollar, PhArrowsLeftRight, PhCompass } from '@phosphor-icons/vue'
import { pairGroups, pairs, type PairGroup } from '~/data/site'

usePageSeo({
  title: 'Forex Markets: Majors, Minors and Exotics',
  description: 'Trade 20 currency pairs on nTrader, including EUR/USD, GBP/USD and USD/JPY. See live quotes and the Sydney, Tokyo, London and New York session times.',
  path: '/markets',
  crumb: 'Forex markets',
})

const groups = Object.keys(pairGroups) as PairGroup[]
const group = ref<PairGroup>('Majors')
const symbols = computed(() => pairGroups[group.value])

const intro = [
  { g: 'Majors' as const, icon: PhCurrencyDollar, d: 'The most traded pairs. All of them include the US dollar, so spreads stay tight all day.' },
  { g: 'Minors' as const, icon: PhArrowsLeftRight, d: 'Crosses between major currencies without the US dollar. Good for views on Europe and Asia.' },
  { g: 'Exotics' as const, icon: PhCompass, d: 'A major currency against an emerging market currency. Wider spreads and bigger moves.' },
]

const sessions = [
  { city: 'Sydney', from: 22, to: 7 },
  { city: 'Tokyo', from: 0, to: 9 },
  { city: 'London', from: 8, to: 17 },
  { city: 'New York', from: 13, to: 22 },
]
type Session = typeof sessions[number]
const now = ref<number | null>(null)
const isOpen = (s: Session, h: number) => (s.from < s.to ? h >= s.from && h < s.to : h >= s.from || h < s.to)
const segs = (s: Session): [number, number][] => (s.from < s.to ? [[s.from, s.to]] : [[s.from, 24], [0, s.to]])

let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  const set = () => { const d = new Date(); now.value = d.getUTCHours() + d.getUTCMinutes() / 60 }
  set()
  timer = setInterval(set, 60_000)
})
onBeforeUnmount(() => clearInterval(timer))

const tabs = ref<HTMLButtonElement[]>([])
const ink = reactive({ x: 0, w: 0 })
const place = () => {
  const b = tabs.value[groups.indexOf(group.value)]
  if (b) Object.assign(ink, { x: b.offsetLeft, w: b.offsetWidth })
}
watch(group, () => nextTick(place))
onMounted(place)
</script>

<template>
  <div>
    <PageHero :title="`${pairs.length} currency pairs, one platform`" :accent="['one', 'platform']" lede="Valora Markets is a forex-only broker. Trade majors, minors and exotics on nTrader with raw pricing from tier-one banks." />

    <section class="section top0">
      <div class="wrap">
        <ul v-reveal="'stagger'" class="intro">
          <li v-for="(x, i) in intro" :key="x.g">
            <button type="button" class="panel spot glow pick" :aria-pressed="group === x.g" :style="{ '--i': i }" v-spotlight @click="group = x.g">
              <span class="shine" aria-hidden="true" />
              <span class="icon-chip icon-chip-lg"><component :is="x.icon" :size="30" weight="duotone" /></span>
              <span class="p-t">{{ x.g }}</span>
              <span class="muted p-d">{{ x.d }}</span>
              <span class="mono p-n">{{ pairGroups[x.g].length }} pairs</span>
            </button>
          </li>
        </ul>

        <div v-reveal class="bar">
          <div class="tabs" role="tablist" aria-label="Pair groups">
            <span v-if="ink.w" class="tab-ink" :style="{ translate: `${ink.x}px 0`, inlineSize: `${ink.w}px` }" aria-hidden="true" />
            <button v-for="g in groups" :key="g" ref="tabs" class="tab" role="tab" type="button" :aria-selected="g === group" aria-controls="quotes-panel" @click="group = g">{{ g }}</button>
          </div>
          <p class="mono list">{{ symbols.join('  ') }}</p>
        </div>

        <div id="quotes-panel" v-reveal="'scale'" class="frame" role="tabpanel">
          <MqlWidget type="overview" :symbols="symbols" :height="480" :label="`Live quotes for ${group.toLowerCase()} currency pairs`" />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div v-reveal class="head">
          <h2>The market never sleeps on weekdays</h2>
          <p class="lede">Forex trades 24 hours a day from Monday to Friday. Liquidity peaks when two sessions overlap. All times are in UTC.</p>
        </div>
        <div v-reveal="'scale'" class="panel glow clock">
          <span class="shine" aria-hidden="true" />
          <div class="hours mono" aria-hidden="true">
            <span v-for="h in [0, 3, 6, 9, 12, 15, 18, 21, 24]" :key="h" :style="{ insetInlineStart: `${(h / 24) * 100}%` }">{{ String(h % 24).padStart(2, '0') }}:00</span>
          </div>
          <ul class="sess">
            <li v-for="(s, i) in sessions" :key="s.city" class="s-row" :style="{ '--i': i }">
              <span class="s-name">
                {{ s.city }}
                <span v-if="now !== null" class="s-state" :data-open="isOpen(s, now) || undefined">{{ isOpen(s, now) ? 'Open' : 'Closed' }}</span>
              </span>
              <span class="s-track">
                <span v-for="([a, b], j) in segs(s)" :key="j" class="s-seg" :data-open="(now !== null && isOpen(s, now)) || undefined" :style="{ insetInlineStart: `${(a / 24) * 100}%`, inlineSize: `${((b - a) / 24) * 100}%` }" />
                <span v-if="now !== null" class="now" :style="{ insetInlineStart: `${(now / 24) * 100}%` }" aria-hidden="true" />
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <CtaBand title="Trade the next session on nTrader" :body="`Open an account in minutes and get access to all ${pairs.length} pairs on desktop, web and mobile.`" />
  </div>
</template>

<style scoped>
.top0 { padding-block-start: 0; }
.intro { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin-block-end: 2.5rem; }
.pick { inline-size: 100%; block-size: 100%; display: grid; gap: 0.75rem; align-content: start; justify-items: start; padding: 1.6rem; text-align: start; color: var(--text); cursor: pointer; }
.pick[aria-pressed='true'] { border-color: oklch(0.83 0.165 84 / 0.6); background: linear-gradient(160deg, oklch(0.83 0.165 84 / 0.14), var(--bg-2) 55%); }
.pick[aria-pressed='true']::after { opacity: 1; }
.p-t { font-size: 1.35rem; font-weight: 600; letter-spacing: -0.02em; margin-block-start: 0.4rem; }
.p-d { font-size: 0.95rem; }
.p-n { font-size: 0.8rem; color: var(--gold); }

.bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; margin-block-end: 1.25rem; }
.list { font-size: 0.8rem; color: var(--faint); white-space: pre-wrap; }
.frame { border-radius: var(--r); overflow: hidden; box-shadow: var(--shadow); }

.clock { --lab: 9rem; display: grid; gap: 1rem; padding: 2rem 1.5rem 1.75rem; }
.hours { position: relative; block-size: 1.2rem; margin-inline-start: var(--lab); font-size: 0.72rem; color: var(--faint); }
.hours span { position: absolute; translate: -50% 0; }
.hours span:first-child { translate: 0 0; }
.hours span:last-child { translate: -100% 0; }
.sess { display: grid; gap: 1rem; }
.s-row { display: grid; grid-template-columns: var(--lab) 1fr; align-items: center; }
.s-name { display: flex; align-items: center; gap: 0.6rem; font-weight: 550; }
.s-state { font-size: 0.72rem; color: var(--faint); font-weight: 500; }
.s-state[data-open] { color: var(--gold); }
.s-track { position: relative; block-size: 2.25rem; border-radius: var(--r-sm); background: oklch(1 0 0 / 0.03); overflow: hidden; }
.s-seg { position: absolute; inset-block: 0; border-radius: var(--r-sm); background: var(--surface-2); transform-origin: 0 50%; animation: seg 1100ms var(--ease-out) both; animation-delay: calc(var(--i) * 120ms + 200ms); }
.s-seg[data-open] { background: var(--gold-grad); box-shadow: 0 0 18px oklch(0.83 0.165 84 / 0.45); }
.now { position: absolute; inset-block: 0; inline-size: 2px; translate: -50% 0; background: var(--text); box-shadow: 0 0 8px var(--text); }

@keyframes seg { from { scale: 0 1; } to { scale: 1 1; } }

@media (max-width: 900px) {
  .intro { grid-template-columns: 1fr; gap: 0.75rem; margin-block-end: 1.75rem; }
}
@media (max-width: 768px) {
  .pick { grid-template-columns: auto 1fr; column-gap: 0.9rem; align-items: center; }
  .pick .icon-chip { grid-row: span 2; }
  .p-t { font-size: 1.1rem; margin: 0; }
  .p-d { grid-column: 1 / -1; }
  .p-n { grid-column: 2; grid-row: 2; }
  .clock { --pad-m: 1.25rem 1rem 1.1rem; --gap-m: 0.75rem; }
  .s-track { block-size: 1.75rem; }
  .sess { gap: 0.7rem; }
}
@media (max-width: 640px) {
  .tabs { inline-size: 100%; }
  .tab { flex: 1; }
  .clock { --lab: 5.5rem; padding-inline: 1rem; }
  .s-name { flex-direction: column; align-items: start; gap: 0; font-size: 0.9rem; }
  .hours span:nth-child(even) { display: none; }
}
</style>
