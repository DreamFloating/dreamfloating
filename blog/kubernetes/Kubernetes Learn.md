# Kubernetes Learn

edit 2024-10-13

[参考文档](https://kubernetes.io/zh-cn/docs/home/)

## 理论知识

[概述](https://kubernetes.io/zh-cn/docs/concepts/overview/)

[Kubernetes 架构](https://kubernetes.io/zh-cn/docs/concepts/architecture/)

[容器](https://kubernetes.io/zh-cn/docs/concepts/containers/)

[工作负载](https://kubernetes.io/zh-cn/docs/concepts/workloads/)

[服务、负载均衡和联网](https://kubernetes.io/zh-cn/docs/concepts/services-networking/)

[存储](https://kubernetes.io/zh-cn/docs/concepts/storage/)

[配置](https://kubernetes.io/zh-cn/docs/concepts/configuration/)

[安全](https://kubernetes.io/zh-cn/docs/concepts/security/)

[策略](https://kubernetes.io/zh-cn/docs/concepts/policy/)

[调度、抢占和驱逐](https://kubernetes.io/zh-cn/docs/concepts/scheduling-eviction/)

[集群管理](https://kubernetes.io/zh-cn/docs/concepts/cluster-administration/)

[Kubernetes 中的 Windows](https://kubernetes.io/zh-cn/docs/concepts/windows/)

[扩展 Kubernetes](https://kubernetes.io/zh-cn/docs/concepts/extend-kubernetes/)

## 安装工具

### kubectl

[文档地址](https://kubernetes.io/zh-cn/docs/tasks/tools/install-kubectl-linux/)

Kubernetes 命令行工具 [kubectl](https://kubernetes.io/zh-cn/docs/reference/kubectl/kubectl/)， 让你可以对 Kubernetes 集群运行命令。 你可以使用 kubectl 来部署应用、监测和管理集群资源以及查看日志。

有关更多信息，包括 kubectl 操作的完整列表，请参见 [`kubectl` 参考文件](https://kubernetes.io/zh-cn/docs/reference/kubectl/)。

**用原生包管理工具安装**

更新 `apt` 包索引，并安装使用 Kubernetes `apt` 仓库所需要的包：

```sh
sudo apt-get update
# apt-transport-https 可以是一个虚拟包；如果是这样，你可以跳过这个包
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg
```

下载 Kubernetes 软件包仓库的公共签名密钥。 同一个签名密钥适用于所有仓库，因此你可以忽略 URL 中的版本信息：

```sh
# 如果 `/etc/apt/keyrings` 目录不存在，则应在 curl 命令之前创建它，请阅读下面的注释。
# sudo mkdir -p -m 755 /etc/apt/keyrings
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.31/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
# allow unprivileged APT programs to read this keyring
sudo chmod 644 /etc/apt/keyrings/kubernetes-apt-keyring.gpg
```

添加合适的 Kubernetes `apt` 仓库。如果你想用 v1.31 之外的 Kubernetes 版本， 请将下面命令中的 v1.31 替换为所需的次要版本：

```sh
# 这会覆盖 /etc/apt/sources.list.d/kubernetes.list 中的所有现存配置
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.31/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
# 有助于让诸如 command-not-found 等工具正常工作
sudo chmod 644 /etc/apt/sources.list.d/kubernetes.list
```

更新 `apt` 包索引，然后安装 kubectl：

```sh
sudo apt-get update
sudo apt-get install -y kubectl
```

执行测试，以保障你安装的版本是最新的：

```sh
kubectl version --client
# 查看版本的详细信息
kubectl version --client --output=yaml
```

>**提示**
>
>要将 kubectl 升级到别的次要版本，你需要先升级 `/etc/apt/sources.list.d/kubernetes.list` 中的版本， 再运行 `apt-get update` 和 `apt-get upgrade` 命令。 更详细的步骤可以在[更改 Kubernetes 软件包存储库](https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubeadm/change-package-repository/)中找到。

通过获取集群状态的方法，检查是否已恰当地配置了 kubectl：

例如，如果你想在自己的笔记本上（本地）运行 Kubernetes 集群，你需要先安装一个 [Minikube](https://minikube.sigs.k8s.io/docs/start/) 这样的工具，然后再重新运行上面的命令。

```shell
kubectl cluster-info
```

### minikube

[文档地址](https://minikube.sigs.k8s.io/docs/start/?arch=%2Flinux%2Fx86-64%2Fstable%2Fbinary+download)

To install the latest minikube **stable** release on **x86-64** **Linux** using **Debian package**:

```
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube_latest_amd64.deb
sudo dpkg -i minikube_latest_amd64.deb
```

启动集群 使用docker驱动启动集群

```
minikube start --force --driver=docker
```

要使 docker 成为默认驱动程序：

```
minikube config set driver docker
```

暂停 Kubernetes 而不影响已部署的应用程序：

```shell
minikube pause
```

取消暂停的实例：

```shell
minikube unpause
```

停止集群：

```shell
minikube stop
```

更改默认内存限制（需要重新启动）：

```shell
minikube config set memory 9001
```

浏览易于安装的 Kubernetes 服务目录：

```shell
minikube addons list
```

创建运行旧 Kubernetes 版本的第二个集群：

```shell
minikube start -p aged --kubernetes-version=v1.16.1
```

删除所有 minikube 集群：

```shell
minikube delete --all
```

### Kind

[文档地址](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)

安装命令

```sh
[ $(uname -m) = x86_64 ] && curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.24.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
```

创建集群

```
kind create cluster --name kind
```

得到已创建集群的信息

```
kind get clusters
```

删除集群

```
kind delete cluster --name kind
```

