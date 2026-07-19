<template>
  <div class="max-w-3xl mx-auto px-6 py-10">
    <header class="mb-10">
      <h1 class="font-serif text-3xl font-semibold mb-2" style="color: var(--color-text)">全部文章</h1>
      <p class="text-sm" style="color: var(--color-text-tertiary)">共 {{ articles?.length || 0 }} 篇</p>
    </header>

    <!-- 标签筛选 -->
    <div v-if="allTags.length" id="tag-filter" class="mb-8 flex flex-wrap items-center gap-2 scroll-mt-20">
      <button
        @click="selectTag('')"
        class="text-xs px-3 py-1.5 rounded-full transition-all duration-200"
        :style="!activeTag ? activeTagStyle : inactiveTagStyle"
      >全部 <span class="opacity-60">{{ articles?.length || 0 }}</span></button>
      <button
        v-for="tag in allTags"
        :key="tag.name"
        @click="selectTag(tag.name)"
        class="text-xs px-3 py-1.5 rounded-full transition-all duration-200"
        :style="activeTag === tag.name ? activeTagStyle : inactiveTagStyle"
      >{{ tag.name }} <span class="opacity-60">{{ tag.count }}</span></button>
    </div>

    <!-- 当前筛选状态 -->
    <div v-if="activeTag" class="mb-6 flex items-center gap-2 text-xs" style="color: var(--color-text-tertiary)">
      <span>当前筛选:{{ activeTag }}</span>
      <span>·</span>
      <span>{{ filteredArticles?.length || 0 }} 篇</span>
      <button @click="selectTag('')" class="underline hover:opacity-70" style="color: var(--color-accent)">清除</button>
    </div>

    <!-- 文章列表 -->
    <ul v-if="filteredArticles?.length" class="space-y-1">
      <li v-for="article in filteredArticles" :key="article._path">
        <NuxtLink
          :to="article._path"
          class="block py-5 px-4 -mx-4 rounded-xl transition-all duration-200 hover:shadow-sm"
          style="border-bottom: 1px solid var(--color-border)"
        >
          <div class="flex items-baseline gap-3 mb-1.5 flex-wrap">
            <time class="text-xs font-mono" style="color: var(--color-text-tertiary)">
              {{ formatDate(article.writtenAt) }}
            </time>
            <div v-if="article.tags?.length" class="flex gap-1.5 flex-wrap">
              <button
                v-for="tag in article.tags"
                :key="tag"
                @click.prevent="selectTag(tag)"
                class="text-[11px] px-1.5 py-0.5 rounded transition-all hover:scale-105 cursor-pointer"
                :style="activeTag === tag ? activeTagChipStyle : tagChipStyle"
              >{{ tag }}</button>
            </div>
          </div>
          <h2 class="font-serif text-xl font-medium mb-1.5" style="color: var(--color-text)">
            {{ article.title }}
          </h2>
          <p v-if="article.summary" class="text-sm leading-relaxed" style="color: var(--color-text-secondary)">
            {{ article.summary }}
          </p>
        </NuxtLink>
      </li>
    </ul>

    <div v-else-if="activeTag" class="py-16 text-center">
      <p class="text-sm mb-4" style="color: var(--color-text-tertiary)">没有标签为「{{ activeTag }}」的文章</p>
      <button @click="selectTag('')" class="text-xs px-3 py-1.5 rounded-full transition-all" :style="inactiveTagStyle">
        查看全部文章
      </button>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

// 从 URL query 初始化
const activeTag = ref(route.query.tag || '')

const { data: articles } = await useAsyncData('all-articles', () =>
  queryContent('articles')
    .where({ _draft: { $ne: true } })
    .sort({ writtenAt: -1 })
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

const filteredArticles = computed(() => {
  if (!activeTag.value) return articles.value
  return articles.value?.filter(a => a.tags?.includes(activeTag.value))
})

function selectTag(tag) {
  activeTag.value = tag
  router.replace({ query: tag ? { tag } : {} })
  if (import.meta.client) {
    const el = document.getElementById('tag-filter')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

watch(() => route.query.tag, (newTag) => {
  activeTag.value = newTag || ''
})

const activeTagStyle = {
  backgroundColor: 'var(--color-accent)',
  color: 'white'
}

const inactiveTagStyle = {
  backgroundColor: 'transparent',
  color: 'var(--color-text-secondary)',
  border: '1px solid var(--color-border)'
}

const tagChipStyle = {
  backgroundColor: 'var(--color-accent-light)',
  color: 'var(--color-accent)'
}

const activeTagChipStyle = {
  backgroundColor: 'var(--color-accent)',
  color: 'white'
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}.${m}.${day}`
}
</script>
