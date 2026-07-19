const isProd = process.env.NODE_ENV === 'production'

export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxtjs/tailwindcss'],

  content: {
    highlight: {
      theme: 'github-light',
      preload: ['json', 'js', 'ts', 'html', 'css', 'vue', 'bash', 'md', 'yaml', 'python', 'sql']
    }
  },

  ssr: true,
  baseURL: isProd ? '/essay-chat/' : '/',
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  },

  app: {
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
