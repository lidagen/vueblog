## Redis基础   

### Redis入门

#### NoSQL
+ NoSQL:即Not-Only SQL(泛指非关系型数据库)，作为关系型数据库的补充。

+ 作用：应对基于海量用户和海量数据前提下的数据处理问题。

+ 特征：
  - 可伸缩，可扩容
  - 大数据量下的高性能
  - 灵活的数据类型
  - 高可用  

+ 常见的NoSQL
  - Redis
  - memcache
  - HBase
  - MongoDB

#### Redis 简介
+ Redis: (REmote DIctionary Server) 是C语言开发的开源高性能的键值对`key-value`数据库。

+ **特征：**
  - 数据间没有必然的关联关系
  - 内部采用单线程机制进行工作
  - 高性能（官方测试：50个并发执行100000个请求，读的速度是110000次/s,写的速度是81000次/s）
  - 多数据类型支持
    + 字符串类型 string
    + 列表类型 list
    + 散列类型 hash
    + 集合类型 set
    + 有序集合类型 sorted_set
  - 持久化支持，可进行数据容灾恢复

+ **Redis 应用**
  - 为热点数据加速查询（主要场景），比如热点商品，热点资讯等高访问量信息等。
  - 任务队列，如秒杀、抢购、购票排队等。
  - 即时信息查询，如各类排行榜、网站访问统计、公交到站信息、在线人数信息、设备信号等。
  - 时效信息控制，如验证码控制，投票控制等。
  - 分布式数据共享，比如分布式应用中的session共享。
  - 消息队列
  - 分布式锁


### 数据类型
#### **string字符串**
+ 存储的数据：单个数据，最简单的数据存储类型，也是最常用的数据存储类型
+ 存储的数据格式： 一个存储空间保存一个数据
+ 存储的内容： 通常使用字符串，如果字符串以整数的形式展示，可以作为数字操作使用
````sh
#添加/修改数据
set key value
#获取数据
get key
#删除
del key
# 添加/修改多个
mset key1 value1 key2 value2
#获取多个
mget key1 key2
#获取字符串长度
strlen key
#追加数据到值后面
append key value
````
+ string 类型的扩展操作
  - string在redis内部就是个字符串，但是遇到incr、decr会转成数值运算
  - redis所有操作都是原子性的，采用单线程处理所有请求，无需考虑并发数据一致性问题
  - 数值的操作时候，超过redis上限会报错（java中long.MAX_VALUE）
````sh
# 设置数值增加指定范围的值（可以解决mysql分表后主键唯一的问题）
incr key
incrby key increment #指定步长
incrbyfloat key increment #可以加小数
# 设置数值减少指定范围的值
decr key
decrby key increment
````
+ string 数据实效性设置
````sh
#设置多少秒后实效
setex key seconds value
#毫秒
psetex key milliseconds value
````
+ 数据库中热点数据的key的命名规范
  - `emp:id:88395515:name` (表名:主键名:值:字段名)
+ 应用场景
  - mysql分表的sequence管理  
  - 短信验证等5分钟时效过期

#### **hash哈希**
+ 存储需求： 对一系列存储的数据进行编组，方便管理，典型应用存储对象信息
+ 需要的存储结构：一个存储空间保存多个键值对数据
+ hash类型： 底层使用哈希表结构实现数据存储
  - hash类型下的value只能存字符串，不允许其它结构
  - 每个hash可以存储2^32-1个键值对
  - hash类型十分贴近对象的数据存储类型，并且可以灵活的增加删除对象属性，但hash设计初衷不是为了存大量对象而设计的，切记不可乱用，更不可将hash作为对象列表使用
  - hgetall操作可以获取全部属性，如果内部field过多，遍历的整体效率会低，有可能成为数据访问的瓶颈
````sh
#添加/修改数据
hset key field value
# 获取数据
hget key field
hgetall key
#删除数据
hdel key field1

#添加/修改多个数据
hmset key field1 value1 field2 value2
#获取多个值
hmget key field1 field2
#获取hash表中字段的数量
hlen key
#获取hash表中是否存在指定字段
hexists key field1
````
+ hash扩展操作与使用注意
````sh
#获取hash表中所有的field名
hkeys key
#获取hash表中所有的value值
hvals key
#指定字段的数值增加指定范围的值
hincrby key field incrment
hincrbyfloat key filde incrment
#如果没值set,有的话什么都不做(value不同也不操作)
hsetnx key field value
````
+ string的json字符串和hash存储区别
  - string的json读为主
  - hash的存储可以灵活增减，适用数据修改较多情况

+ 应用场景
  - 用户购物车
  - 抢购

