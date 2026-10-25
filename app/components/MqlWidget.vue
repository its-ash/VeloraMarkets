<script setup lang="ts">
import { MQL5_WIDGET } from '~/data/site'

const props = withDefaults(defineProps<{
  type: 'ticker' | 'overview' | 'chart'
  symbols: string[]
  height?: number
  period?: string
  label: string
  marquee?: boolean
  bare?: boolean
}>(), { height: 400, period: 'H1', marquee: false, bare: false })

const MARQUEE_W = 1800
const LOAD_TIMEOUT_MS = 8000

const boxes = ref<HTMLDivElement[]>([])
const state = ref<'loading' | 'ready' | 'error'>('loading')
const uid = useId()
const copies = computed(() => (props.marquee ? 2 : 1))

let mo: MutationObserver | undefined
let timer: ReturnType<typeof setTimeout> | undefined

const mount = () => {
  if (!boxes.value.length) return
  state.value = 'loading'
  mo?.disconnect()
  clearTimeout(timer)
  mo = new MutationObserver(() => {
    if (boxes.value.some(b => b.childElementCount > 2 || (b.firstElementChild?.childElementCount ?? 0) > 0)) {
      state.value = 'ready'
      clearTimeout(timer)
      mo?.disconnect()
    }
  })

  boxes.value.forEach((host, n) => {
    host.replaceChildren()
    const id = `mql5-${props.type}-${uid}-${n}`
    const target = document.createElement('div')
    target.id = id
    const script = document.createElement('script')
    script.async = true
    script.type = 'text/javascript'
    script.dataset.type = MQL5_WIDGET.dataType
    script.src = MQL5_WIDGET.src
    script.textContent = JSON.stringify({
      type: props.type,
      filter: props.symbols.join(','),
      period: props.period,
      width: props.marquee ? MARQUEE_W : '100%',
      height: props.height,
      theme: MQL5_WIDGET.theme,
      id,
    })
    script.onerror = () => { state.value = 'error' }
    mo!.observe(host, { childList: true, subtree: true })
    host.append(target, script)
  })

  timer = setTimeout(() => { if (state.value === 'loading') state.value = 'ready' }, LOAD_TIMEOUT_MS)
}

onMounted(mount)
watch(() => [props.type, props.symbols.join(','), props.period], () => nextTick(mount))
onBeforeUnmount(() => { mo?.disconnect(); clearTimeout(timer) })
</script>

<template>
  <div class="mql" :data-state="state" :data-marquee="marquee || undefined" :style="{ '--h': `${height}px`, '--w': `${MARQUEE_W}px` }" role="region" :aria-label="label" :aria-busy="state === 'loading'">
    <div class="track">
      <div
        v-for="n in copies"
        :key="n"
        ref="boxes"
        class="frame"
        :data-dark="MQL5_WIDGET.forceDark || undefined"
        :data-bare="bare || undefined"
        :aria-hidden="n > 1 || undefined"
      />
    </div>
    <div v-if="state === 'loading'" class="skeleton" aria-hidden="true">
      <span v-for="i in (type === 'ticker' ? 1 : 5)" :key="i" class="bar" :style="{ '--i': i }" />
    </div>
    <p v-else-if="state === 'error'" class="err" role="status">Live quotes cannot load right now. Open nTrader to see real-time prices.</p>
  </div>
</template>

<style scoped>
.mql { position: relative; min-block-size: var(--h); overflow: hidden; }
.frame { min-block-size: var(--h); border-radius: var(--r-sm); overflow: hidden; color-scheme: dark; transition: opacity 500ms var(--ease-out); }
.frame[data-dark] { filter: invert(0.93) hue-rotate(180deg) saturate(1.1); }
.frame[data-bare] { border-radius: 0; filter: invert(1) hue-rotate(180deg) saturate(1.2); mix-blend-mode: screen; }
.frame :deep(iframe), .frame > :deep(div), .frame > :deep(div > div) { border: 0 !important; outline: 0 !important; box-shadow: none !important; border-radius: 0 !important; background: transparent !important; }
.frame :deep(iframe) { display: block; inline-size: calc(100% + 4px) !important; max-inline-size: none; margin: -2px !important; }
.mql[data-state='loading'] .frame, .mql[data-state='error'] .frame { opacity: 0; }

.mql[data-marquee] .track { display: flex; inline-size: max-content; animation: rtl 60s linear infinite; }
.mql[data-marquee] .frame { flex: none; inline-size: var(--w); }
.mql[data-marquee]:hover .track, .mql[data-marquee]:focus-within .track { animation-play-state: paused; }
.mql[data-marquee]::before, .mql[data-marquee]::after { content: ''; position: absolute; inset-block: 0; inline-size: 6rem; z-index: 1; pointer-events: none; }
.mql[data-marquee]::before { inset-inline-start: 0; background: linear-gradient(90deg, var(--bg), transparent); }
.mql[data-marquee]::after { inset-inline-end: 0; background: linear-gradient(-90deg, var(--bg), transparent); }

.skeleton { position: absolute; inset: 0; display: grid; align-content: center; gap: 0.75rem; padding: 1rem; pointer-events: none; }
.bar { block-size: max(0.9rem, calc(var(--h) / 9)); border-radius: var(--r-sm); background: linear-gradient(90deg, var(--surface) 0%, var(--surface-2) 40%, var(--surface) 80%); background-size: 300% 100%; animation: shimmer 1.4s linear infinite; animation-delay: calc(var(--i) * 90ms); }
.err { position: absolute; inset: 0; display: grid; place-items: center; padding: 1rem; text-align: center; color: var(--muted); font-size: 0.92rem; }

@keyframes rtl { from { translate: 0 0; } to { translate: -50% 0; } }
@keyframes shimmer { from { background-position: 100% 0; } to { background-position: -200% 0; } }
@media (prefers-reduced-motion: reduce) {
  .mql[data-marquee] .track { animation: none; }
}
</style>
