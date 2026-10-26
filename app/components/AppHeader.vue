<script setup lang="ts">
import { PhList, PhX, PhArrowUpRight } from '@phosphor-icons/vue'
import { nav, SIGNUP_URL, LOGIN_URL } from '~/data/site'

const route = useRoute()
const solid = ref(false)
const open = ref(false)
const dlg = ref<HTMLDialogElement>()
const sentinel = ref<HTMLElement>()
const links = ref<HTMLElement>()
const ink = reactive({ x: 0, w: 0, on: false })

let io: IntersectionObserver | undefined

onMounted(() => {
  io = new IntersectionObserver(([e]) => { solid.value = !e!.isIntersecting })
  if (sentinel.value) io.observe(sentinel.value)
})
onBeforeUnmount(() => io?.disconnect())

const show = () => { dlg.value?.showModal(); open.value = true }
const hide = () => { dlg.value?.close(); open.value = false }

watch(() => route.path, hide)

const hover = (e: PointerEvent | FocusEvent) => {
  const t = e.currentTarget as HTMLElement
  const p = links.value!.getBoundingClientRect()
  const r = t.getBoundingClientRect()
  Object.assign(ink, { x: r.left - p.left, w: r.width, on: true })
}
</script>

<template>
  <div ref="sentinel" class="sentinel" aria-hidden="true" />
  <header class="bar" :data-solid="solid || undefined">
    <div class="wrap row">
      <NuxtLink to="/" class="brand" aria-label="Valora Markets home">
        <LogoMark size="1.9rem" />
      </NuxtLink>

      <nav aria-label="Primary" class="desk">
        <div ref="links" class="links" @pointerleave="ink.on = false">
          <span class="ink" :style="{ translate: `${ink.x}px 0`, inlineSize: `${ink.w}px`, opacity: ink.on ? 1 : 0 }" aria-hidden="true" />
          <ul class="lst">
            <li v-for="l in nav" :key="l.to">
              <NuxtLink :to="l.to" class="link" @pointerenter="hover" @focus="hover" @blur="ink.on = false">{{ l.label }}</NuxtLink>
            </li>
          </ul>
        </div>
      </nav>

      <div class="cta desk">
        <a :href="LOGIN_URL" class="btn btn-sm">Log in</a>
        <a v-magnetic="0.2" :href="SIGNUP_URL" class="btn btn-sm btn-gold">Open account</a>
      </div>

      <button class="burger" type="button" aria-label="Open menu" :aria-expanded="open" aria-controls="mnav" @click="show">
        <PhList :size="26" />
      </button>
    </div>
  </header>

  <dialog id="mnav" ref="dlg" class="sheet" aria-label="Menu" @close="open = false" @click.self="hide">
    <div class="sheet-in">
      <div class="sheet-top">
        <LogoMark size="1.75rem" />
        <button class="burger" type="button" aria-label="Close menu" @click="hide"><PhX :size="26" /></button>
      </div>
      <ul class="mlinks">
        <li v-for="(l, i) in nav" :key="l.to" :style="{ '--i': i }">
          <NuxtLink :to="l.to" class="mlink">
            {{ l.label }}<PhArrowUpRight :size="22" />
          </NuxtLink>
        </li>
      </ul>
      <div class="mcta">
        <a :href="SIGNUP_URL" class="btn btn-gold btn-lg">Open account</a>
        <a :href="LOGIN_URL" class="btn btn-lg">Log in</a>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.sentinel { position: absolute; inset: 0 0 auto; block-size: 3rem; pointer-events: none; }
.bar {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  block-size: var(--nav-h);
  display: flex;
  align-items: center;
  border-block-end: 1px solid transparent;
  transition: background-color 300ms ease, border-color 300ms ease, backdrop-filter 300ms ease;
}
.bar[data-solid] { background: oklch(0.12 0.004 85 / 0.72); backdrop-filter: blur(16px) saturate(1.3); border-color: var(--line); }
@media (prefers-reduced-transparency: reduce) { .bar[data-solid] { background: var(--bg); backdrop-filter: none; } }

.row { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; }
.brand { display: flex; align-items: center; min-block-size: 2.75rem; }

.links { position: relative; }
.lst { position: relative; display: flex; gap: 0.25rem; }
.ink { position: absolute; inset-block: 0; inset-inline-start: 0; border-radius: var(--r-sm); background: var(--surface); transition: translate 280ms var(--ease-out), inline-size 280ms var(--ease-out), opacity 200ms ease; pointer-events: none; }
.link { position: relative; display: flex; align-items: center; min-block-size: 2.5rem; padding: 0 0.95rem; border-radius: var(--r-sm); color: var(--muted); font-weight: 500; font-size: 0.95rem; transition: color 200ms ease; }
.link:hover, .link.router-link-active { color: var(--text); }
.link.router-link-active::after { content: ''; position: absolute; inset: auto 0.95rem 0.3rem; block-size: 2px; border-radius: 2px; background: var(--gold); }
.cta { display: flex; gap: 0.6rem; }

.burger { display: none; place-items: center; inline-size: 2.9rem; block-size: 2.9rem; border-radius: var(--r-sm); border: 1px solid var(--line); background: var(--bg-2); cursor: pointer; }

.sheet {
  inset: 0;
  inline-size: 100%;
  max-inline-size: none;
  block-size: 100dvh;
  max-block-size: none;
  border: 0;
  background: var(--bg);
  color: var(--text);
  opacity: 0;
  translate: 0 -1.5rem;
  transition: opacity 260ms var(--ease-out), translate 340ms var(--ease-drawer), display 340ms allow-discrete, overlay 340ms allow-discrete;
}
.sheet[open] { opacity: 1; translate: 0 0; }
@starting-style { .sheet[open] { opacity: 0; translate: 0 -1.5rem; } }
.sheet::backdrop { background: oklch(0.1 0.01 85 / 0.6); }
.sheet-in { display: flex; flex-direction: column; gap: 2rem; min-block-size: 100%; padding: 0.9rem var(--gutter) max(2rem, env(safe-area-inset-bottom)); }
.sheet-top { display: flex; align-items: center; justify-content: space-between; min-block-size: 3rem; }
.mlinks { display: grid; }
.mlinks li { border-block-end: 1px solid var(--line); }
.sheet[open] .mlinks li { animation: fade-up 520ms var(--ease-out) both; animation-delay: calc(var(--i) * 55ms + 80ms); }
.mlink { display: flex; align-items: center; justify-content: space-between; padding: 1.1rem 0; font-size: 1.9rem; font-weight: 600; letter-spacing: -0.03em; }
.mlink svg { color: var(--gold); }
.mlink.router-link-active { color: var(--gold); }
.mcta { display: grid; gap: 0.75rem; margin-block-start: auto; }

@media (max-width: 1100px) {
  .desk { display: none; }
  .burger { display: grid; }
}
</style>
