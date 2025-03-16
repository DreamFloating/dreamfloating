import { ComponentPublicInstance, createApp } from 'vue'
import './style.css'
import App from './App.vue'
// 暗夜模式的样式
import 'element-plus/theme-chalk/dark/css-vars.css'
/* 导入pinia组件 */
import { createPinia } from 'pinia'
/* 导入fontawesome图标组件 */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircleInfo, faLanguage, faMagnifyingGlass, faMoon, faSquarePlus, faSun } from '@fortawesome/free-solid-svg-icons'
import {} from '@fortawesome/free-regular-svg-icons'
/* 导入所有element plus图标 */
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
/* 导入json显示组件 */
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
/* 导入 vue-router */
import router from './vue-router'
/* 导入 axios */
import axios from 'axios'
import VueAxios from 'vue-axios'
/* 导入 i18n */
import i18n from './vue-i18n'
/* 完整导入 element plus ui组件 */
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

const pinia = createPinia()

/* 添加font-awesome图标 */
library.add(faSun, faMoon, faLanguage, faSquarePlus, faMagnifyingGlass, faCircleInfo)
app.component('font-awesome-icon', FontAwesomeIcon)

/* 添加element-plus图标 */
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

/* 注册VueJsonPretty组件 */
app.component('VueJsonPretty', VueJsonPretty)

app.use(router).use(VueAxios, axios).use(i18n).use(ElementPlus).use(pinia).mount('#app')

/**
 * 全局错误处理
 * @param err 错误
 * @param instance 组件实例
 * @param info 信息
 */
app.config.errorHandler = (err: unknown, instance: ComponentPublicInstance | null, info: string) => {
  console.error('Global error handler:', err, instance, info)
}

/**
 * 全局警告处理
 * @param msg 信息
 * @param instance 组件实例
 * @param trace 异常信息
 */
app.config.warnHandler = (msg: string, instance: ComponentPublicInstance | null, trace: string) => {
  console.warn('Global warn handler:', msg, instance, trace)
}
