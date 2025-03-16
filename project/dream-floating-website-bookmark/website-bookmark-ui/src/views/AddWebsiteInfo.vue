<script setup lang="ts">
  import { t } from '@src/common/funcation'
  import { ResponseResult, WebsiteInfo } from '@src/common/interface'
  import { useWebsiteBookmarkStore } from '@src/pinia-store'
  import instance from '@src/type-axios'
  import { ElMessage, FormInstance, FormRules, InputInstance } from 'element-plus'
  import { ContentSaveIcon } from 'mdi-vue3'
  import { nextTick, reactive, ref } from 'vue'

  const websiteBookmarkStore = useWebsiteBookmarkStore()

  const addWebsiteInfoForm = ref<FormInstance>()

  const addWebsiteInfoRules = reactive<FormRules<WebsiteInfo>>({
    url: {
      required: true,
      type: 'string',
      validator: (_rule: any, value: string, callback: any) => {
        if (value == undefined || value.trim().length === 0) {
          callback(t('rules_tip.website_url_required'))
        }
        callback()
      }
    }
  })

  const keywordsInputRef = ref<InputInstance>()

  const tagsInputRef = ref<InputInstance>()

  const typeInputRef = ref<InputInstance>()

  const saveWebsiteInfo = () => {
    if (addWebsiteInfoForm) {
      addWebsiteInfoForm.value?.validate(async (valid, _fields) => {
        if (valid) {
          websiteBookmarkStore.addDialogLoading = true
          await instance
            .post('/saveWebsiteInfo', websiteBookmarkStore.websiteInfo)
            .then((response) => {
              const body = response.data as ResponseResult
              if (body.code === 200) {
                ElMessage({
                  type: 'success',
                  grouping: true,
                  plain: true,
                  message: t('system.tip.operation_successful')
                })
                websiteBookmarkStore.closeAddDialog()
                websiteBookmarkStore.queryWebsiteInfos()
              }
            })
            .finally(() => {
              websiteBookmarkStore.addDialogLoading = false
            })
        }
      })
    }
  }

  const showKeywordsInput = () => {
    websiteBookmarkStore.keywordsInputVisible = true
    nextTick(() => {
      keywordsInputRef.value?.input?.focus()
    })
  }

  const showTagsInput = () => {
    websiteBookmarkStore.tagsInputVisible = true
    nextTick(() => {
      tagsInputRef.value?.input?.focus()
    })
  }

  const showTypeInput = () => {
    websiteBookmarkStore.typeInputVisible = true
    nextTick(() => {
      typeInputRef.value?.input?.focus()
    })
  }
