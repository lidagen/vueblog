## Redis高级
### linux 操作redis
#### 安装
````sh
#下载解压tar.gz包
wget http://download.redis.io/releases/redis-5.0.7.tar.gz
#进入解压的包
cd ./redis-5.0.7
#编译
make
#安装
make install
````
#### 指定端口启动
````sh
redis-server --prot 6379
#关闭redis
#查进程,找PID号杀掉
ps -ef |grep redis-
kill -s 9 pid号
````
#### 配置文件启动
````sh
#修改目录下的redis.conf,启动
redis-server redis.conf
````

### 持久化
+ 持久化：利用永久存储介质进行保存，在特定时间将保存的数据进行恢复的机制。
+ 持久化是防止意外丢失，确保数据安全
+ 持久化过程工作方式：
  - 数据（快照）：将当前的数据状态进行保存，存储数据结果，关注点在数据。（RDB）
  - 过程（日志）：将数据的操作步骤记录，存储操作过程，关注点在数据操作的过程。（AOF）
#### RDB
+ RDB启动方式---save指令
````sh
#手动执行一次保存操作，保存位置在redis.conf配置的dir目录下dump.rdb文件
save
````
+ RDB相关配置`redis.conf`
````sh
#设置本地保存快照名称，默认值是dump.rdb，可改为dump_端口号.rdb
dbfilename dump.rdb
#存储rdb的路径
dir "/opt/redisData"
#本地存储是否压缩数据，默认yes,如果设置为no,可节省CPU时间，但文件会变大巨大
rdbcompression yes
#设置是如rdb文件格式校验，默认yes,如果设置no，可节约读写10%时间消耗，但存储数据有损坏风险
rdbchecksum yes
#后台bgsave存储出错是否停止保存，默认yes
stop-writes-on-bgsave-error yes
#配置RDB自动保存，叫save后台是bgsave指令
save 300 50
````
+ save指令工作原理
  - 因为redis是单线程的，save指令保存数据会耗时，有可能导致长时间阻塞。线上环境不建议使用
+ bgsave指令 
  - basave命令后，其不是立刻执行，而是会调用fork函数生成子进程保存数据，不占用redis线程。
````sh
#后台保存
bgsave
````
+ **bgsave是针对save的优化，Redis涉及RDB的操作都用bgsave代替save指令**

+ bgsave自动执行
  - 配置：
  ````sh
  #second 监控时间 changes 监控key的变化量
  # 在10秒内监控到了10个key发生了变化就保存
  # 在redis.conf中配置
  save second changes
  ```` 

+ 注意：
    - save配置要根据实际业务设定，频度过高或者过低都可能出现性能问题
    - save配置中second和changes设置通常互补对应关系，尽量不要设置成包含性的关系
    - save配置后是bgsave指令操作
+ rdb特殊启动形式
  - 全量复制 
  - 服务器运行过程中重启
 ````sh
 debug reload
 ```` 
  - 关闭服务器时指定保存数据
````sh
  shutdown save
````    
+ RDB优点
  - RDB是一个紧凑的二进制文件，存储效率高
  - RDB内部存储的是redis在某个时间点的数据快照，非常适用数据备份，全量复制
  - RDB恢复数据速度比AOF快
  - 应用：服务器中每隔N小时执行bgsave备份，并将RDB文件拷贝到远程机器中，用于灾难恢复
+ RDB缺点
  - RDB无论执行指令还是利用配置，都无法做到实时持久化，有较大可能丢失部分数据
  - bgsave指令每次运行需要fork子进程，要牺牲一些性能
  - Redis众多版本未就RDB文件格式统一，不同版本可能无法兼容  

#### AOF
+ append only file:以独立日志的方式记录每次命令，重启后再次执行AOF文件中的命令达到恢复数据的目的。
+ aof解决了数据持久化和实时性，是redis持久化的主流方式
+ aof持久化的三种策略（appendfsync）
  - always(每次): 每次写入都同步到aof文件中，数据零误差，**性能较低**
  - everysec(每秒)：每秒将缓存区的数据同步到aof文件中，数据准确率较高，性能较高，最多丢失1秒内的数据
  - no (系统控制)：由操作系统控制每次aof的周期，**时间不可控**
+ aof开启
````sh
#conf文件中配置，dir中生成aof文件
#是否开启aof，默认no
appendonly yes|no
#策略
appendfsync always|everysec|no
#文件名
appendfilename appendonly_端口号.aof
````  
+ AOF重写
  - 随着命令越来越多，文件会越来越大，为了解决这个问题，Redis引入了aof重写机制，简单来说就是对同一个数据若干条指令转化成的最终结果进行对于指令记录
  - 重写好处：1.降低磁盘占用量；2.降低持久化时间，减少IO；3.数据恢复效率变高
  - 重写方式
````sh
#手动重写
bgrewriteaof
#conf配置
#设置允许重写的最小aof文件大小，避免了达到约定百分比但尺寸仍然很小的情况还要重写
auto-aof-rewrite-min-size 64mb
#aof自动重写配置。当目前aof文件大小超过上一次重写的aof文件大小的百分之多少进行重写
auto-aof-rewrite-percentage 100
````  
#### RDB和AOF的区别
持久化方式 | RDB | AOF | 
- | :-: | :-: | :-: | -: 
占用存储空间  | java  |  AP | 
存储速度  | 小（数据级：压缩）  |  大 （指令级：重写）| 
恢复速度  | 快 |  慢
数据安全性  | 会丢失数据 |  依据策略决定
资源消耗  | 高/重量级  | 低/轻量级  
启动优先级  | 低  | 高|  

##### RDB和AOF选择
+ 数据十分敏感，选AOF
  - 策略为everysec,最多丢失1秒内数据
  - 注意：AOF文件存储较大，恢复较慢
+ 数据呈现阶段有效性，选RDB
  - 数据可以良好做到阶段内无丢失，且恢复较快
  - 注意:利用RDB实现紧凑数据持久化会使redis降的很低

+ 综合对比
  - AOF适用数据敏感业务
  - 如能承受数分钟内丢失，且追求大数据恢复速度，选RDB
  - 容灾恢复选RDB
  - 双保险策略，都开启，重启后Redis优先使用AOF恢复
##### 持久化应用场景
  
#### 两种持久化应用场景

### redis.conf
### 事务
### 集群  