# Docker部署容器

## postgres

拉取最新镜像

```sh
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

```sh
docker run -i --rm postgres cat /usr/share/postgresql/postgresql.conf.sample > my-postgres.conf
```

创建并编辑docker-compose.yml

```sh
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

```sh
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

## mariadb

```sh
docker pull mariadb
```

```sh
mkdir /root/docker-compose/mariadb
cd /root/docker-compose/mariadb
vim docker-compose.yml
```

```sh
docker run --name some-mariadb -v /root/docker-compose/mariadb:/etc/mysql/conf.d --rm mariadb:latest my_print_defaults --mysqld
# 获取到默认配置
docker run --rm mariadb:latest my_print_defaults --mysqld > my.cnf
```

```yaml
networks:
  custom-network:
    driver: bridge
services:
  mariadb:
    image: "mariadb"
    container_name: "mariadb"
    environment:
      MYSQL_ROOT_PASSWORD: 'qazWSXedcRFV1234!'
      MYSQL_DATABASE: sae_mariadb
      MYSQL_USER: dreamfloating
      MYSQL_PASSWORD: 'qazWSXedcRFV1234!'
    ports:
      - "3307:3306"
    volumes:
      - mariadb-data:/var/lib/mysql
    networks:
      - custom-network
volumes:
  mariadb-data:
```

```
# 进入容器
docker exec -it mariadb bash
cat /etc/mysql/my.cnf
```

