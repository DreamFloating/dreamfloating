# Docker部署容器

自定义网络

```bash
docker network create custom
```

> 目前发现虚拟机挂起恢复后，docker network custom 网络有问题，主机无法正常访问运行的
>
> 重启docker之后可以恢复正常
>
> ```
> systemctl restart docker
> ```
>
> https://blog.csdn.net/congcong365/article/details/131223037 其他解决方案

> `restart` 的选项说明：
>
> - `no`（默认）：容器不会自动重启。
> - `always`：无论退出状态如何，容器始终重启。
> - `unless-stopped`：容器总是重启，除非手动停止。
> - `on-failure[:max-retries]`：仅在容器以非零状态退出时重启，可以指定最大重启次数。

## postgres

> PostgreSQL 是一个功能强大的开源关系型数据库，以其强大的数据完整性、高度可扩展性和支持复杂查询著称。它支持 ACID 特性，拥有多种扩展功能，包括 JSON 数据类型、全文搜索、事务处理和并发控制，广泛应用于企业级和数据密集型应用。

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
    image: "postgres:latest"
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

> MariaDB 是 MySQL 的一个分支，具有高性能、开源、兼容 MySQL 的特点，支持 ACID 事务、分布式架构、分区表等功能。它提供了更高的安全性和更多的存储引擎选项，适合企业级应用和高并发场景。

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
      TZ: 'Asia/Shanghai' # 设置时区
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

> Redis 是一个开源的内存数据库，支持键值对存储，通常用于缓存、会话管理和实时数据处理。它支持丰富的数据结构（如字符串、哈希、列表、集合等），提供持久化选项，保证数据不丢失，适合高性能、低延迟的应用场景。

```bash
docker pull redis
mkdir /root/docker-compose/redis
cd /root/docker-compose/redis
```

