# frp learn

[项目地址](https://github.com/fatedier/frp)

[文档地址](https://gofrp.org/zh-cn/docs/overview/)

> 下载部署文件
>
> https://github.com/fatedier/frp/releases
>
> `frps`服务端配置
>
> ```
> chmod +x frps
> ```
>
> ```
> bindPort = 7000
> auth.method = "token"
> auth.token = "token info"
> webServer.addr = "0.0.0.0"
> webServer.port = 7500
> webServer.user = "admin"
> webServer.password = "admin"
> log.to  = "./frps.log"
> log.level = "info"
> log.maxDays = 7
> allowPorts = [
> {start = 2000, end = 4000 }
> ]
> ```
>
> 启动命令
>
> ```
> ./frps -c ./frps.toml
> ```
>
> 注册成服务
>
> ```
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
> ```
> # 启动frp
> sudo systemctl start frps
> # 停止frp
> sudo systemctl stop frps
> # 重启frp
> sudo systemctl restart frps
> # 查看frp状态
> sudo systemctl status frps
> ```
>
> `frpc`客户端配置
>
> ```
> chmod +x frpc
> ```
>
> ```
> serverAddr = "frps server ip"
> serverPort = 7000
> auth.method = "token"
> auth.token = "token info"
> log.to  = "./frpc.log"
> log.level = "info"
> log.maxDays = 7
> 
> [[proxies]]
> name = "ssh"
> type = "tcp"
> localIP = "127.0.0.1"
> localPort = 22
> remotePort = 2000
> ```
>
> 启动命令
>
> ```
> ./frpc -c ./frpc.toml
> ```
>
> 注册成服务
>
> ```
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
> ```
> # 启动frp
> sudo systemctl start frpc
> # 停止frp
> sudo systemctl stop frpc
> # 重启frp
> sudo systemctl restart frpc
> # 查看frp状态
> sudo systemctl status frpc
> ```
>
> 