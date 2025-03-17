<script setup lang="ts">
  import { getNextIndex, getPermission, t } from '@src/common/funcation'
  import NoPermission from './NoPermission.vue'
  import { useWebsiteBookmarkStore } from '@src/pinia-store'
  import erd from '@src/element-resize-detector'
  import { onMounted } from 'vue'
  import AddWebsiteInfo from '@src/views/AddWebsiteInfo.vue'
  import { WebsiteInfo } from '@src/common/interface'

  const websiteBookmarkStore = useWebsiteBookmarkStore()

  const jumpLink = (row: WebsiteInfo, _column: any, _event: Event) => {
    if (row.url) {
      window.open(row.url, '_blank') // 使用 _blank 在新标签页打开
    } else {
      console.error('URL 不存在')
    }
  }

  const resetInfoTableHeight = () => {
    const websiteInfoMain = document.getElementById('websiteInfoMain') as HTMLElement
    if (websiteInfoMain) {
      erd.listenTo(websiteInfoMain, function (element) {
        websiteBookmarkStore.infoTableHeight = element.offsetHeight - 16
      })
    }
  }

  const initPage = () => {
    resetInfoTableHeight()
    websiteBookmarkStore.queryWebsiteInfos()
  }

  onMounted(() => {
    initPage()
  })
</script>
<template>
  <ElContainer
    v-if="getPermission('basic')"
    class="default_container_style">
    <ElMain class="main-style">
      <ElContainer class="default_container_style">
        <ElHeader class="header-style">
          <ElSpace>
            <ElInput
              style="width: 15rem"
              :placeholder="t('placeholder.search_website')"
              clearable
              v-model="websiteBookmarkStore.searchName">
              <template #prefix>
                <ElIcon>
                  <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
                </ElIcon>
              </template>
            </ElInput>
            <ElTooltip
              :content="t('tool_tip.add_website')"
              placement="bottom">
              <ElButton
                type="primary"
                plain
                round
                @click="websiteBookmarkStore.openAddDialog()">
                <ElIcon>
                  <font-awesome-icon :icon="['fas', 'square-plus']" />
                </ElIcon>
              </ElButton>
            </ElTooltip>
            <ElTooltip
              :content="t('tool_tip.search_website')"
              placement="bottom">
              <ElButton
                type="primary"
                plain
                round
                @click="websiteBookmarkStore.queryWebsiteInfos()">
                <ElIcon>
                  <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
                </ElIcon>
              </ElButton>
            </ElTooltip>
          </ElSpace>
        </ElHeader>
        <ElMain
          id="websiteInfoMain"
          class="default_main_style"
          v-loading="websiteBookmarkStore.infoTableLoading">
          <ElTable
            :data="websiteBookmarkStore.websiteInfoList"
            :height="websiteBookmarkStore.infoTableHeight"
            :max-height="websiteBookmarkStore.infoTableHeight"
            @cell-dblclick="jumpLink"
            style="width: 100%"
            show-overflow-tooltip
            stripe
            border>
            <ElTableColumn
              type="selection"
              :resizable="false"
              width="50" />
            <ElTableColumn
              type="index"
              :resizable="false"
              :index="getNextIndex(websiteBookmarkStore.currentPage, websiteBookmarkStore.pageSize)"
              width="auto" />
            <ElTableColumn
              prop="title"
              :label="t('table.colum.website.title')"
              :resizable="false"
              width="auto" />
            <ElTableColumn
              prop="url"
              :label="t('table.colum.website.url')"
              :resizable="false"
              width="auto" />
            <ElTableColumn
              :label="t('table.colum.operations')"
              :resizable="false"
              width="150"
              min-width="150"
              fixed="right">
              <template #default="scope">
                <ElSpace spacer="|">
                  <ElButton
                    type="primary"
                    link
                    @click="websiteBookmarkStore.openDetailDrawer(scope.row)">
                    <ElIcon size="20">
                      <font-awesome-icon :icon="['fas', 'circle-info']" />
                    </ElIcon>
                  </ElButton>
                </ElSpace>
              </template>
            </ElTableColumn>
          </ElTable>
        </ElMain>
        <ElFooter style="display: flex; height: auto; margin: 0.5rem">
          <ElSpace style="margin: auto">
            <ElPagination
              v-model:current-page="websiteBookmarkStore.currentPage"
              v-model:page-size="websiteBookmarkStore.pageSize"
              :total="websiteBookmarkStore.total"
              :page-sizes="[1000, 2000, 3000, 5000, 10000]"
              :pager-count="11"
              background
              layout="total, sizes, prev, pager, next, jumper"
              size="small"
              @size-change="websiteBookmarkStore.handleSizeChange"
              @current-change="websiteBookmarkStore.handleCurrentChange" />
          </ElSpace>
        </ElFooter>
      </ElContainer>
    </ElMain>
  </ElContainer>
  <NoPermission v-else />
  <AddWebsiteInfo />
</template>
<style lang="less" scoped>
  .main-style {
    padding: 0;
    margin: 0.5rem;
    box-shadow: var(--el-box-shadow-dark);
  }

  .header-style {
    display: flex;
    box-shadow: var(--el-box-shadow);
  }
</style>
