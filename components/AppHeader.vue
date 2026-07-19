<template>
  <header class="border-b border-neutral-100">
    <div class="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
      <NuxtLink to="/" class="text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors">
        Essay
      </NuxtLink>
      <nav class="flex gap-5 text-xs text-neutral-400">
        <NuxtLink to="/" class="hover:text-neutral-700 transition-colors">文章</NuxtLink>
        <NuxtLink to="/timeline" class="hover:text-neutral-700 transition-colors">时间轴</NuxtLink>
        <NuxtLink to="/about" class="hover:text-neutral-700 transition-colors">关于</NuxtLink>
      </nav>
    </div>
  </header>
</template>
