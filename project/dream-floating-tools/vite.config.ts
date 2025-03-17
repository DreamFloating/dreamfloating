import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 该插件为在构建生产时不支持这些功能的旧版浏览器提供支持
import legacy from '@vitejs/plugin-legacy'
import path from 'path'
// 导入unplugin-vue-i18n插件
import vueI18n from '@intlify/unplugin-vue-i18n/vite'
// Vue的按需组件自动导入插件
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const host = process.env.TAURI_DEV_HOST

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    vueI18n({
      // 从根目录上的 /vue-i18n/locales 文件夹导入所有语言文件
      include: [path.resolve(__dirname, '.src/vue-i18n/locales/**')]
    }),
    Components({
      dts: true,
      resolvers: [ElementPlusResolver()]
    })
  ],
  // 开发或生产环境服务的公共基础路径,设置为./解决nginx部署静态资源404问题
  base: './',
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  // 防止 Vite 清除 Rust 显示的错误
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 5173,
    // Tauri 工作于固定端口，如果端口不可用则报错
    strictPort: true,
    // 如果设置了 host，Tauri 则会使用
    host: host || false,
    // 允许在开发过程中实时更新代码和预览效果
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 5174
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**']
    },
    // 自定义代理规则
    proxy: {
      // 后端接口
      '/api': {
        // 接口地址
        target: 'http://127.0.0.1:9000',
        // 处理跨域
        changeOrigin: true,
        // 重写请求路径 将请求路径中以 /api 开头的部分替换为空字符串,从而使代理的请求路径与目标服务器的期望路径相匹配
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    // 用于创建模块路径的别名
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
      '@views': path.resolve(__dirname, 'src/views')
    }
  },
  // 控制台输出的级别 不知道为什么报错
  // logLevel: 'info',
  // 添加有关当前构建目标的额外前缀，使这些 CLI 设置的 Tauri 环境变量可以在客户端代码中访问
  envPrefix: ['VITE_', 'TAURI_ENV_*'],
  build: {
    // 规定触发警告的 chunk 大小。（以 kB 为单位）
    chunkSizeWarningLimit: 1024,
    // 自定义底层的 Rollup 打包配置
    rollupOptions: {
      output: {
        // 实现将来自 node_modules 目录的模块手动拆分成单独的代码块
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }
    },
    // Tauri 在 Windows 上使用 Chromium，在 macOS 和 Linux 上使用 WebKit
    target: process.env.TAURI_ENV_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
    // 在 debug 构建中不使用 minify 不知道为什么报错
    // minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
    // 在 debug 构建中生成 sourcemap
    sourcemap: !!process.env.TAURI_ENV_DEBUG
  }
}))
