## Redis高级
### linux 操作redis
#### 1安装
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
#### 2.指定端口启动
````sh
redis-server --prot 6379
#关闭redis
#查进程,找PID号杀掉
ps -ef |grep redis-
kill -s 9 pid号
````
#### 3.配置文件启动
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
#### 1.RDB
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

#### 2.AOF
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
#### 3.RDB和AOF的区别
持久化方式 | RDB | AOF | 
- | :-: | :-: | :-: | -: 
占用存储空间  | java  |  AP | 
存储速度  | 小（数据级：压缩）  |  大 （指令级：重写）| 
恢复速度  | 快 |  慢
数据安全性  | 会丢失数据 |  依据策略决定
资源消耗  | 高/重量级  | 低/轻量级  
启动优先级  | 低  | 高|  

##### 4.RDB和AOF选择
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


### 事务
#### 1.事务简介
+ redis的一系列操作，中间不被打断

#### 2.事务基本操作
````sh
#开启事务,事务开启的位置，在这个命令后续的指令都在一个事务内
multi
#执行事务，设定的结束事务位置
exec
# 两个命令成对出现，设定了事务的开始和结束区间

#取消事务命令,发生在exec之前，multi之后
discard
````
+ 注意：当我们加入事务命令的时候，命令加入任务队列中并未执行，只有执行了exec才真正执行
+ `multi`命令开启后，redis会创建一个队列，对之后的指令都放入队列中，在识别到`exec`指令后，在依次执行队列里的指令
+ 事务注意事项：
  - `multi`开启后，后续指令出错（比如set写成est），则事务全不执行，事务取消，无法执行`exec`
  -  `multi`开启后,对输入操作了不符合其数据结构的指令，比如对string用了lpush,则这行指令出错，其余正确执行。这种需要程序员自己回滚事务。

#### 3.锁
##### watch
+ 一笔数据需要进行进行修改，这时几个客户端都有权限修改，为了保证不重复操作，需要锁来监控这个key是否发生了变化，如果变化则后续操作不发生。
````sh
#对key进行监控，如果事务执行exec前key有了改动，则终止执行事务
watch key1 [key2...]
#取消对所有key监控
unwatch
````
+ 监控在`multi`之前，在`exec`执行前，key的值发生变化，则`exec`不执行

##### 分布式锁
+ 多个人抢购一个物品，如何避免这件商品不被多个人抢到？
````sh
#使用setnx设置一个公共锁
setnx lock_key value
#利用setnx返回值特征，有值则返回失败，无值则返回成功
#抢购前，设置锁，成功则进入修改数据并删除锁，失败则等待
````
##### 死锁
+ 如果某个客户端加锁以后，客户端宕机无法执行之后步骤，或者忘记解锁，如何解决？
````sh
#给锁设置一个时效，到期自动解锁
expire key second
pexpire key millisenconds
````
+ 由于redis操作通常都是毫秒级，因此锁定时间不宜过大，具体需要业务测试后确定
  - 测试百万次最长执行时间对应命令的最大耗时，测试百万次网络延迟平均耗时
  - 锁时间推荐：最大耗时 * 1.2+平均网络耗时 * 1.1

### 删除策略
#### 1.过期数据
+ redis所有数据放在内存中，内存中可以用TTL指令获取其状态
  - XX：具有时效性数据
  - -1：永久有效数据
  - -2：已经过期的、被删除或为定义的的数据

#### 2.数据删除策略
+ 过期的数据并不一定立刻被删除了，redis有三种删除策略：

  - 定时删除：创建一个定时器，当key设定了时间，且过期时间到达时，由定时任务执行删除
    + 优点：节约内存，到时就删除，快速释放不必要的内存占用
    + 缺点：CPU压力很大，无论CPU此时负载多高，均占用CPU，会影响redis服务器响应时间和指令吞吐量。
    + 总结：用处理器性能换取存储时间（时间换空间）

  - 惰性删除：数据到了过期时间，不做处理，等下次访问该数据时，如果过期就删除
    + 优点：节约CPU性能，发现必须删除时再删除
    + 缺点：内存占用压力大，出现长期占用内存的数据
    + 总结：用存储空间换取处理器性能

  - 定期删除：执行器在0-15个分区循环检查，在每个分区随机检查W个key,如果有失效的删除，当本次检查失效的key数量大于W * 25%,则继续这个过程，如果小于W * 25%，则检查下个分区
    + conf中，w的取值= ACTIVE_EXPIRE_CYCLE_LOOKUPS_PRE_LOOP属性值
    + 周期性轮询来检查redis中key的时效性，利用过期key占比方式控制删除频率
    + 特点1：CPU性能占用设置有峰值，检测频度可设置
    + 特点2：内存压力不会很大，长期占用的冷数据会被持续清理
    + 总结：周期性抽查存储空间（随机检查，重点抽查）

+ redis内部时效性数据处理方法：
  - 当带有时效的指令设置key后，redis在内存开辟一块空间，里面存储这个数据的*地址->过期的时间*。
  - 数据删除的目标是在内存占用和CPU占用中找平衡，避免redis性能下降甚至宕机。
  - 删除的时候，会找已经时效的时间，根据时间能找到对应的数据位置，执行删除。




