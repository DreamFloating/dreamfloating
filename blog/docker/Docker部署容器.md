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
  consul:
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
      - "kafka-data:/bitnami"
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

## prometheus、node-exporter、cadvisor、grafana

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

```bash
vim docker_containers.json
vim docker_host.json
vim monitor_services.json
```

## minio

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



