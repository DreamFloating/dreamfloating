# Electron Learn

edit 2024-10-15

## Electron搭建

[Electron docs](https://www.electronjs.org/zh/docs/latest/)

Electron是一个使用 JavaScript、HTML 和 CSS 构建桌面应用程序的框架。 嵌入 [Chromium](https://www.chromium.org/) 和 [Node.js](https://nodejs.org/) 到 二进制的 Electron 允许您保持一个 JavaScript 代码代码库并创建 在Windows上运行的跨平台应用 macOS和Linux——不需要本地开发 经验。

[Electron Forge docs](https://www.electronforge.io/)

Electron Forge 是一款用于打包和分发 Electron 应用程序的一体化工具。它结合了许多单一用途的软件包，创建了一个完整的开箱即用的构建管道，包括代码签名、安装程序和工件发布。对于高级工作流程，可以通过其[插件 API在 Forge 生命周期中添加自定义构建逻辑。可以通过创建自己的](https://www.electronforge.io/config/plugins)[Makers](https://www.electronforge.io/config/makers)和[Publishers](https://www.electronforge.io/config/publishers)来处理自定义构建和存储目标。

创建新引用程序并使用`vite-typescript`模板（个人偏好）

```
npm init electron-app@latest electron-vite-demo -- --template=vite-typescript
```

启动应用

```
npm start
```

构建可分发文件

```
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

```
npm start
```

测试打包之后是否正常显示

```
npm run package
```

## 集成Vue3

```
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

```
[27764:1015/171100.223:ERROR:CONSOLE(1)] "Request Autofill.enable failed. {"code":-32601,"message":"'Autofill.enable' wasn't found"}", source: devtools://devtools/bundled/core/protocol_client/protocol_client.js (1)
[27764:1015/172237.759:ERROR:CONSOLE(1)] "Request Autofill.enable failed. {"code":-32601,"message":"'Autofill.enable' wasn't found"}", source: devtools://devtools/bundled/core/protocol_client/protocol_client.js (1)
```

在开发环境下，控制台会提示`electron`安全警告

https://www.electronjs.org/zh/docs/latest/tutorial/security

## 发布至Github

安装依赖

```sh
npm install --save-dev @electron-forge/publisher-github
```

