<template>
  <div class="max-w-2xl mx-auto px-6 py-12">
    <header class="mb-10">
      <NuxtLink to="/" class="text-sm text-neutral-400 hover:text-neutral-700">&larr; 首页</NuxtLink>
    </header>

    <ContentRenderer v-if="data" :value="data">
      <template #empty>
        <p class="text-neutral-400">暂无内容。</p>
      </template>
    </ContentRenderer>

    <div v-else-if="status === 'pending'" class="text-neutral-400 text-sm">
      加载中...
    </div>

    <div v-else class="text-neutral-400">
      文章不存在。
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const slug = (route.params.slug || []).join('/')

const { data, status } = await useAsyncData(`article-${slug}`, () =>
  queryContent().where({ _path: `/articles/${slug}` }).findOne()
)
</script>

<style>
.nuxt-content h1 { font-size: 1.75rem; font-weight: 500; margin-top: 2rem; margin-bottom: 0.75rem; color: #171717; }
.nuxt-content h2 { font-size: 1.35rem; font-weight: 500; margin-top: 1.75rem; margin-bottom: 0.5rem; color: #262626; }
.nuxt-content h3 { font-size: 1.15rem; font-weight: 500; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #404040; }
.nuxt-content p { margin-bottom: 1rem; line-height: 1.8; color: #525252; }
.nuxt-content ul, .nuxt-content ol { margin-bottom: 1rem; padding-left: 1.5rem; }
.nuxt-content li { margin-bottom: 0.35rem; line-height: 1.7; color: #525252; }
.nuxt-content code { background: #f5f5f5; padding: 0.15em 0.4em; border-radius: 3px; font-size: 0.9em; color: #d6336c; }
.nuxt-content pre { background: #f8f8f8; padding: 1rem; border-radius: 8px; overflow-x: auto; margin-bottom: 1rem; }
.nuxt-content pre code { background: none; padding: 0; color: #333; }
.nuxt-content blockquote { border-left: 3px solid #e5e5e5; padding-left: 1rem; color: #737373; margin-bottom: 1rem; }
.nuxt-content a { color: #2563eb; text-decoration: underline; }
</style>
