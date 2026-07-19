<template>
  <header class="sticky top-0 z-50 backdrop-blur-md header-bar" style="background-color: rgba(250, 249, 247, 0.85); border-bottom: 1px solid var(--color-border)">
    <div class="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2 group logo-link">
        <span class="logo-badge">
          E
        </span>
        <span class="font-serif text-base font-medium tracking-tight logo-text">
          Essay
        </span>
      </NuxtLink>
      <nav class="flex items-center gap-1">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          :class="{ 'nav-link--active': isActive(link.to) }"
        >{{ link.label }}</NuxtLink>
        <button
          @click="$emit('open-search')"
          class="ml-1 flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm search-trigger"
          aria-label="搜索文章"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <kbd class="search-kbd">⌘K</kbd>
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup>
defineEmits(['open-search'])

const route = useRoute()

const links = [
  { to: '/', label: '文章' },
  { to: '/tags', label: '标签' },
  { to: '/timeline', label: '时间轴' },
  { to: '/about', label: '关于' }
]

function isActive(to) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<style scoped>
/* Logo 徽标：hover 时旋转 + 微放大 */
.logo-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background-color: var(--color-accent);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  transition: transform 0.5s var(--ease-spring), background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 6px -2px rgba(74, 107, 74, 0.3);
}
.logo-link:hover .logo-badge {
  transform: rotate(-8deg) scale(1.08);
  background-color: var(--color-accent-hover);
  box-shadow: 0 4px 12px -2px rgba(74, 107, 74, 0.45);
}
.logo-text {
  color: var(--color-text);
  transition: color 0.3s ease;
}
.logo-link:hover .logo-text {
  color: var(--color-accent);
}

/* 导航链接：底部指示条 + 背景泛起 */
.nav-link {
  position: relative;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  transition: color 0.25s var(--ease-smooth), background-color 0.25s var(--ease-smooth);
}
.nav-link::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0.15rem;
  width: 0;
  height: 2px;
  background-color: var(--color-accent);
  border-radius: 1px;
  transition: width 0.35s var(--ease-out-expo), left 0.35s var(--ease-out-expo), opacity 0.2s ease;
  opacity: 0;
}
.nav-link:hover {
  color: var(--color-accent);
  background-color: rgba(74, 107, 74, 0.05);
}
.nav-link:hover::after {
  width: 60%;
  left: 20%;
  opacity: 1;
}
.nav-link--active {
  color: var(--color-accent);
  background-color: var(--color-accent-light);
  font-weight: 500;
}
.nav-link--active::after {
  width: 60%;
  left: 20%;
  opacity: 1;
}

/* 搜索按钮 */
.search-trigger {
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
  transition: color 0.25s var(--ease-smooth), border-color 0.25s var(--ease-smooth),
              background-color 0.25s var(--ease-smooth), transform 0.3s var(--ease-out-expo),
              box-shadow 0.3s var(--ease-out-expo);
}
.search-trigger:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
  background-color: var(--color-accent-light);
  transform: translateY(-1px);
  box-shadow: 0 4px 10px -4px rgba(74, 107, 74, 0.25);
}
.search-trigger:active {
  transform: translateY(0);
}
.search-kbd {
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.65rem;
  padding: 0.1rem 0.3rem;
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 3px;
  color: var(--color-text-tertiary);
  line-height: 1;
  transition: border-color 0.25s ease, color 0.25s ease;
}
.search-trigger:hover .search-kbd {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
@media (max-width: 480px) {
  .search-kbd {
    display: none;
  }
}
</style>
