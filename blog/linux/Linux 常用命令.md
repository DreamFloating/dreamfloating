# Linux常用命令

## systemctl

| 命令                                                 | 备注                                   |
| ---------------------------------------------------- | -------------------------------------- |
| systemctl start <service_name>                       | 启动服务                               |
| systemctl stop <service_name>                        | 停止服务                               |
| systemctl restart <service_name>                     | 重启服务                               |
| systemctl reload <service_name>                      | 重新加载服务配置                       |
| systemctl status <service_name>                      | 查看服务状态                           |
| systemctl enable <service_name>                      | 设置服务开机自启                       |
| systemctl disable <service_name>                     | 取消服务开机自启                       |
| systemctl is-enabled <service_name>                  | 查看服务是否开机自启                   |
| systemctl reboot                                     | 重启系统                               |
| systemctl poweroff                                   | 关机系统                               |
| systemctl suspend                                    | 挂起系统                               |
| systemctl is-system-running                          | 查看系统状态                           |
| systemctl list-units                                 | 列出所有可用的单元                     |
| systemctl list-unit-files                            | 列出所有已安装的单元文件               |
| journalctl -u <service_name>                         | 查看服务日志                           |
| journalctl -b                                        | 查看系统引导日志                       |
| systemctl list-units --type=service --state=running  | 查看所有运行的service                  |
| systemctl list-units --type=service --state=inactive | 查看状态为 `inactive` 的服务（未运行） |
| systemctl list-units --type=service --state=failed   | 查看状态为 `failed` 的服务（启动失败） |

## htop

> `htop` 是一个交互式的系统监视器和进程查看工具，比传统的 `top` 命令更为直观和用户友好。它提供了彩色显示、进程树视图和交互式管理进程的功能。以下是一些常用的 `htop` 命令和操作：
>
> 基本操作
>
> - **启动 `htop`**
>
>   ```
>   htop
>   ```
>
>   在终端中输入 `htop` 命令启动工具。
>
> - **退出 `htop`**
>
>   - 按 `q` 键即可退出 `htop`。
>
> 常用键盘快捷键
>
> - **上下箭头键（↑/↓）**
>   - 用于选择进程。
> - **左右箭头键（←/→）**
>   - 切换不同的排序列，如 CPU、内存等。
> - **F2（Setup）**
>   - 进入设置菜单，可以配置显示选项、颜色、排序方式等。
> - **F3（Search）**
>   - 查找进程，可以输入进程名称或部分名称进行搜索。
> - **F4（Filter）**
>   - 过滤进程列表，只显示符合条件的进程。
> - **F5（Tree）**
>   - 切换到进程树视图，显示进程的层级结构。
> - **F6（Sort）**
>   - 更改排序方式，如按 CPU 使用率、内存使用率、进程 ID 等排序。
> - **F7（Nice -） 和 F8（Nice +）**
>   - 调整选定进程的优先级（nice 值），提高或降低其调度优先级。
> - **F9（Kill）**
>   - 结束选中的进程，提供多种信号选项来终止进程。
> - **F10（Quit）**
>   - 退出 `htop`。
>
> 显示和过滤选项
>
> - **显示所有用户的进程**
>   - 按下 `u` 键，然后选择特定用户或显示所有用户的进程。
> - **只显示某个用户的进程**
>   - 按 `u` 键，然后选择该用户。
> - **按 CPU 或内存使用率排序**
>   - 按 `M` 键：按内存使用率排序。
>   - 按 `P` 键：按 CPU 使用率排序。
>   - 按 `T` 键：按运行时间排序。
> - **查看帮助**
>   - 按 `h` 键可以查看 `htop` 的帮助菜单。

## 用户登录信息

> `last` 命令用于显示系统的用户登录和注销记录。它从 `/var/log/wtmp` 文件中读取信息，并按时间顺序显示最近的登录会话。
>
> ```bash
> last
> ```
>
> 这个命令会列出所有用户的登录记录，包括登录时间、退出时间、会话时长以及登录终端。
>
> `lastb` 命令用于显示失败的登录尝试记录。它从 `/var/log/btmp` 文件中读取信息。
>
> ```
> lastb
> ```
>
> 这个命令会列出所有失败的登录尝试，例如错误的用户名或密码。
>
> `who` 命令用于查看当前正在登录的用户列表。
>
> ```
> who
> ```
>
> 这个命令会显示当前所有已登录用户的用户名、登录终端、登录时间和连接的来源（如远程IP地址）。
>
> `lastlog` 命令用于显示所有用户的最后一次登录时间。
>
> ```
> lastlog
> ```
>
> 它会列出系统中所有用户的用户名、最后一次登录的时间和登录的终端。对于从未登录过的用户，显示为 "**Never logged in**"。

## 磁盘命令

