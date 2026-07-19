// 搜索逻辑 composable
// 客户端全文搜索:标题、摘要、标签(中文友好,用 includes 匹配)

export function useSearch() {
  // 搜索数据(所有文章的 frontmatter)
  const articles = ref([])
  const loaded = ref(false)

  // 加载文章数据(懒加载,只在首次打开搜索时执行)
  async function ensureLoaded() {
    if (loaded.value) return
    try {
      const list = await queryContent('articles')
        .where({ _draft: { $ne: true } })
        .sort({ writtenAt: -1 })
        .find()
      articles.value = list || []
      loaded.value = true
    } catch (e) {
      console.error('搜索数据加载失败:', e)
    }
  }

  // 搜索:返回加权排序后的结果
  function search(query) {
    const q = (query || '').trim().toLowerCase()
    if (!q) return []

    // 多关键词支持(空格分隔,全部匹配才算命中)
    const keywords = q.split(/\s+/).filter(Boolean)

    const results = []
    for (const article of articles.value) {
      const title = (article.title || '').toLowerCase()
      const summary = (article.summary || '').toLowerCase()
      const tags = (article.tags || []).map(t => String(t).toLowerCase())

      // 每个关键词都必须命中至少一个字段
      const matchInfo = { title: false, summary: false, tags: false }
      let allMatched = true
      for (const kw of keywords) {
        const inTitle = title.includes(kw)
        const inSummary = summary.includes(kw)
        const inTags = tags.some(t => t.includes(kw))
        if (inTitle) matchInfo.title = true
        if (inSummary) matchInfo.summary = true
        if (inTags) matchInfo.tags = true
        if (!inTitle && !inSummary && !inTags) {
          allMatched = false
          break
        }
      }

      if (!allMatched) continue

      // 加权:标题 3 分,标签 2 分,摘要 1 分
      let score = 0
      if (matchInfo.title) score += 3
      if (matchInfo.tags) score += 2
      if (matchInfo.summary) score += 1

      results.push({
        article,
        score,
        matchInfo,
        keywords
      })
    }

    // 按分数降序,同分按写作时间降序
    results.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return new Date(b.article.writtenAt || 0) - new Date(a.article.writtenAt || 0)
    })

    return results
  }

  // 高亮匹配词:把匹配的部分用 <mark> 包裹
  function highlight(text, keywords) {
    if (!text || !keywords || !keywords.length) return text
    let result = String(text)
    // 按关键词长度降序处理,避免短词替换破坏长词
    const sorted = [...keywords].sort((a, b) => b.length - a.length)
    for (const kw of sorted) {
      if (!kw) continue
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const re = new RegExp(escaped, 'gi')
      result = result.replace(re, (m) => `<mark>${m}</mark>`)
    }
    return result
  }

  return {
    articles,
    loaded,
    ensureLoaded,
    search,
    highlight
  }
}
