# Docker常用命令

| 命令                                                         | 备注                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| docker pull 镜像名称                                         | 拉取最新镜像                                                 |
| docker images                                                | 查看所有已拉取的镜像                                         |
| docker volume list                                           | 查看所有已创建的卷                                           |
| docker network list                                          | 查看所有网络                                                 |
| docker compose up -d                                         | 创建或启动当前路径下的docker-compose.yml文件中定义的容器，并在后台运行 |
| docker compose down                                          | 停止并删除当前路径下的docker-compose.yml文件中定义的容器、网络 |
| docker-compose down --volumes                                | 停止并删除容器、网络以及数据卷                               |
| docker-compose down --rmi all                                | 停止并删除容器、网络，并删除镜像                             |
| docker ps                                                    | 查看当前正在运行的容器                                       |
| docker ps -a                                                 | 查看所有已创建的容器                                         |
| docker logs 容器名                                           | 查看容器运行日志                                             |
| docker save -o my-image.tar my-image:latest                  | 导出docker镜像                                               |
| docker load -i /path/to/destination/my-image.tar             | 导入docker镜像                                               |
| docker export -o my-container.tar my-container               | 导出docker容器 my-container表示容器ID                        |
| docker import /path/to/destination/my-container.tar my-imported-image | 导入docker容器为新的镜像                                     |
|                                                              |                                                              |

