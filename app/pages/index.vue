<script setup lang="ts">
import {
  PhArrowRight, PhLightning, PhShieldCheck, PhDesktop, PhDeviceMobile, PhGlobe, PhHeadset,
  PhUserPlus, PhIdentificationCard, PhWallet, PhChartLineUp, PhLockKey, PhCheck,
} from '@phosphor-icons/vue'
import { SIGNUP_URL, DEMO_URL, faqs, payments, pairs, pairGroups } from '~/data/site'

usePageSeo({
  title: 'Forex Broker with Raw Spreads on nTrader',
  description: 'Trade 20 forex pairs on nTrader with Valora Markets. Raw spreads from 0.0 pips, leverage up to 1:500, segregated funds and 24/5 human support.',
  path: '/',
  faq: faqs,
})

const stats = [
  { to: 0, decimals: 1, suffix: ' pips', label: 'Raw spreads from' },
  { to: 500, prefix: '1:', label: 'Leverage up to' },
  { to: pairs.length, label: 'Currency pairs' },
  { to: 24, suffix: '/5', label: 'Human support' },
]

const tools = [
  'One-click trading and depth of market',
  'Built-in indicators and drawing tools',
  'Automated strategies and copy trading',
  'Price alerts on desktop, web and phone',
]

const steps = [
  { icon: PhUserPlus, t: 'Register', d: 'Fill in one short form. It takes about three minutes.' },
  { icon: PhIdentificationCard, t: 'Verify', d: 'Upload a photo ID and a proof of address from your phone.' },
  { icon: PhWallet, t: 'Fund', d: 'Deposit by card, bank transfer, e-wallet or crypto.' },
  { icon: PhChartLineUp, t: 'Trade', d: 'Log in to nTrader and place your first order.' },
]

const payName: Record<string, string> = { visa: 'Visa', mastercard: 'Mastercard', paypal: 'PayPal', applepay: 'Apple Pay', googlepay: 'Google Pay', wise: 'Wise', bitcoin: 'Bitcoin', ethereum: 'Ethereum', tether: 'Tether' }
</script>

