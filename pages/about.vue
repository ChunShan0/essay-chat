<template>
  <div class="max-w-3xl mx-auto px-6 py-10">
    <header class="page-enter mb-10">
      <h1 class="font-serif text-3xl font-semibold mb-4" style="color: var(--color-text)">关于</h1>
    </header>

    <div class="space-y-6 text-base leading-relaxed" style="color: var(--color-text-secondary)">
      <p>
        这是 <strong style="color: var(--color-text)">Essay · 随笔画像</strong>,一个个人随笔空间。
      </p>
      <p>
        这里记录阅读、思考和游戏相关的笔记。每一篇文章都是思维的一帧快照,串联起来便是一个人的知识画像。
      </p>
      <p>
        内容以 Markdown 文件形式存在,通过 Nuxt 3 + @nuxt/content 构建,部署在 GitHub Pages。
      </p>

      <div class="pt-6 mt-6" style="border-top: 1px solid var(--color-border)">
        <h2 class="font-serif text-lg font-medium mb-3" style="color: var(--color-text)">技术栈</h2>
        <ul class="space-y-1.5 text-sm">
          <li class="tech-item">· Nuxt 3(静态站点生成)</li>
          <li class="tech-item">· @nuxt/content(Markdown 即内容)</li>
          <li class="tech-item">· Tailwind CSS(样式)</li>
          <li class="tech-item">· GitHub Pages(托管)</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-enter {
  animation: pageFadeIn 0.6s var(--ease-out-expo) both;
}
@keyframes pageFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 技术栈列表项：hover 时左缩进 + 颜色加深 */
.tech-item {
  transition: transform 0.3s var(--ease-out-expo), color 0.3s ease;
  display: inline-block;
  width: 100%;
}
.tech-item:hover {
  transform: translateX(6px);
  color: var(--color-accent);
}
</style>
