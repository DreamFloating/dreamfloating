# Docker部署容器

自定义网络

```bash
docker network create custom
```

## postgres

```bash
docker pull postgres
mkdir /root/docker-compose/postgres
cd /root/docker-compose/postgres
```

得到默认的配置文件

```bash
docker run -i --rm postgres cat /usr/share/postgresql/postgresql.conf.sample > my-postgres.conf
```

```bash
vim docker-compose.yml
```

```yaml
networks:
  custom:
    external: true
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
      - custom
volumes:
  postgresql-data:
```

docker compose指令(**需要在对应的文件夹中执行，文件夹内有docker-compose.yml文件**)

```bash
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

```bash
docker pull mariadb
mkdir /root/docker-compose/mariadb
cd /root/docker-compose/mariadb
vim docker-compose.yml
```

```yaml
networks:
  custom:
    external: true
services:
  mariadb:
    image: "mariadb"
    container_name: "mariadb"
    environment:
      MYSQL_ROOT_PASSWORD: 'qazWSXedcRFV1234!'
    ports:
      - "3306:3306"
    volumes:
      - mariadb-data:/var/lib/mysql
    networks:
      - custom
volumes:
  mariadb-data:
```

```bash
# 进入容器
docker exec -it mariadb bash
# 查看配置
cat /etc/mysql/my.cnf
```

## redis

```bash
docker pull redis
mkdir /root/docker-compose/redis
cd /root/docker-compose/redis
```

从官网拷贝一份配置文件放到`/root/docker-compose/redis`目录下 [reids.conf](https://redis.io/docs/latest/operate/oss_and_stack/management/config-file/)

```bash
vim redis.conf
```

大概在21行 修改

```
# bind 127.0.0.1 -::1
```

大概在1046行 新增

```
requirepass nkrnZipHdC8ztftCFDfJ
```

大概在1394行 修改

```
appendonly yes
```

```bash
vim docker-compose.yml
```

```yaml
networks:
  custom:
    external: true
services:
  redis:
    image: "redis"
    container_name: "redis"
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
      - "./redis.conf:/usr/local/etc/redis/redis.conf"
    command: redis-server /usr/local/etc/redis/redis.conf
    networks:
      - custom
volumes:
  redis-data:
```

## consul

```bash
docker pull hashicorp/consul
mkdir /root/docker-compose/consul
cd /root/docker-compose/consul
vim docker-compose.yml
```

```yaml
networks:
  custom:
    external: true
services:
  redis:
    image: "hashicorp/consul"
    container_name: "consul"
    ports:
      - "8500:8500"
    volumes:
      - consul-data:/consul/data
    command: agent -server -ui -bind=127.0.0.1 -bootstrap-expect=1 -client=0.0.0.0
    networks:
      - custom
volumes:
  consul-data:
```

## influxdb

```bash
docker pull influxdb
mkdir /root/docker-compose/influxdb
cd /root/docker-compose/influxdb
vim docker-compose.yml
```

```yaml
networks:
  custom:
    external: true
services:
  redis:
    image: "influxdb"
    container_name: "influxdb"
    ports:
      - "8086:8086"
    environment:
      DOCKER_INFLUXDB_INIT_MODE: setup
      DOCKER_INFLUXDB_INIT_USERNAME: admin
      DOCKER_INFLUXDB_INIT_PASSWORD: 'M3MhtPPwSCktasjRdX56'
      DOCKER_INFLUXDB_INIT_ORG: sae
      DOCKER_INFLUXDB_INIT_BUCKET: sae_influxdb
    volumes:
      - influxdb2-data:/var/lib/influxdb2
      - influxdb2-config:/etc/influxdb2
    networks:
      - custom
volumes:
  influxdb2-data:
  influxdb2-config:
```

## Kafka and Akhq

```bash
docker pull tchiotludo/akhq
docker pull bitnami/kafka
mkdir /root/docker-compose/kafka
cd /root/docker-compose/kafka
vim docker-compose.yml
```

>akhq配置文件参考地址 对应AKHQ_CONFIGURATION
>
>YML 配置文件示例可在此处找到：[application.example.yml](https://github.com/tchiotludo/akhq/blob/dev/application.example.yml)

```yaml
networks:
  custom:
    external: true
services:
  kafka:
    image: 'bitnami/kafka'
    container_name: "kafka"
    ports:
      - "9092:9092"
    volumes:
      - "kafka_data:/bitnami"
    environment:
      # KRaft settings
      - KAFKA_CFG_NODE_ID=0
      - KAFKA_CFG_PROCESS_ROLES=controller,broker
      - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@kafka:9093
      # Listeners
      - KAFKA_CFG_LISTENERS=PLAINTEXT://0.0.0.0:9092,CONTROLLER://:9093
      # KAFKA_CFG_ADVERTISED_LISTENERS需要与实际访问地址一致
      - KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://192.168.234.129:9092
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT
      - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_CFG_INTER_BROKER_LISTENER_NAME=PLAINTEXT
    networks:
      - custom
  akhq:
    image: 'tchiotludo/akhq'
    container_name: "akhq"
    environment:
      AKHQ_CONFIGURATION: |
        micronaut:
          security:
            enabled: true
            token:
              jwt:
                signatures:
                  secret:
                    generator:
                      secret: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.e30.sOt0052yykJR1Hx-9UyJdZXobGSIO4rjx-58PafHHlQ"
        akhq:
          connections:
            docker-kafka-server:
              properties:
                bootstrap.servers: "kafka:9092"
          security:
            default-group: admin
            basic-auth:
              - username: admin
                # ukAcSF0ZCaT0uwMqX1jb
                password: "859416a18ea542e56744b5f2286acaec3d3d055be535cc168b6b9f77581bee93"
                passwordHash: SHA256
                groups:
                  - admin
    ports:
      - "8090:8080"
    links:
      - kafka
    networks:
      - custom
volumes:
  kafka_data:
```