<template>
  <div>
    <section class="hero">
      <div class="glow-bg" aria-hidden="true">
        <span class="orb o1" /><span class="orb o2" />
      </div>
      <div class="scene-slot"><HeroScene /></div>
      <div class="veil" aria-hidden="true" />
      <div class="hud" aria-hidden="true" />
      <div class="wrap hero-in">
        <p class="eyebrow" style="animation: fade-up 700ms var(--ease-out) both">nTrader only</p>
        <HeroTitle text="Forex trading, built on nTrader alone." accent="nTrader" :delay="150" />
        <p class="lede" style="animation: fade-up 900ms var(--ease-out) 520ms both">
          Raw spreads from 0.0 pips, fast execution and one platform tuned end to end on desktop, web and mobile.
        </p>
        <div class="ctas" style="animation: fade-up 900ms var(--ease-out) 680ms both">
          <a v-magnetic :href="SIGNUP_URL" class="btn btn-gold btn-lg">Open account <PhArrowRight :size="18" /></a>
          <a :href="DEMO_URL" class="btn btn-ghost btn-lg">Try demo</a>
        </div>
      </div>
    </section>

    <div class="tape">
      <MqlWidget type="ticker" :symbols="[...pairGroups.Majors, ...pairGroups.Minors]" :height="60" label="Live forex quotes ticker" marquee bare />
    </div>

    <section class="section stats-sec">
      <ul v-reveal="'stagger'" class="wrap stats">
        <li v-for="s in stats" :key="s.label" class="stat">
          <p class="lbl">{{ s.label }}</p>
          <CountUp class="num" :to="s.to" :decimals="s.decimals" :prefix="s.prefix" :suffix="s.suffix" />
        </li>
      </ul>
    </section>

    <section class="section">
      <div class="wrap show">
        <div v-reveal="'left'" class="stack">
          <h2>One platform, tuned for every trade</h2>
          <p class="lede">We build pricing, risk and support around nTrader only. You get one fast stack instead of three average ones.</p>
          <ul v-reveal="'stagger'" class="ticks">
            <li v-for="t in tools" :key="t"><PhCheck :size="18" weight="bold" class="gold" />{{ t }}</li>
          </ul>
          <NuxtLink to="/platform" class="btn more">Explore nTrader <PhArrowRight :size="18" /></NuxtLink>
        </div>
        <div v-reveal="'right'" class="chart-box">
          <MqlWidget type="chart" :symbols="['EURUSD']" :height="440" label="EUR/USD live chart" />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div v-reveal class="head">
          <h2>Why traders move to Valora</h2>
        </div>
        <div v-reveal="'stagger'" class="bento">
          <article v-spotlight class="panel spot glow cell a" style="--i: 0">
            <span class="shine" aria-hidden="true" />
            <div class="hero-icon" aria-hidden="true">
              <span class="ring r1" /><span class="ring r2" />
              <span class="icon-chip icon-chip-lg"><PhLightning :size="34" weight="duotone" /></span>
            </div>
            <div class="cell-in">
              <h3>No dealing desk, no re-quotes</h3>
              <p class="muted">Orders route straight to our liquidity providers. No dealing desk stands between you and the price.</p>
            </div>
          </article>
          <article v-spotlight class="panel spot glow cell b" style="--i: 1">
            <span class="shine" aria-hidden="true" />
            <span class="icon-chip"><PhShieldCheck :size="22" weight="duotone" /></span>
            <h3>Segregated funds</h3>
            <p class="muted">Client money sits in separate accounts at tier-one banks.</p>
          </article>
          <article v-spotlight class="panel spot glow cell c" style="--i: 2">
            <span class="shine" aria-hidden="true" />
            <div class="devices">
              <span class="icon-chip" style="--i: 0"><PhDesktop :size="22" weight="duotone" /></span>
              <span class="icon-chip" style="--i: 1"><PhGlobe :size="22" weight="duotone" /></span>
              <span class="icon-chip" style="--i: 2"><PhDeviceMobile :size="22" weight="duotone" /></span>
            </div>
            <h3>Every screen</h3>
            <p class="muted">Desktop, web and mobile share one account and one watchlist.</p>
          </article>
          <article v-spotlight class="panel spot glow cell d" style="--i: 3">
            <span class="shine" aria-hidden="true" />
            <span class="icon-chip"><PhLockKey :size="22" weight="duotone" /></span>
            <div class="stack">
              <h3>Negative balance protection</h3>
              <p class="muted">A fast market can never leave you owing more than your account balance.</p>
            </div>
          </article>
          <article v-spotlight class="panel spot glow cell e" style="--i: 4">
            <span class="shine" aria-hidden="true" />
            <span class="icon-chip icon-chip-lg"><PhHeadset :size="30" weight="duotone" /></span>
            <div class="stack">
              <h3>Talk to a person, not a bot</h3>
              <p class="muted">Our support desk answers live chat, email and phone 24 hours a day from Monday to Friday.</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div v-reveal class="head">
          <h2>Pick the account that fits how you trade</h2>
          <p class="lede">All three run on nTrader with the same tools. Only the pricing model changes.</p>
        </div>
        <div v-reveal>
          <AccountTabs />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <h2 v-reveal class="head">From sign-up to first trade</h2>
        <ol v-reveal="'stagger'" class="steps">
          <li v-for="(s, i) in steps" :key="s.t" class="panel glow step" :style="{ '--i': i }">
            <span class="shine" aria-hidden="true" />
            <span class="icon-chip icon-chip-lg"><component :is="s.icon" :size="30" weight="duotone" /></span>
            <h3>{{ s.t }}</h3>
            <p class="muted">{{ s.d }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="section pay-sec">
      <div class="wrap">
        <h2 v-reveal class="pay-title">Deposit and withdraw your way</h2>
        <ul v-reveal="'stagger'" class="pay">
          <li v-for="p in payments" :key="p">
            <span class="logo" :style="{ maskImage: `url(${asset(`pay/${p}.svg`)})` }" role="img" :aria-label="payName[p]" />
          </li>
        </ul>
      </div>
    </section>

    <section class="section">
      <div class="wrap faq-wrap">
        <div v-reveal class="stack faq-head">
          <p class="eyebrow">Questions</p>
          <h2>Before you open an account</h2>
          <NuxtLink to="/contact" class="btn more">Ask our team <PhArrowRight :size="18" /></NuxtLink>
        </div>
        <FaqList :items="faqs" />
      </div>
    </section>

    <CtaBand />
  </div>
</template>

<style scoped>
.hero { position: relative; min-block-size: 100dvh; display: grid; align-items: center; overflow: hidden; padding-block: calc(var(--nav-h) + 2rem) 4rem; isolation: isolate; }
.scene-slot { position: absolute; inset: 0; }
.glow-bg { position: absolute; inset: 0; z-index: -1; pointer-events: none; background: radial-gradient(55% 45% at 50% 42%, rgb(255 248 63 / 0.12), transparent 70%), radial-gradient(70% 35% at 50% 100%, rgb(232 220 26 / 0.1), transparent 70%); }
.orb { position: absolute; border-radius: 50%; animation: glow-pulse 11s var(--ease-in-out) infinite, drift 26s var(--ease-in-out) infinite alternate; }
.o1 { inset: 10% auto auto -8%; inline-size: 30vmax; aspect-ratio: 1; background: radial-gradient(closest-side, rgb(255 248 63 / 0.14), transparent); }
.o2 { inset: 10% -8% auto auto; inline-size: 30vmax; aspect-ratio: 1; background: radial-gradient(closest-side, rgb(232 220 26 / 0.12), transparent); animation-delay: -4s, -10s; }
.hud { position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(to bottom, oklch(1 0 0 / 0.025) 0 1px, transparent 1px 4px), radial-gradient(120% 100% at 50% 50%, transparent 55%, oklch(0.08 0.004 85 / 0.7)); }
.veil { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(38% 30% at 50% 50%, oklch(0.12 0.004 85 / 0.6), oklch(0.12 0.004 85 / 0.15) 70%, transparent), linear-gradient(to top, var(--bg) 2%, transparent 26%); }
.hero-in { position: relative; display: grid; justify-items: center; text-align: center; gap: 1.5rem; max-inline-size: var(--wrap); margin-inline: auto; }
.hero-in > * { max-inline-size: 44rem; }
.hero-in > .lede { margin-inline: auto; }
.hero-in > .ht-wrap { max-inline-size: 100%; }
.hero-in .ctas { justify-content: center; }
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .hero-in { animation: hero-out linear both; animation-timeline: view(); animation-range: exit 0% exit 80%; }
  }
}
@keyframes hero-out { to { opacity: 0; translate: 0 -3rem; scale: 0.96; } }
.ctas { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-block-start: 0.5rem; }

