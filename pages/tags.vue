<template>
  <div class="max-w-3xl mx-auto px-6 py-10">
    <header class="mb-10">
      <h1 class="font-serif text-3xl font-semibold mb-2" style="color: var(--color-text)">标签</h1>
      <p class="text-sm" style="color: var(--color-text-tertiary)">
        共 {{ allTags.length }} 个标签 · {{ totalCount }} 篇文章
      </p>
    </header>

    <!-- 标签云 -->
    <div v-if="allTags.length" class="flex flex-wrap gap-3 mb-12">
      <NuxtLink
        v-for="tag in allTags"
        :key="tag.name"
        :to="{ path: '/', query: { tag: tag.name } }"
        class="tag-card group flex items-center gap-2 px-4 py-2.5 rounded-xl"
        :style="tagCardStyle"
        :title="`查看 ${tag.count} 篇「${tag.name}」相关文章`"
      >
        <span class="font-medium tag-name" :style="{ fontSize: tagFontSize(tag.count), color: 'var(--color-text)' }">
          {{ tag.name }}
        </span>
        <span class="tag-count text-xs px-1.5 py-0.5 rounded-full font-mono">{{ tag.count }}</span>
      </NuxtLink>
    </div>

    <!-- 全部文章入口 -->
    <div class="pt-8" style="border-top: 1px solid var(--color-border)">
      <NuxtLink
        to="/"
        class="back-link inline-flex items-center gap-2 text-sm"
        style="color: var(--color-accent)"
      >
        <span class="back-arrow">←</span>
        <span>查看全部文章</span>
      </NuxtLink>
    </div>

    <!-- 空状态 -->
    <div v-if="!allTags.length && articles?.length" class="py-16 text-center text-sm" style="color: var(--color-text-tertiary)">
      文章暂无标签
    </div>
    <div v-if="!articles?.length" class="py-16 text-center text-sm" style="color: var(--color-text-tertiary)">
      还没有文章
    </div>
  </div>
</template>

<script setup>
const { data: articles } = await useAsyncData('tags-page-articles', () =>
  queryContent('articles')
    .where({ _draft: { $ne: true } })
    .only(['tags'])
    .find()
)

const allTags = computed(() => {
  const counts = {}
  articles.value?.forEach(a => a.tags?.forEach(t => {
    counts[t] = (counts[t] || 0) + 1
  }))
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

const totalCount = computed(() => {
  const set = new Set()
  articles.value?.forEach(a => a._path && set.add(a._path))
  return articles.value?.length || 0
})

// 根据文章数动态调整字号（标签云权重可视化）
function tagFontSize(count) {
  const max = allTags.value[0]?.count || 1
  const ratio = count / max
  if (ratio > 0.75) return '16px'
  if (ratio > 0.5) return '15px'
  if (ratio > 0.25) return '14px'
  return '13px'
}

const tagCardStyle = {
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)'
}

useHead({ title: '标签 - Essay' })
</script>

<style scoped>
/* 标签卡片：悬浮上浮 + 边框强调 + 阴影 */
.tag-card {
  transition: transform 0.35s var(--ease-out-expo), box-shadow 0.35s var(--ease-out-expo),
              border-color 0.3s ease, background-color 0.3s ease;
}
.tag-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-accent);
  box-shadow: 0 12px 24px -10px rgba(74, 107, 74, 0.22);
  background-color: var(--color-accent-light);
}

/* 标签名：悬浮变强调色 */
.tag-name {
  transition: color 0.3s ease;
}
.tag-card:hover .tag-name {
  color: var(--color-accent) !important;
}

/* 计数 badge：默认墨绿浅色，悬浮反色 */
.tag-count {
  background-color: var(--color-accent-light);
  color: var(--color-accent);
  transition: background-color 0.3s ease, color 0.3s ease;
}
.tag-card:hover .tag-count {
  background-color: var(--color-accent);
  color: white;
}

/* 返回链接：箭头位移 */
.back-link {
  transition: color 0.25s ease;
}
.back-arrow {
  display: inline-block;
  transition: transform 0.3s var(--ease-out-expo);
}
.back-link:hover .back-arrow {
  transform: translateX(-4px);
}
</style>
