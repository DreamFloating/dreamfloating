// 导入i18n创建多语言对象
import { createI18n } from 'vue-i18n'
// 使用 unplugin-vue-i18n 插件导入所有语言 不知道为什么使用unplugin-vue-i18n不生效
// import messages from '@intlify/unplugin-vue-i18n/messages'
import zh from './locales/zh.json'

const i18n = createI18n({
  // 是否允许在消息中使用组合字符
  allowComposition: true,
  // 开启全局多语言渗透
  globalInjection: true,
  // 多语言环境 默认保存在localStorage中的语言 第二 中文
  // navigator.language 为浏览器语言,可以添加为第三个选项,但需要核对浏览器语言的缩写是否与自身定义的语言缩写名称对应
  locale: localStorage.getItem('language') ?? 'zh',
  // 使用vue3 组合式API时设置为false
  legacy: false,
  // 语言配置
  messages: {
    zh
  }
  // 是否在控制台中输出翻译警告信息
  //silentTranslationWarn: true,
  // 是否在控制台中输出缺失翻译警告信息
  //missingWarn: false,
  // 是否在控制台中输出回退翻译警告信息
  //silentFallbackWarn: true,
  // 是否在控制台中输出回退翻译警告信息
  //fallbackWarn: false
})

export default i18n
