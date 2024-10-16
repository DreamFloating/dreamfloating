# Electron Learn

edit 2024-10-15

## Electron搭建

[Electron docs](https://www.electronjs.org/zh/docs/latest/)

Electron是一个使用 JavaScript、HTML 和 CSS 构建桌面应用程序的框架。 嵌入 [Chromium](https://www.chromium.org/) 和 [Node.js](https://nodejs.org/) 到 二进制的 Electron 允许您保持一个 JavaScript 代码代码库并创建 在Windows上运行的跨平台应用 macOS和Linux——不需要本地开发 经验。

[Electron Forge docs](https://www.electronforge.io/)

Electron Forge 是一款用于打包和分发 Electron 应用程序的一体化工具。它结合了许多单一用途的软件包，创建了一个完整的开箱即用的构建管道，包括代码签名、安装程序和工件发布。对于高级工作流程，可以通过其[插件 API在 Forge 生命周期中添加自定义构建逻辑。可以通过创建自己的](https://www.electronforge.io/config/plugins)[Makers](https://www.electronforge.io/config/makers)和[Publishers](https://www.electronforge.io/config/publishers)来处理自定义构建和存储目标。

创建新引用程序并使用`vite-typescript`模板（个人偏好）

```sh
npm init electron-app@latest electron-vite-demo -- --template=vite-typescript
```

启动应用

```sh
npm start
```

构建可分发文件

```sh
npm run make
```

### 遇到的问题

[Cannot find module ´electron-squirrel-startup´](https://github.com/electron/forge/issues/3714)

因为使用typescript,安装`@types/electron-squirrel-startup`

```sh
npm i @types/electron-squirrel-startup
```

修改`electron-squirrel-startup`的导入方式

```ts
import electronSquirrelStartup from 'electron-squirrel-startup'
if (electronSquirrelStartup) {
  app.quit()
}
```

因为使用typescript,在`forge.env.d.ts`中新增申明

```ts
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string
declare const MAIN_WINDOW_VITE_NAME: string
```

测试开发环境是否正常显示

```sh
npm start
```

测试打包之后是否正常显示

```sh
npm run package
```

## 集成Vue3

```sh
npm install vue
npm install --save-dev @vitejs/plugin-vue
```

在`src`文件夹下新建`App.vue`

```vue
<template>
  <h1>💖 Hello World!</h1>
  <p>Welcome to your Electron application.</p>
</template>

<script setup>
console.log('👋 This message is being logged by "App.vue", included via Vite');
</script>
```

修改`index.html`

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <title>Hello World!</title>

</head>

<body>
  <div id="app"></div>
  <script type="module" src="/src/renderer.ts"></script>
</body>

</html>
```

在`renderer.js`配置

```js
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');
```

在`vite.renderer.config.mjs`中配置

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [vue()]
});
```

### 遇到的问题

https://github.com/electron/electron/issues/41614

打开控制台会提示错误 暂无其他影响

```sh
[27764:1015/171100.223:ERROR:CONSOLE(1)] "Request Autofill.enable failed. {"code":-32601,"message":"'Autofill.enable' wasn't found"}", source: devtools://devtools/bundled/core/protocol_client/protocol_client.js (1)
[27764:1015/172237.759:ERROR:CONSOLE(1)] "Request Autofill.enable failed. {"code":-32601,"message":"'Autofill.enable' wasn't found"}", source: devtools://devtools/bundled/core/protocol_client/protocol_client.js (1)
```

在开发环境下，控制台会提示`electron`安全警告

https://www.electronjs.org/zh/docs/latest/tutorial/security

## 使用预加载脚本

>Electron 的主进程是一个拥有着完全操作系统访问权限的 Node.js 环境。 除了 [Electron 模组](https://www.electronjs.org/zh/docs/latest/api/app) 之外，您也可以访问 [Node.js 内置模块](https://nodejs.org/dist/latest/docs/api/) 和所有通过 npm 安装的包。 另一方面，出于安全原因，渲染进程默认跑在网页页面上，而并非 Node.js里。
>
>为了将 Electron 的不同类型的进程桥接在一起，我们需要使用被称为 **预加载** 的特殊脚本。

编辑preload.ts

```ts
import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('version', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
})
```

编辑App.vue

```vue
<template>
  <h1>💖 Hello World!</h1>
  <p>Welcome to your Electron application.</p>
  <p id="info"></p>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'

  console.log('👋 This message is being logged by "App.vue", included via Vite')
  const initPage = () => {
    const information = document.getElementById('info')
    information.innerText = `本应用正在使用 Chrome (v${version.chrome()}), Node.js (v${version.node()}), 和 Electron (v${version.electron()})`
  }

  onMounted(() => {
    initPage()
  })
</script>
```

运行之后即可在页面显示版本信息

## 在进程之间通信

>我们之前提到，Electron 的主进程和渲染进程有着清楚的分工并且不可互换。 这代表着无论是从渲染进程直接访问 Node.js 接口，亦或者是从主进程访问 HTML 文档对象模型 (DOM)，都是不可能的。
>
>解决这一问题的方法是使用进程间通信 (IPC)。可以使用 Electron 的 `ipcMain` 模块和 `ipcRenderer` 模块来进行进程间通信。 为了从你的网页向主进程发送消息，你可以使用 `ipcMain.handle` 设置一个主进程处理程序（handler），然后在预处理脚本中暴露一个被称为 `ipcRenderer.invoke` 的函数来触发该处理程序（handler）。
>
>我们将向渲染器添加一个叫做 `ping()` 的全局函数来演示这一点。这个函数将返回一个从主进程翻山越岭而来的字符串。

编辑preload.ts

```ts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('version', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping')
})
```

编辑main.ts

```ts
import { app, BrowserWindow, ipcMain } from 'electron'

// app.on('ready', createWindow)
app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong')
  createWindow()
})
```

编辑App.vue

```vue
<template>
  <h1>💖 Hello World!</h1>
  <p>Welcome to your Electron application.</p>
  <p id="info"></p>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'

  console.log('👋 This message is being logged by "App.vue", included via Vite')
  const initPage = async () => {
    const information = document.getElementById('info')
    information.innerText = `本应用正在使用 Chrome (v${version.chrome()}), Node.js (v${version.node()}), 和 Electron (v${version.electron()})`
    const response = await window.version.ping()
    console.log(response)
  }

  onMounted(() => {
    initPage()
  })
</script>
```

> 预加载脚本包含在浏览器窗口加载网页之前运行的代码。 其可访问 DOM 接口和 Node.js 环境，并且经常在其中使用 `contextBridge` 接口将特权接口暴露给渲染器。
>
> 由于主进程和渲染进程有着完全不同的分工，Electron 应用通常使用预加载脚本来设置进程间通信 (IPC) 接口以在两种进程之间传输任意信息。

## 打包应用程序

清理缓存

```
npx electron-forge publish --clean
```

打包

```sh
npm run package
```

创建安装程序

```sh
npm run make
```

