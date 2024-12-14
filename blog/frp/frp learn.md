# frp learn

[项目地址](https://github.com/fatedier/frp)

[文档地址](https://gofrp.org/zh-cn/docs/overview/)

> 下载部署文件
>
> https://github.com/fatedier/frp/releases
>
> `frps`服务端配置
>
> ```bash
> chmod +x frps
> vim frps.toml
> ```
>
> ```toml
> bindAddr = "0.0.0.0"
> bindPort = 7000
> auth.method = "token"
> auth.token = "token info"
> webServer.addr = "0.0.0.0"
> webServer.port = 7500
> webServer.user = "admin"
> webServer.password = "admin"
> log.to  = "/root/frps/logs/frps.log"
> log.level = "info"
> log.maxDays = 7
> allowPorts = [
> {start = 2000, end = 4000 }
> ]
> ```
>
> 启动命令
>
> ```bash
> ./frps -c ./frps.toml
> ```
>
> 注册成服务
>
> ```bash
> sudo vim /etc/systemd/system/frps.service
> ```
>
> ```
> [Unit]
> # 服务名称，可自定义
> Description = frp server
> After = network.target syslog.target
> Wants = network.target
> 
> [Service]
> Type = simple
> # 启动frpc的命令，需修改为您的frpc的安装路径
> ExecStart = /path/to/frps -c /path/to/frps.toml
> 
> [Install]
> WantedBy = multi-user.target
> ```
>
> ```bash
> # 启动frp
> sudo systemctl start frps
> # 停止frp
> sudo systemctl stop frps
> # 重启frp
> sudo systemctl restart frps
> # 查看frp状态
> sudo systemctl status frps
> # 开机自启动
> sudo systemctl enable frpc
> ```
>
> `frpc`客户端配置
>
> ```bash
> chmod +x frpc
> vim frpc.toml
> ```
>
> ```toml
> serverAddr = "frps server ip"
> serverPort = 7000
> auth.method = "token"
> auth.token = "token info"
> log.to  = "/root/frpc/logs/frpc.log"
> log.level = "info"
> log.maxDays = 7
> 
> [[proxies]]
> name = "ssh"
> type = "tcp"
> localIP = "127.0.0.1"
> localPort = 22
> remotePort = 2000
> transport.useEncryption = true
> transport.useCompression = true
> ```
>
> 启动命令
>
> ```bash
> ./frpc -c ./frpc.toml
> ```
>
> 注册成服务
>
> ```bash
> sudo vim /etc/systemd/system/frpc.service
> ```
>
> ```
> [Unit]
> # 服务名称，可自定义
> Description = frpc
> After = network.target syslog.target
> Wants = network.target
> 
> [Service]
> Type = simple
> # 启动frps的命令，需修改为您的frps的安装路径
> ExecStart = /path/to/frpc -c /path/to/frpc.toml
> 
> [Install]
> WantedBy = multi-user.target
> ```
>
> ```bash
> # 启动frp
> sudo systemctl start frpc
> # 停止frp
> sudo systemctl stop frpc
> # 重启frp
> sudo systemctl restart frpc
> # 查看frp状态
> sudo systemctl status frpc
> # 开机自启动
> sudo systemctl enable frpc
> ```
>

> **动态配置更新**
>
> 要启用此功能，需要在 frpc 中启用 webServer，以提供 API 服务。配置如下：
>
> ```toml
> webServer.addr = "127.0.0.1"
> webServer.port = 7400
> ```
>
> 然后执行以下命令来重载配置：
>
> ```bash
> ./frpc reload -c ./frpc.toml
> ```

## 介绍

> frp 是一款高性能的反向代理应用，专注于内网穿透。它支持多种协议，包括 TCP、UDP、HTTP、HTTPS 等，并且具备 P2P 通信功能。使用 frp，您可以安全、便捷地将内网服务暴露到公网，通过拥有公网 IP 的节点进行中转。

> 通过在具有公网 IP 的节点上部署 frp 服务端，您可以轻松地将内网服务穿透到公网，并享受以下专业特性：
>
> - 多种协议支持：客户端服务端通信支持 TCP、QUIC、KCP 和 Websocket 等多种协议。
> - TCP 连接流式复用：在单个连接上承载多个请求，减少连接建立时间，降低请求延迟。
> - 代理组间的负载均衡。
> - 端口复用：多个服务可以通过同一个服务端端口暴露。
> - P2P 通信：流量不必经过服务器中转，充分利用带宽资源。
> - 客户端插件：提供多个原生支持的客户端插件，如静态文件查看、HTTPS/HTTP 协议转换、HTTP、SOCKS5 代理等，以便满足各种需求。
> - 服务端插件系统：高度可扩展的服务端插件系统，便于根据自身需求进行功能扩展。
> - 用户友好的 UI 页面：提供服务端和客户端的用户界面，使配置和监控变得更加方便。

> **工作原理**
>
> frp 主要由两个组件组成：客户端(frpc) 和 服务端(frps)。通常情况下，服务端部署在具有公网 IP 地址的机器上，而客户端部署在需要穿透的内网服务所在的机器上。
>
> 由于内网服务缺乏公网 IP 地址，因此无法直接被非局域网内的用户访问。用户通过访问服务端的 frps，frp 负责根据请求的端口或其他信息将请求路由到相应的内网机器，从而实现通信。
>
> **代理**
>
> 在 frp 中，一个代理对应一个需要公开访问的内网服务。一个客户端可以同时配置多个代理，以满足不同的需求。
>
> **代理类型**
>
> frp 支持多种代理类型，以适应不同的使用场景。以下是一些常见的代理类型：
>
> - **TCP**：提供纯粹的 TCP 端口映射，使服务端能够根据不同的端口将请求路由到不同的内网服务。
> - **UDP**：提供纯粹的 UDP 端口映射，与 TCP 代理类似，但用于 UDP 流量。
> - **HTTP**：专为 HTTP 应用设计，支持修改 Host Header 和增加鉴权等额外功能。
> - **HTTPS**：类似于 HTTP 代理，但专门用于处理 HTTPS 流量。
> - **STCP**：提供安全的 TCP 内网代理，要求在被访问者和访问者的机器上都部署 frpc，不需要在服务端暴露端口。
> - **SUDP**：提供安全的 UDP 内网代理，与 STCP 类似，需要在被访问者和访问者的机器上都部署 frpc，不需要在服务端暴露端口。
> - **XTCP**：点对点内网穿透代理，与 STCP 类似，但流量不需要经过服务器中转。
> - **TCPMUX**：支持服务端 TCP 端口的多路复用，允许通过同一端口访问不同的内网服务。
>
> 每种代理类型适用于不同的使用情境，您可以根据需求选择合适的代理类型来配置 frp。