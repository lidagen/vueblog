## Kafka 基础
+ Kafka是一个**分布式**的基于**发布\订阅**的**消息队列**

### 消息队列
+ 缓冲和削峰：上游数据时有突发流量，下游可能扛不住
+ 解耦和扩展性：项目开始的时候，并不能确定具体需求。消息队列可以作为一个接口层
+ 冗余：可以采用一对多的方式，一个生产者发布消息，可以被多个订阅topic的服务消费到
+ 健壮性：消息队列可以堆积请求，所以消费端业务即使短时间死掉，也不会影响主要业务的正常进行。
+ 异步通信：有些数据不需要即时处理。
### 消费模式
#### 1.1消息队列两种模式
+ 点对点模式：消费者拉取数据，消息收到后清除
+ 发布/订阅模式：消费者消费数据后不会清除消息（拉模式）
### kafka组件
+ Topic ：消息根据Topic进行归类
+ Producer：发送消息者
+ Consumer：消息接受者
+ broker：每个kafka实例(server) 
+ Segment：partition物理上由多个segment组成。
+ offset : 每个partition都由一系列有序的、不可变的消息组成，这些消息被连续的追加到partition中。partition中的每个消息都有一个连续递增的序列号叫做offset，偏移量offset在每个分区中是唯一的。
+ replica： partition 的副本，保障 partition 的高可用。
+ follower： replica 中的一个角色，从 leader 中复制（fentch）数据。
+ leader： replica 中的一个角色， producer 和 consumer 只跟 leader 交互。
+ controller：kafka 集群中的其中一个服务器，用来进行 leader election 以及 各种 failover。
+ Zookeeper：依赖集群保存meta信息。
+ Partition：每个 topic 包含一个或多个 partition。kafka 分配的单位是 partition。
+ Consumer group：high-level consumer API 中，每个 consumer 都属于一个 consumer group，每条消息和partition只能被 group 中的一个 Consumer 消费，但可以被多个 consumer group 消费。
### 集群配置

### kafka命令
````sh
# bin/kafka-topics.sh
# 查看所有topic
bin/kafka-topics.sh --list --zookeeper localhost:2181
# 创建一个topic ,--topic定义topic名，--replication-factor定义副本数 ，--partitions 定义分区数
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic test
# 删除
 bin/kafka-topics.sh  --delete --zookeeper localhost:2181 --topic test

````
### 数据日志分离
