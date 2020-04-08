## Redis集群
### 主从复制
#### 1.主从复制简介
+ 单机Redis风险与问题
  - 机器故障
  - 容量瓶颈
+ 为了避免单机的服务器故障，我们准备多台服务器，将数据复制多个副本保存在不同服务器上，**连接在一起**，并保证数据是**同步**的，这样即使有一台Redis出现故障，其他机器仍然能够提供服务，实现Redis的搞可用，同时实现数据**冗余备份**。  
+ 多台服务器连接方案：一主(master)多从(slave)，主提供写操作，从提供读操作，主的数据同步给从，保证数据一致性。

+ 主从复制的作用：
    - 读写分离：master写，slave读，提高服务器的读写负载能力
    - 负载均衡：基于主从架构，配合读写分离，由slave分担master负载，并根据需求的变化，改变slave的数量，通过多个从节点分担数据读取负载，大大提高了redis服务器并发量和数据吞吐量
    - 故障恢复：当master出现问题，有slave提供服务，实现快速故障恢复
    - 数据冗余：实现数据热备份，是持久化之外的一种数据冗余方式
    - 高可用基石：基于主从复制，构建哨兵模式和集群，实现redis高可用方案

#### 2.主从复制工作流程
+ 主从复制大体可以分为3个阶段：
  - 建立连接阶段：slave连接master
  - 数据同步阶段：master同步数据给slave
  - 命令传播阶段：master数据变化同步给slave

##### 2.1建立连接阶段工作流程
+ 设置master地址和端口，保存master信息
+ 建立socket连接
+ 发送ping命令（定时器）
+ 身份验证
+ 发送slave端口信息  

 | master |  slave |   
- | :-: | :-: | :-: | -:
 || 1.发送指令：slaveof ip port | 
 | 2.接受指令，响应对方 |  | 
 |  | 3.保存master ip port
 |  | 4.根据保存的信息创立socket
 |  | 5.周期性的发送ping
 | 6.响应pong | 
 |  | 7.发送指令 auth passord
 | 8.响应鉴权 | 
 |  | 9.发送指令 replconf listening-port &lt;port-number&gt;
 | 10.保存slave port | 

+ 主从复制配置
 `````sh
 #设置slave redis.conf#
 #redis.conf配置文件加主ip 端口
 slaveof 127.0.0.1 6379

 #如果需要设置密码#
 #master配置文件
 requirepass <password>
 #slaver配置文件
 masterauth <password>
 `````

 ##### 2.2数据同步阶段工作流程
 + 请求同步数据
 + 创建RDB同步数据
 + 恢复RDB同步数据
 + 请求部分同步数据
 + 恢复部分同步数据


 | master |  slave |   
- | :-: | :-: | :-: | -:
 || 1.发送指令：sync2 | 
 | 2.执行bgsave |  | 
 | 3.第一个slave连接时，创建命令缓冲区 | 
 | 4.生成RDB文件，通过socket发送给slave| 
 |  | 5.接收RDB文件，并清空自己的数据，执行RDB文件恢复
 |  | 6.发送命令告知RDB恢复完成
 |  7.发送复制缓冲区信息| 
 |  | 8.接受信息，执行bgrewriteaof，恢复数据

 **1~5全量复制，6～8增量复制**

  ###### 2.2.1数据同步注意事项
  + master端：
    - 如果master数据量巨大，数据同步应避开流量高峰期，避免造成master阻塞
    - 复制缓冲区大小设定不合理，会导致数据溢出，如进行全量复制周期太长，进行部分复制时发现数据已经存在丢失的情况，必须进行第二次全量复制，使slave陷入死循环
    ````sh
    #master端,设定复制缓冲区大小
    repl-backlog-size 1mb
    ````
    - master单机内存占用主机内存不应过大，建议使用50%-70%的内存，留下30%-50%执行bgsave命令和创建复制缓冲区

+ slave端：
  - 为避免slave进行全量复制、增量复制时服务器响应阻塞或数据不同步，建议关闭此时对外服务
  ````sh
  #slave端
  slave-server-slate-data yes|no
  ````
  - 数据同步阶段，master发送给slave信息可以理解master是slave的客户端，主动向slave发送命令
  - 多个slave同时对master请求数据同步，master发送的RDB文件增多，会对带宽造成巨大冲击，因此数据同步需要根据业务需求，适量错峰
  - slave过多时，建议调整拓扑结构，由一主多从结构变为树状结构，中间的节点即是master,也是slave。注意树状结构，层数越高，导致最地层slave和顶层master间数据同步延迟较大，谨慎选择

