<script setup lang="ts">
const props = withDefaults(defineProps<{ text: string, accent?: string, delay?: number }>(), { accent: '', delay: 150 })

// Abstract market rhythm for the pulse strip. Decorative only, no quotes and no numbers.
const BARS = [38, 58, 44, 72, 50, 86, 62, 94, 66, 78, 54, 88, 70, 96, 74, 60, 84, 56, 76, 68, 90, 64, 80, 48]

const words = computed(() => {
  let i = 0
  return props.text.split(' ').filter(Boolean).map(w => ({
    acc: !!props.accent && w.replace(/[.,]/g, '') === props.accent,
    chars: [...w].map(c => ({ c, i: i++ })),
  }))
})

const lines = computed(() => {
  const ws = words.value
  const mark = ws.findIndex(w => w.chars.at(-1)?.c === ',')
  return mark > 0 && mark < ws.length - 1 ? [ws.slice(0, mark + 1), ws.slice(mark + 1)] : [ws]
})
</script>

<template>
  <div class="ht-wrap" :style="{ '--base': `${delay}ms` }">
    <h1 class="ht" :aria-label="text">
      <span v-for="(line, li) in lines" :key="li" class="ln" :style="{ '--li': li }">
        <template v-for="(w, wi) in line" :key="wi">
          <span class="w" :class="{ acc: w.acc }" aria-hidden="true"><span v-for="ch in w.chars" :key="ch.i" class="c" :style="{ '--ci': ch.i }">{{ ch.c }}</span></span>{{ ' ' }}
        </template>
      </span>
    </h1>

    <div class="tape" aria-hidden="true">
      <span class="rule" />
      <span v-for="(h, i) in BARS" :key="i" class="bar" :style="{ '--h': `${h}%`, '--i': i }" />
      <span class="scan" />
    </div>
  </div>
</template>

<style scoped>
/* Display size tracks both axes: inline (vi) and viewport height (dvh). The two-line
   lockup grows until whichever dimension runs out first, so it always fills the hero
   without pushing the lede or the CTAs out of it. */
.ht-wrap {
  --fs: clamp(2rem, min(6.1vi, 11dvh), 7.5rem);
  display: grid;
  justify-items: center;
  gap: clamp(0.9rem, 0.4rem + 1.4dvh, 1.75rem);
  inline-size: 100%;
}

.ht {
  font-family: var(--display);
  font-weight: 700;
  font-size: var(--fs);
  line-height: 1.02;
  letter-spacing: -0.04em;
  text-wrap: balance;
  text-align: center;
  font-optical-sizing: auto;
  text-shadow: 0 0.06em 0.7em oklch(0.83 0.165 84 / 0.16);
}
.ln { display: block; overflow: clip; padding-block: 0.14em 0.16em; margin-block: -0.14em -0.16em; }
/* perspective in em so the 3D flip keeps the same character at every display size,
   from 2rem on a phone to 7.5rem on a desktop. */
.w { display: inline-block; white-space: nowrap; position: relative; padding-block-end: 0.06em; perspective: 6.8em; }

.c {
  display: inline-block;
  transform-origin: 50% 100%;
  animation: char-in 900ms var(--ease-out) both;
  animation-delay: calc(var(--base) + var(--li) * 90ms + var(--ci) * 26ms);
  transition: translate 420ms var(--ease-out);
}

.acc .c {
  color: var(--gold);
  background: linear-gradient(100deg, #c98a04 0%, #f2bb16 32%, #fff3cd 48%, #f2bb16 64%, #c98a04 100%);
  background-size: 800% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: char-in 900ms var(--ease-out) both, shimmer 6s linear infinite;
  animation-delay: calc(var(--base) + var(--li) * 90ms + var(--ci) * 26ms), calc(var(--base) + 1200ms);
}
.acc::after {
  content: '';
  position: absolute;
  inset: auto 0 -0.01em;
  block-size: 0.055em;
  border-radius: 1em;
  background: var(--gold-grad);
  box-shadow: 0 0 0.6em oklch(0.83 0.165 84 / 0.5);
  transform-origin: 50% 50%;
  animation: rule-in 900ms var(--ease-out) both;
  animation-delay: calc(var(--base) + 1100ms);
}

@media (hover: hover) and (pointer: fine) {
  .w:hover .c { translate: 0 -0.07em; }
}

/* Market pulse: abstract candle rhythm under the headline, like a chart waking up. */
.tape {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: clamp(0.22rem, 0.14rem + 0.5vi, 0.45rem);
  inline-size: fit-content;
  max-inline-size: 100%;
  block-size: clamp(1.4rem, min(1.1rem + 1.2vi, 4.5dvh), 2.6rem);
  mask-image: linear-gradient(90deg, transparent, #000 13%, #000 87%, transparent);
}
.rule {
  position: absolute;
  inset: auto 0 0;
  block-size: 1px;
  background: linear-gradient(90deg, transparent, oklch(0.83 0.165 84 / 0.65) 22%, oklch(0.83 0.165 84 / 0.65) 78%, transparent);
  transform-origin: 50% 50%;
  animation: rule-in 1000ms var(--ease-out) both;
  animation-delay: calc(var(--base) + 700ms);
}
.bar {
  --o: 0.5;
  inline-size: clamp(0.2rem, 0.12rem + 0.35vi, 0.34rem);
  block-size: var(--h);
  border-radius: 1px;
  background: var(--gold-grad);
  opacity: var(--o);
  transform-origin: 50% 100%;
  animation: bar-in 780ms var(--ease-out) both;
  animation-delay: calc(var(--base) + 780ms + var(--i) * 30ms);
}
.bar:nth-child(4n) { --o: 0.82; box-shadow: 0 0 0.5rem oklch(0.83 0.165 84 / 0.45); }
.bar:nth-child(5n) { --o: 0.28; }
.bar:nth-child(7n) { --o: 0.95; }
.scan {
  position: absolute;
  inset: -40% auto -40% 0;
  inline-size: clamp(1.8rem, 1rem + 5vi, 4rem);
  background: linear-gradient(90deg, transparent, oklch(0.83 0.165 84 / 0.5), transparent);
  filter: blur(6px);
  opacity: 0;
  animation: tape-scan 6.5s linear infinite;
  animation-delay: calc(var(--base) + 1300ms);
}

@keyframes char-in {
  from { opacity: 0; transform: translateY(0.9em) rotateX(-70deg); }
  to { opacity: 1; transform: none; }
}
@keyframes shimmer {
  from { background-position: 100% 0; }
  to { background-position: 0% 0; }
}
@keyframes rule-in {
  from { scale: 0 1; }
  to { scale: 1 1; }
}
@keyframes bar-in {
  from { scale: 1 0; opacity: 0; }
  to { scale: 1 1; opacity: var(--o); }
}
@keyframes tape-scan {
  0% { translate: -160% 0; opacity: 0; }
  18%, 82% { opacity: 1; }
  100% { translate: 900% 0; opacity: 0; }
}
</style>
