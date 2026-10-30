<script setup lang="ts">
import { PhHouse, PhChartLineUp, PhUserPlus, PhInfo, PhSignIn } from '@phosphor-icons/vue'
import { SIGNUP_URL, LOGIN_URL } from '~/data/site'

const tabs = [
  { to: '/', label: 'Home', icon: PhHouse },
  { to: '/platform', label: 'nTrader', icon: PhChartLineUp },
  { href: SIGNUP_URL, label: 'Open account', icon: PhUserPlus, main: true },
  { to: '/about', label: 'About', icon: PhInfo },
  { href: LOGIN_URL, label: 'Log in', icon: PhSignIn },
]
</script>

<template>
  <div class="shell">
    <a href="#main" class="skip">Skip to content</a>
    <div class="progress" aria-hidden="true" />
    <AppHeader />
    <main id="main">
      <slot />
    </main>
    <AppFooter />
    <nav class="dock" aria-label="Quick links">
      <template v-for="t in tabs" :key="t.label">
        <NuxtLink v-if="t.to" :to="t.to" class="tab-l" exact-active-class="on">
          <component :is="t.icon" :size="22" weight="duotone" /><span>{{ t.label }}</span>
        </NuxtLink>
        <a v-else :href="t.href" class="tab-l" :class="{ main: t.main }">
          <span v-if="t.main" class="fab"><component :is="t.icon" :size="22" weight="bold" /></span>
          <component :is="t.icon" v-else :size="22" weight="duotone" /><span>{{ t.main ? 'Open' : t.label }}</span>
        </a>
      </template>
    </nav>
    <div class="grain" aria-hidden="true" />
  </div>
</template>

<style scoped>
.shell { display: flex; flex-direction: column; min-block-size: 100dvh; overflow-x: clip; }
main { flex: 1; }
.skip {
  position: fixed;
  inset: 0.75rem auto auto 0.75rem;
  z-index: 80;
  padding: 0.75rem 1rem;
  border-radius: var(--r-sm);
  background: var(--gold);
  color: var(--gold-ink);
  font-weight: 600;
  translate: 0 -200%;
  transition: translate 200ms var(--ease-out);
}
.skip:focus-visible { translate: 0 0; }
.dock { display: none; }
@media (max-width: 768px) {
  .shell { padding-block-end: calc(4.25rem + env(safe-area-inset-bottom)); }
  .dock {
    position: fixed;
    inset: auto 0 0;
    z-index: 50;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    align-items: end;
    padding: 0.4rem 0.25rem max(0.4rem, env(safe-area-inset-bottom));
    background: oklch(0.12 0.004 85 / 0.85);
    backdrop-filter: blur(16px) saturate(1.3);
    border-block-start: 1px solid var(--line);
  }
}
.tab-l { display: grid; justify-items: center; gap: 0.2rem; min-block-size: 3.25rem; align-content: center; color: var(--muted); font-size: 0.7rem; font-weight: 550; transition: color 200ms ease, scale 160ms var(--ease-out); }
.tab-l:active { scale: 0.92; }
.tab-l.on { color: var(--gold); }
.tab-l.main { color: var(--gold); }
.fab { display: grid; place-items: center; inline-size: 2.9rem; block-size: 2.9rem; margin-block-start: -1.4rem; border-radius: 50%; background: var(--gold-grad); color: var(--gold-ink); box-shadow: 0 0 0 4px var(--bg), 0 0.5rem 1.4rem -0.4rem oklch(0.83 0.165 84 / 0.7); }
@media (max-width: 768px) and (prefers-reduced-transparency: reduce) { .dock { background: var(--bg); backdrop-filter: none; } }
</style>
