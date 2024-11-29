# Docker创建自己的镜像容器

## springboot项目容器化部署

> 准备部署的jar包和application.yml
>
> 创建Dockerfile文件

```bash
touch Dockerfile
vim Dockerfile
```

> Dockerfile文件内容

```dockerfile
# 镜像源
FROM openjdk:17-slim

# 工作目录
WORKDIR /sae-gateway

# 将jar包复制到容器工作目录下
COPY springboot-gateway-0.0.1-SNAPSHOT.jar sae-gateway.jar

# 启动jar包
ENTRYPOINT ["java", "-jar", "sae-gateway.jar"]

# 对应的端口 application.yml需要和这里保持一致
EXPOSE 8080
```

> 用当前目录下的Dockerfile文件打包镜像

```bash
docker build -t sae-gateway .
```

> 编写docker-compose.yml文件

```bash
vim docker-compose.yml
```

```yaml
services:
  sae-gateway:
    image: "sae-gateway:latest"
    container_name: "sae-gateway"
    ports:
      - "10000:8080"
    volumes:
      - ./application.yml:/sae-gateway/application.yml
    networks:
      - custom

networks:
  custom:
    external: true
```

```bash
# 进入容器查看信息
docker exec -it sae-gateway /bin/bash
```

