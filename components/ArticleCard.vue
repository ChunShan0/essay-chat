<template>
  <article class="group">
    <time class="text-xs text-neutral-400">{{ formattedDate }}</time>
    <h2 class="mt-1 text-xl font-medium text-neutral-900">
      <NuxtLink :to="path" class="hover:text-neutral-600 transition-colors">
        {{ title }}
      </NuxtLink>
    </h2>
    <p v-if="summary" class="mt-2 text-sm text-neutral-500 leading-relaxed">
      {{ summary }}
    </p>
    <div v-if="tags?.length" class="mt-3 flex gap-2">
      <span
        v-for="tag in tags"
        :key="tag"
        class="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded"
      >{{ tag }}</span>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  path: { type: String, required: true },
  date: { type: String, default: '' },
  summary: { type: String, default: '' },
  tags: { type: Array, default: () => [] }
})

const formattedDate = computed(() => {
  if (!props.date) return ''
  const d = new Date(props.date)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
})
</script>
