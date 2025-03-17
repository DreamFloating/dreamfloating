import { ResponseResult, WebsiteInfo } from '@src/common/interface'
import instance from '@src/type-axios'
import { defineStore } from 'pinia'

export const useWebsiteBookmarkStore = defineStore('websiteBookmark', {
  state: () => {
    return {
      searchName: '',
      websiteInfoList: [] as WebsiteInfo[],
      infoTableHeight: 0,
      infoTableLoading: false,
      currentPage: 1,
      pageSize: 1000,
      total: 0,
      websiteInfo: {} as WebsiteInfo,
      addDialog: false,
      addDialogLoading: false,
      keywordsInputVisible: false,
      keywordsInputList: [] as string[],
      keywordsInput: '',
      tagsInputVisible: false,
      tagsInputList: [] as string[],
      tagsInput: '',
      typeInputVisible: false,
      typeInputList: [] as string[],
      typeInput: ''
    }
  },
  getters: {},
  actions: {
    async queryWebsiteInfos() {
      this.infoTableLoading = true
      this.websiteInfoList = []
      const params = {
        searchInfo: this.searchName,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      await instance
        .post('/queryWebsiteInfos', params)
        .then((response) => {
          const body = response.data as ResponseResult
          if (body.code === 200) {
            this.total = body.data.total
            this.websiteInfoList = body.data.data
          }
        })
        .finally(() => {
          this.infoTableLoading = false
        })
    },
    openAddDialog() {
      this.websiteInfo = {
        orderNumber: this.total + 1
      } as WebsiteInfo
      this.addDialog = true
    },
    closeAddDialog() {
      this.websiteInfo = {} as WebsiteInfo
      this.keywordsInputVisible = false
      this.keywordsInput = ''
      this.keywordsInputList = []
      this.tagsInputVisible = false
      this.tagsInput = ''
      this.tagsInputList = []
      this.typeInputVisible = false
      this.typeInput = ''
      this.typeInputList = []
      this.addDialog = false
    },
    openDetailDrawer(row: WebsiteInfo) {
      this.websiteInfo = row
    },
    closeDetailDrawer() {},
    handleSizeChange(val: number) {
      this.pageSize = val
      this.currentPage = 1
      this.queryWebsiteInfos()
    },
    handleCurrentChange(val: number) {
      this.currentPage = val
      this.queryWebsiteInfos()
    },
    async fetchWebsiteTitle() {
      if (this.websiteInfo.url) {
        this.addDialogLoading = true
        await instance
          .post('/fetchWebsiteTitle', this.websiteInfo.url)
          .then((response) => {
            const body = response.data as ResponseResult
            if (body.code === 200) {
              this.websiteInfo.title = body.data.title
              this.websiteInfo.description = body.data.description
              this.websiteInfo.keywords = body.data.keywords
            } else {
              this.websiteInfo.title = ''
              this.websiteInfo.description = ''
              this.websiteInfo.keywords = ''
            }
          })
          .finally(() => {
            this.addDialogLoading = false
          })
      }
    },
    handleKeywordsInputConfirm() {
      if (this.keywordsInput && this.keywordsInput !== '') {
        if (!this.keywordsInputList.includes(this.keywordsInput)) {
          this.keywordsInputList.push(this.keywordsInput)
          this.websiteInfo.keywords = this.keywordsInputList.toString()
        }
      }
      this.keywordsInputVisible = false
      this.keywordsInput = ''
    },
    handleKeywordsClose(tag: string) {
      this.keywordsInputList.splice(this.keywordsInputList.indexOf(tag), 1)
      this.websiteInfo.keywords = this.keywordsInputList.toString()
    },
    handleTagsInputConfirm() {
      if (this.tagsInput && this.tagsInput !== '') {
        if (!this.tagsInputList.includes(this.tagsInput)) {
          this.tagsInputList.push(this.tagsInput)
          this.websiteInfo.tags = this.tagsInputList.toString()
        }
      }
      this.tagsInputVisible = false
      this.tagsInput = ''
    },
    handleTagsClose(tag: string) {
      this.tagsInputList.splice(this.tagsInputList.indexOf(tag), 1)
      this.websiteInfo.tags = this.tagsInputList.toString()
    },
    handleTypeInputConfirm() {
      if (this.typeInput && this.typeInput !== '') {
        if (!this.tagsInputList.includes(this.typeInput)) {
          this.typeInputList.push(this.typeInput)
          this.websiteInfo.type = this.typeInputList.toString()
        }
      }
      this.typeInputVisible = false
      this.typeInput = ''
    },
    handleTypeClose(tag: string) {
      this.typeInputList.splice(this.typeInputList.indexOf(tag), 1)
      this.websiteInfo.type = this.typeInputList.toString()
    },
    // 预定义淡色的颜色数组
    getLightRandomColor(): string {
      const lightColors = [
        '255, 182, 193', // 浅粉红
        '255, 218, 185', // 桃色
        '255, 255, 224', // 浅黄色
        '224, 255, 255', // 浅青色
        '216, 191, 216', // 薰衣草紫
        '176, 224, 230', // 粉蓝色
        '240, 230, 140' // 卡其色
      ]
      const index = Math.floor(Math.random() * lightColors.length)
      return `rgba(${lightColors[index]}, 0.2)` // 添加透明度 0.5
    }
  }
})
