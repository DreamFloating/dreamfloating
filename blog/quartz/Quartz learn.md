# Quartz learn

## 并发

>**默认情况下**，Quartz 会等待上一个作业完成后再执行下一次调度，除非显式地配置允许并发执行。
>
>**使用 `@DisallowConcurrentExecution` 注解**，可以确保作业不会并发执行，Quartz 会等待上一个任务完成后再执行下一次任务。
>
>**如果使用 `@AllowConcurrentExecution`**，作业可以并发执行。
>
>**在集群模式下**，只有一个节点会执行作业，其他节点会等待。

## 表结构

### QRTZ_BLOB_TRIGGERS

> Quartz 用于存储触发器（Triggers）相关信息的表之一，主要用于存储 **序列化的触发器对象**。这个表包含的触发器数据是以二进制（BLOB）格式存储的，通常用来存储那些需要持久化的触发器的状态。Quartz 使用这个表来存储一些复杂的触发器数据，尤其是那些带有复杂状态的触发器（例如，Cron 触发器、Simple 触发器等）。
>
> ```sql
> CREATE TABLE `QRTZ_BLOB_TRIGGERS` (
>   `SCHED_NAME` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
>   `TRIGGER_NAME` varchar(190) COLLATE utf8mb4_general_ci NOT NULL,
>   `TRIGGER_GROUP` varchar(190) COLLATE utf8mb4_general_ci NOT NULL,
>   `BLOB_DATA` blob,
>   PRIMARY KEY (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`),
>   KEY `SCHED_NAME` (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`),
>   CONSTRAINT `QRTZ_BLOB_TRIGGERS_ibfk_1` FOREIGN KEY (`SCHED_NAME`, `TRIGGER_NAME`, `TRIGGER_GROUP`) REFERENCES `QRTZ_TRIGGERS` (`SCHED_NAME`, `TRIGGER_NAME`, `TRIGGER_GROUP`)
> ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
> ```
>
> | 字段名        | 数据类型     | 描述                                                         |
> | ------------- | ------------ | ------------------------------------------------------------ |
> | SCHED_NAME    | varchar(120) | 调度器名称，标识这个触发器所属的调度器。                     |
> | TRIGGER_NAME  | varchar(190) | 触发器的名称。                                               |
> | TRIGGER_GROUP | varchar(190) | 触发器的组名。                                               |
> | BLOB_DATA     | blob         | 存储序列化的触发器对象的二进制数据。这个字段用于存储触发器的具体数据。 |

### QRTZ_CALENDARS

> 用于存储 **日历**（Calendars）相关的数据。Quartz 中的日历功能允许你定义一些特殊的时间排除规则，例如假期、特定的工作日规则等，作业触发器可以使用这些日历来避免在某些时间执行作业。日历可以用于排除特定时间段，确保作业不会在这些不合适的时间运行。
>
> ```sql
> CREATE TABLE `QRTZ_CALENDARS` (
>   `SCHED_NAME` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
>   `CALENDAR_NAME` varchar(190) COLLATE utf8mb4_general_ci NOT NULL,
>   `CALENDAR` blob NOT NULL,
>   PRIMARY KEY (`SCHED_NAME`,`CALENDAR_NAME`)
> ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
> ```
>
> | 字段名        | 数据类型     | 描述                                   |
> | ------------- | ------------ | -------------------------------------- |
> | SCHED_NAME    | varchar(120) | 调度器名称，标识这个日历所属的调度器。 |
> | CALENDAR_NAME | varchar(190) | 日历的名称。                           |
> | CALENDAR      | blob         | 存储日历的序列化数据。                 |

### QRTZ_CRON_TRIGGERS

> Quartz 调度器中用于存储 **Cron 触发器**（Cron Trigger）数据的表。Cron 触发器是一种非常灵活的触发器类型，它允许用户使用类似于 Unix Cron 表达式的方式来定义作业的执行计划。`QRTZ_CRON_TRIGGERS` 表专门用于存储这些 Cron 表达式及其相关的触发器信息。
>
> ```sql
> CREATE TABLE `QRTZ_CRON_TRIGGERS` (
>   `SCHED_NAME` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
>   `TRIGGER_NAME` varchar(190) COLLATE utf8mb4_general_ci NOT NULL,
>   `TRIGGER_GROUP` varchar(190) COLLATE utf8mb4_general_ci NOT NULL,
>   `CRON_EXPRESSION` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
>   `TIME_ZONE_ID` varchar(80) COLLATE utf8mb4_general_ci DEFAULT NULL,
>   PRIMARY KEY (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`),
>   CONSTRAINT `QRTZ_CRON_TRIGGERS_ibfk_1` FOREIGN KEY (`SCHED_NAME`, `TRIGGER_NAME`, `TRIGGER_GROUP`) REFERENCES `QRTZ_TRIGGERS` (`SCHED_NAME`, `TRIGGER_NAME`, `TRIGGER_GROUP`)
> ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
> ```
>
> | 字段名          | 数据类型     | 描述                                           |
> | --------------- | ------------ | ---------------------------------------------- |
> | SCHED_NAME      | varchar(120) | 调度器名称，标识这个 Cron 触发器所属的调度器。 |
> | TRIGGER_NAME    | varchar(190) | Cron 触发器的名称。                            |
> | TRIGGER_GROUP   | varchar(190) | Cron 触发器的组名。                            |
> | CRON_EXPRESSION | varchar(120) | Cron 表达式，定义了作业执行的时间计划。        |
> | TIME_ZONE_ID    | varchar(80)  | 时间区，定义 Cron 表达式的时区。               |

### QRTZ_FIRED_TRIGGERS

> 用于存储已经被触发并执行的触发器信息。每当触发器触发并开始执行作业时，相关的信息（如触发器的名称、组、执行时间等）会被记录到 `QRTZ_FIRED_TRIGGERS` 表中。
>
> ```sql
> CREATE TABLE `QRTZ_FIRED_TRIGGERS` (
>   `SCHED_NAME` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
>   `ENTRY_ID` varchar(95) COLLATE utf8mb4_general_ci NOT NULL,
>   `TRIGGER_NAME` varchar(190) COLLATE utf8mb4_general_ci NOT NULL,
>   `TRIGGER_GROUP` varchar(190) COLLATE utf8mb4_general_ci NOT NULL,
>   `INSTANCE_NAME` varchar(190) COLLATE utf8mb4_general_ci NOT NULL,
>   `FIRED_TIME` bigint NOT NULL,
>   `SCHED_TIME` bigint NOT NULL,
>   `PRIORITY` int NOT NULL,
>   `STATE` varchar(16) COLLATE utf8mb4_general_ci NOT NULL,
>   `JOB_NAME` varchar(190) COLLATE utf8mb4_general_ci DEFAULT NULL,
>   `JOB_GROUP` varchar(190) COLLATE utf8mb4_general_ci DEFAULT NULL,
>   `IS_NONCONCURRENT` varchar(1) COLLATE utf8mb4_general_ci DEFAULT NULL,
>   `REQUESTS_RECOVERY` varchar(1) COLLATE utf8mb4_general_ci DEFAULT NULL,
>   PRIMARY KEY (`SCHED_NAME`,`ENTRY_ID`),
>   KEY `IDX_QRTZ_FT_TRIG_INST_NAME` (`SCHED_NAME`,`INSTANCE_NAME`),
>   KEY `IDX_QRTZ_FT_INST_JOB_REQ_RCVRY` (`SCHED_NAME`,`INSTANCE_NAME`,`REQUESTS_RECOVERY`),
>   KEY `IDX_QRTZ_FT_J_G` (`SCHED_NAME`,`JOB_NAME`,`JOB_GROUP`),
>   KEY `IDX_QRTZ_FT_JG` (`SCHED_NAME`,`JOB_GROUP`),
>   KEY `IDX_QRTZ_FT_T_G` (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`),
>   KEY `IDX_QRTZ_FT_TG` (`SCHED_NAME`,`TRIGGER_GROUP`)
> ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
> ```
>
> | 字段名            | 数据类型     | 描述                                             |
> | ----------------- | ------------ | ------------------------------------------------ |
> | SCHED_NAME        | varchar(120) | 调度器名称，标识这个已触发的触发器所属的调度器。 |
> | ENTRY_ID          | varchar(95)  | 触发器执行历史的唯一标识符。                     |
> | TRIGGER_NAME      | varchar(190) | 被触发的触发器名称。                             |
> | TRIGGER_GROUP     | varchar(190) | 被触发的触发器组名。                             |
> | INSTANCE_NAME     | varchar(190) | 实例名称                                         |
> | FIRED_TIME        | bigint       | 触发器触发的时间。                               |
> | SCHED_TIME        | bigint       | 调度器实际执行作业的时间。                       |
> | PRIORITY          | int          | 优先                                             |
> | STATE             | varchar(16)  | 状态                                             |
> | JOB_NAME          | varchar(190) | 被触发的作业的名称。                             |
> | JOB_GROUP         | varchar(190) | 被触发的作业的组名。                             |
> | IS_NONCONCURRENT  | varchar(1)   | 标识作业是否是非并发执行的。                     |
> | REQUESTS_RECOVERY | varchar(1)   | 是否要求唤醒                                     |

### QRTZ_JOB_DETAILS

>  Quartz 调度器中的核心表之一，用于存储作业的详细信息。每个作业在 Quartz 中都有一个对应的记录，它包含作业的基本属性，如作业名称、作业组、作业执行的类、调度策略等。这个表是 Quartz 调度器管理作业的基础。
>
> ```sql
> CREATE TABLE `QRTZ_JOB_DETAILS` (
>   `SCHED_NAME` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
>   `JOB_NAME` varchar(190) COLLATE utf8mb4_general_ci NOT NULL,
>   `JOB_GROUP` varchar(190) COLLATE utf8mb4_general_ci NOT NULL,
>   `DESCRIPTION` varchar(250) COLLATE utf8mb4_general_ci DEFAULT NULL,
>   `JOB_CLASS_NAME` varchar(250) COLLATE utf8mb4_general_ci NOT NULL,
>   `IS_DURABLE` varchar(1) COLLATE utf8mb4_general_ci NOT NULL,
>   `IS_NONCONCURRENT` varchar(1) COLLATE utf8mb4_general_ci NOT NULL,
>   `IS_UPDATE_DATA` varchar(1) COLLATE utf8mb4_general_ci NOT NULL,
>   `REQUESTS_RECOVERY` varchar(1) COLLATE utf8mb4_general_ci NOT NULL,
>   `JOB_DATA` blob,
>   PRIMARY KEY (`SCHED_NAME`,`JOB_NAME`,`JOB_GROUP`),
>   KEY `IDX_QRTZ_J_REQ_RECOVERY` (`SCHED_NAME`,`REQUESTS_RECOVERY`),
>   KEY `IDX_QRTZ_J_GRP` (`SCHED_NAME`,`JOB_GROUP`)
> ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
> ```
>
> | 字段名            | 数据类型     | 描述                                                         |
> | ----------------- | ------------ | ------------------------------------------------------------ |
> | SCHED_NAME        | varchar(120) | 调度器的名称，标识该作业所属的调度器。                       |
> | JOB_NAME          | varchar(190) | 作业的名称，标识每个作业的唯一标识符。                       |
> | JOB_GROUP         | varchar(190) | 作业的组名，作业可以分组，便于管理。                         |
> | DESCRIPTION       | varchar(250) | 作业的描述，通常用于提供有关作业的更多信息。                 |
> | JOB_CLASS_NAME    | varchar(250) | 作业的执行类的全路径名称（即实现 `Job` 接口的类）。          |
> | IS_DURABLE        | varchar(1)   | 是否持久化作业。`Y` 表示持久化作业，`N` 表示非持久化作业。持久化作业意味着即使调度器重启，作业也会保留。 |
> | IS_NONCONCURRENT  | varchar(1)   |                                                              |
> | IS_UPDATE_DATA    | varchar(1)   |                                                              |
> | REQUESTS_RECOVERY | varchar(1)   |                                                              |
> | JOB_DATA          | blob         |                                                              |

### QRTZ_LOCKS

> Quartz 调度器中的一个表，专门用于管理 Quartz 的锁机制，确保调度器在集群模式下的任务调度协调。其主要功能是帮助 Quartz 调度器在集群中多个节点之间管理任务的执行，避免多个节点同时执行相同的任务。`QRTZ_LOCKS` 表用于存储锁的信息，以便于调度器能够正确地协调作业的执行。
>
> ```sql
> CREATE TABLE `QRTZ_LOCKS` (
>   `SCHED_NAME` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
>   `LOCK_NAME` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
>   PRIMARY KEY (`SCHED_NAME`,`LOCK_NAME`)
> ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
> ```
>
> | 字段名     | 数据类型     | 描述                                                         |
> | ---------- | ------------ | ------------------------------------------------------------ |
> | SCHED_NAME | varchar(120) | 调度器名称，表示锁属于哪个调度器实例。                       |
> | LOCK_NAME  | varchar(40)  | 锁的名称，表示当前锁的唯一标识符。通常是针对某个作业或触发器的锁。 |

### QRTZ_PAUSED_TRIGGER_GRPS

> Quartz 调度器中的一个表，用于存储当前暂停的触发器组信息。Quartz 调度器允许你暂停整个触发器组，这意味着该组下的所有触发器将不会被触发或执行，直到你恢复该组的触发器。`QRTZ_PAUSED_TRIGGER_GRPS` 表记录了哪些触发器组处于暂停状态。
>
> ```sql
> CREATE TABLE `QRTZ_PAUSED_TRIGGER_GRPS` (
>   `SCHED_NAME` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
>   `TRIGGER_GROUP` varchar(190) COLLATE utf8mb4_general_ci NOT NULL,
>   PRIMARY KEY (`SCHED_NAME`,`TRIGGER_GROUP`)
> ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
> ```
>
> | 字段名        | 数据类型     | 描述                                       |
> | ------------- | ------------ | ------------------------------------------ |
> | SCHED_NAME    | varchar(120) | 调度器的名称，标识该触发器组所属的调度器。 |
> | TRIGGER_GROUP | varchar(190) | 触发器组的名称，标识被暂停的触发器组。     |

### QRTZ_SCHEDULER_STATE

> Quartz 调度器中的一个表，用于存储调度器的当前状态信息。Quartz 调度器在执行作业和触发器时，可能会有不同的状态（例如：启动、停止、暂停等）。该表记录了调度器的状态，允许你查询调度器的当前运行状态，特别是在集群环境中，多个调度器实例可以共享同一个数据库，因此此表对于监控和管理调度器的状态非常重要。
>
> ```sql
> CREATE TABLE `QRTZ_SCHEDULER_STATE` (
>   `SCHED_NAME` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
>   `INSTANCE_NAME` varchar(190) COLLATE utf8mb4_general_ci NOT NULL,
>   `LAST_CHECKIN_TIME` bigint NOT NULL,
>   `CHECKIN_INTERVAL` bigint NOT NULL,
>   PRIMARY KEY (`SCHED_NAME`,`INSTANCE_NAME`)
> ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
> ```
>
> | 字段名            | 数据类型     | 描述                                       |
> | ----------------- | ------------ | ------------------------------------------ |
> | SCHED_NAME        | varchar(120) | 调度器的名称，标识该记录所属的调度器实例。 |
> | INSTANCE_NAME     | varchar(190) |                                            |
> | LAST_CHECKIN_TIME | bigint       | 最后验证时间                               |
> | CHECKIN_INTERVAL  | bigint       | 时间间隔                                   |

### QRTZ_SIMPLE_TRIGGERS

> Quartz 调度器中的一个表，用于存储简单触发器（`SimpleTrigger`）的相关信息。`SimpleTrigger` 是 Quartz 中的一种触发器类型，通常用于执行定时任务，并具有非常简单的触发条件。该表记录了 `SimpleTrigger` 的详细配置，帮助调度器管理这些触发器的执行。
>
> ```sql
> CREATE TABLE `QRTZ_SIMPLE_TRIGGERS` (
>   `SCHED_NAME` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
>   `TRIGGER_NAME` varchar(190) COLLATE utf8mb4_general_ci NOT NULL,
>   `TRIGGER_GROUP` varchar(190) COLLATE utf8mb4_general_ci NOT NULL,
>   `REPEAT_COUNT` bigint NOT NULL,
>   `REPEAT_INTERVAL` bigint NOT NULL,
>   `TIMES_TRIGGERED` bigint NOT NULL,
>   PRIMARY KEY (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`),
>   CONSTRAINT `QRTZ_SIMPLE_TRIGGERS_ibfk_1` FOREIGN KEY (`SCHED_NAME`, `TRIGGER_NAME`, `TRIGGER_GROUP`) REFERENCES `QRTZ_TRIGGERS` (`SCHED_NAME`, `TRIGGER_NAME`, `TRIGGER_GROUP`)
> ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
> ```
>
> | 字段名          | 数据类型     | 描述                                                         |
> | --------------- | ------------ | ------------------------------------------------------------ |
> | SCHED_NAME      | varchar(120) | 调度器的名称，标识该记录所属的调度器实例。                   |
> | TRIGGER_NAME    | varchar(190) | 触发器的名称，标识每个触发器的唯一标识符。                   |
> | TRIGGER_GROUP   | varchar(190) | 触发器的组名，用于分组管理触发器。                           |
> | REPEAT_COUNT    | bigint       | 重复间隔时间，表示触发器执行的间隔时间，单位是毫秒。         |
> | REPEAT_INTERVAL | bigint       | 重复次数，表示触发器将会执行多少次。如果值为 `-1`，表示无限次重复。 |
> | TIMES_TRIGGERED | bigint       | 触发器已被触发的次数。                                       |

### QRTZ_SIMPROP_TRIGGERS

> Quartz 调度器中的一个表，用于存储具有自定义属性的触发器。它主要用于存储 `SimpleTrigger` 类型触发器的附加属性（即触发器的自定义数据），这些属性是在触发器定义时动态设置的，用于控制触发器的特定行为。
>
> ```sql
> CREATE TABLE `QRTZ_SIMPROP_TRIGGERS` (
>   `SCHED_NAME` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
>   `TRIGGER_NAME` varchar(190) COLLATE utf8mb4_general_ci NOT NULL,
>   `TRIGGER_GROUP` varchar(190) COLLATE utf8mb4_general_ci NOT NULL,
>   `STR_PROP_1` varchar(512) COLLATE utf8mb4_general_ci DEFAULT NULL,
>   `STR_PROP_2` varchar(512) COLLATE utf8mb4_general_ci DEFAULT NULL,
>   `STR_PROP_3` varchar(512) COLLATE utf8mb4_general_ci DEFAULT NULL,
>   `INT_PROP_1` int DEFAULT NULL,
>   `INT_PROP_2` int DEFAULT NULL,
>   `LONG_PROP_1` bigint DEFAULT NULL,
>   `LONG_PROP_2` bigint DEFAULT NULL,
>   `DEC_PROP_1` decimal(13,4) DEFAULT NULL,
>   `DEC_PROP_2` decimal(13,4) DEFAULT NULL,
>   `BOOL_PROP_1` varchar(1) COLLATE utf8mb4_general_ci DEFAULT NULL,
>   `BOOL_PROP_2` varchar(1) COLLATE utf8mb4_general_ci DEFAULT NULL,
>   PRIMARY KEY (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`),
>   CONSTRAINT `QRTZ_SIMPROP_TRIGGERS_ibfk_1` FOREIGN KEY (`SCHED_NAME`, `TRIGGER_NAME`, `TRIGGER_GROUP`) REFERENCES `QRTZ_TRIGGERS` (`SCHED_NAME`, `TRIGGER_NAME`, `TRIGGER_GROUP`)
> ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
> ```
>
> | 字段名        | 数据类型      | 描述                                                   |
> | ------------- | ------------- | ------------------------------------------------------ |
> | SCHED_NAME    | varchar(120)  | 调度器的名称，标识该触发器所属的调度器实例。           |
> | TRIGGER_NAME  | varchar(190)  | 触发器的名称，标识触发器的唯一标识符。                 |
> | TRIGGER_GROUP | varchar(190)  | 触发器的组名，用于分组管理触发器。                     |
> | STR_PROP_1    | varchar(512)  | 自定义的字符串属性 1，用于存储触发器的附加字符串信息。 |
> | STR_PROP_2    | varchar(512)  | 自定义的字符串属性 2。                                 |
> | STR_PROP_3    | varchar(512)  | 自定义的字符串属性 3。                                 |
> | INT_PROP_1    | int           |                                                        |
> | INT_PROP_2    | int           |                                                        |
> | LONG_PROP_1   | bigint        |                                                        |
> | LONG_PROP_2   | bigint        |                                                        |
> | DEC_PROP_1    | decimal(13,4) |                                                        |
> | DEC_PROP_2    | decimal(13,4) |                                                        |
> | BOOL_PROP_1   | varchar(1)    |                                                        |
> | BOOL_PROP_2   | varchar(1)    |                                                        |

### QRTZ_TRIGGERS

> Quartz 调度器中的一个关键表，用于存储所有类型的触发器（`Trigger`）的相关信息，包括 `SimpleTrigger`、`CronTrigger`、`CalendarIntervalTrigger` 等。这是 Quartz 调度器中的核心表之一，它记录了所有触发器的基础信息，帮助调度器在运行时识别和管理触发器。
>
> ```sql
> CREATE TABLE `QRTZ_TRIGGERS` (
>   `SCHED_NAME` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
>   `TRIGGER_NAME` varchar(190) COLLATE utf8mb4_general_ci NOT NULL,
>   `TRIGGER_GROUP` varchar(190) COLLATE utf8mb4_general_ci NOT NULL,
>   `JOB_NAME` varchar(190) COLLATE utf8mb4_general_ci NOT NULL,
>   `JOB_GROUP` varchar(190) COLLATE utf8mb4_general_ci NOT NULL,
>   `DESCRIPTION` varchar(250) COLLATE utf8mb4_general_ci DEFAULT NULL,
>   `NEXT_FIRE_TIME` bigint DEFAULT NULL,
>   `PREV_FIRE_TIME` bigint DEFAULT NULL,
>   `PRIORITY` int DEFAULT NULL,
>   `TRIGGER_STATE` varchar(16) COLLATE utf8mb4_general_ci NOT NULL,
>   `TRIGGER_TYPE` varchar(8) COLLATE utf8mb4_general_ci NOT NULL,
>   `START_TIME` bigint NOT NULL,
>   `END_TIME` bigint DEFAULT NULL,
>   `CALENDAR_NAME` varchar(190) COLLATE utf8mb4_general_ci DEFAULT NULL,
>   `MISFIRE_INSTR` smallint DEFAULT NULL,
>   `JOB_DATA` blob,
>   PRIMARY KEY (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`),
>   KEY `IDX_QRTZ_T_J` (`SCHED_NAME`,`JOB_NAME`,`JOB_GROUP`),
>   KEY `IDX_QRTZ_T_JG` (`SCHED_NAME`,`JOB_GROUP`),
>   KEY `IDX_QRTZ_T_C` (`SCHED_NAME`,`CALENDAR_NAME`),
>   KEY `IDX_QRTZ_T_G` (`SCHED_NAME`,`TRIGGER_GROUP`),
>   KEY `IDX_QRTZ_T_STATE` (`SCHED_NAME`,`TRIGGER_STATE`),
>   KEY `IDX_QRTZ_T_N_STATE` (`SCHED_NAME`,`TRIGGER_NAME`,`TRIGGER_GROUP`,`TRIGGER_STATE`),
>   KEY `IDX_QRTZ_T_N_G_STATE` (`SCHED_NAME`,`TRIGGER_GROUP`,`TRIGGER_STATE`),
>   KEY `IDX_QRTZ_T_NEXT_FIRE_TIME` (`SCHED_NAME`,`NEXT_FIRE_TIME`),
>   KEY `IDX_QRTZ_T_NFT_ST` (`SCHED_NAME`,`TRIGGER_STATE`,`NEXT_FIRE_TIME`),
>   KEY `IDX_QRTZ_T_NFT_MISFIRE` (`SCHED_NAME`,`MISFIRE_INSTR`,`NEXT_FIRE_TIME`),
>   KEY `IDX_QRTZ_T_NFT_ST_MISFIRE` (`SCHED_NAME`,`MISFIRE_INSTR`,`NEXT_FIRE_TIME`,`TRIGGER_STATE`),
>   KEY `IDX_QRTZ_T_NFT_ST_MISFIRE_GRP` (`SCHED_NAME`,`MISFIRE_INSTR`,`NEXT_FIRE_TIME`,`TRIGGER_GROUP`,`TRIGGER_STATE`),
>   CONSTRAINT `QRTZ_TRIGGERS_ibfk_1` FOREIGN KEY (`SCHED_NAME`, `JOB_NAME`, `JOB_GROUP`) REFERENCES `QRTZ_JOB_DETAILS` (`SCHED_NAME`, `JOB_NAME`, `JOB_GROUP`)
> ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
> ```
>
> | 字段名         | 数据类型     | 描述                                                         |
> | -------------- | ------------ | ------------------------------------------------------------ |
> | SCHED_NAME     | varchar(120) | 调度器的名称，标识该触发器所属的调度器实例。                 |
> | TRIGGER_NAME   | varchar(190) | 触发器的名称，标识触发器的唯一标识符。                       |
> | TRIGGER_GROUP  | varchar(190) | 触发器的组名，用于分组管理触发器。                           |
> | JOB_NAME       | varchar(190) | 触发器所关联的作业名称。                                     |
> | JOB_GROUP      | varchar(190) | 触发器所关联的作业组名。                                     |
> | DESCRIPTION    | varchar(250) | 触发器的描述信息，便于描述触发器的用途或配置。               |
> | NEXT_FIRE_TIME | bigint       | 触发器下次触发的时间（时间戳，单位为毫秒）。                 |
> | PREV_FIRE_TIME | bigint       | 触发器上次触发的时间（时间戳，单位为毫秒）。                 |
> | PRIORITY       | int          | 触发器的优先级，数字越小优先级越高。                         |
> | TRIGGER_STATE  | varchar(16)  | 触发器的当前状态，通常包括 `NORMAL`, `PAUSED`, `COMPLETE`, `BLOCKED` 等。 |
> | TRIGGER_TYPE   | varchar(8)   | 触发器类型                                                   |
> | START_TIME     | bigint       | 触发器的开始时间（时间戳，单位为毫秒）。                     |
> | END_TIME       | bigint       | 触发器的结束时间（时间戳，单位为毫秒）。                     |
> | CALENDAR_NAME  | varchar(190) | 触发器所关联的日历名称。                                     |
> | MISFIRE_INSTR  | smallint     | 触发器错过触发时的处理策略。                                 |
> | JOB_DATA       | blob         | 触发器的作业数据，通常用于保存与作业执行相关的附加数据。     |