#####  2.3命令传播阶段工作流程
###### 2.3.1概念
+ 当master数据被修改后，导致主从数据不一致，这时需要从master同步数据到slave,这个阶段就是命令传播阶段
+ master将接收的数据变更命令发送给slave,slave接到命令后执行命令

+ 命令传播阶段可能出现断网情况
  - 网络闪断闪连     ---- 忽略
  - 端世界网络中断 ---- 部分复制
  - 长时间网络中断 ---- 全量复制

+  部分复制的时候需要三个核心要素
   - 服务器的运行id (run_id)
     + 每个redis启动都会生成一个运行run_id,多次运行id不同
   - 主服务器复制积压缓冲区
     + 是一个先进先出的队列，用于存储服务器执行过的命令，每次传播命令，master都将传播的命令记录下来，并保存在复制积压缓冲区
     + 每台服务器启动时，如果开启AOF或被连接成为master节点，即创建复制缓冲区（所以AOF一般需要开启）
     + 它的作用就是保存master收到的所有修改数据的指令（同步给slave）
   - 主服务器的复制偏移量(offset)
     + 偏移量对应字节值，用来确定不同slave同步数据的位置
     + 同步信息，对比master和slave差异，当slave断线，恢复数据用

###### 2.3.2 数据同步+命令传播流程
<font color=#900000  >红色为master</font>,<font color=#116100 >绿色为slave</font>，
1～5全量复制，6～8部分复制
 | master |  slave |   
- | :-: | :-: | :-: | -:
 || 1.发送指令：psync2  ? -1| 
 | 2.执行bgsave 生成RDB文件，记录当前复制偏移量<font color=#900000 >offset</font>|  | 
 | 3.发送 +FULLRESYNC  <font color=#900000 >run_id</font>,<font color=#900000 >offset</font> 通过socket发送RDB给slave,期间接受客户端命令，<font color=#900000 >offset</font>发生变化| 
 | | 4.收到 +FULLRESYNC 保存了master的 <font color=#900000 >run_id</font>,<font color=#900000 >offset</font> 清空当前数据，通过socket接收RDB数据，恢复RDB数据
 |  | 5.发送命令：psync2 <font color=#116100 >run_id</font>, <font color=#116100 >offset</font>
 | 6.接收命令，判断<font color=#116100 >run_id</font> ,<font color=#116100 >offset</font>是否在复制缓冲区 | 
 |  7.如果<font color=#116100 >run_id</font> ,<font color=#116100 >offset</font>有一个不满足，执行全量复制1| 
 |  7.如果<font color=#116100 >run_id</font> ,<font color=#116100 >offset</font>校验通过，<font color=#116100 >offset</font>和<font color=#900000 >offset</font>相同，忽略| 
 |7.如果<font color=#116100 >run_id</font> ,<font color=#116100 >offset</font>校验通过，<font color=#116100 >offset</font>和<font color=#900000 >offset</font>不相同，发送 + CONTINUE <font color=#900000 >offset</font>，通过socket发送复制缓冲区中的<font color=#116100 >offset</font>到<font color=#900000 >offset</font>的数据|
 ||8.收到+ CONTINUE ，保存master的<font color=#900000 >offset</font>，接收消息后执行bgrewirteaof，恢复数据

##### 2.3.3 心跳机制
+ 进入命令传播阶段，master与slave间需要进行信息交换，使用心跳机制进行维护，实现双方连接在线
+ 当slave多数掉线或者延迟过高，master为了保障数据稳定性，将拒绝所有数据同步操作
````sh
#slave数量小于2个，或者所有slave的延迟大于8秒，将拒绝同步操作
min-slaves-to-wirte 2
min-slaves-max-lag 8
````
#### 3.主从复制常见问题

