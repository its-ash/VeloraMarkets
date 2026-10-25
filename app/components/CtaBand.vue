<script setup lang="ts">
import { PhArrowRight, PhRocketLaunch } from '@phosphor-icons/vue'
import { SIGNUP_URL, DEMO_URL } from '~/data/site'

withDefaults(defineProps<{ title?: string, body?: string }>(), {
  title: 'Your nTrader account is ten minutes away',
  body: 'Apply online, verify your ID and fund by card, bank or crypto. Prefer to practise first? The demo is free.',
})
</script>

<template>
  <section class="section">
    <div v-reveal="'scale'" class="wrap panel glow band" v-spotlight>
      <span class="shine" aria-hidden="true" />
      <span class="orb" aria-hidden="true" />
      <div class="copy stack">
        <h2>{{ title }}</h2>
        <p class="lede">{{ body }}</p>
        <div class="row">
          <a v-magnetic :href="SIGNUP_URL" class="btn btn-gold btn-lg">Open account <PhArrowRight :size="18" /></a>
          <a :href="DEMO_URL" class="btn btn-ghost btn-lg">Try demo</a>
        </div>
      </div>
      <span class="icon-chip icon-chip-lg mark" aria-hidden="true"><PhRocketLaunch :size="34" weight="duotone" /></span>
    </div>
  </section>
</template>

<style scoped>
.band { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 2rem; padding: clamp(2.5rem, 1.5rem + 5vi, 6rem) clamp(1.5rem, 1rem + 4vi, 5rem); background: radial-gradient(120% 140% at 100% 0%, oklch(0.83 0.165 84 / 0.16), transparent 55%), var(--bg-2); }
.orb { position: absolute; inset: auto -10% -60% auto; inline-size: 34rem; aspect-ratio: 1; z-index: -1; border-radius: 50%; background: radial-gradient(closest-side, oklch(0.83 0.165 84 / 0.22), transparent); animation: glow-pulse 6s var(--ease-in-out) infinite; pointer-events: none; }
.copy { max-inline-size: 40rem; }
.row { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-block-start: 0.5rem; }
.mark { inline-size: 7rem; block-size: 7rem; }
@media (max-width: 768px) {
  .band { grid-template-columns: 1fr; }
  .mark { display: none; }
}
@media (max-width: 560px) { .row .btn { inline-size: 100%; } }
</style>
