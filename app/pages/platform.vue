<script setup lang="ts">
import {
  PhArrowRight, PhDesktop, PhGlobe, PhDeviceMobile, PhLightning, PhChartBar, PhRobot,
  PhBell, PhStack, PhUsersThree, PhCheck, PhAppleLogo, PhGooglePlayLogo,
} from '@phosphor-icons/vue'
import { DEMO_URL, WEB_TRADER_URL, PORTAL_URL, IOS_URL, ANDROID_URL, pairGroups } from '~/data/site'

usePageSeo({
  title: 'nTrader Platform for Desktop, Web and Mobile',
  description: 'Trade forex on nTrader: one-click execution, advanced charts, automated strategies, copy trading and depth of market on desktop, web, iOS and Android.',
  path: '/platform',
  crumb: 'nTrader platform',
})

const devices = [
  { icon: PhDesktop, name: 'nTrader Desktop', body: 'Detachable charts across several monitors, hotkeys for every order type and full depth of market.', pts: ['Windows and macOS', 'Multi-monitor layouts', 'Custom hotkeys'], links: [{ label: 'Download desktop', href: `${PORTAL_URL}/downloads`, icon: PhArrowRight }] },
  { icon: PhGlobe, name: 'nTrader Web', body: 'The full platform in your browser. No install, no plugins, and your layouts follow you between devices.', pts: ['Runs in any modern browser', 'Synced workspaces', 'Same order tools as desktop'], links: [{ label: 'Launch web app', href: WEB_TRADER_URL, icon: PhArrowRight }] },
  { icon: PhDeviceMobile, name: 'nTrader Mobile', body: 'Open, edit and close positions with one thumb. Price alerts arrive as push notifications.', pts: ['iOS and Android', 'Biometric log in', 'Charts with drawing tools'], links: [{ label: 'App Store', href: IOS_URL, icon: PhAppleLogo }, { label: 'Google Play', href: ANDROID_URL, icon: PhGooglePlayLogo }] },
]

const features = [
  { icon: PhLightning, t: 'One-click execution', d: 'Send market and pending orders from the chart, the watchlist or depth of market.' },
  { icon: PhChartBar, t: 'Advanced charting', d: 'Multiple chart types, timeframes from one minute to monthly and a full set of drawing tools.' },
  { icon: PhRobot, t: 'Automated strategies', d: 'Build trading robots and custom indicators, then backtest them on historical tick data.' },
  { icon: PhUsersThree, t: 'Copy trading', d: 'Follow strategy providers inside nTrader and set your own risk limits per strategy.' },
  { icon: PhBell, t: 'Smart alerts', d: 'Price, indicator and margin alerts by push, email or in-platform pop-up.' },
  { icon: PhStack, t: 'Depth of market', d: 'See the available volume at each price level before you send an order.' },
]
</script>

<template>
  <div>
    <PageHero title="nTrader is the only platform we run" :accent="['nTrader']" lede="We put all our engineering into one platform. That means faster fixes, better pricing and support staff who know every button.">
      <div class="row">
        <a v-magnetic :href="DEMO_URL" class="btn btn-gold btn-lg">Try demo <PhArrowRight :size="18" /></a>
        <a :href="WEB_TRADER_URL" class="btn btn-ghost btn-lg">Launch web app</a>
      </div>
    </PageHero>

    <section class="section board-sec">
      <div class="wrap board">
        <div v-reveal="'scale'" class="frame">
          <MqlWidget type="chart" :symbols="['GBPUSD']" :height="440" label="GBP/USD live chart" />
        </div>
        <div v-reveal="'right'" class="frame">
          <MqlWidget type="overview" :symbols="pairGroups.Majors" :height="440" label="Live quotes for major currency pairs" />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <h2 v-reveal class="head">One account, three ways in</h2>
        <div v-reveal="'stagger'" class="devs">
          <article v-for="(d, i) in devices" :key="d.name" v-spotlight class="panel spot glow dev" :style="{ '--i': i }">
            <span class="shine" aria-hidden="true" />
            <div class="dev-icon" aria-hidden="true">
              <span class="halo" />
              <span class="icon-chip icon-chip-lg"><component :is="d.icon" :size="34" weight="duotone" /></span>
            </div>
            <h3>{{ d.name }}</h3>
            <p class="muted">{{ d.body }}</p>
            <ul class="pts">
              <li v-for="p in d.pts" :key="p"><PhCheck :size="16" weight="bold" class="gold" />{{ p }}</li>
            </ul>
            <div class="dev-links">
              <a v-for="l in d.links" :key="l.href" :href="l.href" class="btn" target="_blank" rel="noopener">{{ l.label }} <component :is="l.icon" :size="18" /></a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div v-reveal class="head">
          <h2>Tools that come with every account</h2>
          <p class="lede">Standard, Raw and Pro accounts all get the full nTrader feature set at no extra cost.</p>
        </div>
        <ul v-reveal="'stagger'" class="feats">
          <li v-for="(f, i) in features" :key="f.t" class="panel glow feat" :style="{ '--i': i }">
            <span class="shine" aria-hidden="true" />
            <span class="icon-chip"><component :is="f.icon" :size="22" weight="duotone" /></span>
            <div>
              <h3>{{ f.t }}</h3>
              <p class="muted">{{ f.d }}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <CtaBand title="See nTrader with live prices" body="Open an account and get every nTrader tool from day one. A free demo is ready if you want to practise first." />
  </div>
</template>

<style scoped>
.row { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-block-start: 0.5rem; }
.board-sec { padding-block-start: 0; }
.board { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 1rem; }
.frame { border-radius: var(--r); overflow: hidden; }

.devs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.dev { padding: clamp(1.5rem, 1rem + 1.5vi, 2.25rem); display: grid; gap: 1rem; align-content: start; }
.dev-links { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-block-start: 0.5rem; }
.dev-icon { position: relative; display: grid; place-items: center; block-size: 8rem; margin-block-end: 0.5rem; }
.halo { position: absolute; inline-size: 8rem; aspect-ratio: 1; border-radius: 50%; background: radial-gradient(closest-side, oklch(0.83 0.165 84 / 0.28), transparent); animation: glow-pulse 5s var(--ease-in-out) infinite; animation-delay: calc(var(--i) * -1.2s); }
.pts { display: grid; gap: 0.5rem; }
.pts li { display: flex; gap: 0.6rem; align-items: center; font-size: 0.95rem; }

.feats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.feat { display: grid; grid-template-columns: auto 1fr; gap: 1.25rem; padding: 1.5rem; }
.feat h3 { margin-block-end: 0.35rem; }

@media (max-width: 1024px) {
  .board, .devs { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .row .btn { flex: 1; }
  .devs, .feats { gap: 0.75rem; }
  .feats { grid-template-columns: 1fr; }
  .dev-icon { block-size: 4.5rem; justify-items: start; margin-block-end: 0; }
  .halo { inline-size: 4.5rem; inset-inline-start: -0.75rem; }
  .pts li { font-size: 0.88rem; }
  .dev .btn { min-block-size: 2.6rem; font-size: 0.9rem; }
  .feat { grid-template-columns: auto 1fr; gap: 0.9rem; }
}
</style>
