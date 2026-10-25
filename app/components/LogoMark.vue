<script setup lang="ts">
defineProps<{ size?: string }>()
</script>

<template>
  <span class="logo" :style="{ '--h': size ?? '2rem' }">
    <img :src="asset('logo.png')" alt="Velora Markets" width="1774" height="887" decoding="async">
  </span>
</template>

<style scoped>
.logo { display: block; block-size: var(--h); inline-size: calc(var(--h) * 3.547); overflow: hidden; flex: none; }
.logo img { block-size: calc(var(--h) * 1.971); inline-size: auto; max-inline-size: none; margin-block-start: calc(var(--h) * -0.507); margin-inline-start: calc(var(--h) * -0.2); }
</style>
