<template>
  <div class="max-w-2xl mx-auto px-6 py-12">
    <header class="mb-12">
      <NuxtLink to="/" class="text-sm text-neutral-400 hover:text-neutral-700">&larr; 首页</NuxtLink>
      <h1 class="mt-4 text-3xl font-medium text-neutral-900">全部文章</h1>
    </header>

    <div class="mb-8 flex flex-wrap gap-2">
      <button
        v-for="tag in allTags"
        :key="tag"
        @click="activeTag = activeTag === tag ? '' : tag"
        :class="[
          'text-xs px-3 py-1 rounded-full transition-colors',
          activeTag === tag
            ? 'bg-neutral-900 text-white'
            : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
        ]"
      >{{ tag }}</button>
    </div>

    <ul class="space-y-10">
      <li v-for="article in filteredArticles" :key="article._path">
        <article>
          <time class="text-xs text-neutral-400">{{ formatDate(article.writtenAt) }}</time>
          <h2 class="mt-1 text-xl font-medium text-neutral-900">
            <NuxtLink :to="article._path" class="hover:text-neutral-600 transition-colors">
              {{ article.title }}
            </NuxtLink>
          </h2>
          <p class="mt-2 text-sm text-neutral-500 leading-relaxed">
            {{ article.summary || article.description }}
          </p>
        </article>
      </li>
    </ul>
  </div>
</template>

<script setup>
const activeTag = ref('')

const { data: articles } = await useAsyncData('all-articles', () =>
  queryContent('articles')
    .where({ _draft: { $ne: true } })
    .sort({ writtenAt: -1 })
    .find()
)

const allTags = computed(() => {
  const tags = new Set()
  articles.value?.forEach(a => a.tags?.forEach(t => tags.add(t)))
  return [...tags]
})

const filteredArticles = computed(() => {
  if (!activeTag.value) return articles.value
  return articles.value?.filter(a => a.tags?.includes(activeTag.value))
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}
</script>
