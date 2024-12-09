# tauri learn

> 环境
>
> - [Microsoft C++ 构建工具](https://tauri.app/zh-cn/start/prerequisites/#microsoft-c-构建工具)
> - [WebView2](https://tauri.app/zh-cn/start/prerequisites/#webview2)
> - [Rust](https://tauri.app/zh-cn/start/prerequisites/#rust)
>
> 创建项目命令
>
> ```bash
> npm create tauri-app@latest
> npm install
> npm run tauri dev
> ```

>Vite+Tauri+Vue项目目录文件介绍
>
>```plaintext
>├── package.json         # 前端依赖和脚本
>├── vite.config.ts       # Vite 配置
>├── tauri.conf.json      # Tauri 配置
>├── src/                 # Vue 前端代码
>│   ├── main.ts          # Vue 项目入口
>│   ├── App.vue          # 根组件
>│   ├── components/      # 通用组件
>│   ├── views/           # 页面组件
>│   ├── assets/          # 静态资源
>│   ├── router/          # 路由配置
>│   └── store/           # 状态管理
>├── src-tauri/           # Tauri 后端代码
>│   ├── src/             # Rust 代码
>│   │   ├── main.rs      # Tauri 主入口
>│   │   └── cmd.rs       # 自定义命令
>│   ├── Cargo.toml       # Rust 项目配置
>│   ├── icons/           # 应用图标
>│   └── target/          # Rust 编译文件
>├── public/              # 静态资源
>├── node_modules/        # 前端依赖
>└── dist/                # 构建输出
>```
>
>- node_modules
>
> 前端依赖
>
>- public
>
> 静态资源
>
>- src
>
> Vue 前端代码
>
>- src-tauri
>
> Tauri 后端代码
>
>- index.html
>
>- packge-lock.json
>
>- packge.json
>
> 管理前端依赖的核心文件。
>
> 包含依赖项（`dependencies` 和 `devDependencies`）以及脚本（如 `dev`、`build` 和 `tauri` 的启动命令）。
>
>- tsconfig.json
>
>- tsconfig.node.json
>
>- vite.config.ts
>
> Vite 的配置文件。
>
> 配置构建工具的行为，如插件、路径别名、开发服务器、代码压缩等。
>
>**异常情况**
>
>`"build": "vue-tsc --noEmit && vite build",`
>
>目前打包出现异常 https://github.com/vuejs/language-tools/pull/5020
>
>`"build": "vite build",`
>
>可以打包成功，通过测试可以确定`npx vue-tsc -b`是无法成功的，提示错误
>
>> Search string not found: "/supportedTSExtensions = .*(?=;)/"
>> (Use `node --trace-uncaught ...` to show where the exception was thrown)

- tauri.conf.json 配置说明注释

```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "dream-floating-tools",
  "version": "0.1.0",
  "identifier": "com.dream-floating-tools.app",
  "build": {
    "beforeDevCommand": "npm run dev",
    "devUrl": "http://localhost:5173",
    "beforeBuildCommand": "npm run build",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        // 设置为空字符串以隐藏窗口标题
        "title": "",
        "width": 800,
        "height": 600,
        "resizable": false,
        // 设置为 false 可以隐藏整个窗口边框（包括右上角图标和操作按钮）
        "decorations": false
      }
    ],
    "security": {
      "csp": null
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": ["icons/32x32.png", "icons/128x128.png", "icons/128x128@2x.png", "icons/icon.icns", "icons/icon.ico"]
  }
}
```

- capabilities/default.json 配置说明注释

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Capability for the main window",
  "windows": ["main"],
  // 权限
  "permissions": [
    "core:default",
    "shell:allow-open",
    "core:window:default",
    // 关闭窗口
    "core:window:allow-close",
    // 最小化窗口
    "core:window:allow-minimize",
    // 最大化窗口
    "core:window:allow-maximize",
    // 切换最大化窗口状态
    "core:window:allow-toggle-maximize",
    // 设置窗口显示在最前面
    "core:window:allow-set-always-on-top",
    // 拖动窗口
    "core:window:allow-start-dragging"
  ]
}
```



