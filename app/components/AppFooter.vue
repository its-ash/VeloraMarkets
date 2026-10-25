<script setup lang="ts">
import { nav, RISK_WARNING, COMPANY, CONTACT_EMAIL, WEB_TRADER_URL } from '~/data/site'

const year = new Date().getFullYear()
const legal = [
  { to: '/legal#risk', label: 'Risk disclosure' },
  { to: '/legal#terms', label: 'Terms of business' },
  { to: '/legal#privacy', label: 'Privacy policy' },
  { to: '/legal#aml', label: 'AML policy' },
]
</script>

<template>
  <footer class="foot">
    <div class="wrap grid">
      <div class="brand stack">
        <LogoMark size="2.2rem" />
        <p class="muted">A forex broker with one platform. Every account, every tool and every price runs on nTrader.</p>
        <a :href="`mailto:${CONTACT_EMAIL}`" class="mail">{{ CONTACT_EMAIL }}</a>
      </div>
      <nav aria-label="Company" class="col">
        <h2 class="ttl">Company</h2>
        <ul>
          <li v-for="l in nav" :key="l.to"><NuxtLink :to="l.to">{{ l.label }}</NuxtLink></li>
          <li><a :href="WEB_TRADER_URL">nTrader Web</a></li>
        </ul>
      </nav>
      <nav aria-label="Legal" class="col">
        <h2 class="ttl">Legal</h2>
        <ul>
          <li v-for="l in legal" :key="l.to"><NuxtLink :to="l.to">{{ l.label }}</NuxtLink></li>
        </ul>
      </nav>
    </div>
    <div class="wrap risk">
      <p><strong>Risk warning:</strong> {{ RISK_WARNING }}</p>
      <p class="copy">&copy; {{ year }} {{ COMPANY }}. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.foot { border-block-start: 1px solid var(--line); background: var(--bg-2); padding-block: clamp(3rem, 2rem + 3vi, 5rem) 2rem; margin-block-start: auto; }
.grid { display: grid; grid-template-columns: minmax(0, 2fr) repeat(2, minmax(0, 1fr)); gap: 2.5rem; }
.brand p { max-inline-size: 38ch; }
.mail { color: var(--gold); font-weight: 550; inline-size: fit-content; }
.ttl { font-size: 0.95rem; letter-spacing: 0; margin-block-end: 1rem; }
.col ul { display: grid; gap: 0.35rem; }
.col a { display: inline-flex; min-block-size: 2rem; align-items: center; color: var(--muted); transition: color 200ms ease; }
.col a:hover { color: var(--gold); }
.risk { margin-block-start: 3rem; padding-block-start: 1.5rem; border-block-start: 1px solid var(--line); display: grid; gap: 1rem; font-size: 0.85rem; color: var(--faint); }
.risk strong { color: var(--muted); }
.copy { color: var(--faint); }
@media (max-width: 768px) {
  .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .brand { grid-column: 1 / -1; }
}
</style>