从官网拷贝一份配置文件放到`/root/docker-compose/redis`目录下 [reids.conf](https://redis.io/docs/latest/operate/oss_and_stack/management/config-file/)

```bash
vim redis.conf
```

大概在88行 修改

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

> Consul 是一个支持分布式系统的服务网格解决方案，提供服务发现、配置管理和健康检查等功能。它使用键值对存储配置信息，支持自动化服务注册和动态负载均衡，适用于微服务架构中的服务治理和故障恢复。
>
> 2024-11-19
>
> ~~启用acl后有一些问题无法解决,搁置启用acl~~
>
> 直接使用global-management policy创建的agent token好像没有问题，所以可能是创建policy的问题

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
  consul:
    image: "hashicorp/consul"
    container_name: "consul"
    ports:
      - "8500:8500"
    volumes:
      - consul-data:/consul/data
      - ./config:/consul/config
    command: agent -server -bootstrap -ui -bind=127.0.0.1 -client=0.0.0.0 -bootstrap-expect=1
    environment:
      - CONSUL_HTTP_TOKEN=7b73aac7-6c23-d13e-b9b3-34eb03a0367b
    networks:
      - custom
volumes:
  consul-data:
```

创建引导 Token

```bash
docker exec -it consul consul acl bootstrap
```

```
AccessorID:       45d95c0e-e230-1c58-e875-e7eb79c78057
SecretID:         7b73aac7-6c23-d13e-b9b3-34eb03a0367b
Description:      Bootstrap Token (Global Management)
Local:            false
Create Time:      2024-11-19 10:19:11.33823649 +0000 UTC
Policies:
   00000000-0000-0000-0000-000000000001 - global-management
```

在浏览器中访问consul ui页面,并使用bootstrap token登录,直接创建一个新的agent token 使用 global-management policy

~~使用global-management策略创建 agent-token~~

```bash
docker exec -it consul consul acl token create \
  -description "Agent Token" \
  -policy-name "global-management" \
  -token=7b73aac7-6c23-d13e-b9b3-34eb03a0367b
```

> docker容器中配置文件目录`/consul/config`
>
> consul.json
>
> ```
> {
>   "acl": {
>     "enabled": true,
>     "default_policy": "deny",
>     "enable_token_persistence": true,
>     "tokens": {
>       "initial_management": "7b73aac7-6c23-d13e-b9b3-34eb03a0367b",
>       "agent": "d3da2956-0a63-fac4-9b9d-5ad9e5210590"
>     }
>   }
> }
> ```

## influxdb

> InfluxDB 是一个开源的时序数据库，专为高性能地存储和查询时间序列数据而设计，常用于监控、物联网和实时分析。它支持精确的时间戳、高效的数据写入和强大的查询语言（InfluxQL），适合处理大量的时序数据。

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
  influxdb:
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

> **Kafka** 是一个分布式流处理平台，主要用于实时数据流的发布、订阅、存储和处理。Kafka 擅长处理高吞吐量、低延迟的数据流，适用于日志收集、事件跟踪、数据管道等场景。它提供了分区和复制机制，保证数据的可靠性和可扩展性。
>
> **Akhq** 是 Kafka 的管理工具，提供一个基于 Web 的界面，方便用户查看和管理 Kafka 集群。它支持主题浏览、消费者组管理、消息查询和实时监控，简化了 Kafka 的管理流程。

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
      - "kafka-data:/bitnami/kafka"
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
  kafka-data:
```

## Kafka Cluster and Akhq（未完成测试）

```bash
docker pull tchiotludo/akhq
docker pull apache/kafka
mkdir /root/docker-compose/kafka-cluster
cd /root/docker-compose/kafka-cluster
vim docker-compose.yml
```

```yaml
services:
  broker:
    image: apache/kafka:latest
    container_name: broker
    environment:
      KAFKA_NODE_ID: 1
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_LISTENERS: PLAINTEXT://localhost:9092,CONTROLLER://localhost:9093
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@localhost:9093
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_NUM_PARTITIONS: 3
```

```yaml
networks:
  custom:
    external: true
services:
  kafka-c-1:
    image: 'bitnami/kafka'
    container_name: "kafka-c-1"
    volumes:
      - "kafka-data-c-1:/bitnami"
    environment:
      - KAFKA_NODE_ID=1
      - KAFKA_PROCESS_ROLES=controller
      - KAFKA_LISTENERS="CONTROLLER://:9093"
      - KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT
      - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_CONTROLLER_QUORUM_VOTERS="1@kafka-c-1:9093,2@kafka-c-2:9093"
      - KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS=0
    networks:
      - custom
  kafka-c-2:
    image: 'bitnami/kafka'
    container_name: "kafka-c-2"
    volumes:
      - "kafka-data-c-2:/bitnami"
    environment:
      - KAFKA_NODE_ID=2
      - KAFKA_PROCESS_ROLES=controller
      - KAFKA_LISTENERS="CONTROLLER://:9093"
      - KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT
      - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_CONTROLLER_QUORUM_VOTERS="1@kafka-c-1:9093,2@kafka-c-2:9093"
      - KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS=0
    networks:
      - custom
  kafka-c-3:
    image: 'bitnami/kafka'
    container_name: "kafka-c-3"
    volumes:
      - "kafka-data-c-3:/bitnami"
    environment:
      - KAFKA_NODE_ID=3
      - KAFKA_PROCESS_ROLES=controller
      - KAFKA_LISTENERS="CONTROLLER://:9093"
      - KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT
      - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_CONTROLLER_QUORUM_VOTERS="1@kafka-c-1:9093,2@kafka-c-2:9093,3@kafka-c-3:9093"
      - KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS=0
    networks:
      - custom
  kafka-b-1:
    image: 'bitnami/kafka'
    container_name: "kafka-b-1"
    ports:
      - 10001:9092
    volumes:
      - "kafka-data-b-1:/bitnami"
    environment:
      - KAFKA_NODE_ID=4
      - KAFKA_PROCESS_ROLES=broker
      - KAFKA_LISTENERS="PLAINTEXT://:19092,PLAINTEXT_HOST://:9092"
      - KAFKA_ADVERTISED_LISTENERS="PLAINTEXT://kafka-b-1:19092,PLAINTEXT_HOST://localhost:10001"
      - KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT
      - KAFKA_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_LISTENER_SECURITY_PROTOCOL_MAP="CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT"
      - KAFKA_CONTROLLER_QUORUM_VOTERS="1@kafka-c-1:9093,2@kafka-c-2:9093,3@kafka-c-3:9093"
      - KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS=0
    depends_on:
      - kafka-c-1
      - kafka-c-2
      - kafka-c-3
    networks:
      - custom
  kafka-b-2:
    image: 'bitnami/kafka'
    container_name: "kafka-b-2"
    ports:
      - 10002:9092
    volumes:
      - "kafka-data-b-2:/bitnami"
    environment:
      - KAFKA_NODE_ID=5
      - KAFKA_PROCESS_ROLES=broker
      - KAFKA_LISTENERS="PLAINTEXT://:19092,PLAINTEXT_HOST://:9092"
      - KAFKA_ADVERTISED_LISTENERS="PLAINTEXT://kafka-b-2:19092,PLAINTEXT_HOST://localhost:10002"
      - KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT
      - KAFKA_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_LISTENER_SECURITY_PROTOCOL_MAP="CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT"
      - KAFKA_CONTROLLER_QUORUM_VOTERS="1@kafka-c-1:9093,2@kafka-c-2:9093,3@kafka-c-3:9093"
      - KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS=0
    depends_on:
      - kafka-c-1
      - kafka-c-2
      - kafka-c-3
    networks:
      - custom
  kafka-b-3:
    image: 'bitnami/kafka'
    container_name: "kafka-b-3"
    ports:
      - 10003:9092
    volumes:
      - "kafka-data-b-3:/bitnami"
    environment:
      - KAFKA_NODE_ID=6
      - KAFKA_PROCESS_ROLES=broker
      - KAFKA_LISTENERS="PLAINTEXT://:19092,PLAINTEXT_HOST://:9092"
      - KAFKA_ADVERTISED_LISTENERS="PLAINTEXT://kafka-data-b-3:19092,PLAINTEXT_HOST://localhost:10003"
      - KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT
      - KAFKA_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_LISTENER_SECURITY_PROTOCOL_MAP="CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT"
      - KAFKA_CONTROLLER_QUORUM_VOTERS="1@kafka-c-1:9093,2@kafka-c-2:9093,3@kafka-c-3:9093"
      - KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS=0
    depends_on:
      - kafka-c-1
      - kafka-c-2
      - kafka-c-3
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
                bootstrap.servers: "kafka-b-1:9092,kafka-b-2:9092,kafka-b-3:9092"
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
      - kafka-b-1
      - kafka-b-2
      - kafka-b-3
    networks:
      - custom
volumes:
  kafka-data-c-1:
  kafka-data-c-2:
  kafka-data-c-3:
  kafka-data-b-1:
  kafka-data-b-2:
  kafka-data-b-3:
```

参考

```yaml
services:
  controller-1:
    image: apache/kafka:latest
    container_name: controller-1
    environment:
      KAFKA_NODE_ID: 1
      KAFKA_PROCESS_ROLES: controller
      KAFKA_LISTENERS: CONTROLLER://:9093
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@controller-1:9093,2@controller-2:9093,3@controller-3:9093
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0

  controller-2:
    image: apache/kafka:latest
    container_name: controller-2
    environment:
      KAFKA_NODE_ID: 2
      KAFKA_PROCESS_ROLES: controller
      KAFKA_LISTENERS: CONTROLLER://:9093
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@controller-1:9093,2@controller-2:9093,3@controller-3:9093
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0

  controller-3:
    image: apache/kafka:latest
    container_name: controller-3
    environment:
      KAFKA_NODE_ID: 3
      KAFKA_PROCESS_ROLES: controller
      KAFKA_LISTENERS: CONTROLLER://:9093
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@controller-1:9093,2@controller-2:9093,3@controller-3:9093
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0

  broker-1:
    image: apache/kafka:latest
    container_name: broker-1
    ports:
      - 29092:9092
    environment:
      KAFKA_NODE_ID: 4
      KAFKA_PROCESS_ROLES: broker
      KAFKA_LISTENERS: 'PLAINTEXT://:19092,PLAINTEXT_HOST://:9092'
      KAFKA_ADVERTISED_LISTENERS: 'PLAINTEXT://broker-1:19092,PLAINTEXT_HOST://localhost:29092'
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@controller-1:9093,2@controller-2:9093,3@controller-3:9093
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
    depends_on:
      - controller-1
      - controller-2
      - controller-3

  broker-2:
    image: apache/kafka:latest
    container_name: broker-2
    ports:
      - 39092:9092
    environment:
      KAFKA_NODE_ID: 5
      KAFKA_PROCESS_ROLES: broker
      KAFKA_LISTENERS: 'PLAINTEXT://:19092,PLAINTEXT_HOST://:9092'
      KAFKA_ADVERTISED_LISTENERS: 'PLAINTEXT://broker-2:19092,PLAINTEXT_HOST://localhost:39092'
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@controller-1:9093,2@controller-2:9093,3@controller-3:9093
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
    depends_on:
      - controller-1
      - controller-2
      - controller-3

  broker-3:
    image: apache/kafka:latest
    container_name: broker-3
    ports:
      - 49092:9092
    environment:
      KAFKA_NODE_ID: 6
      KAFKA_PROCESS_ROLES: broker
      KAFKA_LISTENERS: 'PLAINTEXT://:19092,PLAINTEXT_HOST://:9092'
      KAFKA_ADVERTISED_LISTENERS: 'PLAINTEXT://broker-3:19092,PLAINTEXT_HOST://localhost:49092'
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@controller-1:9093,2@controller-2:9093,3@controller-3:9093
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
    depends_on:
      - controller-1
      - controller-2
      - controller-3
```

## prometheus、node-exporter、cadvisor、grafana

> **Prometheus**：一个开源监控系统，用于收集、存储和查询时序数据，广泛应用于监控基础设施和应用性能。
>
> **Node Exporter**：Prometheus 的数据采集插件，专门用于收集主机的系统指标（如 CPU、内存、磁盘等），将数据暴露给 Prometheus。
>
> **cAdvisor**：用于监控容器的资源使用情况，如 CPU、内存、网络等，并提供实时监控数据，适合容器化环境。
>
> **Grafana**：数据可视化工具，支持与 Prometheus 等多种数据源集成，可以创建动态仪表板，以图表方式展示监控数据。

参考项目：[dockprom](https://github.com/stefanprodan/dockprom)

```bash
docker pull prom/prometheus
docker pull prom/node-exporter
docker pull gcr.io/cadvisor/cadvisor
docker pull grafana/grafana
mkdir /root/docker-compose/monitor
cd /root/docker-compose/monitor
vim docker-compose.yml
```

```yaml
networks:
  custom:
    external: true
services:
  prometheus:
    image: "prom/prometheus:latest"
    container_name: "prometheus"
    ports:
      - "9090:9090"
    volumes:
      - prometheus-data:/prometheus
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=200h'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--web.enable-lifecycle'
    networks:
      - custom
    labels:
      org.label-schema.group: "monitoring"
  nodeexporter:
    image: "prom/node-exporter:latest"
    container_name: "nodeexporter"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    expose:
      - 9100
    networks:
      - custom
    labels:
      org.label-schema.group: "monitoring"
  cadvisor:
    image: "gcr.io/cadvisor/cadvisor:latest"
    container_name: cadvisor
    privileged: true
    devices:
      - /dev/kmsg:/dev/kmsg
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker:/var/lib/docker:ro
    expose:
      - 8080
    networks:
      - custom
    labels:
      org.label-schema.group: "monitoring"
  grafana:
    image: "grafana/grafana:latest"
    container_name: "grafana"
    ports:
      - '3000:3000'
    expose:
      - 3000
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana/provisioning/dashboards:/etc/grafana/provisioning/dashboards
      - ./grafana/provisioning/datasources:/etc/grafana/provisioning/datasources
    environment:
      - GF_USERS_ALLOW_SIGN_UP=false
    networks:
      - custom
    labels:
      org.label-schema.group: "monitoring"
volumes:
  prometheus-data:
  grafana-data:
```

```bash
vim prometheus.yml
```

```yaml
global:
  scrape_interval:     15s
  evaluation_interval: 15s
  external_labels:
      monitor: 'docker-host-alpha'
scrape_configs:
  - job_name: 'prometheus'
    scrape_interval: 10s
    static_configs:
      - targets: ['localhost:9090']
  - job_name: 'nodeexporter'
    scrape_interval: 5s
    static_configs:
      - targets: ['nodeexporter:9100']
  - job_name: 'cadvisor'
    scrape_interval: 5s
    static_configs:
      - targets: ['cadvisor:8080']
```

```bash
mkdir /root/docker-compose/monitor/grafana
mkdir /root/docker-compose/monitor/grafana/provisioning
mkdir /root/docker-compose/monitor/grafana/provisioning/dashboards
mkdir /root/docker-compose/monitor/grafana/provisioning/datasources
cd /root/docker-compose/monitor/grafana/provisioning/datasources
vim datasource.yml
```

```yaml
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    orgId: 1
    url: http://prometheus:9090
    basicAuth: false
    isDefault: true
    editable: true
```

```bash
cd /root/docker-compose/monitor/grafana/provisioning/dashboards
vim dashboard.yml
```

```yaml
apiVersion: 1
providers:
  - name: 'Prometheus'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    editable: true
    allowUiUpdates: true
    options:
      path: /etc/grafana/provisioning/dashboards
```

显示系统中挂载的文件系统及其类型

```bash
df -T
```

查看`/dev/sda1`的类型

```bash
vim docker_host.json
```

大概在480行 修改为自身系统的文件类型

```
"expr": "sum(node_filesystem_free_bytes{fstype=\"ext4\"})",
```

```bash
vim docker_containers.json
```

大概在406行 修改为自身系统的文件类型

```
"expr": "(node_filesystem_size_bytes{fstype=\"ext4\"} - node_filesystem_free_bytes{fstype=\"ext4\"}) / node_filesystem_size_bytes{fstype=\"ext4\"}  * 100",
```

```bash
vim monitor_services.json
```

## minio

> MinIO 是一个开源的高性能对象存储系统，兼容 Amazon S3 API，适合分布式环境和云原生应用。它提供数据冗余、纠删码和高吞吐量，常用于数据湖、备份和云存储等场景。

```bash
docker pull minio/minio
mkdir /root/docker-compose/minio
cd /root/docker-compose/minio
vim docker-compose.yml
```

```yaml
networks:
  custom:
    external: true
services:
  minio:
    image: "minio/minio:latest"
    container_name: "minio"
    ports:
      - "9001:9000"
      - "9002":"9001"
    volumes:
      - ./data:/data
      - ./config:/root/.minio
    environment:
      - MINIO_ACCESS_KEY=root
      - MINIO_SECRET_KEY=roottoor
    command: server /data --console-address ":9000" --address ":9001"
    networks:
      - custom
```

## emqx

> EMQX 是一个开源、高性能的 MQTT 消息中间件，支持大规模 IoT（物联网）设备的连接与消息通信。它具备 MQTT、MQTT-SN、CoAP 和 HTTP 等多协议支持，具备水平扩展、高可用性和低延迟的特性，适合物联网、智能家居、车联网等场景。

```bash
docker pull emqx/emqx
mkdir /root/docker-compose/emqx
cd /root/docker-compose/emqx
vim docker-compose.yml
```

```yaml
services:
  emqx1:
    image: emqx/emqx:latest
    container_name: emqx1
    environment:
      - "EMQX_NODE_NAME=emqx@node1.emqx.io"
      - "EMQX_CLUSTER__DISCOVERY_STRATEGY=static"
      - "EMQX_CLUSTER__STATIC__SEEDS=[emqx@node1.emqx.io,emqx@node2.emqx.io]"
    healthcheck:
      test: ["CMD", "/opt/emqx/bin/emqx", "ctl", "status"]
      interval: 5s
      timeout: 25s
      retries: 5
    networks:
      custom:
        aliases:
          - node1.emqx.io
    ports:
      - 1883:1883
      - 8083:8083
      - 8084:8084
      - 8883:8883
      - 18083:18083 

  emqx2:
    image: emqx/emqx:latest
    container_name: emqx2
    environment:
      - "EMQX_NODE_NAME=emqx@node2.emqx.io"
      - "EMQX_CLUSTER__DISCOVERY_STRATEGY=static"
      - "EMQX_CLUSTER__STATIC__SEEDS=[emqx@node1.emqx.io,emqx@node2.emqx.io]"
    healthcheck:
      test: ["CMD", "/opt/emqx/bin/emqx", "ctl", "status"]
      interval: 5s
      timeout: 25s
      retries: 5
    networks:
      custom:
        aliases:
          - node2.emqx.io

networks:
  custom:
    external: true
```

## rabbitmq

>  RabbitMQ 是一个开源消息队列系统，支持多种消息协议（如 AMQP、MQTT、STOMP 等）。它通过消息队列实现异步通信、负载均衡和消息路由，适用于分布式系统的数据传输和任务调度。RabbitMQ 提供可靠的消息传递和灵活的路由策略，广泛应用于微服务、日志处理和实时分析等场景。

```bash
docker pull rabbitmq:management
mkdir /root/docker-compose/rabbitmq
cd /root/docker-compose/rabbitmq
vim docker-compose.yml
```

```yaml
services:
  rabbitmq:
    image: "rabbitmq:management"
    container_name: "rabbitmq"
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest
    volumes:
      - rabbitmq-data:/var/lib/rabbitmq
    networks:
      - custom

volumes:
  rabbitmq-data:

networks:
  custom:
    external: true
```

```bash
# 检查插件启用状态
docker exec -it rabbitmq rabbitmq-plugins list
```

> 安装插件的方法 如[rabbitmq-delayed-message-exchange](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange)
>
> 从[rabbitmq-delayed-message-exchange](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases)下载适合版本的.ez文件
>
> 拷贝到容器对应目录中并启用
>
> ```bash
> docker cp rabbitmq_delayed_message_exchange-版本号.ez rabbitmq:/plugins
> docker exec -it rabbitmq rabbitmq-plugins enable rabbitmq_delayed_message_exchange
> docker compose restart rabbitmq
> ```

## sonarqube

> SonarQube 是一个开源的代码质量管理平台，用于持续检查和分析代码的质量、漏洞、安全性和可维护性。它支持多种编程语言，提供丰富的可视化报告和统计信息，帮助开发团队识别和修复代码问题，促进最佳实践和高质量软件的开发。SonarQube 可与 CI/CD 工具集成，支持持续集成和部署过程中的代码质量监控。

查看系统当前参数

```
sysctl vm.max_map_count
sysctl fs.file-max
# 查看可以同时打开的文件描述符的最大数量
ulimit -n
# 查看可以同时运行的最大进程数
ulimit -u
```

修改系统参数 重启失效

```
sysctl -w vm.max_map_count=524288
sysctl -w fs.file-max=131072
ulimit -n 131072
ulimit -u 8192
```

永久修改 在末尾添加

```bash
vim /etc/sysctl.conf
vm.max_map_count=524288
```

```bash
docker pull sonarqube
mkdir /root/docker-compose/sonarqube
mkdir /root/docker-compose/sonarqube/sonarqube_data
mkdir /root/docker-compose/sonarqube/sonarqube_extensions
mkdir /root/docker-compose/sonarqube/sonarqube_logs
sudo chown -R 1000:1000 ./sonarqube_logs ./sonarqube_data ./sonarqube_extensions
cd /root/docker-compose/sonarqube
vim docker-compose.yml
```

```yaml
services:
  sonarqube:
    image: "sonarqube:latest"
    container_name: "sonarqube"
    ports:
      - "9000:9000"
    environment:
      - "SONAR_JDBC_URL=jdbc:postgresql://postgresql:5432/sonarqube"
      - "SONAR_JDBC_USERNAME=postgres"
      - "SONAR_JDBC_PASSWORD=rfvTGByhnUJM"
    volumes:
      - ./sonarqube_data:/opt/sonarqube/data
      - ./sonarqube_extensions:/opt/sonarqube/extensions
      - ./sonarqube_logs:/opt/sonarqube/logs
    networks:
      - custom

networks:
  custom:
    external: true
```

## Nginx

> Nginx 是一个高性能的开源 HTTP 和反向代理服务器，同时也可以用作负载均衡器和缓存服务器。它以处理大量并发连接而著称，广泛用于网站的静态内容服务、API 网关、流媒体传输和反向代理等场景。Nginx 配置灵活，支持多种模块，适合用于现代 Web 应用架构。

```bash
docker pull nginx
mkdir /root/docker-compose/nginx
mkdir /root/docker-compose/nginx/html
cd /root/docker-compose/nginx
docker run --rm --entrypoint=cat nginx /etc/nginx/nginx.conf > nginx.conf
vim docker-compose.yml
```

```yaml
services:
  nginx:
    image: "nginx:latest"
    container_name: "nginx"
    ports:
      - "80:80"
    volumes:
      - "./html:/usr/share/nginx/html:ro" # 只读模式
      - "./nginx.conf:/etc/nginx/nginx.conf:ro" # 只读模式
    networks:
      - custom

networks:
  custom:
    external: true
```

```bash
vim nginx.conf
```

```
server {
  listen 80;
  server_name localhost;

  location / {
    root    html;
    index   index.html index.htm;
  }
  
  error_page   500 502 503 504  /50x.html;
  location = /50x.html {
    root   html;
  }
}
```

```bash
cd /root/docker-compose/nginx/html
vim index.html
```

```html
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

```bash
vim 50x.html
```

```html
<!DOCTYPE html>
<html>
<head>
<title>Error</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>An error occurred.</h1>
<p>Sorry, the page you are looking for is currently unavailable.<br/>
Please try again later.</p>
<p>If you are the system administrator of this resource then you should check
the error log for details.</p>
<p><em>Faithfully yours, nginx.</em></p>
</body>
</html>
```

## Dashy

> Dashy 是一个开源的自托管仪表板工具，允许用户通过自定义的链接和小工具来组织和访问常用的 Web 应用、服务和书签。它提供了友好的用户界面，支持主题和布局定制，适合个人用户和团队用于创建个性化的启动页和工作面板。Dashy 可以方便地集成多种服务，帮助用户提高工作效率。

```bash
docker pull lissy93/dashy
mkdir /root/docker-compose/dashy
cd /root/docker-compose/dashy
vim docker-compose.yml
```

```yaml
services:
  dashy:
    image: "lissy93/dashy:latest"
    container_name: "dashy"
    ports:
      - "8080:8080"
    volumes:
      - "./dashy-data:/app/user-data"
    networks:
      - custom

networks:
  custom:
    external: true
```

## Homepage

> Homepage 是一个开源项目，允许用户通过 Docker 容器快速创建和自托管的个性化启动页，便于访问常用的 Web 应用和链接。

```bash
docker pull lissy93/dashy
mkdir /root/docker-compose/homepage
cd /root/docker-compose/homepage
vim docker-compose.yml
```

```yaml
services:
  homepage:
    image: ghcr.io/gethomepage/homepage:latest
    container_name: homepage
    ports:
      - 10000:3000
    volumes:
      - ./config:/app/config
    networks:
      - custom

networks:
  custom:
    external: true
```

> 将homepage放在nginx后并启用身份验证(未测试)
>
> 首先，安装 `htpasswd` 工具来生成密码文件：
>
> ```
> # 安装 Apache 工具包（Debian/Ubuntu）
> sudo apt-get install apache2-utils
> 
> # 生成密码文件
> htpasswd -c /path/to/htpasswd user1
> ```
>
> 然后，创建一个 Nginx 配置文件（`nginx.conf`）：
>
> ```
> server {
>     listen 80;
> 
>     location / {
>         auth_basic "Protected Area";
>         auth_basic_user_file /etc/nginx/.htpasswd;
> 
>         proxy_pass http://your_upstream_service;
>     }
> }
> ```

## homarr

> Homarr 是一个自托管的仪表板工具，专门设计用于管理和访问个人应用程序、服务和链接。它提供了一个友好的用户界面，允许用户将常用的 Web 应用程序、媒体服务器、游戏和其他服务组织在一个地方。

```
docker pull ghcr.io/ajnart/homarr
mkdir /root/docker-compose/homarr
cd /root/docker-compose/homarr
vim docker-compose.yml
```

```yaml
services:
  homarr:
    image: "ghcr.io/ajnart/homarr:latest"
    container_name: "homarr"
    ports:
      - "7575:7575"
    volumes:
      - "./configs:/app/data/configs"
      - "./icons:/app/public/icons"
      - "./data:/data"
    networks:
      - custom

networks:
  custom:
    external: true
```

## watchtower

> Watchtower 是一个开源的 Docker 容器管理工具，用于自动更新正在运行的 Docker 容器。它监控 Docker 守护进程中的容器，并在检测到基础镜像更新时，自动拉取新镜像并重启相关容器，确保应用程序始终运行最新版本。

## dockge

> Docke 是一个开源的 Docker 前端界面工具，旨在简化 Docker 容器的管理和操作。它提供了一个用户友好的 Web 界面，用户可以通过图形化方式创建、启动、停止和管理 Docker 容器。

## linkace

> LinkAce 是一个自托管的书签管理工具，允许用户收集、组织和分享书签。它提供了一个直观的用户界面，支持标签、分类和搜索功能，帮助用户高效管理他们的在线链接和资源。

> 第一版 需要三个服务 mariadb、linkace、redis
>
> ```bash
> docker pull linkace/linkace:simple
> mkdir /root/docker-compose/linkace
> cd /root/docker-compose/linkace
> vim docker-compose.yml
> vim .env
> chmod 666 /root/docker-compose/linkace/.env
> ```

```yaml
services:
  db:
    image: "mariadb:latest"
    container_name: "linkace-mariadb"
    command: mariadbd --character-set-server=utf8mb4 --collation-server=utf8mb4_bin
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_PASSWORD}
      - MYSQL_USER=${DB_USERNAME}
      - MYSQL_PASSWORD=${DB_PASSWORD}
      - MYSQL_DATABASE=${DB_DATABASE}
    volumes:
      - linkace_db:/var/lib/mysql
  app:
    image: "linkace/linkace:simple"
    container_name: "linkace"
    depends_on:
      - db
    ports:
      - "81:80"
    volumes:
      - ./.env:/app/.env
      - ./backups:/app/storage/app/backups
      - linkace_logs:/app/storage/logs
  redis:
    image: "redis:latest"
    container_name: "linkace-redis"

volumes:
  linkace_logs:
  linkace_db:
    driver: local
```

```
## LINKACE CONFIGURATION

## Please note that the LinkAce Docker image will be renamed with the release of LinkAce 2!
## Read more: https://github.com/Kovah/LinkAce/issues/502

## Basic app configuration
COMPOSE_PROJECT_NAME=linkace
# The environment is usually 'production' but may be changed to 'local' for development
APP_ENV=local
# The app key is generated later, please leave it like that
APP_KEY=someRandomStringWith32Characters
# Enable the debug more if you are running into issues or while developing
APP_DEBUG=true

## Configuration of the database connection
## Attention: Those settings are configured during the web setup, please do not modify them now.
# Set the database driver (mysql, pgsql, sqlsrv, sqlite)
DB_CONNECTION=mysql
# Set the host of your database here
DB_HOST=db
# Set the port of your database here
DB_PORT=3306
# Set the database name here
DB_DATABASE=linkace
# Set both username and password of the user accessing the database
DB_USERNAME=linkace
# Wrap your password into quotes (") if it contains special characters
DB_PASSWORD=qazWSXedc

## Redis cache configuration
# Set the Redis connection here if you want to use it
REDIS_HOST=redis
REDIS_PASSWORD=
REDIS_PORT=6379

## You probably do not want to change any values blow. Only continue if you know what you are doing.
# Configure various driver
SESSION_DRIVER=redis
LOG_CHANNEL=stack
BROADCAST_DRIVER=log
CACHE_DRIVER=redis
QUEUE_DRIVER=database
```

> 第二版 使用已部署的mariadb 和 redis,需要先在mariadb中创建对应的账号和数据库
>
> ```bash
> docker pull linkace/linkace:simple
> mkdir /root/docker-compose/linkace
> cd /root/docker-compose/linkace
> vim docker-compose.yml
> ```

```yaml
services:
  app:
    image: "linkace/linkace:simple"
    container_name: "linkace"
    ports:
      - "81:80"
    volumes:
      - ./.env:/app/.env
      - ./backups:/app/storage/app/backups
      - linkace_logs:/app/storage/logs
    networks:
      - custom

networks:
  custom:
    external: true

volumes:
  linkace_logs:
```

>```bash
>vim .env
>chmod 666 /root/docker-compose/linkace/.env
>```

```
## LINKACE CONFIGURATION

## Please note that the LinkAce Docker image will be renamed with the release of LinkAce 2!
## Read more: https://github.com/Kovah/LinkAce/issues/502

## Basic app configuration
COMPOSE_PROJECT_NAME=linkace
# The environment is usually 'production' but may be changed to 'local' for development
APP_ENV=local
# The app key is generated later, please leave it like that
APP_KEY=someRandomStringWith32Characters
# Enable the debug more if you are running into issues or while developing
APP_DEBUG=true

## Configuration of the database connection
## Attention: Those settings are configured during the web setup, please do not modify them now.
# Set the database driver (mysql, pgsql, sqlsrv, sqlite)
DB_CONNECTION=mysql
# Set the host of your database here
DB_HOST=mariadb
# Set the port of your database here
DB_PORT=3306
# Set the database name here
DB_DATABASE=linkace
# Set both username and password of the user accessing the database
DB_USERNAME=linkace
# Wrap your password into quotes (") if it contains special characters
DB_PASSWORD=qazWSXedc

## Redis cache configuration
# Set the Redis connection here if you want to use it
REDIS_HOST=redis
REDIS_PASSWORD=nkrnZipHdC8ztftCFDfJ
REDIS_PORT=6379

## You probably do not want to change any values blow. Only continue if you know what you are doing.
# Configure various driver
SESSION_DRIVER=redis
LOG_CHANNEL=stack
BROADCAST_DRIVER=log
CACHE_DRIVER=redis
QUEUE_DRIVER=database
```

## portainer

> Portainer 是一个开源的容器管理工具，提供了一个简单易用的 Web 界面，用于管理 Docker 容器、镜像、网络和数据卷。它支持多种 Docker 环境，包括单节点 Docker 和 Docker Swarm 集群，方便用户监控和管理容器化应用。

```bash
docker pull portainer/portainer-ce
mkdir /root/docker-compose/portainer
cd /root/docker-compose/portainer
vim docker-compose.yml
```

```yaml
services:
  portainer:
    image: "portainer/portainer-ce:latest"
    container_name: "portainer"
    ports:
      - "8000:8000"
      - "9443:9443"
      - "9002:9000"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer_data:/data
    networks:
      - custom

networks:
  custom:
    external: true

volumes:
  portainer_data:
```

## linux-dash

> 适用于 Linux 的 Web 仪表板（暂时用不上）

```bash
docker pull imightbebob/linux-dash:x86
mkdir /root/docker-compose/linux-dash
cd /root/docker-compose/linux-dash
vim docker-compose.yml
```

```yaml
services:
  linux-dash:
    image: "imightbebob/linux-dash:x86"
    container_name: "linux-dash"
    ports:
      - "8080:8080"
    networks:
      - custom

networks:
  custom:
    external: true
```

## Mysql

```bash
docker pull mysql
mkdir /root/docker-compose/mysql
cd /root/docker-compose/mysql
vim docker-compose.yml
```

```yaml
services:
  mysql:
    image: "mysql:latest"
    container_name: "mysql"
    ports:
      - "3307:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=qazWSXedcRFV
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_general_ci
    networks:
      - custom
    volumes:
      - mysql-data:/var/lib/mysql
      - ./mysql.cnf:/etc/my.cnf
networks:
  custom:
    external: true

volumes:
  mysql-data:
```

```ini
# For advice on how to change settings please see
# http://dev.mysql.com/doc/refman/9.1/en/server-configuration-defaults.html

[mysqld]
#
# Remove leading # and set to the amount of RAM for the most important data
# cache in MySQL. Start at 70% of total RAM for dedicated server, else 10%.
innodb_buffer_pool_size = 512M
#
# Remove leading # to turn on a very important data integrity option: logging
# changes to the binary log between backups.
# log_bin
#
# Remove leading # to set options mainly useful for reporting servers.
# The server defaults are faster for transactions and fast SELECTs.
# Adjust sizes as needed, experiment to find the optimal values.
# join_buffer_size = 128M
# sort_buffer_size = 2M
# read_rnd_buffer_size = 2M

host-cache-size=0
skip-name-resolve
datadir=/var/lib/mysql
socket=/var/run/mysqld/mysqld.sock
secure-file-priv=/var/lib/mysql-files
user=mysql

pid-file=/var/run/mysqld/mysqld.pid

max_connections = 200

[client]
socket=/var/run/mysqld/mysqld.sock

!includedir /etc/mysql/conf.d/
```

## Nacos

> 2024-11-19
>
> 通过frpc代理，可以正常访问ui，但是在spring cloud中无法注册成功，提示Client not connected, current status:STARTING

```bash
docker pull nacos/nacos-server
mkdir /root/docker-compose/nacos
cd /root/docker-compose/nacos
vim docker-compose.yml
```

```yaml
services:
  nacos:
    image: "nacos/nacos-server:latest"
    container_name: "nacos"
    ports:
      - "8848:8848"
      - "9848:9848"
    environment:
      - PREFER_HOST_MODE=hostname
      - MODE=standalone
      - NACOS_AUTH_ENABLE=true
      - NACOS_AUTH_TOKEN_EXPIRE_SECONDS=18000
      - NACOS_AUTH_IDENTITY_KEY=saeServerIdentity
      - NACOS_AUTH_IDENTITY_VALUE=saeSecurity
      - NACOS_AUTH_TOKEN=UEFlWWM4eTBuVTBvMXNacVhFZTU3R2tHQTVVQUJIMnM=
    networks:
      - custom
    volumes:
      - ./standalone-logs/:/home/nacos/logs
networks:
  custom:
    external: true
```





