<script setup lang="ts">
  import { en, zhCn } from 'element-plus/es/locale/index.mjs'
  import { computed } from 'vue'

  // 获取到浏览器保存的语言属性
  const language = localStorage.getItem('language')

  const locale = computed(() => {
    // 根据浏览器保存的语言选择
    if (language === 'zh-cn') {
      return zhCn
    } else if (language === 'en') {
      return en
    } else {
      // 默认使用中文
      return zhCn
    }
  })
</script>
<template>
  <ElConfigProvider :locale="locale">
    <RouterView />
  </ElConfigProvider>
</template>
<style scoped lang="less"></style>