</script>
<template>
  <ElDialog
    v-model="websiteBookmarkStore.addDialog"
    draggable
    destroy-on-close
    append-to-body
    center
    align-center
    @close="websiteBookmarkStore.closeAddDialog()">
    <ElContainer class="default_container_style">
      <ElMain
        class="el_card_main"
        v-loading="websiteBookmarkStore.addDialogLoading">
        <ElScrollbar>
          <ElForm
            ref="addWebsiteInfoForm"
            :rules="addWebsiteInfoRules"
            :model="websiteBookmarkStore.websiteInfo"
            inline-message
            status-icon
            scroll-to-error
            label-position="top">
            <ElFormItem
              prop="title"
              :label="t('table.colum.website.title')">
              <ElInput
                :placeholder="t('placeholder.add_website_title')"
                v-model="websiteBookmarkStore.websiteInfo.title"
                clearable
                maxlength="255"
                show-word-limit />
            </ElFormItem>
            <ElFormItem
              prop="url"
              :label="t('table.colum.website.url')">
              <ElInput
                :placeholder="t('placeholder.add_website_url')"
                v-model="websiteBookmarkStore.websiteInfo.url"
                clearable
                maxlength="2048"
                show-word-limit
                @blur="websiteBookmarkStore.fetchWebsiteTitle()" />
            </ElFormItem>
            <ElFormItem
              prop="description"
              :label="t('table.colum.website.description')">
              <ElInput
                :placeholder="t('placeholder.add_website_description')"
                :rows="5"
                v-model="websiteBookmarkStore.websiteInfo.description"
                type="textarea"
                clearable
                maxlength="10000"
                show-word-limit />
            </ElFormItem>
            <ElFormItem
              prop="keywords"
              :label="t('table.colum.website.keywords')">
              <ElSpace style="flex-wrap: wrap">
                <ElTag
                  style="margin-bottom: 0.2rem"
                  v-if="websiteBookmarkStore.keywordsInputList.length > 0"
                  v-for="tag in websiteBookmarkStore.keywordsInputList"
                  type="primary"
                  :key="tag"
                  closable
                  @close="websiteBookmarkStore.handleKeywordsClose(tag)">
                  {{ tag }}
                </ElTag>
                <ElInput
                  style="width: 5rem"
                  size="small"
                  ref="keywordsInputRef"
                  v-if="websiteBookmarkStore.keywordsInputVisible"
                  v-model="websiteBookmarkStore.keywordsInput"
                  @keyup.enter="websiteBookmarkStore.handleKeywordsInputConfirm"
                  @blur="websiteBookmarkStore.handleKeywordsInputConfirm" />
                <ElButton
                  v-else
                  type="primary"
                  size="small"
                  plain
                  @click="showKeywordsInput">
                  {{ t('placeholder.add_website_keywords') }}
                </ElButton>
              </ElSpace>
            </ElFormItem>
            <ElRow>
              <ElCol :span="12">
                <ElFormItem
                  prop="tags"
                  :label="t('table.colum.website.tags')">
                  <ElSpace style="flex-wrap: wrap">
                    <ElTag
                      style="margin-bottom: 0.2rem"
                      v-if="websiteBookmarkStore.tagsInputList.length > 0"
                      v-for="tag in websiteBookmarkStore.tagsInputList"
                      type="primary"
                      :key="tag"
                      :color="websiteBookmarkStore.getLightRandomColor()"
                      closable
                      @close="websiteBookmarkStore.handleTagsClose(tag)">
                      {{ tag }}
                    </ElTag>
                    <ElInput
                      style="width: 5rem"
                      size="small"
                      ref="tagsInputRef"
                      v-if="websiteBookmarkStore.tagsInputVisible"
                      v-model="websiteBookmarkStore.tagsInput"
                      @keyup.enter="websiteBookmarkStore.handleTagsInputConfirm"
                      @blur="websiteBookmarkStore.handleTagsInputConfirm" />
                    <ElButton
                      v-else
                      type="primary"
                      size="small"
                      plain
                      @click="showTagsInput">
                      {{ t('placeholder.add_website_tags') }}
                    </ElButton>
                  </ElSpace>
                </ElFormItem>
              </ElCol>
              <ElCol :span="12">
                <ElFormItem
                  prop="type"
                  :label="t('table.colum.website.type')">
                  <ElSpace style="flex-wrap: wrap">
                    <ElTag
                      style="margin-bottom: 0.2rem"
                      v-if="websiteBookmarkStore.typeInputList.length > 0"
                      v-for="tag in websiteBookmarkStore.typeInputList"
                      type="primary"
                      :key="tag"
                      closable
                      @close="websiteBookmarkStore.handleTypeClose(tag)">
                      {{ tag }}
                    </ElTag>
                    <ElInput
                      style="width: 5rem"
                      size="small"
                      ref="typeInputRef"
                      v-if="websiteBookmarkStore.typeInputVisible"
                      v-model="websiteBookmarkStore.typeInput"
                      @keyup.enter="websiteBookmarkStore.handleTypeInputConfirm"
                      @blur="websiteBookmarkStore.handleTypeInputConfirm" />
                    <ElButton
                      v-else
                      type="primary"
                      size="small"
                      plain
                      @click="showTypeInput">
                      {{ t('placeholder.add_website_tags') }}
                    </ElButton>
                  </ElSpace>
                </ElFormItem>
              </ElCol>
            </ElRow>

            <ElFormItem
              prop="orderNumber"
              :label="t('table.colum.orderNumber')">
              <ElInputNumber
                v-model="websiteBookmarkStore.websiteInfo.orderNumber"
                :placeholder="t('placeholder.add_website_orderNumber')"
                :min="1"
                :step="1"
                step-strictly
                clearable />
            </ElFormItem>
          </ElForm>
        </ElScrollbar>
      </ElMain>
    </ElContainer>
    <template #footer>
      <ElFooter style="display: flex; padding: 0.5rem">
        <ElSpace style="margin: auto">
          <ElTooltip
            :content="t('tool_tip.save_website')"
            placement="top">
            <ElButton
              type="primary"
              plain
              @click="saveWebsiteInfo()">
              <ElIcon>
                <ContentSaveIcon />
              </ElIcon>
            </ElButton>
          </ElTooltip>
        </ElSpace>
      </ElFooter>
    </template>
  </ElDialog>
</template>
<style lang="less" scoped></style>