.tape { background: transparent; }

.stats-sec { padding-block: clamp(3rem, 2rem + 3vi, 5rem); }
.stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px; background: var(--line); border-radius: var(--r); overflow: hidden; border: 1px solid var(--line); }
.stat { background: var(--bg); padding: clamp(1.25rem, 1rem + 1.5vi, 2.25rem); display: grid; gap: 0.5rem; }
.lbl { color: var(--faint); font-size: 0.9rem; }
.num { font-size: clamp(2rem, 1.4rem + 2vi, 3.25rem); letter-spacing: -0.04em; color: var(--text); }

.show { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: clamp(2rem, 1rem + 4vi, 5rem); align-items: center; }
.ticks { display: grid; gap: 0.75rem; }
.ticks li { display: flex; gap: 0.75rem; align-items: center; }
.more { justify-self: start; }
.chart-box { border-radius: var(--r); overflow: hidden; box-shadow: var(--shadow); }

.bento { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-auto-rows: minmax(14rem, auto); gap: 1rem; }
.cell { padding: 1.6rem; display: grid; gap: 0.75rem; align-content: start; }
.cell h3 { margin-block-start: 0.5rem; }
.a { grid-column: span 2; grid-row: span 2; align-content: space-between; min-block-size: 30rem; background: radial-gradient(90% 70% at 50% 30%, oklch(0.83 0.165 84 / 0.14), transparent 70%), var(--bg-2); }
.hero-icon { position: relative; display: grid; place-items: center; block-size: 16rem; }
.ring { position: absolute; border-radius: 50%; border: 1px dashed oklch(0.83 0.165 84 / 0.35); animation: orbit 18s linear infinite; }
.r1 { inline-size: 9rem; block-size: 9rem; }
.r2 { inline-size: 14rem; block-size: 14rem; border-style: solid; border-color: oklch(0.83 0.165 84 / 0.15); animation-duration: 28s; animation-direction: reverse; }
.ring::after { content: ''; position: absolute; inset-block-start: -4px; inset-inline-start: 50%; inline-size: 8px; block-size: 8px; border-radius: 50%; background: var(--gold); box-shadow: 0 0 12px var(--gold); }
.cell-in { display: grid; gap: 0.75rem; }
.b { background: linear-gradient(150deg, oklch(0.83 0.165 84 / 0.16), var(--bg-2) 65%); }
.devices { display: flex; gap: 0.6rem; }
.d { grid-column: span 2; grid-template-columns: auto 1fr; align-items: start; background: repeating-linear-gradient(135deg, oklch(0.83 0.165 84 / 0.04) 0 2px, transparent 2px 14px), var(--bg-2); }
.d h3 { margin: 0; }
.e { grid-column: 1 / -1; grid-template-columns: auto 1fr; align-items: center; gap: 1.5rem; background: linear-gradient(90deg, oklch(0.83 0.165 84 / 0.1), var(--bg-2) 45%); }
.e h3 { margin: 0; }

