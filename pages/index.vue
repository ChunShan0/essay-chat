<template>
  <div class="max-w-3xl mx-auto px-6">
    <!-- Hero -->
    <section class="hero-enter pt-16 pb-12">
      <h1 class="font-serif text-5xl font-semibold tracking-tight" style="color: var(--color-text)">
        Essay
      </h1>
      <p class="mt-4 text-lg leading-relaxed max-w-xl" style="color: var(--color-text-secondary)">
        记录阅读、思考与游戏笔记。每一篇文章都是思维的一帧快照。
      </p>
      <div v-if="articles?.length" class="mt-8 flex gap-6 text-sm" style="color: var(--color-text-tertiary)">
        <span>{{ articles.length }} 篇文章</span>
        <span>·</span>
        <span>{{ allTags.length }} 个标签</span>
      </div>
    </section>

    <!-- 标签筛选条 -->
    <div v-if="allTags.length" id="tag-filter" class="pb-6 flex flex-wrap items-center gap-2 scroll-mt-20">
      <button
        @click="selectTag('')"
        class="filter-btn text-xs px-3 py-1.5 rounded-full"
        :style="!activeTag ? activeTagStyle : inactiveTagStyle"
      >
        全部 <span class="opacity-60">{{ articles?.length || 0 }}</span>
      </button>
      <button
        v-for="tag in allTags"
        :key="tag.name"
        @click="selectTag(tag.name)"
        class="filter-btn text-xs px-3 py-1.5 rounded-full"
        :style="activeTag === tag.name ? activeTagStyle : inactiveTagStyle"
      >
        {{ tag.name }} <span class="opacity-60">{{ tag.count }}</span>
      </button>
    </div>

    <!-- 当前筛选状态提示 -->
    <div v-if="activeTag" class="pb-4 flex items-center gap-2 text-xs" style="color: var(--color-text-tertiary)">
      <span>当前筛选:{{ activeTag }}</span>
      <span>·</span>
      <span>{{ filteredArticles?.length || 0 }} 篇</span>
      <button @click="selectTag('')" class="underline hover:opacity-70" style="color: var(--color-accent)">清除</button>
    </div>

    <!-- 文章列表 -->
    <section class="pb-16">
      <div v-if="status === 'pending'" class="py-12 text-center text-sm" style="color: var(--color-text-tertiary)">
        加载中...
      </div>
      <div v-else-if="error" class="py-12 text-center text-sm text-red-500">
        加载失败
      </div>
      <div v-else-if="!articles?.length" class="py-16 text-center">
        <p class="text-sm" style="color: var(--color-text-tertiary)">还没有文章，在 content/articles/ 下创建 .md 文件开始写作。</p>
      </div>
      <div v-else-if="filteredArticles?.length === 0" class="py-16 text-center">
        <p class="text-sm mb-4" style="color: var(--color-text-tertiary)">没有标签为「{{ activeTag }}」的文章</p>
        <button @click="selectTag('')" class="text-xs px-3 py-1.5 rounded-full transition-all" :style="inactiveTagStyle">
          查看全部文章
        </button>
      </div>
      <ul v-else class="space-y-1">
        <li v-for="article in filteredArticles" :key="article._path">
          <NuxtLink
            :to="article._path"
            class="article-item block py-5 px-4 -mx-4 rounded-xl"
          >
            <div class="flex items-baseline gap-3 mb-1.5 flex-wrap">
              <time class="text-xs font-mono tracking-wide" style="color: var(--color-text-tertiary)">
                {{ formatDate(article.writtenAt) }}
              </time>
              <div v-if="article.tags?.length" class="flex gap-1.5 flex-wrap">
                <button
                  v-for="tag in article.tags"
                  :key="tag"
                  @click.prevent="selectTag(tag)"
                  class="tag-chip text-[11px] px-1.5 py-0.5 rounded cursor-pointer"
                  :style="activeTag === tag ? activeTagChipStyle : tagChipStyle"
                >{{ tag }}</button>
              </div>
            </div>
            <h2 class="article-title font-serif text-xl font-medium mb-1.5">
              {{ article.title }}
            </h2>
            <p v-if="article.summary" class="article-summary text-sm leading-relaxed" style="color: var(--color-text-secondary)">
              {{ article.summary }}
            </p>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const { data: articles, status, error } = await useAsyncData('home-articles', () =>
  queryContent('articles')
    .where({ _draft: { $ne: true } })
    .sort({ writtenAt: -1 })
    .find()
)

// 从 URL query 初始化筛选标签（支持从标签云页跳转）
const activeTag = ref(route.query.tag || '')

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
  // 同步到 URL query（不刷新页面，支持分享和浏览器前进后退）
  router.replace({ query: tag ? { tag } : {} })
  // 平滑滚动到筛选条
  if (import.meta.client) {
    const el = document.getElementById('tag-filter')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

// 监听路由 query 变化（浏览器前进/后退时同步）
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

<style scoped>
/* Hero 区域淡入入场 */
.hero-enter {
  animation: heroFadeIn 0.7s var(--ease-out-expo) both;
}
@keyframes heroFadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 文章卡片：悬浮上浮 + 左侧强调线展开 + 背景泛起 */
.article-item {
  position: relative;
  border-bottom: 1px solid var(--color-border);
  transition: transform 0.35s var(--ease-out-expo), box-shadow 0.35s var(--ease-out-expo),
              background-color 0.3s ease;
}
.article-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 3px;
  height: 0;
  background-color: var(--color-accent);
  border-radius: 0 2px 2px 0;
  transform: translateY(-50%);
  transition: height 0.4s var(--ease-out-expo);
}
.article-item:hover {
  transform: translateY(-3px);
  background-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 10px 24px -10px rgba(74, 107, 74, 0.18), 0 3px 8px -4px rgba(0, 0, 0, 0.04);
  border-bottom-color: transparent;
}
.article-item:hover::before {
  height: 60%;
}

/* 标题：悬浮渐变到强调色 */
.article-title {
  color: var(--color-text);
  transition: color 0.3s var(--ease-smooth), transform 0.3s var(--ease-out-expo);
}
.article-item:hover .article-title {
  color: var(--color-accent);
}

/* 摘要：悬浮时颜色略加深，提升可读层级感 */
.article-summary {
  transition: color 0.3s ease;
}
.article-item:hover .article-summary {
  color: #4a4a4a;
}

/* 标签 chip：悬浮微放大 */
.tag-chip {
  transition: transform 0.25s var(--ease-spring), background-color 0.25s ease, color 0.25s ease;
}
.tag-chip:hover {
  transform: scale(1.1);
}

/* 筛选按钮：悬浮上浮 + 阴影 */
.filter-btn {
  transition: transform 0.3s var(--ease-out-expo), box-shadow 0.3s var(--ease-out-expo),
              background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease;
}
.filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px -4px rgba(74, 107, 74, 0.25);
}
.filter-btn:active {
  transform: translateY(0);
}
</style>
