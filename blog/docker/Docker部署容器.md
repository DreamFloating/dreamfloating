# Docker部署容器

## postgres

拉取最新镜像

```
docker pull postgres
```

进入`/root`文件夹

```sh
cd /root
```

创建docker-compose文件夹并进入docker-compose文件夹

```sh
mkdir docker-compose
cd docker-compose
```

创建postgres文件夹并进入postgres文件夹

```sh
mkdir postgres
cd postgres
```

得到默认的配置文件

```
docker run -i --rm postgres cat /usr/share/postgresql/postgresql.conf.sample > my-postgres.conf
```

创建并编辑docker-compose.yml

```
vim docker-compose.yml
```

```yaml
networks:
  custom-network:
    driver: bridge
services:
  postgres:
    image: "postgres"
    container_name: "postgresql"
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: "postgres"
      PGDATA: /var/lib/postgresql/data
    volumes:
      - postgresql-data:/var/lib/postgresql/data
      - ./my-postgres.conf:/etc/postgresql/postgresql.conf
    command: -c 'config_file=/etc/postgresql/postgresql.conf'
    networks:
      - custom-network
volumes:
  postgresql-data:
    driver: local
```

docker compose指令(**需要在对应的文件夹中执行，文件夹内有docker-compose.yml文件**)

```
# 第一次启动
docker compose up -d
# 启动
docker compose start
# 停止
docker compose stop
# 重启
docker compose restart
# 删除
docker compose down
```