#### **list列表**  
+ 数据存储需求：存储多个数据，并对数据进入存储空间的顺序进行区分
+ 需要的数据结构： 一个存储空间保存多个数据，且通过数据体现进入的顺序
+ list类型：保存多个数据，地层使用双向链表存储结构实现
````sh
#添加/修改数据
lpush key value1 [value2...] #左push,后lpush的在前面
rpush key value1 [value2...] #右push，跟push顺序一致 
#获取数据
lrange key start stop #左开始读，start stop理解为开始-结束的index(0 -1看所有)
lindex key index #直接下标读取
llen key #获取长度
#获取并移除
lpop key #左边弹出1个
rpop key #右边弹出1个
#移除指定数据
lrem key count value #count是个数，list值有重复的情况
````
+ list的阻塞数据获取
````sh
#规定时间获取并移除数据
blpop key1 [key2...] timeout
bropo key1 [key2...] timeout
````
+ list操作注意事项
  - list中保存的都是string类型，值的个数也是2^32-1个
  - list具有索引概念 。通常操作以队列形式出队入队，或以栈的形式出栈入栈
  - 获取全内容结束索引为-1
  - list可以对数据分页操作，通常第一页走redis,后续页查询数据库
+ 应用场景  
  - 最新消息的展示

#### **set集合**
+ 新的存储需求：存储大量数据，在查询方面更高效率
+ 需要的存储结构： 能够保存大量数据，高效的内部存储结构，便于查询
+ 对hash结构的变形，仅使用field的存储空间
````sh
#添加数据
sadd key member1 [member2...]
#获取全部
smembers key
#删除数据
srem key member1 [member2...]
#获取集合总量
scard key
#判断集合中包含某元素
sismember key member1
````
+ set的随机取值删值操作
  - 业务场景 (随机推 ： 每位用户注册今日头条，都会让选择几项新闻类型，但是后期为了增加用户活跃度，必须让用户对其他类别逐渐产生兴趣，增加客户留存（随机取一定数量的热点类别加入到用户自己选择的类别中)
````sh
#随机获取集合中指定数量的数据
srandmember key [count]
#随机获取集合中某几个数据并移除集合
spop key   [count]     
````

+ set数据交并差操作
  - 业务场景（社交软件可能认识的人）
````sh
#求两个set的交集、并集、差集
# 交集（权限set对权限去重）
sinter key1 key2
#并集
sunion key1 key2
#差集
sdiff key1 key2 #只查左边（key1）的差集

#求多个set的交集、并集、差集并存指定集合中
sinterstore destination key1 [key2...]
sunionstore destination key1 [key2...]
sdiffstore destination key1 [key2...]
#将set中元素移动到另一个set中
smove source destination menber
````
+ set操作注意事项
  - set类型不允许值重复
  - set虽然和hash存储结构相同，但是无法使用hash中的存储value的空间

#### **sorted_set有序集合**
+ 新的存储需求：数据排序有利于数据有效展示，需要提供一个根据自身特征进行排序的方式
+ sorted_set：在set的基础上，增加了可排序字段
````sh
#添加数据 （score是排序的规则顺序）
zadd key score1 member1 [score2 member2...]
#获取全部数据
zrange key start stop [WITHSCORES] #带上withscores参数，会显示score
zrevrange key start stop [WITHSCORES] #反转显示 
#删除数据
zrem key member [menber1...]

#按score值范围获取数据
zrangebyscore key min max [WITHSCORES] [LIMIT]  #limit和mysql用法一样，筛选前几位
zrevrangebyscore key max min [WITHSCORES] [LIMIT]
#按索引删除
zremrangebyrank key start stop 
#按score值删除数据
zremrangebyscore key min max

#获取集合总数
zcard key
zcount key min max #score范围count

#集合交集、并集 #score 会求和
zinterstore destination numkeys key1 [key2...] 
zunionstore destination numkeys key1 [key2...]
````
+ sorted_set扩展操作
  - 业务场景：各类榜单排名，根据score排序，根据score值顺序来获取值的索引
````sh
#获取数据对应的索引
zrank key member
zrevrank key menber

zscore key member #获取score值
zincrby key increment member #score值的修改
```` 
+ sorted_set注意事项
  - score可以保存整数和小数（双精度double），小数可能有精度问题
  - sorted_set地层还是set，其值不能重复，重复后一次覆盖前一次
  - score比较需要位数一致，否则可能不准确，不足的可以补0

### 通用命令
#### key通用命令
````sh
#删除
del key
#key是否存在
exists key
#根据key获取数据类型
type key

#为key设置时效
expire key seconds
pexpire key milliseconds
expireat key timstaamp
pexpireat key milliseconds timstaamp

#获取key的有效时间
ttl key
pttl key #毫秒

#切换key从有时效变为永久件
persist key

#key的扩展操作 keys pattern
keys * #查询所有
keys it* #it开头的key
keys *it  #it结尾的key
keys ??it #前两个字符随意，后面it结尾
keys user:? #查询user:开头，后一个字符随意
keys u[st]er #查询u开头，er结尾，中间一个值为s或t
````
#### 数据库通用命令
````sh
#redis使用过程中，如果数据不区分种类、类别，可能会出现key重复的情况.
#解决方案：redis为每个服务提供16个数据库，编号从0-15，每个数据库之间相互独立

#切换数据库
select index  #0-15  
#把本库数据移动到
move key index
#数据清除
dbsize #数据库大小
flushdb #清除本编号内的内容
flushall #清除所有
````
````sh
#其他操作
quit
ping
echo message
````
