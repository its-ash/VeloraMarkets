<script setup lang="ts">
import { RISK_WARNING, COMPANY, CONTACT_EMAIL } from '~/data/site'

usePageSeo({
  title: 'Legal: Risk Disclosure, Terms and Privacy',
  description: 'Read the Velora Markets risk disclosure, terms of business, privacy policy and anti-money laundering policy before you trade forex on nTrader.',
  path: '/legal',
  crumb: 'Legal',
})

const docs = [
  {
    id: 'risk',
    t: 'Risk disclosure',
    p: [
      RISK_WARNING,
      'Prices can move quickly, especially around economic releases and at the weekly open. Stop-loss orders limit risk but cannot guarantee execution at your chosen price in a fast market.',
      'Past performance is not a reliable guide to future results. Only trade with money you can afford to lose.',
    ],
  },
  {
    id: 'terms',
    t: 'Terms of business',
    p: [
      `These terms govern the relationship between you and ${COMPANY}. By opening an account you confirm that you have read and accepted them.`,
      'All trading takes place on the nTrader platform. We may reject or cancel orders placed at prices that are clearly wrong due to a technical error.',
      'You are responsible for keeping your log-in details private and for all activity on your account.',
    ],
  },
  {
    id: 'privacy',
    t: 'Privacy policy',
    p: [
      'We collect the personal data needed to open and run your account, meet our legal duties and keep your account secure.',
      'We never sell your data. We share it only with service providers who help us run the business, and with authorities when the law requires it.',
      `You can ask to see, correct or delete your data at any time by writing to ${CONTACT_EMAIL}.`,
    ],
  },
  {
    id: 'aml',
    t: 'AML policy',
    p: [
      'We verify the identity of every client before the first deposit and monitor accounts for unusual activity.',
      'Withdrawals go back to the same method and the same name used to deposit, wherever possible.',
      'We report suspicious transactions to the relevant authorities and may freeze accounts while we investigate.',
    ],
  },
]

const active = ref('risk')
let io: IntersectionObserver | undefined
onMounted(() => {
  io = new IntersectionObserver(es => {
    const v = es.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
    if (v) active.value = v.target.id
  }, { rootMargin: '-30% 0px -60% 0px' })
  docs.forEach(d => { const el = document.getElementById(d.id); if (el) io!.observe(el) })
})
onBeforeUnmount(() => io?.disconnect())
</script>

<template>
  <div>
    <PageHero title="Legal and policies" lede="The documents that govern your account. Please read them before you trade." />

    <section class="section top0">
      <div class="wrap layout">
        <nav class="toc" aria-label="Legal sections">
          <a v-for="d in docs" :key="d.id" :href="`#${d.id}`" class="toc-a" :aria-current="active === d.id ? 'true' : undefined">{{ d.t }}</a>
        </nav>
        <div class="docs">
          <article v-for="d in docs" :id="d.id" :key="d.id" v-reveal class="doc">
            <h2>{{ d.t }}</h2>
            <p v-for="(x, i) in d.p" :key="i">{{ x }}</p>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.top0 { padding-block-start: 0; }
.layout { display: grid; grid-template-columns: 15rem minmax(0, 1fr); gap: clamp(2rem, 1rem + 4vi, 5rem); align-items: start; }
.toc { position: sticky; inset-block-start: calc(var(--nav-h) + 1.5rem); display: grid; gap: 0.25rem; border-inline-start: 1px solid var(--line); }
.toc-a { padding: 0.6rem 1rem; color: var(--muted); border-inline-start: 2px solid transparent; margin-inline-start: -1px; transition: color 200ms ease, border-color 250ms var(--ease-out); }
.toc-a:hover { color: var(--text); }
.toc-a[aria-current] { color: var(--gold); border-color: var(--gold); }
.docs { display: grid; gap: 4rem; max-inline-size: 68ch; }
.doc { display: grid; gap: 1rem; scroll-margin-top: calc(var(--nav-h) + 1.5rem); }
.doc h2 { font-size: clamp(1.6rem, 1.3rem + 1vi, 2.2rem); }
.doc p { color: var(--muted); }
@media (max-width: 768px) {
  .layout { grid-template-columns: 1fr; }
  .toc { position: static; display: flex; overflow-x: auto; border: 0; border-block-end: 1px solid var(--line); scrollbar-width: none; }
  .toc-a { white-space: nowrap; border-inline-start: 0; border-block-end: 2px solid transparent; margin: 0 0 -1px; }
}
</style>
