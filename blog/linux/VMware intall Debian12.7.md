# VMware install Debian12.7

edit 2024-10-13

## 1.下载镜像

从[官网](https://www.debian.org/)下载镜像

## 2.配置虚拟机

### 2.1配置虚拟机相关信息

![image-20241013110336160](http://101.133.167.243:9000/typora/2024/10/13/202410131103198.png)

![image-20241013110407195](http://101.133.167.243:9000/typora/2024/10/13/202410131104227.png)

![image-20241013110430213](http://101.133.167.243:9000/typora/2024/10/13/202410131104239.png)

![image-20241013110451381](http://101.133.167.243:9000/typora/2024/10/13/202410131104408.png)

![image-20241013110646708](http://101.133.167.243:9000/typora/2024/10/13/202410131106735.png)

![image-20241013110700255](http://101.133.167.243:9000/typora/2024/10/13/202410131107282.png)

![image-20241013110809270](http://101.133.167.243:9000/typora/2024/10/13/202410131108300.png)

![image-20241013110834473](http://101.133.167.243:9000/typora/2024/10/13/202410131108502.png)

![image-20241013110845773](http://101.133.167.243:9000/typora/2024/10/13/202410131108801.png)

![image-20241013110854599](http://101.133.167.243:9000/typora/2024/10/13/202410131108625.png)

![image-20241013110908750](http://101.133.167.243:9000/typora/2024/10/13/202410131109783.png)

![image-20241013110920917](http://101.133.167.243:9000/typora/2024/10/13/202410131109948.png)

![image-20241013110934786](http://101.133.167.243:9000/typora/2024/10/13/202410131109810.png)

![image-20241013111112550](http://101.133.167.243:9000/typora/2024/10/13/202410131111581.png)

![image-20241013111038857](http://101.133.167.243:9000/typora/2024/10/13/202410131110906.png)

### 2.2开始安装Debian

选择图形化安装

![image-20241013111301602](http://101.133.167.243:9000/typora/2024/10/13/202410131113638.png)

默认选择英文

![image-20241013111439577](http://101.133.167.243:9000/typora/2024/10/13/202410131114728.png)

默认选择美国

![image-20241013111649953](http://101.133.167.243:9000/typora/2024/10/13/202410131116095.png)

默认选择美式英语

![image-20241013111714206](http://101.133.167.243:9000/typora/2024/10/13/202410131117341.png)

设置主机名

![image-20241013111836287](http://101.133.167.243:9000/typora/2024/10/13/202410131118412.png)

设置域名

![image-20241013112004819](http://101.133.167.243:9000/typora/2024/10/13/202410131120947.png)

设置root账号密码

```
MMOZnl=uf_9Z
```

![image-20241013112341262](http://101.133.167.243:9000/typora/2024/10/13/202410131123442.png)

创建用户

![image-20241013112510534](http://101.133.167.243:9000/typora/2024/10/13/202410131125684.png)

设置账号名

![image-20241013112820000](http://101.133.167.243:9000/typora/2024/10/13/202410131128142.png)

设置密码

```
MMOZnl=uf_9Z
```

![image-20241013112938662](http://101.133.167.243:9000/typora/2024/10/13/202410131129790.png)

选择时区

![image-20241013113211613](http://101.133.167.243:9000/typora/2024/10/13/202410131132743.png)

选择第一项

![image-20241013113350646](http://101.133.167.243:9000/typora/2024/10/13/202410131133779.png)

![image-20241013113414307](http://101.133.167.243:9000/typora/2024/10/13/202410131134451.png)

![image-20241013113501695](http://101.133.167.243:9000/typora/2024/10/13/202410131135824.png)

保持默认 点击继续

![image-20241013113607596](http://101.133.167.243:9000/typora/2024/10/13/202410131136732.png)

选择 Yes

![image-20241013113644442](http://101.133.167.243:9000/typora/2024/10/13/202410131136573.png)

选择 No

![image-20241013113930051](http://101.133.167.243:9000/typora/2024/10/13/202410131139184.png)

选择包管理器位置

![image-20241013114007476](http://101.133.167.243:9000/typora/2024/10/13/202410131140631.png)

选择包管理器镜像位置

![image-20241013114111105](http://101.133.167.243:9000/typora/2024/10/13/202410131141238.png)

默认不设置代理

![image-20241013114207989](http://101.133.167.243:9000/typora/2024/10/13/202410131142157.png)

选择 No 不参加调查

![image-20241013114424765](http://101.133.167.243:9000/typora/2024/10/13/202410131144903.png)

选择需要安装的软件 可以选择1、2项安装桌面

![image-20241013114509277](http://101.133.167.243:9000/typora/2024/10/13/202410131145438.png)

选择 Yes

![image-20241013115011427](http://101.133.167.243:9000/typora/2024/10/13/202410131150566.png)

![image-20241013115053219](http://101.133.167.243:9000/typora/2024/10/13/202410131150364.png)

安装完成 点击继续 重启登录系统

![image-20241013115152089](http://101.133.167.243:9000/typora/2024/10/13/202410131151258.png)

## 3.配置root账号SSH访问(可选)

在虚拟机中使用root账号登录系统

安装vim

```
apt install vim
```

进入`/etc/ssh`目录中

```
cd /etc/ssh
```

使用vim编辑sshd_config

```
vim sshd_config
```

新增行

```
PermitRootLogin yes
```

![image-20241013120236527](http://101.133.167.243:9000/typora/2024/10/13/202410131202668.png)

保存退出 重启ssh服务

```
systemctl restart ssh
```

安装ufw防火墙

```
apt install ufw
```

激活防火墙

```
ufw enable
```

开启22端口

```
ufw allow 22
```

使用`ip address`得到Debian主机的ip地址,在SSH客户端访问Debian主机

---

### 使用nftables作为防火墙并使用fail2ban封锁ip

```bash
apt install nftables
```

编辑`/etc/nftables.conf`

```
#!/usr/sbin/nft -f

flush ruleset

table inet filter {
        # 输入链：控制进入服务器的流量
        chain input {
                type filter hook input priority 0; policy drop;

                # 允许本机回环（127.0.0.1 和 ::1）
                iif lo accept

                # 允许已建立和相关的连接（保持 SSH 会话等）
                ct state established,related accept

                # 允许 ICMP（Ping），防止调试时无法访问服务器
                ip protocol icmp accept
                ip6 nexthdr icmpv6 accept

                # 限制同一ip每分钟最多ssh连接请求 超出则丢弃
                tcp dport 22 meter ssh-meter { ip saddr limit rate 3/minute } accept

                # 开放端口
                tcp dport { 7000, 7400 } accept
        }

        # 服务器一般不转发流量，默认丢弃
        chain forward {
                type filter hook forward priority 0; policy drop;
        }

        # 允许服务器发出的所有流量
        chain output {
                type filter hook output priority 0; policy accept;
        }
}
```

重启和设置自启动

```
systemctl restart nftables
systemctl enable nftables
```

```
检查规则
nft list ruleset
添加规则 允许端口流量 比如 10000
sudo nft add rule inet filter input tcp dport 10000 accept
sudo nft list ruleset
sudo nft list ruleset > /etc/nftables.conf
如果系统重启，使用以下命令来恢复规则集
sudo nft -f /etc/nftables.conf
或者直接修改 /etc/nftables.conf 在chain input 末尾添加
tcp dport 10000 accept
tcp dport { 10000, 10001 } accept
重新生效命令
sudo nft -f /etc/nftables.conf
```

**重启也有效需要该命令**

```
nft list ruleset > /etc/nftables.conf
```

### 安装fail2ban自动封锁ip 需要安装rsyslog

```
apt install rsyslog
```

编辑 /etc/ssh/sshd_config 将日志登录改为info

```
LogLevel INFO
```

```
apt install fail2ban
```

```
vim /etc/fail2ban/jail.local
```

```
[DEFAULT]
banaction = nftables-allports

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
bantime = 24h
```

```
systemctl restart ssh
systemctl restart rsyslog
systemclt restart fail2ban
```

