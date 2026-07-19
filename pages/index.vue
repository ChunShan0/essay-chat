<template>
  <div class="max-w-2xl mx-auto px-6 py-12">
    <header class="mb-16">
      <h1 class="text-4xl font-medium tracking-tight text-neutral-900">
        Essay · 随笔画像
      </h1>
      <p class="mt-4 text-lg text-neutral-500 leading-relaxed">
        记录阅读、思考和游戏笔记。每一篇文章都是思维的一帧快照。
      </p>
      <nav class="mt-6 flex gap-6 text-sm">
        <NuxtLink to="/" class="text-neutral-900 border-b-2 border-neutral-900 pb-0.5">文章</NuxtLink>
        <NuxtLink to="/timeline" class="text-neutral-400 hover:text-neutral-700 transition-colors">时间轴</NuxtLink>
        <NuxtLink to="/about" class="text-neutral-400 hover:text-neutral-700 transition-colors">关于</NuxtLink>
      </nav>
    </header>

    <section>
      <div v-if="status === 'pending'" class="text-neutral-400 text-sm">加载中...</div>
      <div v-else-if="error" class="text-red-500 text-sm">加载失败：{{ error }}</div>
      <ul v-else class="space-y-10">
        <li v-for="article in articles" :key="article._path">
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
            <div v-if="article.tags?.length" class="mt-3 flex gap-2">
              <span
                v-for="tag in article.tags"
                :key="tag"
                class="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded"
              >{{ tag }}</span>
            </div>
          </article>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
const { data: articles, status, error } = await useAsyncData('home-articles', () =>
  queryContent('articles')
    .where({ _draft: { $ne: true } })
    .sort({ writtenAt: -1 })
    .find()
)

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}
</script>
