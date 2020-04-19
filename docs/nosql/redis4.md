## 企业级解决方案
### 缓存预热
#### 现象
+ 服务器启动后快速宕机
#### 原因
  - 请求数量较大
  - 主从之间数据吞吐量比较大，数据同步操作频率高
#### 解决方案
+ 前置准备工作
  - 日常例行统计数据访问记录，统计访问频度较高的热度数据
  - 利用LRU数据删除策略，构建数据保留队列
+ 准备工作
  - 将统计结果中的数据分类，根据级别，redis优先加载级别较高的热点数据
  - 利用分布式多服务器同时进行数据读取，提速数据加载过程
+ 实施
  - 使用脚本固定触发数据预热过程
  - 如果条件允许，使用CDN

### 缓存雪崩
#### 现象
+ 系统运行过程突然数据库访问激增
+ 导致数据库崩溃引发应用服务器崩溃
#### 原因
+ 在一个较短时间内，缓存中较多的**key集中过期**
+ 大量请求未命中redis,从而给数据库带来大的压力
+ 应用服务器，redis,数据库的重启效果不明显
#### 解决方案
+ 解决方案1
  - 更多页面静态化处理
  - 构建多级缓存架构
    + nginx+redis+ehcache
  - 对数据库查询进行优化
  - 灾难预警：
    + 监控CPU使用
    + 内存容量
    + 平均响应时间
    + 线程数
  - 服务限流、熔断  
+ 解决方案2  
  - LRU和LFU的切换
  - 数据有效期策略
    + 根据业务不同，key失效时间错峰
    + 过期时间使用固定时间+随机值，稀释集中到期key数量
  - 定期维护，对即将过期的数据做访问量统计，确认是否需要延期
  - 加锁：慎用  

### 缓存击穿
#### 现象
+ 系统运**行中，数据库访问激增
+ redis服务器无大量key过期，CPU正常，内存平稳无波动
+ 数据库崩溃
#### 原因
+ **单个key**过期，而这个key访问量很大
+ 大量对这个key的请求，redis未命中，短时间对数据库发起大量访问
#### 解决方案
+ 预先对可能的高热key加大过期时长
+ 实时对流量激增的key延长过期时间或者设置永久key
+ 对可能的高峰访问前，提前刷新数据有效期，确保key在访问时不过期
+ 分布式锁，防止被击穿，但是也影响性能

### 缓存穿透
#### 现象
+ 应用服务器访问增加，redis命中**逐步降低**
+ redis服务器CPU占用激增
+ 数据库压力激增
+ 数据库崩溃
#### 原因
+ 大量非正常URL，要获取的数据根本不存在
+ redis中没有这些数据，所以去请求数据库
+ 可能的黑客攻击
#### 解决方案1
+ redis对没有的数据缓存null,设置较短过期时间（<5min）
+ 白名单策略
  - 提前预热各种分类数据id对于的bitmaps,当数据正常放行，数据异常拦截（效率较低）
  - 布隆过滤器（布隆过滤器命中率这种情况可以忽略）
+ 实施监控
  - 监控redis命中率与null数据的占比
    + 非活动时间波动，通常检测3～5倍，超过5纳入排查
    + 活动时间波动，通村检测10～50倍，超过50纳入排查
+ key加密
  - 问题出现后，临时启动防灾业务key,对key进行业务层传输加密，设定校验程序，对key校验（例如每天随机分配60个加密串，挑选2～3个，混淆在页面数据id中，发现key不满足规则，驳回请求）      
#### 解决方案2

### 性能指标监控
#### 监控指标
+ 性能指标：Performance
+ 内存指标：Memory
+ 基本活动指标：Basicactivity
+ 持久性指标：Persistence
+ 错误指标：Error
#### 性能指标：Performance
NAME | DESC |  
- | :-: | :-: | :-: | -:
latency | redis响应一个请求的时间
OPS | 每秒处理请求总数
hit rate | 缓存命中率（计算出来的）

#### 内存指标：Memory
NAME | DESC |  
- | :-: | :-: | :-: | -:
used_memory | 已使用内存
mem_fragmentation_ratio| 内存碎片率
evicted_keys | 由于内存限制而被移除key数量
blocked clients | 由于BLPOP、BRPOP等命令而阻塞的客户端

#### 基本活动指标：Basicactivity
NAME | DESC |  
- | :-: | :-: | :-: | -:
connected_clients | 客户端连接数
connected_slaves | slave数量
master_last_io_senconds_ago | 最近一次主从交互之后的秒数
keyspace | 数据库key总数

#### 持久性指标：Persistence
NAME | DESC |  
- | :-: | :-: | :-: | -:
rdb_last_save_time | 最后一次保存到磁盘的时间戳
rdb_changes_since_last_save | 自最后一次持久化磁盘后的更改数

#### 错误指标：Error
NAME | DESC |  
- | :-: | :-: | :-: | -:
rejected_connections | 由于达到最大连接数maxcliens限制而被拒绝的连接数
keyspace_misses | key值查找未命中数
master_link_down_since_seconds | 主从断开的秒数

### 性能指标监控命令
#### 监控工具
+ cloud insight redis
+ Prometheus
+ Redis-stat
+ Redis-faina
+ RedisLive
+ Zabbix
#### 监控命令
+ benchmark
````sh
#50个连接，10000次请求对应性能
redis-benchmark
#100个连接，5000次请求对应性能
redis-benchmark -c 100 -n 5000
````
+ redis cli
  - monitor
  - showlog
````sh
#命令 get 获取慢查询日志 len 获取慢查询条数 reset重置慢查询日志
showlog [operator]
 #相关配置
 slowlog-log-slower-than 1000 #设置慢查询时间下限
 slowlog-max-len 100 #设置慢查询命令对应日志显示长度
````+