## RabbitMQ基础

### MQ基本概念
+ MQ全称Message Queue,多用于分布式系统之间进行通信。
  - 系统通信有直接远程调用
  - 也可以采用消息中间件
+ MQ的优劣：
  - 优势：应用解耦；异步提速；削峰填谷
  - 劣势：系统可用性降低；系统复杂性提高；一致性问题  
::: tip
+ 异步提速：同步需要等待处理完成后的结果（串行），异步不需要等待
+ 一致性问题：即CAP中满足AP，满足最终一致性
::: 

#### AMQP
+ AMQP: 即Advanced Message Queuing Protocol（高级消息队列协议），是一个网络协议，是应用层协议的一个开放标准，为面向消息中间件设计。基于此协议的客户端与消息中间件可传递消息，并不受客户端、中间件、语言不同限制。

#### RabbitMQ 架构

<img :src="$withBase('/mq/1.png')" alt="dock">

+ `Broker` 这个是rabbitMQ的Server
  + `Virtual Host虚拟机`一个Server包含多个虚拟机，是一种逻辑分区。每个用户在自己的vhost创建exchange\queue
    - `Exchange交换机` 分发消息（三种交换机类型）
       + Fanout广播：将消息投递给所有绑定该交换机的队列
       + Direct定向：把消息交给符合指定RoutingKey的队列
       + Topic通配符：把消息交给符合Routing Pattern（路由模式）的队列
    - `Queue队列` 存储消息
    - Exchange与Queue的关系由`Binding`虚拟连接
+ `Routes路由` 管理Exchange把根据规则把消息分发给哪个Queue
+ `Publisher生产者`
  - `Connection` TCP连接，用于跟MQ通信
  - `channel`每个Connection下包括多个channel（类型线程池的概念，减少TCP开销）
+ `Consumer消费者`

#### RabbitMQ 6种工作模式
+ 简单模式
+ work queues
+ Publish/Subsvribe 发布订阅
+ Routing 路由模式
+ Topics 主题模式
+ RPC 远程调用模式 （忽略）


### RabbitMQ工作模式
+ 工作模式其实就是消息路由分发的不同模式

#### workqueues 工作队列模式  `Exchange类型null`
<img :src="$withBase('/mq/2.png')" alt="dock">

+ 根据上图可知，工作队列模式是一个Publisher，对应多个Consumer模式，多个Consumer之间是竞争关系。
+ 默认情况下，rabbitmq将会按顺序派发每个任务给下一个消费者，平均而言，每个消费者将获得相同数量的消息，这种分发消息的方式称为轮询。
+ 应用场景：对应一些任务过重或者任务较多的情况，使用这种模式提高任务处理速度

#### Pub/Sub 订阅模式 `Exchange类型Fanout`
<img :src="$withBase('/mq/3.png')" alt="dock">

+ 这个模式中，多了个Exchange角色，过程也有变化
  - P：发送消息到Exchange,而不是Queue
  - Exchange :一方面接收消息，另一方面知道如何处理消息。（例如递交给某个特别队列、递交给所有队列、或者丢弃消息，如果操作取决于Exchange类型）
+ Exchange只负责分发消息，不具备存储消息能力，所有如果没有任何Queue绑定Exchange,或者没有符合的路由规则，消息会丢失 
+ 可以不指定RoutingKey

#### Routing 路由模式 `Exchange类型Direct`
<img :src="$withBase('/mq/4.png')" alt="dock">

+ 队列与交换机的绑定，不能是任意绑定了，而是指定一个RoutingKey
+ 消息的发送放在向Exchange发送消息时，必须指定消息的RoutingKey
+ Exchange不再把消息交给每一个绑定的Queue,而是根据消息的RoutingKey进行判断，只有队列的RoutingKey和消息的RoutingKey一致时，才会接收到消息
::: tip
+ 简单理解就是虽然exchange绑定了多个队列，但是根据指定的RoutingKey可以选择性的把消息发送给指定的队列
+ Routing模式要求绑定Exchange交换机时指定RoutingKey
:::

#### Topics 主题模式   `Exchange类型Topics`
<img :src="$withBase('/mq/5.png')" alt="dock">

+ Topics主题模式可以实现Pub/Sub发布订阅模式 和 Routing路由模式，只是Topics在配置RoutingKey的时候可以使用通配符，更加灵活。
+ 模糊匹配，*代表一个**单词**，#表示零个或者多个单词
