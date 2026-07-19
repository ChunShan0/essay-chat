<template>
  <div class="max-w-3xl mx-auto px-6 py-10">
    <!-- 返回按钮 -->
    <button
      @click="goBack"
      class="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors hover:gap-2.5"
      style="color: var(--color-text-tertiary)"
    >
      <span>←</span>
      <span>返回</span>
    </button>

    <!-- 加载中 -->
    <div v-if="status === 'pending'" class="py-20 text-center text-sm" style="color: var(--color-text-tertiary)">
      加载中...
    </div>

    <!-- 文章不存在 -->
    <div v-else-if="!data" class="py-20 text-center">
      <p class="font-serif text-2xl mb-2" style="color: var(--color-text)">文章不存在</p>
      <p class="text-sm" style="color: var(--color-text-tertiary)">可能链接有误或文章已删除</p>
      <NuxtLink to="/" class="inline-block mt-6 text-sm underline" style="color: var(--color-accent)">
        回到首页
      </NuxtLink>
    </div>

    <!-- 文章内容 -->
    <article v-else>
      <!-- 文章头部 -->
      <header class="mb-10">
        <h1 class="font-serif text-4xl font-semibold leading-tight mb-4" style="color: var(--color-text)">
          {{ data.title }}
        </h1>
        <div class="flex flex-wrap items-center gap-3 text-sm" style="color: var(--color-text-tertiary)">
          <time class="font-mono">{{ formatDate(data.writtenAt) }}</time>
          <span v-if="data.tags?.length">·</span>
          <div v-if="data.tags?.length" class="flex gap-1.5">
            <span
              v-for="tag in data.tags"
              :key="tag"
              class="text-xs px-2 py-0.5 rounded"
              style="background-color: var(--color-accent-light); color: var(--color-accent)"
            >{{ tag }}</span>
          </div>
        </div>
      </header>

      <!-- 正文 -->
      <div class="article-body">
        <ContentRenderer :value="data" />
      </div>

      <!-- 文章末尾 -->
      <footer class="mt-16 pt-8" style="border-top: 1px solid var(--color-border)">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-1.5 text-sm transition-colors hover:gap-2.5"
          style="color: var(--color-accent)"
        >
          <span>←</span>
          <span>回到首页</span>
        </NuxtLink>
      </footer>
    </article>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const slug = computed(() => {
  const s = route.params.slug
  if (Array.isArray(s)) return s.join('/')
  return s || ''
})

const { data, status } = await useAsyncData(`article-${slug.value}`, () =>
  queryContent().where({ _path: `/articles/${slug.value}` }).findOne()
)

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`
}
</script>
