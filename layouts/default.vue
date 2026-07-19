<template>
  <div class="min-h-screen flex flex-col" style="background-color: var(--color-bg)">
    <AppHeader @open-search="searchOpen = true" />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
    <SearchModal :open="searchOpen" @close="searchOpen = false" />
  </div>
</template>

<script setup>
const searchOpen = ref(false)

// 全局快捷键 Cmd/Ctrl + K 触发搜索
function onKeydown(e) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    searchOpen.value = true
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>
