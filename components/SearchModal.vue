<template>
  <Teleport to="body">
    <Transition name="search-modal">
      <div v-if="open" class="search-overlay" @click.self="close">
        <div class="search-modal" role="dialog" aria-modal="true" aria-label="搜索文章">
          <!-- 搜索框 -->
          <div class="search-input-wrap">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              placeholder="搜索文章标题、摘要、标签..."
              class="search-input"
              @keydown="onKeydown"
            />
            <button v-if="query" class="search-clear" @click="query = ''" aria-label="清除">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <kbd class="search-kbd">ESC</kbd>
          </div>

          <!-- 搜索结果 -->
          <div class="search-results" ref="resultsRef">
            <!-- 空状态(未输入) -->
            <div v-if="!query.trim()" class="search-empty">
              <p class="search-empty-text">输入关键词搜索文章</p>
              <p class="search-empty-hint">支持标题、摘要、标签匹配</p>
            </div>

            <!-- 加载中 -->
            <div v-else-if="loading" class="search-loading">
              <p class="search-loading-text">加载中...</p>
            </div>

            <!-- 无结果 -->
            <div v-else-if="results.length === 0" class="search-no-result">
              <p class="search-no-result-text">没有找到「{{ query }}」相关的文章</p>
            </div>

            <!-- 结果列表 -->
            <ul v-else class="search-result-list">
              <li v-for="(item, index) in results" :key="item.article._path">
                <a
                  :href="item.article._path"
                  class="search-result-item"
                  :class="{ active: index === activeIndex }"
                  @click="onSelect(item.article._path)"
                  @mousemove="activeIndex = index"
                >
                  <div class="result-row">
                    <time class="result-date">{{ formatDate(item.article.writtenAt) }}</time>
                    <div v-if="item.article.tags?.length" class="result-tags">
                      <span
                        v-for="tag in item.article.tags"
                        :key="tag"
                        class="result-tag"
                        v-html="highlight(tag, item.keywords)"
                      ></span>
                    </div>
                  </div>
                  <h3 class="result-title" v-html="highlight(item.article.title, item.keywords)"></h3>
                  <p v-if="item.article.summary" class="result-summary" v-html="highlight(item.article.summary, item.keywords)"></p>
                </a>
              </li>
            </ul>
          </div>

          <!-- 底部快捷键提示 -->
          <div class="search-footer">
            <div class="search-footer-left">
              <span class="search-footer-item"><kbd>↑</kbd><kbd>↓</kbd> 导航</span>
              <span class="search-footer-item"><kbd>↵</kbd> 打开</span>
              <span class="search-footer-item"><kbd>esc</kbd> 关闭</span>
            </div>
            <span class="search-footer-count">{{ query.trim() ? `${results.length} 个结果` : `${articles.length} 篇文章` }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  open: { type: Boolean, default: false }
})
const emit = defineEmits(['close'])

const { articles, loaded, ensureLoaded, search, highlight } = useSearch()

const query = ref('')
const activeIndex = ref(0)
const inputRef = ref(null)
const resultsRef = ref(null)
const loading = ref(false)

// 搜索结果(实时计算)
const results = computed(() => {
  if (!query.value.trim() || !loaded.value) return []
  return search(query.value)
})

// 监听弹窗打开:加载数据 + 聚焦输入框
watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    query.value = ''
    activeIndex.value = 0
    // 加载数据
    if (!loaded.value) {
      loading.value = true
      await ensureLoaded()
      loading.value = false
    }
    // 等待 DOM 渲染后聚焦
    await nextTick()
    inputRef.value?.focus()
  }
})

// 监听查询变化:重置选中项
watch(query, () => {
  activeIndex.value = 0
})

// 键盘导航
function onKeydown(e) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, results.value.length - 1)
    scrollIntoView()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
    scrollIntoView()
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (results.value[activeIndex.value]) {
      onSelect(results.value[activeIndex.value].article._path)
    }
  } else if (e.key === 'Escape') {
    e.preventDefault()
    close()
  }
}

// 滚动选中项到可视区域
function scrollIntoView() {
  nextTick(() => {
    const list = resultsRef.value
    if (!list) return
    const items = list.querySelectorAll('.search-result-item')
    const active = items[activeIndex.value]
    if (active) {
      active.scrollIntoView({ block: 'nearest' })
    }
  })
}

function onSelect(path) {
  close()
  navigateTo(path)
}

function close() {
  emit('close')
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
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: rgba(28, 28, 28, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 12vh;
  padding-left: 1rem;
  padding-right: 1rem;
}

.search-modal {
  width: 100%;
  max-width: 640px;
  background-color: var(--color-surface);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 75vh;
}

/* 搜索框 */
.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
}

.search-icon {
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  color: var(--color-text);
  font-family: var(--font-sans);
}

.search-input::placeholder {
  color: var(--color-text-tertiary);
}

.search-clear {
  border: none;
  background: none;
  cursor: pointer;
  color: var(--color-text-tertiary);
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s;
}
.search-clear:hover {
  color: var(--color-text);
}

.search-kbd {
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.7rem;
  padding: 0.15rem 0.4rem;
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-tertiary);
}

/* 结果区 */
.search-results {
  flex: 1;
  overflow-y: auto;
  min-height: 120px;
}

.search-result-list {
  list-style: none;
  padding: 0.5rem;
  margin: 0;
}

.search-result-item {
  display: block;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.12s;
}

.search-result-item.active {
  background-color: var(--color-accent-light);
}

.result-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.result-date {
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.7rem;
  color: var(--color-text-tertiary);
}

.result-tags {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.result-tag {
  font-size: 0.65rem;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  background-color: var(--color-accent-light);
  color: var(--color-accent);
}

.result-title {
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text);
  margin: 0 0 0.25rem 0;
  line-height: 1.4;
}

.result-summary {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 高亮匹配词 */
:deep(mark) {
  background-color: transparent;
  color: var(--color-accent);
  font-weight: 600;
}

/* 空状态 / 无结果 */
.search-empty,
.search-loading,
.search-no-result {
  padding: 2.5rem 1.25rem;
  text-align: center;
}

.search-empty-text,
.search-loading-text,
.search-no-result-text {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0 0 0.25rem 0;
}

.search-empty-hint {
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  margin: 0;
}

/* 底部 */
.search-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1.25rem;
  border-top: 1px solid var(--color-border);
  background-color: var(--color-bg);
  font-size: 0.7rem;
  color: var(--color-text-tertiary);
}

.search-footer-left {
  display: flex;
  gap: 1rem;
}

.search-footer-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.search-footer kbd {
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.65rem;
  padding: 0.1rem 0.3rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 3px;
  color: var(--color-text-secondary);
}

.search-footer-count {
  font-family: 'JetBrains Mono', 'Consolas', monospace;
}

/* 过渡动画 */
.search-modal-enter-active,
.search-modal-leave-active {
  transition: opacity 0.2s ease;
}
.search-modal-enter-active .search-modal,
.search-modal-leave-active .search-modal {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.search-modal-enter-from,
.search-modal-leave-to {
  opacity: 0;
}
.search-modal-enter-from .search-modal,
.search-modal-leave-to .search-modal {
  transform: translateY(-12px) scale(0.98);
  opacity: 0;
}

/* 响应式 */
@media (max-width: 640px) {
  .search-overlay {
    padding-top: 6vh;
  }
  .search-modal {
    max-height: 85vh;
  }
  .search-footer-left {
    gap: 0.5rem;
  }
}
</style>
