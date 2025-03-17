import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
/* 该插件为在构建生产时不支持这些功能的旧版浏览器提供支持 */
import legacy from '@vitejs/plugin-legacy'
import path from 'path'
/* 导入unplugin-vue-i18n插件 */
import vueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
/* vue的按需组件自动导入插件 */
import components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    vueI18nPlugin({
      /* 从根目录上的 vue-i18n/locales 文件夹导入所有语言文件 */
      include: [path.resolve(__dirname, './src/vue-i18n/locales/**')]
    }),
    components({
      dts: true,
      resolvers: [ElementPlusResolver()]
    })
  ],
  /* 开发或生产环境服务的公共基础路径,设置为./解决nginx部署静态资源404问题 */
  base: './',
  /* 开发服务器选项 */
  server: {
    /* IP地址 */
    host: '0.0.0.0',
    /* 端口 */
    port: 5173,
    /* 检查端口是否被占用 如果已被占用则会直接退出 */
    strictPort: true,
    /* 允许在开发过程中实时更新代码和预览效果 */
    hmr: true,
    /* 自定义代理规则 */
    proxy: {
      /* 后端接口 */
      '/api': {
        /* 接口地址 */
        target: 'http://localhost:10000/website-bookmark-api',
        /* 处理跨域 */
        changeOrigin: true,
        /* 重写请求路径 将请求路径中以 /api 开头的部分替换为空字符串,从而使代理的请求路径与目标服务器的期望路径相匹配 */
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    /* 用于创建模块路径的别名 */
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
      '@views': path.resolve(__dirname, 'src/views')
    }
  },
  /* 控制台输出的级别 */
  logLevel: 'info',
  /* 构建选项 */
  build: {
    /* 规定触发警告的chunk大小(以kB为单位) */
    chunkSizeWarningLimit: 1024,
    /* 自定义底层的Rollup打包配置 */
    rollupOptions: {
      output: {
        /* 实现将来自node_modules目录的模块手动拆分成单独的代码块 */
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }
    }
  }
})
