import { ref } from 'vue'
import i18n from '@src/vue-i18n'
import { useDark, useToggle } from '@vueuse/core'
import cronParser from 'cron-parser'
import instance from '@src/type-axios'
import { ResponseResult } from '../interface'

/* i18n国际化 */
export const t = i18n.global.t

/** 默认的语言选项 */
export const language = ref(t('system.language.zh-cn'))

/**
 * 切换语言选项的方法
 * @param language 语言简称
 */
export const switchLanguage = (language: string) => {
  localStorage.setItem('language', 'zh-cn')
  if (language === 'zh-cn') {
    localStorage.setItem('language', 'zh-cn')
  }
  window.location.reload()
}

/**
 * 检查用户选择的语言的方法 默认使用中文
 */
export const checkLanguage = () => {
  const localStorageLanguage = localStorage.getItem('language')
  if (localStorageLanguage !== null) {
    language.value = t('system.language.' + localStorageLanguage)
  }
}

// 默认的暗夜模式转换方式
export const isDark = useDark()
export const toggleDark = useToggle(isDark)

/**
 * 根据权限名称查询该用户是否有该权限
 * @param permissionName 权限名称
 * @returns 结果 true or flase
 */
export const getPermission = (permissionName: string) => {
  const permissionListStr = sessionStorage.getItem('scope')
  let permissionList = [] as string[]
  if (permissionListStr !== null) {
    permissionList = permissionListStr.split(',')
  }
  return permissionList.includes(permissionName)
}

// 定义 store 重置方法的类型
type StoreResetFunction = () => { $reset: () => void }

// 创建一个函数来初始化标签页名称到重置方法的映射对象
const createStoreResetMap = (): Record<string, StoreResetFunction> => ({})

/**
 * 根据标签页名称 在移除标签页时 将 pinia store 中的信息重置
 * @param tabName 标签页名称
 */
export const resetPiniaStoreOnRemoveTab = (tabName: string) => {
  const storeResetMap = createStoreResetMap()
  const useStore = storeResetMap[tabName]
  if (useStore) {
    const store = useStore()
    store.$reset()
  }
}

/**
 * 根据当前页和每页大小计算行号
 * @param currentPage 当前页
 * @param pageSize 每页大小
 * @returns 行号
 */
export const getNextIndex = (currentPage: number, pageSize: number) => {
  return 1 + (currentPage - 1) * pageSize
}

/**
 * 将json字符串转换成json对象
 * @param str json字符串
 * @returns json对象
 */
export const jsonFormat = (str: string) => {
  try {
    return JSON.parse(str)
  } catch (error) {
    // console.log(error)
    return str
  }
}

/**
 * 检查cron表达式是否符合要求
 * @param str cron表达式
 * @returns
 */
export const validateCron = (str: string): boolean => {
  try {
    cronParser.parseExpression(str)
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}