> `df`（disk free）命令用于显示文件系统的磁盘空间使用情况。
>
> ```
> df -h
> ```
>
> 显示系统中挂载的文件系统及其类型
>
> ```
> df -T
> ```
>
> `-h` 选项表示以人类可读的格式显示（如 GB、MB），方便查看。
>
> `du`（disk usage）命令用于查看文件和目录占用的磁盘空间大小。
>
> ```
> du -sh /path/to/directory
> ```
>
> `fdisk` 命令用于管理磁盘分区，支持创建、删除、修改分区表。
>
> ```
> sudo fdisk /dev/sda
> ```
>
> 进入交互式界面，执行分区操作（如 `p` 列出分区，`n` 新建分区，`d` 删除分区）。
>
> `parted` 是一个高级的磁盘分区工具，支持更大容量的磁盘。
>
> ```
> sudo parted /dev/sda
> ```
>
> 进入交互模式，可执行分区操作（如 `mkpart` 创建分区，`print` 查看分区）。
>
> `lsblk`（list block devices）命令用于列出所有块设备的信息，包括磁盘和分区的层次结构。
>
> ```
> lsblk
> ```
>
> 可以查看磁盘及其分区的挂载情况。
>
> `blkid` 命令用于查看块设备的属性，如文件系统类型和 UUID。
>
> ```
> blkid
> ```
>
> 显示每个设备的文件系统类型（如 ext4、xfs）和唯一标识符（UUID）。
>
> `mount` 和 `umount` 命令
>
> ```
> sudo mount /dev/sda1 /mnt
> ```
>
> 将 `/dev/sda1` 分区挂载到 `/mnt` 目录。
>
> 卸载磁盘
>
> ```
> sudo umount /mnt
> ```
>
> 将 `/mnt` 目录下的设备卸载。
>
> `mkfs`（make filesystem）命令用于格式化磁盘分区，创建文件系统。
>
> ```
> sudo mkfs.ext4 /dev/sda1
> ```
>
> `ext4` 可以替换为其他文件系统类型（如 `xfs`、`ntfs` 等）。
>
> `fsck`（file system check）命令用于检查和修复文件系统的错误。
>
> ```
> sudo fsck /dev/sda1
> ```
>
> 对 `/dev/sda1` 分区进行文件系统检查。
>
> `swap` 命令
>
> ```
> sudo mkswap /dev/sda2
> ```
>
> 将 `/dev/sda2` 分区格式化为交换分区。
>
> 启用交换分区
>
> ```
> sudo swapon /dev/sda2
> ```
>
> 启用指定的交换分区。
>
> 禁用交换分区
>
> ```
> sudo swapoff /dev/sda2
> ```

## 文件查找

> `find` 命令是一个强大的查找工具，可以根据文件名、类型、大小、修改时间等多种条件查找文件或目录。
>
> ```
> # 按名称查找
> find /path/to/search -name "filename"
> ```
>
> `/path/to/search`：指定查找的路径，`-name` 用于按文件名查找。
>
> ```
> # 查找文件类型
> find /path/to/search -type f
> ```
>
> `-type f` 查找普通文件，`-type d` 查找目录。
>
> ```
> # 按文件大小查找
> find /path/to/search -size +100M
> ```
>
> 查找大于 100MB 的文件，`+` 表示大于，`-` 表示小于。
>
> ```
> # 按修改时间查找
> find /path/to/search -mtime -7
> ```
>
> 查找最近 7 天内修改过的文件，`-mtime +7` 查找超过 7 天未修改的文件。
>
> `locate` 命令通过检索预先生成的数据库快速查找文件。
>
> ```
> locate filename
> ```
>
> 它比 `find` 快，因为查找的是索引文件。但索引可能不是最新的，需要使用 `updatedb` 命令更新数据库。
>
> `which` 命令用于查找可执行文件的路径，通常用来查找命令的实际位置。
>
> ```
> which ls
> ```
>
> 输出 `ls` 命令的实际路径，例如 `/bin/ls`。
>
> `whereis` 命令用于查找命令的二进制文件、源代码文件和手册文件。
>
> ```
> whereis ls
> ```
>
> 可以输出 `ls` 命令的二进制文件路径、源代码路径和手册页路径。
>
> `whatis` 命令用于显示命令的简短描述。
>
> ```
> whatis ls
> ```
>
> 显示 `ls` 命令的简要说明。
>
> `grep` 命令用于在文件内容中查找特定的文本模式。
>
> ```
> grep "pattern" /path/to/file
> ```
>
> 查找文件中包含 `"pattern"` 的行。
>
> 可以将 `find` 的输出传递给 `xargs`，对找到的文件执行批量操作。
>
> ```
> find /path/to/search -name "*.txt" | xargs grep "pattern"
> ```
>
> 查找以 `.txt` 结尾的文件，并在这些文件中查找包含 `"pattern"` 的行。
>
> `tree` 命令以树状结构显示目录内容。
>
> ```
> tree /path/to/directory
> ```
>
> 显示指定目录及其子目录的树状结构。

## 端口

```
ss -tuln | grep 80
```

## 防火墙

查找

```
sudo iptables -L -n --line-numbers | grep 18083
```