.steps { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; counter-reset: step; }
.step { padding: 1.75rem; display: grid; gap: 0.9rem; align-content: start; counter-increment: step; }
.step::before { content: counter(step, decimal-leading-zero); position: absolute; inset: 1.25rem 1.5rem auto auto; font-family: var(--mono); font-size: 0.85rem; color: var(--faint); }
.step h3 { margin-block-start: 0.5rem; }

.pay-sec { padding-block: clamp(3rem, 2rem + 3vi, 5rem); }
.pay-title { font-size: clamp(1.4rem, 1.2rem + 1vi, 2rem); margin-block-end: 2rem; }
.pay { display: flex; flex-wrap: wrap; gap: clamp(1.5rem, 1rem + 3vi, 3.5rem); align-items: center; }
.logo { display: block; inline-size: 2.5rem; block-size: 2.5rem; background: var(--muted); mask-size: contain; mask-repeat: no-repeat; mask-position: center; transition: background-color 250ms ease, scale 250ms var(--ease-out); }
.pay li:hover .logo { background: var(--gold); scale: 1.12; }

.faq-wrap { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: clamp(2rem, 1rem + 4vi, 5rem); align-items: start; }
.faq-head { position: sticky; inset-block-start: calc(var(--nav-h) + 2rem); }

@keyframes orbit { to { rotate: 360deg; } }

@media (max-width: 1024px) {
  .bento { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .a { grid-column: 1 / -1; grid-row: span 1; min-block-size: 24rem; }
  .d { grid-column: 1 / -1; }
  .steps { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 768px) {
  /* Mobile hero: scene stays full-bleed and the copy sits in the centre, as on desktop. */
  .hero { align-items: center; padding-block: calc(var(--nav-h) + 1rem) 2.5rem; }
  .hero-in { gap: 1.15rem; }
  .veil {
    background:
      radial-gradient(85% 42% at 50% 50%, oklch(0.12 0.004 85 / 0.82), oklch(0.12 0.004 85 / 0.35) 70%, transparent),
      linear-gradient(to top, var(--bg) 4%, transparent 28%);
  }
  .ctas .btn { flex: 1; }
  .stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .show, .faq-wrap { grid-template-columns: 1fr; }
  .faq-head { position: static; }
  .bento, .steps { grid-template-columns: 1fr; }
  .a, .b, .c, .d, .e { grid-column: 1; }
  .bento, .steps { gap: 0.75rem; }
  .bento { grid-auto-rows: auto; }
  .a { min-block-size: 0; }
  .hero-icon { block-size: 7.5rem; }
  .r1 { inline-size: 5rem; block-size: 5rem; }
  .r2 { inline-size: 7rem; block-size: 7rem; }
  .d, .e { grid-template-columns: 1fr; }
}
</style>
