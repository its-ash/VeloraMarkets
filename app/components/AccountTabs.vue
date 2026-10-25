<script setup lang="ts">
import { PhArrowRight, PhCheck } from '@phosphor-icons/vue'
import { accounts, SIGNUP_URL } from '~/data/site'

const active = ref(accounts.findIndex(a => a.featured))
const tabsEl = ref<HTMLElement>()
const btns = ref<HTMLButtonElement[]>([])
const ink = reactive({ x: 0, w: 0 })
const acc = computed(() => accounts[active.value]!)

const place = () => {
  const b = btns.value[active.value]
  if (b) Object.assign(ink, { x: b.offsetLeft, w: b.offsetWidth })
}

const pick = (i: number, focus = false) => {
  active.value = (i + accounts.length) % accounts.length
  nextTick(() => { place(); if (focus) btns.value[active.value]?.focus() })
}

const key = (e: KeyboardEvent) => {
  const map: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 }
  if (e.key in map) { e.preventDefault(); pick(active.value + map[e.key]!, true) }
}

let ro: ResizeObserver | undefined
onMounted(() => {
  place()
  ro = new ResizeObserver(place)
  if (tabsEl.value) ro.observe(tabsEl.value)
})
onBeforeUnmount(() => ro?.disconnect())

const rows = computed(() => [
  ['Minimum deposit', acc.value.deposit],
  ['Spreads', acc.value.spread],
  ['Commission', acc.value.commission],
  ['Leverage', acc.value.leverage],
  ['Minimum trade', `${acc.value.minLot} lots`],
])
</script>

<template>
  <div class="acc">
    <div ref="tabsEl" class="tabs" role="tablist" aria-label="Account types" @keydown="key">
      <span v-if="ink.w" class="tab-ink" :style="{ translate: `${ink.x}px 0`, inlineSize: `${ink.w}px` }" aria-hidden="true" />
      <button
        v-for="(a, i) in accounts"
        :id="`tab-${a.id}`"
        :key="a.id"
        ref="btns"
        class="tab"
        role="tab"
        type="button"
        :aria-selected="i === active"
        :aria-controls="`panel-${a.id}`"
        :tabindex="i === active ? 0 : -1"
        @click="pick(i)"
      >
        {{ a.name }}
      </button>
    </div>

    <Transition name="swap" mode="out-in">
      <div :id="`panel-${acc.id}`" :key="acc.id" v-spotlight class="panel spot glow body" role="tabpanel" :aria-labelledby="`tab-${acc.id}`">
        <span class="shine" aria-hidden="true" />
        <div class="intro stack">
          <h3 class="name">{{ acc.name }} account</h3>
          <p class="muted">{{ acc.pitch }}</p>
          <p class="best"><PhCheck :size="18" weight="bold" /> Best for {{ acc.best.toLowerCase() }}</p>
          <a :href="`${SIGNUP_URL}?account=${acc.id}`" class="btn btn-gold">Choose {{ acc.name }} <PhArrowRight :size="18" /></a>
        </div>
        <dl class="spec">
          <div v-for="([k, v], i) in rows" :key="k" class="cell" :style="{ '--i': i }">
            <dt>{{ k }}</dt>
            <dd class="mono">{{ v }}</dd>
          </div>
        </dl>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.acc { display: grid; gap: 1.5rem; justify-items: start; }
.body { inline-size: 100%; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr); gap: clamp(1.5rem, 1rem + 3vi, 4rem); padding: clamp(1.5rem, 1rem + 2vi, 3rem); }
.name { font-size: clamp(1.8rem, 1.4rem + 1.4vi, 2.6rem); letter-spacing: -0.035em; }
.best { display: flex; gap: 0.5rem; align-items: center; color: var(--gold); font-weight: 500; }
.intro .btn { justify-self: start; margin-block-start: 0.5rem; }
.spec { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; background: var(--line); border-radius: var(--r-sm); overflow: hidden; align-self: start; }
.cell { background: var(--bg-2); padding: 1.1rem 1.2rem; display: grid; gap: 0.3rem; animation: fade-up 600ms var(--ease-out) both; animation-delay: calc(var(--i) * 60ms); }
.cell:first-child { grid-column: 1 / -1; background: oklch(0.83 0.165 84 / 0.08); }
.cell:first-child dd { font-size: 2rem; color: var(--gold); }
dt { font-size: 0.85rem; color: var(--faint); }
dd { font-size: 1.15rem; }
.swap-enter-active { transition: opacity 320ms var(--ease-out), translate 420ms var(--ease-out); }
.swap-leave-active { transition: opacity 150ms ease, translate 150ms ease; }
.swap-enter-from { opacity: 0; translate: 0 0.75rem; }
.swap-leave-to { opacity: 0; translate: 0 -0.4rem; }
@media (max-width: 768px) {
  .body { grid-template-columns: 1fr; }
  .tabs { inline-size: 100%; }
  .tab { flex: 1; }
}
</style>
