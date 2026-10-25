<script setup lang="ts">
import { PhPlus } from '@phosphor-icons/vue'

defineProps<{ items: { q: string, a: string }[], group?: string }>()
</script>

<template>
  <div v-reveal="'stagger'" class="list">
    <details v-for="(f, i) in items" :key="f.q" class="faq" :name="group ?? 'faq'" :open="i === 0">
      <summary>{{ f.q }}<PhPlus :size="20" weight="bold" /></summary>
      <p>{{ f.a }}</p>
    </details>
  </div>
</template>