##### 3.1频繁全量复制1
+ 问题现象：伴随系统运行，master数量也会变多，一旦master重启，其run_id变化，会导致所有slave全量复制操作
+ 内部优化方案：
  - master内部创建一个master_replid变量，使用和run_id一样生成策略，并发送给所有slave
  - 当master需要关闭时执行shutdown save,将RDB持久化，将run_id和offset保存在RDB中
  - master重启后加载RDB，恢复数据，并将run_id和offset加载到内存中
  - 作用：master重启后恢复原来的run_id，使所有slave认为还是以前的master  

##### 3.2频繁全量复制2
  + 问题现象： 网络环境不佳，出现网络中断，slave不提供服务
  + 复制缓冲区过小，断网后slave的offset过界，触发全量复制
  + 解决方案：修改复制缓冲区大小 repl-backlog-size
  + 设置建议：
    - 测算从master到slave重连的second
    - 获取master平均每秒产生写命令的数据总量，write_size_per_second
    - 最优 repl-backlog-size = 2 * second * write_size_per_second

##### 3.3频繁的网络中断1
  + 问题现象：master的CPU占用过高或slave频繁断开连接
  + 问题原因：
    - slave每秒发送心跳命令到master
    - 当slave接到了慢查询时（keys *、hgetall）,会大量占用CPU性能
    - master每秒调用复制函数replicationCron(),比对slave发现长时间没有响应
  + 最终结果：master各种资源被严重占用
  + 解决方案：
    - 通过设置合适的超时时间，确认是否释放slave
    ````sh
    #默认60秒，超过该值，释放slave
    repl-timeout
    ````
##### 3.4频繁的网络中断2
+ 问题现象：slave与master断开连接
+ 问题原因：
  - master发送ping指令频度过低
  - master设定超时时间过短
  - ping指令网络丢包
+ 解决方案：提高ping指令发送频度
````sh
#超时时间repl-timeout的时间至少是ping指令的频度5-10倍，否则slave容易被判定超时
repl-ping-salve-period
```` 
##### 3.5数据不同步 
+ 问题现象：多个slave间数据不同步
+ 问题原因：网络信息不同步，数据发送有延迟
+ 解决方案：
  - 优化主从间网络环境，通常部署在一个机房，如使用云服务需要注意这个问题
  - 监控从节点延迟（通过offset)判断，如果slave延迟过大，暂时屏蔽程序对该slave访问
  ````sh
  slave-serve-stale-data yes|no
  ````


### 哨兵模式
#### 1.哨兵简介
+ 哨兵（sentinel）是一个分布式系统，用于对主从结构中的每台服务器进行监控，当master出现故障时重新选择新的master并将所有slave连接到新的master

+ 哨兵的作用
  - 监控：不断的检查master、slave是否正常运行，master存活检测,master、slave运行情况检测
  - 通知： 当被检测的服务出现问题时，向其他（哨兵间、客户端）发送通知
  - 自动故障转移：断开master与slave之间连接，选取一个slave作为master,将其他slave转移到新master,并告知客户端新的master地址

+ 注意：
  - 哨兵也是一台redis服务器，只是不提供数据服务
  - 通常哨兵配置为单数

#### 2.启用哨兵模式
##### 2.1哨兵模式搭建
+ 演示搭建，我们会起3个哨兵，一个master两个slave
+ redis安装目录有一个`sentinel.conf`是哨兵配置，我们去注释复制修改它`cat sentinel.conf |grep -v "#" |grep -v "^$" > ./conf/sentinel_26379.conf`,修改dir指向自己设定的目录
`````sh
port 26379
daemonize no
pidfile /var/run/redis-sentinel.pid
logfile ""
dir /media/ws/disk3/redisData
# 监控的ip 端口，2代表有两个哨兵判定那么就认定它挂了
sentinel monitor mymaster 127.0.0.1 6379 2
#sentinel会向master发送心跳PING来确认master是否存活，
#如果master在“一定时间范围”内不回应PONG 或者是回复了一个错误消息，
#那么这个sentinel会主观地(单方面地)认为这个master已经不可用
sentinel down-after-milliseconds mymaster 30000
#在发生failover主备切换时，这个选项指定了最多可以有多少个slave同时对
#新的master进行同步，这个数字越小，完成failover所需的时间就越长，
#但是如果这个数字越大，就意味着越多的slave因为replication而不可用。
#可以通过将这个值设为 1 来保证每次只有一个slave处于不能处理命令请求的状态。
sentinel parallel-syncs mymaster 1
#主从切换时间
sentinel failover-timeout mymaster 180000
sentinel deny-scripts-reconfig yes
`````
+ 再复制两个，修改端口号`sed 's/26379/26380/g' sentinel_26379.conf > sentinel_26380.conf `
+ 准备一个master,两个slave的配置文件
````sh
#master
port 6379
daemonize yes
logfile "6379.log"
dir "/media/ws/disk3/redisData"
dbfilename dump_6379.rdb
rdbcompression yes
rdbchecksum yes
save 10 2
appendonly yes
appendfsync everysec
appendfilename appendonly_6379.aof
auto-aof-rewrite-percentage 100 
auto-aof-rewrite-min-size 64mb
````
````sh
#slave
port 6380
daemonize yes
logfile "6380.log"
dir "/media/ws/disk3/redisData"
slaveof 127.0.0.1 6379
````

