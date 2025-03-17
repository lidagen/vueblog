<template><div><h2 id="集合" tabindex="-1"><a class="header-anchor" href="#集合"><span><strong>集合</strong></span></a></h2>
<h3 id="常见的集合" tabindex="-1"><a class="header-anchor" href="#常见的集合"><span>常见的集合</span></a></h3>
<ul>
<li>Collection接口的子接口包括：Set（HashSet、TreeSet、LinkedHashSet）接口和List（ArrayList、LinkedList、Stack）接口</li>
<li>Map接口的实现类主要有：HashMap、TreeMap、Hashtable、ConcurrentHashMap</li>
</ul>
<h3 id="hashmap和hashtable区别" tabindex="-1"><a class="header-anchor" href="#hashmap和hashtable区别"><span>HashMap和HashTable区别</span></a></h3>
<ul>
<li>HashMap没有考虑同步，是线程不安全的；Hashtable使用了synchronized关键字，是线程安全的；</li>
<li>HashMap允许K/V都为null；后者K/V都不允许为null；</li>
</ul>
<h3 id="hashmap是怎么解决哈希冲突的" tabindex="-1"><a class="header-anchor" href="#hashmap是怎么解决哈希冲突的"><span>HashMap是怎么解决哈希冲突的</span></a></h3>
<ul>
<li>使用链地址法（使用散列表）来链接拥有相同hash值的数据；</li>
<li>使用2次扰动函数（hash函数）来降低哈希冲突的概率</li>
<li>引入红黑树进一步降低遍历的时间复杂度，使得遍历更快；</li>
</ul>
<h3 id="hashmap在jdk1-7和jdk1-8中有哪些不同" tabindex="-1"><a class="header-anchor" href="#hashmap在jdk1-7和jdk1-8中有哪些不同"><span>HashMap在JDK1.7和JDK1.8中有哪些不同</span></a></h3>
<ul>
<li>存储结构 	1.7数组 + 链表 	1.8数组 + 链表 + 红黑树</li>
</ul>
<h3 id="为什么hashmap中string、integer这样的包装类适合作为key" tabindex="-1"><a class="header-anchor" href="#为什么hashmap中string、integer这样的包装类适合作为key"><span>为什么HashMap中String、Integer这样的包装类适合作为Key</span></a></h3>
<ul>
<li>String、Integer等包装类的特性能够保证Hash值的不可更改性和计算准确性，能够有效的减少Hash碰撞的几率</li>
</ul>
<h3 id="如果我想要让自己的object作为k应该怎么办呢" tabindex="-1"><a class="header-anchor" href="#如果我想要让自己的object作为k应该怎么办呢"><span>如果我想要让自己的Object作为K应该怎么办呢？</span></a></h3>
<ul>
<li>重写hashCode()和equals()方法</li>
</ul>
<h3 id="concurrenthashmap和hashtable的区别" tabindex="-1"><a class="header-anchor" href="#concurrenthashmap和hashtable的区别"><span>ConcurrentHashMap和Hashtable的区别？</span></a></h3>
<ul>
<li>ConcurrentHashMap 结合了 HashMap 和 HashTable 二者的优势。HashMap 没有考虑同步，HashTable 考虑了同步的问题。但是 HashTable 在每次同步执行时都要锁住整个结构。 ConcurrentHashMap 锁的方式是稍微细粒度的。</li>
</ul>
<h3 id="concurrenthashmap实现" tabindex="-1"><a class="header-anchor" href="#concurrenthashmap实现"><span>ConcurrentHashMap实现</span></a></h3>
<ul>
<li>Node + CAS + Synchronized来保证并发安全进行实现</li>
</ul>
<h3 id="hashset是如何保证数据不可重复的" tabindex="-1"><a class="header-anchor" href="#hashset是如何保证数据不可重复的"><span>HashSet是如何保证数据不可重复的</span></a></h3>
<ul>
<li>HashSet的底层其实就是HashMap，由于HashMap的K值本身就不允许重复，并且在HashMap中如果K/V相同时，会用新的V覆盖掉旧的V，然后返回旧的V，那么在HashSet中执行这一句话始终会返回一个false，导致插入失败，这样就保证了数据的不可重复性；</li>
</ul>
<h3 id="blockingqueue是什么" tabindex="-1"><a class="header-anchor" href="#blockingqueue是什么"><span>BlockingQueue是什么？</span></a></h3>
<ul>
<li>Java.util.concurrent.BlockingQueue是一个队列，在进行检索或移除一个元素的时候，它会等待队列变为非空；当在添加一个元素时，它会等待队列中的可用空间。BlockingQueue接口是Java集合框架的一部分，主要用于实现生产者-消费者模式。</li>
</ul>
<h2 id="多线程" tabindex="-1"><a class="header-anchor" href="#多线程"><span><strong>多线程</strong></span></a></h2>
<h3 id="为什么用线程池" tabindex="-1"><a class="header-anchor" href="#为什么用线程池"><span>为什么用线程池</span></a></h3>
<ul>
<li>线程创建和销毁过程，都有性能开销，还可以控制线程数量。</li>
<li>使用场景：
<ul>
<li>异步任务处理的，不是主流程的，比如业务中，清算以后要下发明细，但是还需要明细计提数据</li>
<li>发服务号通知业务</li>
<li>MQ消息消费</li>
</ul>
</li>
</ul>
<h3 id="threadpoolexcutor-线程池参数" tabindex="-1"><a class="header-anchor" href="#threadpoolexcutor-线程池参数"><span>threadpoolexcutor,线程池参数</span></a></h3>
<ul>
<li>核心线程数</li>
<li>最大线程数</li>
<li>空闲线程存活时间</li>
<li>存活时间单位</li>
<li>工作队列 ：ArrayQ 有界 LinkedQ 无界 synchronusQ不缓存任务的阻塞队列 prorityQ优先级的无界阻塞队列</li>
<li>线程工厂：设定线程名，是否守护线程</li>
<li>拒绝策略：callerRuns直接执行被拒绝的线程，如果县城池shutdown则抛弃 *Abort （默认） 丢弃抛异常 Discard 丢弃 DiscardOldest 丢弃最老的一个，并将新的加入</li>
</ul>
<h3 id="线程池参数如何确定、出错如何处理、无可用线程如何处理" tabindex="-1"><a class="header-anchor" href="#线程池参数如何确定、出错如何处理、无可用线程如何处理"><span>线程池参数如何确定、出错如何处理、无可用线程如何处理</span></a></h3>
<ul>
<li>确定参数
<ul>
<li>task，每秒任务数，假设500-1000</li>
<li>taskcost: 任务处理时间，假设0.1s</li>
<li>responseTime,系统最大容忍响应时间，假设1s</li>
</ul>
</li>
<li>corePoolSize:</li>
</ul>
<h3 id="lock" tabindex="-1"><a class="header-anchor" href="#lock"><span>lock</span></a></h3>
<h3 id="atomicinteger怎么用的" tabindex="-1"><a class="header-anchor" href="#atomicinteger怎么用的"><span>AtomicInteger怎么用的</span></a></h3>
<ul>
<li>原子操作的Integer类，通过线程安全的方式操作加减</li>
</ul>
<h3 id="java中哪些方法创建多线程" tabindex="-1"><a class="header-anchor" href="#java中哪些方法创建多线程"><span>java中哪些方法创建多线程</span></a></h3>
<ul>
<li>thread</li>
<li>runable</li>
<li>callable</li>
<li>线程池</li>
</ul>
<h3 id="线程的状态" tabindex="-1"><a class="header-anchor" href="#线程的状态"><span>线程的状态</span></a></h3>
<ul>
<li>新建new</li>
<li>就绪runable</li>
<li>运行runing</li>
<li>阻塞blocked</li>
<li>死亡dead</li>
</ul>
<h3 id="sleep-yield-join-wait方法区别" tabindex="-1"><a class="header-anchor" href="#sleep-yield-join-wait方法区别"><span>sleep\yield\join\wait方法区别</span></a></h3>
<ul>
<li>sleep不会释放锁，阻塞线程</li>
<li>wait放锁，等待其它线程notify</li>
<li>yield 暂停当前线程，线程重回就绪</li>
<li>join 当前调用join方法，等join的线程结束后，程序继续</li>
</ul>
<h3 id="为什么不推荐stop和destory方法结束线程运行" tabindex="-1"><a class="header-anchor" href="#为什么不推荐stop和destory方法结束线程运行"><span>为什么不推荐stop和destory方法结束线程运行</span></a></h3>
<ul>
<li>直接杀死线程，不安全， interrupt() 方法来中断线程比较好</li>
</ul>
<h3 id="synchronized" tabindex="-1"><a class="header-anchor" href="#synchronized"><span>synchronized</span></a></h3>
<ul>
<li>synchronized锁，多线程情况下，保证对实例变量线程安全</li>
<li>synchronized可以加在方法上和同步代码块，synchronized 加方法上或者sychronized(this)锁的都是对象，会对其它锁对象的同步方法阻塞</li>
<li>synchronized（非this)锁定代码块，其它同步方法是异步</li>
</ul>
<h3 id="syschronized原理" tabindex="-1"><a class="header-anchor" href="#syschronized原理"><span>syschronized原理</span></a></h3>
<ul>
<li>加synchronized关键字的，编译后的class文件是有加锁和退出锁的操作的，每个对象有一个monitor监视器，调用获取对象时，将值+1，离开-1。加减表示锁占有</li>
</ul>
<h3 id="reentrantlock-和-synchronized" tabindex="-1"><a class="header-anchor" href="#reentrantlock-和-synchronized"><span>ReentrantLock 和 synchronized</span></a></h3>
<ul>
<li>ReentrantLock 类实现了 Lock，它拥有与 synchronized 相同的并发性和内存语义且它还具有可扩展性。</li>
<li>精细化、需要自己加锁解锁</li>
</ul>
<h3 id="volatile" tabindex="-1"><a class="header-anchor" href="#volatile"><span>volatile</span></a></h3>
<ul>
<li>多个线程间对变量可见，加了这个关键字，每个线程对变量进行改变，都会把最新结果写回共享内存中，被其它线程可见</li>
<li>使用这个声明的变量，编译器会避免指令重排</li>
<li>指令重排 1。分配内存空间 2。初始化对象 3。将对象指向给刚分配的内存空间。2和3有可能重排序，多线程情况下，有可能出现问题</li>
</ul>
<h3 id="threadlocal" tabindex="-1"><a class="header-anchor" href="#threadlocal"><span>threadLocal</span></a></h3>
<ul>
<li>ThreadLocal是一个本地线程副本变量工具类。线程间数据隔离</li>
</ul>
<h3 id="countdownlatch" tabindex="-1"><a class="header-anchor" href="#countdownlatch"><span>countDownLatch</span></a></h3>
<ul>
<li>同步计数器，用来协调多个线程之间的同步</li>
</ul>
<h2 id="kafka" tabindex="-1"><a class="header-anchor" href="#kafka"><span><strong>kafka</strong></span></a></h2>
<ul>
<li>分布式的发布、订阅模式的消息队列</li>
</ul>
<h4 id="模式" tabindex="-1"><a class="header-anchor" href="#模式"><span>模式</span></a></h4>
<ul>
<li>点对点模式： 一对一</li>
<li>发布订阅：一对多
<ul>
<li>发布到topic的消息会被所有consumer消费（拉模式）</li>
</ul>
</li>
</ul>
<h3 id="消息队列使用场景" tabindex="-1"><a class="header-anchor" href="#消息队列使用场景"><span>消息队列使用场景</span></a></h3>
<ul>
<li>缓冲和削峰：上游数据时有突发流量，下游可能扛不住</li>
<li>解耦和扩展性：项目开始的时候，并不能确定具体需求。消息队列可以作为一个接口层</li>
<li>冗余：可以采用一对多的方式，一个生产者发布消息，可以被多个订阅topic的服务消费到</li>
<li>健壮性：消息队列可以堆积请求，所以消费端业务即使短时间死掉，也不会影响主要业务的正常进行。</li>
<li>异步通信：有些数据不需要即时处理。</li>
</ul>
<h3 id="broker作用" tabindex="-1"><a class="header-anchor" href="#broker作用"><span>broker作用</span></a></h3>
<ul>
<li>producer往Brokers里面的指定Topic中写消息，cunsumer从Brokers里面拉取指定Topic的消息,消息中转站</li>
</ul>
<h3 id="kafka中的-zookeeper-起到什么作用-可以不用zookeeper么" tabindex="-1"><a class="header-anchor" href="#kafka中的-zookeeper-起到什么作用-可以不用zookeeper么"><span>kafka中的 zookeeper 起到什么作用，可以不用zookeeper么</span></a></h3>
<ul>
<li>broker依赖于ZK，zookeeper 在kafka中还用来选举 和 检测broker是否存活。</li>
</ul>
<h3 id="kafka主从同步数据" tabindex="-1"><a class="header-anchor" href="#kafka主从同步数据"><span>kafka主从同步数据</span></a></h3>
<ul>
<li>kafka使用ISR的方式很好的均衡了确保数据不丢失以及吞吐率。Follower可以批量的从Leader复制数据，而且Leader充分利用磁盘顺序读以及send file(zero copy)机制，这样极大的提高复制性能，内部批量写磁盘，大幅减少了Follower与Leader的消息量差。</li>
</ul>
<h3 id="kafka-producer如何优化打入速度" tabindex="-1"><a class="header-anchor" href="#kafka-producer如何优化打入速度"><span>kafka producer如何优化打入速度</span></a></h3>
<ul>
<li>增加线程</li>
<li>提高 batch.size</li>
<li>增加更多 producer 实例</li>
<li>增加 partition 数</li>
<li>设置 acks=-1 时，如果延迟增大：可以增大 num.replica.fetchers（follower 同步数据的线程数）来调解；</li>
<li>跨数据中心的传输：增加 socket 缓冲区设置以及 OS tcp 缓冲区设置。</li>
</ul>
<h3 id="kafka的message格式是什么样的" tabindex="-1"><a class="header-anchor" href="#kafka的message格式是什么样的"><span>kafka的message格式是什么样的</span></a></h3>
<ul>
<li>一个Kafka的Message由一个固定长度的header和一个变长的消息体body组成</li>
</ul>
<h3 id="kafka中consumer-group-是什么概念" tabindex="-1"><a class="header-anchor" href="#kafka中consumer-group-是什么概念"><span>kafka中consumer group 是什么概念</span></a></h3>
<ul>
<li>是Kafka实现单播和广播两种消息模型的手段</li>
<li>对于同一个topic，每个group都可以拿到同样的所有数据，但是数据进入group后只能被其中的一个worker消费</li>
</ul>
<h3 id="kafka中的消息是否会丢失和重复消费-ack" tabindex="-1"><a class="header-anchor" href="#kafka中的消息是否会丢失和重复消费-ack"><span>Kafka中的消息是否会丢失和重复消费？ACK</span></a></h3>
<ul>
<li>
<p>要确定Kafka的消息是否丢失或重复，从两个方面分析入手：消息发送和消息消费。</p>
</li>
<li>
<p>消息发送，Kafka消息发送有两种方式：同步（sync）和异步（async），默认是同步方式，afka通过配置request.required.acks属性来确认消息的生产：</p>
<ul>
<li>0---表示不进行消息接收是否成功的确认；</li>
<li>1---表示当Leader接收成功时确认；</li>
<li>-1---表示Leader和Follower都接收成功时确认；</li>
<li>acks=0，不和Kafka集群进行消息接收确认，则当网络异常、缓冲区满了等情况时，消息可能丢失；acks=1、同步模式下，只有Leader确认接收成功后但挂掉了，副本没有同步，数据可能丢失；</li>
</ul>
</li>
<li>
<p>消息消费，Kafka消息消费有两个consumer接口，Low-level API和High-level API：</p>
<ul>
<li>Low-level API：消费者自己维护offset等值，可以实现对Kafka的完全控制；</li>
<li>High-level API：封装了对parition和offset的管理，使用简单；可能存在一个问题就是当消息消费者从集群中把消息取出来、并提交了新的消息offset值后，还没来得及消费就挂掉了，那么下次再消费时之前没消费成功的消息就“诡异”的消失了；</li>
</ul>
</li>
<li>
<p>解决办法： 针对消息丢失：同步模式下，确认机制设置为-1，即让消息写入Leader和Follower之后再确认消息发送成功；异步模式下，为防止缓冲区满，可以在配置文件设置不限制阻塞超时时间，当缓冲区满时让生产者一直处于阻塞状态；</p>
</li>
<li>
<p>针对消息重复：将消息的唯一标识保存到外部介质中，每次消费时判断是否处理过即可。</p>
</li>
</ul>
<h3 id="为什么kafka不支持读写分离" tabindex="-1"><a class="header-anchor" href="#为什么kafka不支持读写分离"><span>为什么Kafka不支持读写分离？</span></a></h3>
<ul>
<li>主写从读有 2 个很明 显的缺点:数据一致性问题。延时问题。</li>
</ul>
<h3 id="kafka中是怎么体现消息顺序性的" tabindex="-1"><a class="header-anchor" href="#kafka中是怎么体现消息顺序性的"><span>Kafka中是怎么体现消息顺序性的？</span></a></h3>
<ul>
<li>kafka每个partition中的消息在写入时都是有序的，消费时，每个partition只能被每一个group中的一个消费者消费，保证了消费时也是有序的。
整个topic不保证有序。如果为了保证topic整个有序，那么将partition调整为1.</li>
</ul>
<h2 id="springcloud" tabindex="-1"><a class="header-anchor" href="#springcloud"><span><strong>springCloud</strong></span></a></h2>
<h3 id="什么是微服物" tabindex="-1"><a class="header-anchor" href="#什么是微服物"><span>什么是微服物</span></a></h3>
<ul>
<li>微服务架构是一种架构模式或者架构风格，它提倡将单一的应用程序划分为一组小的服务，每个服务运行在其独立的进程中，服务之间互相协调，互相配合，为用户提供最终价值。</li>
</ul>
<h3 id="spring-cloud-和dubbo区别" tabindex="-1"><a class="header-anchor" href="#spring-cloud-和dubbo区别"><span>spring cloud 和dubbo区别</span></a></h3>
<ul>
<li>Dubbo采用RPC通信方式，SpringCloud采用基于HTTP的REST,后者牺牲了一部分性能换取更高灵活性，不存在代码层面强依赖。</li>
<li>半自动和全自动，Spring Cloud可以和Spring家族完美融合，保证更高的稳定性，Dubbo需要对组件之外的东西有足够的了解。</li>
<li>Dubbo更像是一款RPC框架，而SpringCloud目标是微服务架构下的一站式解决方案。
###微服务的优缺点</li>
<li>优点：
<ul>
<li>每个服务足够内聚，足够小。代码能够聚集在一个单一的业务功能上。</li>
<li>开发简单，开发效率高，一个服务可能只需要干一件事。</li>
<li>微服务是松耦合的,无论开发还是部署都是独立的。</li>
</ul>
</li>
<li>缺点：
<ul>
<li>分布式增加了系统的复杂性</li>
<li>多服务的运维压力比单服务大</li>
<li>系统之间调用成本</li>
<li>加大性能监控难度</li>
</ul>
</li>
</ul>
<h3 id="技术栈" tabindex="-1"><a class="header-anchor" href="#技术栈"><span>技术栈</span></a></h3>
<ul>
<li>服务注册发现：euraka</li>
<li>服务调用：openFeign</li>
<li>服务降级熔断：hystrix</li>
<li>负载均衡：rinbon</li>
<li>配置中心：appllo、springConfig</li>
<li>服务网关：gateway</li>
</ul>
<h3 id="euraka-enableeurekaserver-enableeurekaclient" tabindex="-1"><a class="header-anchor" href="#euraka-enableeurekaserver-enableeurekaclient"><span>euraka <code v-pre>@EnableEurekaServer</code> <code v-pre>@EnableEurekaClient</code></span></a></h3>
<h4 id="eureka和zookeeper区别" tabindex="-1"><a class="header-anchor" href="#eureka和zookeeper区别"><span>Eureka和Zookeeper区别</span></a></h4>
<ul>
<li>Eureka取CAP的AP，注重可用性，Zookeeper取CAP的CP注重一致性。</li>
<li>Zookeeper有Leader和Follower角色，Eureka各个节点平等。</li>
<li>Zookeeper采用过半数存活原则，Eureka采用自我保护机制解决分区问题。</li>
<li>eureka本质是一个工程，Zookeeper只是一个进程。</li>
</ul>
<h4 id="eureka心跳监测" tabindex="-1"><a class="header-anchor" href="#eureka心跳监测"><span>Eureka心跳监测</span></a></h4>
<ul>
<li>客户端30s(可配置)发送一次心跳到服务端。</li>
<li>服务中心90s(可配置)未收到心跳会认为客户端挂了，会删掉服务信息。</li>
</ul>
<h4 id="eureka采用自我保护机制" tabindex="-1"><a class="header-anchor" href="#eureka采用自我保护机制"><span>Eureka采用自我保护机制</span></a></h4>
<ul>
<li>如果Eureka Server收到的心跳包不足正常值的85%（可配置）就会进入自我保护模式，在这种模式下，Eureka Server不会删除任何服务信息。</li>
<li>自我保护机制意义：它不会从注册列表中剔除因长时间没收到心跳导致租期过期的服务，而是等待修复，直到心跳恢复正常之后，它自动退出自我保护模式。这种模式旨在避免因网络分区故障导致服务不可用的问题。</li>
</ul>
<h3 id="ribbon-loadbalanced" tabindex="-1"><a class="header-anchor" href="#ribbon-loadbalanced"><span>Ribbon <code v-pre>@LoadBalanced</code></span></a></h3>
<h4 id="负载均衡是什么" tabindex="-1"><a class="header-anchor" href="#负载均衡是什么"><span>负载均衡是什么</span></a></h4>
<ul>
<li>单个组件可靠性不高，多组件来确保服务吞吐量，而如何依次访问不同的组件实例，就是负载均衡的意义</li>
</ul>
<h4 id="ribbon负载均衡和nginx负载均衡的区别" tabindex="-1"><a class="header-anchor" href="#ribbon负载均衡和nginx负载均衡的区别"><span>Ribbon负载均衡和Nginx负载均衡的区别</span></a></h4>
<ul>
<li>Nginx是服务器负载均衡，客户端所有请求都交给Nginx,然后由Nginx实现转发请求，即负载均衡在服务端实现的。</li>
<li>Ribbon本地负载均衡，在调用微服务接口时，会在注册中心上获取注册信息服务列表后缓存在JVM本地，从而在本地实现RPC远程调用服务。</li>
</ul>
<h4 id="ribbon负载均衡策略-irule" tabindex="-1"><a class="header-anchor" href="#ribbon负载均衡策略-irule"><span>Ribbon负载均衡策略 <code v-pre>IRule</code></span></a></h4>
<ul>
<li>RoundRobinRule：轮询</li>
<li>RandomRule： 随机</li>
<li>RetryRule： 先按照轮询策略获取服务，如果获取失败则在指定时间重连</li>
<li>BestAvailableRule： 会过滤掉多次访问失败的服务，然后挑一个并发量最小的连接</li>
<li>AvailabilityFilteringRule：先过滤失败的服务，挑并发最小的连接</li>
<li>WeightedResponseTimeRule: 继承RoundRobinRule并增加了权重</li>
</ul>
<h4 id="负载均衡算法" tabindex="-1"><a class="header-anchor" href="#负载均衡算法"><span>负载均衡算法</span></a></h4>
<ul>
<li>rest接口第几次请求的数字对服务器集群数取余（请求次数%服务器数量）。每次服务器重启后计数重新开始。</li>
</ul>
<h3 id="openfeign-feignclient-enablefeignclients" tabindex="-1"><a class="header-anchor" href="#openfeign-feignclient-enablefeignclients"><span>OpenFeign <code v-pre>@FeignClient</code> <code v-pre>EnableFeignClients</code></span></a></h3>
<h4 id="超时控制" tabindex="-1"><a class="header-anchor" href="#超时控制"><span>超时控制</span></a></h4>
<ul>
<li>OpenFeign 默认的调用超时为1秒钟，如果调用过程超过了1秒，Feign客户端会直接返回报错，为了避免这种情况，我们有时需要对Feign客户端进行超时控制。</li>
</ul>
<h3 id="openfeign-的日志增强" tabindex="-1"><a class="header-anchor" href="#openfeign-的日志增强"><span>OpenFeign 的日志增强</span></a></h3>
<ul>
<li>Feign提供了日志打印功能，我们可以通过配置调整日志级别，从而了解feign请求过程中http细节。</li>
</ul>
<h3 id="hystrix-enableeurekaclient" tabindex="-1"><a class="header-anchor" href="#hystrix-enableeurekaclient"><span>Hystrix <code v-pre>EnableEurekaClient</code></span></a></h3>
<h4 id="服务雪崩" tabindex="-1"><a class="header-anchor" href="#服务雪崩"><span>服务雪崩</span></a></h4>
<ul>
<li>多个微服务调用的时候，如果链路上某个微服务调用时间过长或者不可用，对微服务的调用就会占用越来越多的系统资源，进而引起系统崩溃，这就是所谓的雪崩效应。</li>
</ul>
<h4 id="hystrix做什么" tabindex="-1"><a class="header-anchor" href="#hystrix做什么"><span>Hystrix做什么</span></a></h4>
<ul>
<li>Hystrix能够保证在一个依赖出问题的时候，不会导致整体服务失败，避免级联故障，提高分布式系统弹性。</li>
<li>当某个服务发生故障时，通过断路器的故障监控，向调用方返回一个符合预期的，可处理的备选响应（Fallback）,而不是长时间的等待或者抛出调用方无法处理的异常。</li>
</ul>
<h4 id="降级、熔断-feignclient-value-cloud-payment-hystrix-service-fallback-feignhystrixfallbackservice-class" tabindex="-1"><a class="header-anchor" href="#降级、熔断-feignclient-value-cloud-payment-hystrix-service-fallback-feignhystrixfallbackservice-class"><span>降级、熔断 <code v-pre>@FeignClient(value =  &quot;CLOUD-PAYMENT-HYSTRIX-SERVICE&quot;,fallback = FeignHystrixFallbackService.class) </code></span></a></h4>
<ul>
<li>降级
<ul>
<li>服务器没反应，返回一个友好的备用反应fallback</li>
</ul>
</li>
<li>熔断
<ul>
<li>某个微服务出错不可用或者响应时间过长，会进行服务降级，进而熔断该节点微服务调用，快速返回错误的响应信息。当检测到该节点微服务响应正常时，恢复链路调用。</li>
<li>熔断过程：服务降级-&gt;进而熔断-&gt;恢复调用链路</li>
</ul>
</li>
<li>服务限流
<ul>
<li>秒杀高并发等操作，严禁一窝蜂的过来拥挤，大家排队，一秒N个，有序进行。</li>
</ul>
</li>
</ul>
<h4 id="断路器涉及三个参数-快照时间窗、请求总数阈值、错误百分比阈值" tabindex="-1"><a class="header-anchor" href="#断路器涉及三个参数-快照时间窗、请求总数阈值、错误百分比阈值"><span>断路器涉及三个参数：快照时间窗、请求总数阈值、错误百分比阈值</span></a></h4>
<ul>
<li>快照时间窗：断路器确定是否打开需要统计一些请求和错误数据，而统计的时间范围就是快照时间窗，默认最近10秒</li>
<li>请求总数阈值：在快照时间窗内，必须满足请求总数阈值才会熔断。默认20，意味着10秒内，如果该hystrix命令的调用次数不超过20次，即使全部失败，断路器也不会打开。</li>
<li>错误百分比阈值： 当在快照时间窗内，满足了请求总数阈值（30次），如果有15次调用失败，那失败的百分比就是50%，如果错误百分比阈值设置50%的情况下，断路器会打开。</li>
</ul>
<h4 id="熔断三种状态" tabindex="-1"><a class="header-anchor" href="#熔断三种状态"><span>熔断三种状态</span></a></h4>
<ul>
<li>熔断打开：请求不再调用当前服务，内部设置时钟一般为MTTR（平均故障处理时间），当熔断打开时常超过所设时钟则到达熔断半开状态。</li>
<li>熔断半开 ：部分请求会根据规则调用当前服务，如果请求成功且符合 规则则认为当前服务恢复政策，关闭熔断。</li>
<li>熔断关闭 ： 熔断关闭不会对服务镜像熔断</li>
</ul>
<h4 id="熔断以后的流程" tabindex="-1"><a class="header-anchor" href="#熔断以后的流程"><span>熔断以后的流程</span></a></h4>
<ul>
<li>熔断以后，服务调用将不再调用主逻辑，而是直接调用降级的fallback。</li>
<li>主逻辑恢复：当熔断器打开进行熔断以后，hystrix启动一个休眠时间窗，超过这个时间窗，熔断半开，释放一次请求到主逻辑，如果调用正常，熔断关闭。主逻辑恢复。如果这次调用失败，断路器打开，休眠时间窗重新计时</li>
</ul>
<h3 id="gateway" tabindex="-1"><a class="header-anchor" href="#gateway"><span>GateWay</span></a></h3>
<h4 id="三大核心概念" tabindex="-1"><a class="header-anchor" href="#三大核心概念"><span>三大核心概念</span></a></h4>
<ul>
<li>路由Route:路由是构建网关的基本模块，它由ID，目标URI，一系列的断言和过滤器组成， 如果断言为TRUE，则匹配该路由</li>
<li>断言Predicate:开发人员可以匹配HTTP请求中的所有内容，如果请求与断言相匹配则进行路由</li>
<li>过滤Filter:指的是Spring框架中GatewayFilter的实例，使用过滤器，可以在请求被路由前或者之后对请求进行修改。</li>
</ul>
<h4 id="gateway工作流程" tabindex="-1"><a class="header-anchor" href="#gateway工作流程"><span>GateWay工作流程</span></a></h4>
<ul>
<li>客户端向Gateway发出请求，然后在Gateway Handle Mapping中找到与请求匹配的路由，将其发送到Gateway Web Handle 。</li>
<li>Handle 再通过指定的过滤器来将请求发送到我们实际的服务执行业务逻辑，然后返回。</li>
<li>过滤器在发送代理请求之前 (pre) 或者之后 (post) 执行业务逻辑。
<ul>
<li>在pre类型的过滤器可以执行参数校验、权限校验、流量监控、日志输出、协议转换等。</li>
<li>在post类型过滤器中可以做响应内容、响应头的修改，日志输出、流量监控也有着重要作用。</li>
</ul>
</li>
</ul>
<h4 id="gateway-过滤器实现" tabindex="-1"><a class="header-anchor" href="#gateway-过滤器实现"><span>gateWay 过滤器实现</span></a></h4>
<ul>
<li>实现接口 <code v-pre>GlobalFilter</code> <code v-pre>Ordered</code></li>
</ul>
<h3 id="springconfig" tabindex="-1"><a class="header-anchor" href="#springconfig"><span>springConfig</span></a></h3>
<ul>
<li>集中管理配置文件</li>
<li>运行期间动态调整的数据，可以放在配置中心，且不需要重启即可感知新的配置</li>
</ul>
</div></template>


