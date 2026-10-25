<script setup lang="ts">
const props = withDefaults(defineProps<{ text: string, accent?: string, delay?: number }>(), { accent: '', delay: 150 })

const words = computed(() => {
  let ci = 0
  return props.text.split(' ').map((w) => {
    const acc = !!props.accent && w.replace(/[.,]/g, '') === props.accent
    return { acc, chars: [...w].map((c, li) => ({ c, ci: ci++, li })) }
  })
})
</script>

<template>
  <h1 class="ht" :aria-label="text" :style="{ '--base': `${delay}ms` }">
    <template v-for="(w, wi) in words" :key="wi">
      <span class="w" :class="{ acc: w.acc }" aria-hidden="true"><span v-for="ch in w.chars" :key="ch.ci" class="c" :style="{ '--ci': ch.ci, '--li': ch.li }">{{ ch.c }}</span></span>{{ ' ' }}
    </template>
  </h1>
</template>

<style scoped>
.ht { font-family: var(--display); font-weight: 700; font-size: clamp(2.1rem, 1rem + 4vi, 4.4rem); line-height: 1.08; letter-spacing: -0.035em; perspective: 900px; text-wrap: balance; text-align: center; }
.w { display: inline-block; white-space: nowrap; position: relative; padding-block-end: 0.12em; }
.acc::after { inset: auto 0 -0.02em; }
.c {
  display: inline-block;
  transform-origin: 50% 100%;
  animation: char-in 1000ms var(--ease-out) both;
  animation-delay: calc(var(--base) + var(--ci) * 32ms);
  transition: translate 420ms var(--ease-out), color 300ms ease;
  transition-delay: calc(var(--li) * 22ms);
}
.acc .c {
  color: var(--gold);
  background: linear-gradient(100deg, #c98a04 0%, #f2bb16 30%, #fff1c4 45%, #f2bb16 60%, #c98a04 100%);
  background-size: 900% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: char-in 1000ms var(--ease-out) both, shimmer 5s linear infinite;
  animation-delay: calc(var(--base) + var(--ci) * 32ms), calc(var(--li) * -110ms);
}
.acc::after {
  content: '';
  position: absolute;
  inset: auto 0 0;
  block-size: 0.07em;
  border-radius: 1em;
  background: var(--gold-grad);
  transform-origin: 50% 50%;
  animation: line-in 900ms var(--ease-out) both;
  animation-delay: calc(var(--base) + 1100ms);
}
@media (hover: hover) and (pointer: fine) {
  .w:hover .c { translate: 0 -0.08em; }
}
@keyframes char-in {
  from { opacity: 0; transform: translateY(0.55em) rotateX(-85deg) scale(0.9); filter: blur(10px); }
  60% { opacity: 1; filter: blur(0); }
  to { opacity: 1; transform: none; filter: none; }
}
@keyframes shimmer {
  from { background-position: 100% 0; }
  to { background-position: 0% 0; }
}
@keyframes line-in {
  from { scale: 0 1; }
  to { scale: 1 1; }
}
</style>