+ 启动顺序，先master,然后slave,最后三个哨兵
````sh
#启动主从
redis-server  /conf/redis _xxxx.conf
#启动哨兵
redis-sentinel /conf/sentinel_xxx.conf
````


#### 3.哨兵工作原理
+ 哨兵在进行主从切换过程经历三个阶段
  - 监控：同步信息
  - 通知：保持联通
  - 故障转移：
    + 发现问题
    + 竞选负责人
    + 优选新master
    + 新master上任，其它slave切换新master,原master作为slave故障恢复后重连


### 集群
#### 1.集群简介
+ 现状问题：
    + redis的OPS最大达到10w/s,当前业务量OPS已经达到20w/s
    + 内存单机256G，业务需求内存时1T
+ 集群架构：集群就是使用网络将若干台计算机联通起来，并统一管理，使其对外呈现单机服务效果
+ 集群作用：
  - 分散单台服务器的访问压力，实现负载均衡
  - 分散单台服务器的存储压力，实现可扩展
  - 降低单机宕机带来的业务灾难    

#### 2.Redis集群结构设计
##### 2.1数据存储设计
+ redis会对集群机器进行一个16384的等分（槽）。通过算法设计，对key进行计算取值之后对16384取余，得到的值来确定在redis集群中，处于哪台机器中
+ 如果增加机器，redis会对原来集群进行计算优化，把原来每台机器的槽分一部分给新机器。如果减少机器，则把这台机器槽分给其他几台机器上。

##### 2.2相互之间通信设计
+ 各个数据库互相通信，保存各个库中槽的编号数据
+ 根据对key的算法计算，找数据在集群中哪个机器上，如果命中就返回，未命中则根据机器内保存的槽编号数据找到对应的机器

#### 3.cluster集群结构搭建
+ 我们配一个三主三从的结构，启动6个redis服务
+ 新建配置文件
````sh
port 6379
daemonize no
logfile "6379.log"
dir "/media/ws/disk3/redisData"
dbfilename "dump_6379.rdb"
rdbcompression yes
rdbchecksum yes
save 10 2
appendonly yes
appendfsync everysec
appendfilename "appendonly_6379.aof"
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
bind 127.0.0.1
databases 16
#集群部署
cluster-enabled yes
#配置文件
cluster-config-file nodes-6379.conf
#超时时间10秒
cluster-node-timeout 10000
````

+ `sed 's/6379/6380/g' redis-cluster-6379.conf > redis-cluster-6380.conf` 复制5份

+ 启动服务 `redis-server redis-cluster-6379.conf`,启动6个服务

+ 执行集群指令
````sh
#进入当前目录下启动集群 其中的1代表一个master一个slave,如果是2则是一个master两个slave
# 5.0启动集群方式,后面的连续IP，前3个为master,后3个为slave,yes确定
redis-cli --cluster create 127.0.0.1:6379 127.0.0.1:6380 127.0.0.1:6381 127.0.0.1:6382 127.0.0.1:6383 127.0.0.1:6384 --cluster-replicas 1
````
+ 操作cli
````sh
#-c为集群参数，会自动找对应的redis
redis-cli -c
````

+ 主从下线和主从切换
  - slave掉线：slave掉线对功能不影响，重连上线后继续提供服务
  - master掉线：掉线后选举slave当master,如果master后续上限则成为slave提供服务