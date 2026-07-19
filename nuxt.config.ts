import { readdirSync } from 'node:fs'
import { join } from 'node:path'

const isProd = process.env.NODE_ENV === 'production'

// 动态获取所有文章路由用于预渲染
// 文章详情页是动态路由（[...slug].vue），爬虫爬到的是带 baseURL 前缀的链接
// （/essay-chat/articles/xxx），被 ignore 排除后不会被预渲染。
// 需要显式列出不带前缀的路由，GitHub Pages 才能直接返回 HTML。
const articleRoutes = readdirSync(join(process.cwd(), 'content/articles'))
  .filter(f => f.endsWith('.md'))
  .map(f => `/articles/${f.replace(/\.md$/, '')}`)

export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxtjs/tailwindcss'],

  content: {
    highlight: {
      theme: 'github-light',
      preload: ['json', 'js', 'ts', 'html', 'css', 'vue', 'bash', 'md', 'yaml', 'python', 'sql']
    }
  },

  ssr: true,

  // 禁用 payload 分离：Nuxt 3 默认将 useAsyncData 的数据分离到 _payload.json 文件，
  // 导致 inline __NUXT_DATA__ 的 state 为空。客户端 hydration 时 useAsyncData 找不到数据，
  // 尝试 re-fetch 调用 queryContent，但 SSG 模式下客户端没有 content 数据库，返回 null，
  // 组件渲染"文章不存在"覆盖 SSR 内容。禁用后数据直接内联到 __NUXT_DATA__ 中。
  experimental: {
    payloadExtraction: false
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', ...articleRoutes],
      // 忽略两类路由：
      // 1. ?tag= query：标签筛选是客户端动态行为，无需预渲染
      // 2. /essay-chat/* 带前缀路由：baseURL 导致爬虫爬到带前缀的链接，
      //    但 pages 自动注册了不带前缀的路由，两者共享 payload 缓存，
      //    并发写入会 EPERM。GitHub Pages 只需要不带前缀的文件（tags/index.html）
      ignore: [/\?tag=/, /^\/essay-chat\//]
    }
  },

  app: {
    baseURL: isProd ? '/essay-chat/' : '/',
    head: {
      title: 'Essay · 随笔画像',
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '个人随笔与AI知识画像 · 记录阅读、思考和游戏笔记' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&display=swap'
        }
      ]
    }
  },

  css: ['~/assets/css/main.css']
})