#### 3.逐出算法
+ 当新数据进入redis中，如果内存不足。这时候需要逐出算法
+ 影响数据逐出的相关配置
````sh
#最大可使用内存,默认0，表示不限制，生产中根据需求来设定，通常设定50%以上
maxmemory
#每次选取待删除的个数
maxmemory-sampes
#删除策略配置
maxmemory-policy
````
##### 影响数据逐出的相关配置
+ 检测易失数据（可能会过期的数据集server.bd[i].expire）
  - volatile-lru:挑选最少使用的数据淘汰
  - volatile-lfu:挑选最近使用次数最少的淘汰
  - volatile-ttl:挑选即将失效的淘汰
  - volatile-random:随机选择数据淘汰

+ 检测全库数据（所有数据集server.db[i].dict)
  - allkeys-lru:挑选最少使用的数据淘汰
  - allkeys-lfu:挑选最近使用次数最少的淘汰
  - allkeys-random:随机选择数据淘汰

+ 放弃数据逐出
  - no-enviction:禁止驱逐,(4.0默认策略)，会引发错误OOM


### redis.conf
#### 1.redis核心配置
````sh
#基础配置#
#设置redis以守护线程方式启动
daemonize yes|no
#绑定主机地址
bind 127.0.0.1
#设置端口号
port 6379
#设置数据库数量
databases 16

#日志配置#
#设置服务器日志级别,默认verbose，生产notice即可，减少IO
loglevel debug|verbose|notice|warning
#日志记录名
logfile 端口号.log

#客户端配置#
#设置同一时间客户端最大连接数量，默认无限制，当客户端连接达到上限，redis会关闭新连接
maxclients 0
#客户端闲置等待最大时长，达到最大时长关闭连接，如需关闭此功能，设置为0
timeout 300

#多服务器快捷配置#
#导入并加载指定配置文件信息，用于快捷创建redis公共配置较多的redis实例配置文件，便于维护
#类似继承，公共的写一个，然后特别的配置用include
include /path/server-端口号.conf
````

### redis高级数据类型
+ 所谓高级数据类型是为了解决单一问题存在的，它不同于前面5种有明显模型特征的基础类型

#### 1.Bitmaps
+ 业务场景：视频网站需要统计一整年未被观看过的视频，并对其下架，redis如何统计这些数据？
+ 方案：这个统计只区分是否，开关式的状态。Bitmaps提供一种二进制方案，二进制每一列代表一部电影，1表示播放过，0表示未播放，这样就最小力度可以保存大量数据
+ 这样的方案保存很方便，但是取值比较麻烦，需要根据位置来取，改值也是。拿时间换空间
+ 简单理解Bitmaps就是对字符串的二进制操作
````sh
#基本操作#
#设定指定key对应偏移量上的bit值，value只能是0和1
setbit key offset value
#获取指定值偏移量上的值
getbit key offset
#注意，如果没设置也会getbit 为0，只要不存在全部是0
````
+ 扩展业务：1.统计每天某一部电影是否被点播 2.统计每天多少部电影被点播 3.统计每周/月/年多少部电影被点播4.统计年哪部没被点播
````sh
#统计指定key中1的数量
bitcount key [start end] #start end没有默认全部

# 对指定key按位op进行交and、并or、非not、异或xor操作，并将结果保存destkey中
bitop op destkey key1 [key2...]
````

+ 业务的redis解决方案
````sh
#假如我们有10部电影，电影在数据库的id就来确定他们的offset位置
#按每一天设定一个key,对点击的电影进行值的修改
#我们设定10部电影分别id 1-10,4.1日id为1、3、5的点击过
setbit 20200401 1 1
setbit 20200401 3 1
setbit 20200401 5 1
#4.2日 id为2、3、5被点击过
setbit 20200402 2 1
setbit 20200402 3 1
setbit 20200402 5 1

#统计总共被点击过的电影数量
bitcount 20200401
bitcount 20200402

# 统计两天被点击过的电影存如key为01-02中
bitop or 01-02 20200401 20200402 
# 现在分别查1-10位置的值
getbit 01-02 1...
````
+ Bitmap只能统计是否被播放，不能统计某部电影被播放过多少次

#### 2.HyperLogLog
+ HyperLogLog只干一件事，统计不重复数据的数量
+ 基数：
  - 基数就是数据集去重后元素个数
  - HyperLogLog就是用来作基数统计的，运用了LogLog算法
````sh
#添加数据
pfadd key element [element...]
#统计数据
pfcount key [key....]
#合并数据
pfmerge distkey sourcekey [sourcekey...]
````  
+ 只用于基数统计，不保存数据
+ 核心是估算算法，最终值存在一定误差
+ 误差范围：基数估计的结果存在一个带有0.81%标准错误的近似值
+ 耗空间极小，占用12k内存
#### 3.GEO
+ 基于坐标点，来做地理位置的相关操作
````sh
#求距离#
#添加坐标点lng经度lat纬度member是名称，如果两点需要计算，他们要放在一个key里
geoadd key lng lat member [lng lat member...]
#获取坐标点
geopos key member [member...]
#计算坐标间距离 unit是单位 可选m  km等
geodist key member1 menber2 [unit]

#求范围#
#根据坐标求范围内数据 radius数字 后面加单位 m km
# withcoord 返回坐标  #withdist返回距离多远 # count范围 #加asc desc升降序
georadius key lng lat radius m\km\ft\mi  [withcoord] [withdist] [withhash] [count count]
#根据点求范围内数据
georadiusbymember key member radius m\km\ft\mi  [withcoord] [withdist] [withhash] [count count]
#获取指定坐标hash值
geohash key member [menber...]

#附近10km内10个人升序排列，并显示距离我多远#geos为保存所有人坐标的key
georadius geos  108.xxx 34.xxx 10 km withdist 1 10 asc
````