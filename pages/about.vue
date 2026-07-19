<template>
  <div class="max-w-2xl mx-auto px-6 py-12">
    <header class="mb-10">
      <NuxtLink to="/" class="text-sm text-neutral-400 hover:text-neutral-700">&larr; 首页</NuxtLink>
    </header>

    <ContentRenderer v-if="data" :value="data" />

    <div v-else class="text-neutral-400 text-sm">加载中...</div>
  </div>
</template>

<script setup>
const { data } = await useAsyncData('about', () =>
  queryContent('about').findOne()
)
</script>
