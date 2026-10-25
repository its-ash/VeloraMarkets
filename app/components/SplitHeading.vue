<script setup lang="ts">
const props = withDefaults(defineProps<{ text: string, as?: 'h1' | 'h2', accent?: string[], delay?: number }>(), { as: 'h1', accent: () => [], delay: 0 })

const words = computed(() => props.text.split(' ').map(w => ({ w, gold: props.accent.includes(w.replace(/[.,]/g, '')) })))
</script>

<template>
  <component :is="as" class="split" :aria-label="text">
    <template v-for="(x, i) in words" :key="i">
      <span class="split-word" aria-hidden="true"><span :class="{ gold: x.gold }" :style="{ animationDelay: `${delay + i * 70}ms` }">{{ x.w }}</span></span>{{ ' ' }}
    </template>
  </component>
</template>

<style scoped>
.split-word > span { animation: rise 1000ms var(--ease-out) both; }
</style>
