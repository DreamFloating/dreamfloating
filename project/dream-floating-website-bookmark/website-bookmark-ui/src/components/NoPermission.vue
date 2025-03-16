<script setup lang="ts">
  import { t } from '@src/common/funcation'
</script>
<template>
  <ElContainer class="default_container_style">
    <ElMain style="display: flex">
      <div style="margin: auto">
        <div style="display: flex">
          <span class="span_1"> 403 </span>
        </div>
        <div style="display: flex">
          <span class="span_2">
            {{ t('system.tip.403_status') }}
          </span>
        </div>
      </div>
    </ElMain>
  </ElContainer>
</template>
<style scoped lang="less">
  .span_1 {
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

  .span_2 {
    margin: auto;
    font-style: italic;
    font-size: 2.5rem;
    transform: skewX(-15deg);
  }
</style>
