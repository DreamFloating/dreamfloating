<script setup lang="ts">
  import { t } from '@src/common/funcation'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  /**
   * 返回主页
   */
  const backHome = () => {
    router.push('/')
  }
</script>
<template>
  <ElContainer class="container_body">
    <ElMain style="display: flex">
      <div style="margin: auto">
        <div style="display: flex">
          <span class="span_404">404</span>
        </div>
        <div style="display: flex">
          <span class="span_404_info">{{ t('system.tip.page_not_fund') }}</span>
        </div>
        <div style="display: flex; margin-top: 1rem">
          <ElButton type="primary" style="margin: auto" @click="backHome()">
            {{ t('system.button.back_home') }}
          </ElButton>
        </div>
      </div>
    </ElMain>
  </ElContainer>
</template>
<style scoped lang="less">
  .container_body {
    width: 100vw;
    height: 100vh;
  }

  .span_404 {
    width: 300px;
    margin: auto;
    font-size: 10rem;
    font-style: italic;
    text-shadow: 10px 10px 5px rgba(124, 124, 124, 0.5);
    transform: skewX(-15deg);
    background: linear-gradient(to right, #ff6347, #ff8c00);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .span_404_info {
    margin: auto;
    font-style: italic;
    font-size: 2.5rem;
    transform: skewX(-15deg);
  }
</style>
