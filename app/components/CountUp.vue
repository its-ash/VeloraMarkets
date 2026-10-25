<script setup lang="ts">
const props = withDefaults(defineProps<{ to: number, decimals?: number, prefix?: string, suffix?: string, ms?: number }>(), { decimals: 0, prefix: '', suffix: '', ms: 1600 })

const el = ref<HTMLElement>()
const val = ref(props.to)
const fmt = (v: number) => `${props.prefix}${v.toLocaleString('en-US', { minimumFractionDigits: props.decimals, maximumFractionDigits: props.decimals })}${props.suffix}`

let io: IntersectionObserver | undefined
let raf = 0

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  val.value = 0
  io = new IntersectionObserver(([e]) => {
    if (!e?.isIntersecting) return
    io?.disconnect()
    const t0 = performance.now()
    const step = (now: number) => {
      const k = Math.min((now - t0) / props.ms, 1)
      val.value = props.to * (1 - (1 - k) ** 4)
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
  }, { threshold: 0.6 })
  if (el.value) io.observe(el.value)
})

onBeforeUnmount(() => { io?.disconnect(); cancelAnimationFrame(raf) })
</script>

<template>
  <span ref="el" class="mono count"><span class="sr-only">{{ fmt(to) }}</span><span aria-hidden="true">{{ fmt(val) }}</span></span>
</template>

<style scoped>
.count { font-variant-numeric: tabular-nums; }
</style>
