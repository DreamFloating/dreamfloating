# Debian安装nginx

## 安装

[官方文档](https://nginx.org/en/linux_packages.html#Debian)

安装先决条件：

```bash
sudo apt install curl gnupg2 ca-certificates lsb-release debian-archive-keyring
```

导入官方 nginx 签名密钥，以便 apt 可以验证包的真实性。获取密钥：

```bash
curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor \
    | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null
```

验证下载的文件是否包含正确的密钥：

```bash
gpg --dry-run --quiet --no-keyring --import --import-options import-show /usr/share/keyrings/nginx-archive-keyring.gpg
```

输出应包含完整的指纹 `573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62` ，如下所示：

```bash
pub   rsa4096 2024-05-29 [SC]
      8540A6F18833A80E9C1653A42FD21310B49F6B46
uid                      nginx signing key <signing-key-2@nginx.com>

pub   rsa2048 2011-08-19 [SC] [expires: 2027-05-24]
      573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62
uid                      nginx signing key <signing-key@nginx.com>

pub   rsa4096 2024-05-29 [SC]
      9E9BE90EACBCDE69FE9B204CBCDCD8A38D88A2B3
uid                      nginx signing key <signing-key-3@nginx.com>
```

要设置稳定的 nginx 包的 apt 存储库，请运行以下命令：

```bash
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
http://nginx.org/packages/debian `lsb_release -cs` nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list
```

设置存储库固定，以便优先使用我们的软件包而不是发行版提供的软件包：

```bash
echo -e "Package: *\nPin: origin nginx.org\nPin: release o=nginx\nPin-Priority: 900\n" \
    | sudo tee /etc/apt/preferences.d/99nginx
```

要安装 nginx，请运行以下命令：

```bash
sudo apt update
sudo apt install nginx
```

安装完成后，启动 Nginx 服务并检查其状态：

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

## 部署项目

将打包好的dist文件夹重名命为对应的文件夹名后放入`/usr/share/nginx/html/`

编辑默认的配置文件`/etc/nginx/conf.d/default.conf`

