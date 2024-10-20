# Electron Music Player

> 使用electron+vite+typescript+vue3开发的一款音乐播放器

> 常用的音频处理库和工具：
>
> [Howler.js](https://howlerjs.com/)
>
> [Web Audio API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Audio_API)
>
> [Tone.js](https://tonejs.github.io/)
>
> [Wavesurfer.js](https://wavesurfer.xyz/)
>
> [Audio5.js](https://zohararad.github.io/audio5js/)
>
> [Pizzicato.js](https://alemangui.github.io/pizzicato/)
>
> 选择合适的音频处理库，主要取决于音乐播放器的复杂度和功能需求。例如，如果只需要基础的音频播放，Howler.js 就足够了；而如果需要高级的音频合成和实时处理，Tone.js 或 Web Audio API 会更合适。

> 在power shell或者cmd中运行命令创建一个新的electron项目
>
> ```sh
> npm create @quick-start/electron df-electron-music-player -- --template vue-ts
> ```

> 升级依赖版本
>
> 在 `package.json` 中，版本号前的符号表示版本范围的约束，常见的符号包括：
>
> 1. **`^` (插入符号)：**
>    - 例如，`^1.2.3` 表示可以更新到 1.x.x 版本的最新版本，但不包括 2.0.0 或更高版本。
>    - 当主版本号（第一个数字）为 0 时，`^0.2.3` 只会更新到 0.2.x，不会更新到 0.3.0。
> 2. **`~` (波浪号)：**
>    - 例如，`~1.2.3` 表示可以更新到 1.2.x 的最新版本，但不包括 1.3.0 或更高版本。
>    - 通常用于希望只更新小版本的情况下。
> 3. **`>` (大于) 和 `<` (小于)：**
>    - 例如，`>1.2.3` 表示安装比 1.2.3 更新的版本，`<2.0.0` 表示安装 2.0.0 以下的版本。
> 4. **`>=` (大于或等于) 和 `<=` (小于或等于)：**
>    - 例如，`>=1.2.3` 表示安装 1.2.3 或更高的版本，`<=2.0.0` 表示安装 2.0.0 或更低的版本。
> 5. **无符号：**
>    - 例如，`1.2.3` 表示只能安装该精确版本。
> 6. **`\*` (星号)：**
>    - 表示可以安装任何版本。
>
> ```
> npm run dev
> ```
>
> 运行正常

> 安装less
>
> ```
> npm install less
> npm install @types/less
> ```

> 安装element-plus
>
> ```sh
> npm install element-plus
> npm install @element-plus/icons-vue
> ```

> 在 Electron 项目中，`vite.main.config.ts`、`vite.preload.config.ts` 和 `vite.renderer.config.ts` 分别用于配置 Vite 构建主进程、预加载脚本和渲染进程的配置。它们的区别在于针对不同的目标和环境进行配置：
>
> 1. **`vite.main.config.ts`（主进程配置）：**
>    - 主要用于配置 Electron 主进程的打包。
>    - 主进程负责创建浏览器窗口、管理应用的生命周期、处理系统级别的事件等。
>    - 这个配置文件中，通常需要设置 `build.target` 为 Node.js 环境，因为主进程运行在 Node.js 上。
>    - 也可以在这个配置中配置一些 Node.js 相关的设置，例如 `external`（排除某些模块）或 `resolve`（别名配置）。
> 2. **`vite.preload.config.ts`（预加载脚本配置）：**
>    - 用于配置 Electron 的预加载脚本。
>    - 预加载脚本运行在渲染器进程和主进程之间，可以访问 Node.js 和浏览器的 API。
>    - 通常用来在渲染器进程中暴露安全的 API，以供前端使用。
>    - 需要配置 `build.target` 为 Node.js 环境，因为预加载脚本可以访问 Node.js 的功能。
> 3. **`vite.renderer.config.ts`（渲染进程配置）：**
>    - 用于配置 Electron 渲染进程的打包。
>    - 渲染进程的配置类似于前端的 Web 项目，因为它是在浏览器环境中运行的。
>    - 可以在这个配置中设置前端相关的构建配置，例如 CSS 处理、JS 代码的打包、静态资源的管理等。
>
> ### 总结
>
> - `vite.main.config.ts` 用于配置 Electron 主进程，运行于 Node.js 环境。
> - `vite.preload.config.ts` 用于配置预加载脚本，运行在 Node.js 环境但能与渲染器进程交互。
> - `vite.renderer.config.ts` 用于配置渲染进程，运行于浏览器环境。
>
> 每个配置文件都有不同的打包目标和配置需求，适用于 Electron 应用的不同模块。

> 安装howler.js
>
> ```sh
> npm install howler
> npm install @types/howler
> ```
>
> 安装vue-router
>
> ```sh
> npm install vue-router
> ```

>安装图标依赖
>
>```sh
>npm install @fortawesome/fontawesome-svg-core
>npm install @fortawesome/free-regular-svg-icons
>npm install @fortawesome/free-solid-svg-icons
>npm install @fortawesome/vue-fontawesome
>npm install mdi-vue3
>```

> 安装sqlite
>
> ```sh
> npm install better-sqlite3
> npm install --save @types/better-sqlite3
> npm install --save-dev @electron/rebuild
> ```
>
> 然后只需重新安装即可触发后安装：
>
> ```sh
> npm install
> npx electron-rebuild
> ```

>安装pinia
>
>```sh
>npm install pinia
>```

> electron中的进程间通信方式
>
> 使用ipcMain和ipcRenderer模块
>
> 要将单向 IPC 消息从渲染器进程发送到主进程，您可以使用 [`ipcRenderer.send`](https://www.electronjs.org/zh/docs/latest/api/ipc-renderer) API 发送消息，然后使用 [`ipcMain.on`](https://www.electronjs.org/zh/docs/latest/api/ipc-main) API 接收。
>
> 双向 IPC 的一个常见应用是从渲染器进程代码调用主进程模块并等待结果。 这可以通过将 [`ipcRenderer.invoke`](https://www.electronjs.org/zh/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args) 与 [`ipcMain.handle`](https://www.electronjs.org/zh/docs/latest/api/ipc-main#ipcmainhandlechannel-listener) 搭配使用来完成。
>
> ### 方法对应关系
>
> | ipcMain 方法                 | ipcRenderer 方法                 | 描述                                     |
> | ---------------------------- | -------------------------------- | ---------------------------------------- |
> | `ipcMain.on`                 | `ipcRenderer.on`                 | 注册监听器，用于监听消息                 |
> | `ipcMain.handle`             | `ipcRenderer.invoke`             | 注册异步处理程序，用于处理请求并返回结果 |
> | `ipcMain.removeListener`     | `ipcRenderer.removeListener`     | 移除指定的监听器                         |
> | `ipcMain.removeAllListeners` | `ipcRenderer.removeAllListeners` | 移除所有监听器                           |
> | `ipcMain.send`               | `ipcRenderer.send`               | 发送异步消息                             |

> ```
> npm install unplugin-vue-components -D
> ```
>

> ```
> npm install music-metadata
> npm install iconv-lite
> npm install chardet
> ```