<template>
  <footer class="border-t mt-auto" style="border-color: var(--color-border)">
    <div class="max-w-3xl mx-auto px-6 py-10 flex flex-col items-center gap-2">
      <div class="flex items-center gap-2 text-sm" style="color: var(--color-text-tertiary)">
        <span class="w-5 h-5 rounded flex items-center justify-center text-[10px] font-semibold" style="background-color: var(--color-accent); color: white">E</span>
        <span class="font-serif">Essay</span>
      </div>
      <p class="text-xs" style="color: var(--color-text-tertiary)">
        {{ new Date().getFullYear() }} · 记录阅读、思考与游戏笔记
      </p>
      <p class="text-[11px]" style="color: var(--color-text-tertiary); opacity: 0.7">
        Powered by Nuxt 3 · Hosted on GitHub Pages
      </p>
    </div>
  </footer>
</template>
