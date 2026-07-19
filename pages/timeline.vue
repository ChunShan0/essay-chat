<template>
  <div class="max-w-2xl mx-auto px-6 py-12">
    <header class="mb-12">
      <NuxtLink to="/" class="text-sm text-neutral-400 hover:text-neutral-700">&larr; 首页</NuxtLink>
      <h1 class="mt-4 text-3xl font-medium text-neutral-900">时间轴</h1>
      <p class="mt-2 text-sm text-neutral-500">按写作时间浏览所有文章</p>
    </header>

    <div v-if="status === 'pending'" class="text-neutral-400 text-sm">加载中...</div>
    <div v-else-if="error" class="text-red-500 text-sm">加载失败</div>

    <div v-else class="space-y-12">
      <section v-for="{ year, articles: yearArticles } in yearGroups" :key="year">
        <h2 class="text-2xl font-medium text-neutral-300 mb-5">{{ year }}</h2>
        <div class="border-l-2 border-neutral-100 pl-6 space-y-8">
          <div v-for="article in yearArticles" :key="article._path" class="relative">
            <div class="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-neutral-300" />
            <time class="text-xs text-neutral-400">{{ formatMonthDay(article.writtenAt) }}</time>
            <h3 class="mt-1 text-lg font-medium text-neutral-900">
              <NuxtLink :to="article._path" class="hover:text-neutral-600 transition-colors">
                {{ article.title }}
              </NuxtLink>
            </h3>
            <p class="mt-1 text-sm text-neutral-500">{{ article.summary || article.description }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
const { data: articles, status, error } = await useAsyncData('timeline-articles', () =>
  queryContent('articles')
    .where({ _draft: { $ne: true } })
    .sort({ writtenAt: -1 })
    .find()
)

const yearGroups = computed(() => {
  const groups = {}
  articles.value?.forEach(a => {
    const year = new Date(a.writtenAt).getFullYear()
    if (!groups[year]) groups[year] = []
    groups[year].push(a)
  })
  return Object.entries(groups).map(([year, arts]) => ({ year, articles: arts }))
})

function formatMonthDay(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}
</script>
