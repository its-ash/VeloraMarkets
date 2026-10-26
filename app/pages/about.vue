<script setup lang="ts">
import { PhScales, PhEye, PhTarget, PhHandshake, PhDesktopTower, PhUsersThree } from '@phosphor-icons/vue'

usePageSeo({
  title: 'About Us: A Forex Broker Built on nTrader',
  description: 'Valora Markets is a forex broker that runs on one platform, nTrader. Learn why we chose one platform and our values: clear pricing and fair execution.',
  path: '/about',
  crumb: 'About us',
})

const values = [
  { icon: PhEye, t: 'Clear pricing', d: 'Spreads, commissions and swaps are published before you trade. No hidden mark-ups.' },
  { icon: PhScales, t: 'Fair execution', d: 'We do not trade against our clients. Orders fill at the best price our providers offer.' },
  { icon: PhTarget, t: 'One focus', d: 'Forex on nTrader is all we do. Every hour of engineering goes into that one product.' },
  { icon: PhHandshake, t: 'Real support', d: 'Our team trades too. Ask a question and you reach someone who understands the market.' },
]
</script>

<template>
  <div>
    <PageHero title="A broker that does one thing well" lede="We started Valora Markets because traders were juggling three platforms and getting average service on each. So we chose one and built everything around it." />

    <section class="section top0">
      <div class="wrap mosaic">
        <div v-reveal="'left'" v-spotlight class="panel spot glow m1" style="--i: 0">
          <span class="shine" aria-hidden="true" />
          <div class="emblem" aria-hidden="true">
            <span class="ring r1" /><span class="ring r2" />
            <span class="icon-chip icon-chip-lg"><PhDesktopTower :size="36" weight="duotone" /></span>
          </div>
          <div class="stack">
            <h2>Why only nTrader</h2>
            <p class="muted">Most brokers spread their effort across several platforms. We put ours into one. When nTrader ships a new feature, every client gets it on the same day, and our support desk already knows how it works.</p>
          </div>
        </div>
        <div v-reveal="'right'" v-spotlight class="panel spot glow m2" style="--i: 1">
          <span class="shine" aria-hidden="true" />
          <span class="icon-chip icon-chip-lg"><PhUsersThree :size="32" weight="duotone" /></span>
          <h3>A team that trades</h3>
          <p class="muted">Our dealing, support and product staff use nTrader every day. When you call us, you speak to people who know the platform from the inside.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <h2 v-reveal class="head">What we stand for</h2>
        <ul v-reveal="'stagger'" class="vals">
          <li v-for="(v, i) in values" :key="v.t" v-spotlight class="panel spot glow val" :style="{ '--i': i }">
            <span class="shine" aria-hidden="true" />
            <span class="icon-chip"><component :is="v.icon" :size="24" weight="duotone" /></span>
            <h3>{{ v.t }}</h3>
            <p class="muted">{{ v.d }}</p>
          </li>
        </ul>
      </div>
    </section>

    <section class="section">
      <blockquote v-reveal="'scale'" class="wrap quote">
        <p>&ldquo;We would rather run one platform properly than three platforms badly. That choice shapes everything we do.&rdquo;</p>
        <footer>Valora Markets founding team</footer>
      </blockquote>
    </section>

    <CtaBand />
  </div>
</template>

<style scoped>
.top0 { padding-block-start: 0; }
.mosaic { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 1rem; }
.m1 { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: clamp(1.5rem, 1rem + 3vi, 3.5rem); padding: clamp(1.5rem, 1rem + 2vi, 3rem); background: radial-gradient(80% 90% at 15% 50%, oklch(0.83 0.165 84 / 0.14), transparent 65%), var(--bg-2); }
.m2 { display: grid; gap: 1rem; align-content: start; padding: clamp(1.5rem, 1rem + 2vi, 2.5rem); background: linear-gradient(160deg, oklch(0.83 0.165 84 / 0.12), var(--bg-2) 60%); }
.emblem { position: relative; display: grid; place-items: center; inline-size: 13rem; block-size: 13rem; }
.ring { position: absolute; border-radius: 50%; border: 1px dashed oklch(0.83 0.165 84 / 0.4); animation: orbit 18s linear infinite; }
.r1 { inline-size: 8rem; block-size: 8rem; }
.r2 { inline-size: 12.5rem; block-size: 12.5rem; border-style: solid; border-color: oklch(0.83 0.165 84 / 0.16); animation-duration: 30s; animation-direction: reverse; }
.ring::after { content: ''; position: absolute; inset-block-start: -4px; inset-inline-start: 50%; inline-size: 8px; block-size: 8px; border-radius: 50%; background: var(--gold); box-shadow: 0 0 12px var(--gold); }
@keyframes orbit { to { rotate: 360deg; } }
.vals { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr)); gap: 1rem; }
.val { padding: 1.75rem; display: grid; gap: 0.75rem; align-content: start; }
.val h3 { margin-block-start: 0.5rem; }
.quote { display: grid; gap: 1.5rem; max-inline-size: 60rem; }
.quote p { font-size: clamp(1.6rem, 1.2rem + 1.8vi, 2.8rem); font-weight: 550; letter-spacing: -0.03em; line-height: 1.15; text-wrap: balance; }
.quote footer { color: var(--gold); font-weight: 500; }
@media (max-width: 768px) {
  .mosaic, .m1 { grid-template-columns: 1fr; }
  .mosaic, .vals { gap: 0.75rem; }
  .emblem { inline-size: 7rem; block-size: 7rem; justify-self: start; }
  .r1 { inline-size: 4.5rem; block-size: 4.5rem; }
  .r2 { inline-size: 6.5rem; block-size: 6.5rem; }
}
</style>
