<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  //import { invoke } from '@tauri-apps/api/core'
  import { ElConfigProvider } from 'element-plus'
  import zhCN from 'element-plus/es/locale/lang/zh-cn'
  import { Window } from '@tauri-apps/api/window'
  import { t } from './utils'

  const appWindow = new Window('main')

  const alwaysOnTopStatus = ref(false)

  // 获取到浏览器保存的语言属性
  const language = localStorage.getItem('language')
  const locale = computed(() => {
    // 根据浏览器保存的语言选择
    if (language === 'zh-cn') {
      return zhCN
    } else {
      return zhCN
    }
  })

  /**
   * 设置窗口在最前面
   */
  const alwaysOnTop = () => {
    alwaysOnTopStatus.value = !alwaysOnTopStatus.value
    if (alwaysOnTopStatus.value) {
      appWindow.setAlwaysOnTop(true)
    } else {
      appWindow.setAlwaysOnTop(false)
    }
  }

  /**
   * 最小化窗口
   */
  const windowMinimize = async () => {
    await appWindow.minimize()
  }

  /**
   * 切换窗口最大化状态
   */
  const windowMaximize = async () => {
    await appWindow.toggleMaximize()
  }

  /**
   * 关闭窗口
   */
  const windowClose = async () => {
    await appWindow.close()
  }

  /**
   * 监听鼠标事件 实现拖动窗口及切换窗口最大化状态
   */
  const dataTauriDragRegion = () => {
    const titlebar = document.getElementById('titlebar')
    if (titlebar) {
      titlebar.addEventListener('mousedown', (event) => {
        if (event.buttons === 1) {
          event.detail === 2
            ? appWindow.toggleMaximize() // Maximize on double click
            : appWindow.startDragging() // Else start dragging
        }
      })
    } else {
      setTimeout(dataTauriDragRegion, 1000)
    }
  }

  const initPage = () => {
    dataTauriDragRegion()
  }

  onMounted(() => {
    initPage()
  })

  /* const greetMsg = ref('')
  const name = ref('')

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    greetMsg.value = await invoke('greet', { name: name.value })
  } */
</script>
<template>
  <ElConfigProvider :locale="locale">
    <ElContainer class="default_container_style">
      <ElHeader class="app_header">
        <div id="titlebar" style="flex-grow: 1" />
        <ElSpace style="margin: 0.5rem">
          <ElTooltip placement="bottom" :content="t('systemTooltip.alwaysOnTop')">
            <ElButton size="small" plain link @click="alwaysOnTop()">
              <ElIcon v-if="!alwaysOnTopStatus">
                <font-awesome-icon :icon="['fas', 'thumbtack']" />
              </ElIcon>
              <ElIcon v-else color="#409EFF">
                <font-awesome-icon :icon="['fas', 'thumbtack']" />
              </ElIcon>
            </ElButton>
          </ElTooltip>
          <ElTooltip placement="bottom" :content="t('systemTooltip.windowMinimize')">
            <ElButton size="small" plain link @click="windowMinimize()">
              <ElIcon>
                <font-awesome-icon :icon="['fas', 'window-minimize']" />
              </ElIcon>
            </ElButton>
          </ElTooltip>
          <ElTooltip placement="bottom" :content="t('systemTooltip.windowMaximize')">
            <ElButton size="small" plain link @click="windowMaximize()">
              <ElIcon>
                <font-awesome-icon :icon="['fas', 'window-maximize']" />
              </ElIcon>
            </ElButton>
          </ElTooltip>
          <ElTooltip placement="bottom" :content="t('systemTooltip.windowClose')">
            <ElButton size="small" plain link @click="windowClose()">
              <ElIcon>
                <font-awesome-icon :icon="['fas', 'window-close']" />
              </ElIcon>
            </ElButton>
          </ElTooltip>
        </ElSpace>
      </ElHeader>
      <ElMain class="default_main_style">
        <RouterView />
      </ElMain>
    </ElContainer>
  </ElConfigProvider>
</template>
<style lang="less" scoped>
  .app_header {
    padding: 0;
    height: 30px;
    display: flex;
    justify-content: flex-end;
    justify-content: space-between;
    background-color: rgba(218, 255, 253, 0.5);
  }
</style>
