<script setup lang="ts">
import { SIGNUP_URL, LOGIN_URL } from '~/data/site'
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
    <nav class="dock" aria-label="Account">
      <a :href="LOGIN_URL" class="btn">Log in</a>
      <a :href="SIGNUP_URL" class="btn btn-gold">Open account</a>
    </nav>
    <div class="grain" aria-hidden="true" />
  </div>
</template>

<style scoped>
.shell { display: flex; flex-direction: column; min-block-size: 100dvh; }
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
  .shell { padding-block-end: calc(4.5rem + env(safe-area-inset-bottom)); }
  .dock {
    position: fixed;
    inset: auto 0 0;
    z-index: 50;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
    padding: 0.75rem var(--gutter) max(0.75rem, env(safe-area-inset-bottom));
    background: oklch(0.12 0.004 85 / 0.85);
    backdrop-filter: blur(16px) saturate(1.3);
    border-block-start: 1px solid var(--line);
  }
}
@media (max-width: 768px) and (prefers-reduced-transparency: reduce) { .dock { background: var(--bg); backdrop-filter: none; } }
</style>
