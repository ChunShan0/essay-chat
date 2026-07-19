<template>
  <div class="max-w-3xl mx-auto px-6 py-10">
    <header class="mb-12">
      <h1 class="font-serif text-3xl font-semibold mb-2" style="color: var(--color-text)">时间轴</h1>
      <p class="text-sm" style="color: var(--color-text-tertiary)">按写作时间浏览所有文章</p>
    </header>

    <div v-if="status === 'pending'" class="text-center text-sm py-12" style="color: var(--color-text-tertiary)">
      加载中...
    </div>

    <div v-else class="space-y-12">
      <section v-for="{ year, articles: yearArticles } in yearGroups" :key="year">
        <h2 class="font-serif text-3xl font-light mb-6" style="color: var(--color-text-tertiary)">
          {{ year }}
        </h2>
        <div class="border-l-2 pl-8 space-y-8" style="border-color: var(--color-border)">
          <div v-for="article in yearArticles" :key="article._path" class="timeline-item relative">
            <div
              class="timeline-dot absolute -left-[41px] top-1.5 w-3 h-3 rounded-full"
              style="background-color: var(--color-accent); border: 3px solid var(--color-bg)"
            />
            <time class="text-xs font-mono mb-1 block" style="color: var(--color-text-tertiary)">
              {{ formatMonthDay(article.writtenAt) }}
            </time>
            <h3 class="font-serif text-lg font-medium mb-1" style="color: var(--color-text)">
              <NuxtLink :to="article._path" class="timeline-title">
                {{ article.title }}
              </NuxtLink>
            </h3>
            <p v-if="article.summary" class="text-sm mb-2" style="color: var(--color-text-secondary)">
              {{ article.summary }}
            </p>
            <div v-if="article.tags?.length" class="flex gap-1.5 flex-wrap mt-2">
              <NuxtLink
                v-for="tag in article.tags"
                :key="tag"
                :to="{ path: '/', query: { tag } }"
                class="timeline-tag text-[11px] px-1.5 py-0.5 rounded"
                style="background-color: var(--color-accent-light); color: var(--color-accent)"
              >{{ tag }}</NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
const { data: articles, status } = await useAsyncData('timeline-articles', () =>
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
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}
</script>

<style scoped>
/* 时间轴圆点：悬浮整个条目时放大 + 发光 */
.timeline-dot {
  transition: transform 0.35s var(--ease-spring), box-shadow 0.35s var(--ease-out-expo);
}
.timeline-item:hover .timeline-dot {
  transform: scale(1.4);
  box-shadow: 0 0 0 4px rgba(74, 107, 74, 0.15), 0 0 12px 2px rgba(74, 107, 74, 0.35);
}

/* 标题：悬浮颜色过渡到强调色 + 轻微右移 */
.timeline-title {
  transition: color 0.3s var(--ease-smooth);
  display: inline-block;
}
.timeline-item:hover .timeline-title {
  color: var(--color-accent);
}

/* 标签：悬浮微放大 + 背景加深 */
.timeline-tag {
  transition: transform 0.25s var(--ease-spring), background-color 0.25s ease;
  display: inline-block;
}
.timeline-tag:hover {
  transform: scale(1.12);
  background-color: var(--color-accent) !important;
  color: white !important;
}
</style>
