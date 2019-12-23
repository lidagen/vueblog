## 分布式锁三 ZK分布式锁

### 概述
基于zookeeper临时有序节点可以实现的分布式锁,大致思想即为：每个客户端对某个方法加锁时，在zookeeper上的与该方法对应的指定节点的目录下，生成一个唯一的瞬时有序节点。 判断是否获取锁的方式很简单，只需要判断有序节点中序号最小的一个。 当释放锁的时候，只需将这个瞬时节点删除即可。


### ZK排他锁
排他锁的核心是如何保证当前有且仅有一个事务获得锁，并且锁被释放后，所有正在等待获取锁的事务都能够被通知到.

#### 获取锁

+ ZooKeeper 是通过创建数据节点（ZNode）来表示一个锁。假设我们有一个`/exclusive_lock`临时节点，在需要创建排他锁时，所有的客户端都会试图调用create()接口在`/exclusive_lock`下创建一个临时节点`/lock`。zk会保证在所有的客户端中，最终只有一个能成功创建，那么就可以认为该客户端获取了锁。同时，所有没有获取到锁的客户端就需要在`/exclusive_lock`节点上创建一个Watcher监听，以便随时监听到`/lock`节点变更情况。

#### 释放锁

+ 在定义锁的时候，我们提到了`/exclusive_lock`是一个临时节点，因此在两种情况下，可能释放锁
  - 当前获取锁的客户端机器宕机，那么ZooKeeper上的这个临时节点就会被移除
  - 正常执行完业务逻辑后，客户端就会主动将自己创建的临时节点删除

+ 无论哪种情况移除了`/lock`节点，zk都会通知所有在`/exclusive_lock`节点上注册了子节点变更Watcher监听的客户端。这些客户端在接收到通知后，再次重新发起分布式锁获取，即重复“获取锁”过程

### ZK共享锁
同排他锁一样，同样是通过ZooKeeper上的数据节点来表示一个锁，是一个类似于/shared_lock/[Hostname]-请求类型-序号的临时顺序节点，如：
/shared_lock/192.168.0.1-R-00000001，那么 这个节点就代表了一个共享锁.(R-读 W-写)

#### 获取锁

+ 在需要获取共享锁时，所有客户端都会到/shared_lock这个节点下面创建一个临时顺序节点，如果当前是读请求，那么就创建例如 /shared_lock/192.168.0.1-R-00000001的节点。如果是写请求，那么就创建例如 /shared_lock/192.168.0.1-W-00000001的节点。

##### 判断读写顺序

+ 根据共享锁的定义，不同的事务都可以同时对同一个数据对象进行读操作，而更新操作必须在当前没有任何事务读写操作的情况下进行。基于这个原则来通过ZooKeeper的节点来确定分布式读写顺序，大概可以分为如下4个步骤：
  - 创建完节点后，获取/shared_lock节点下的所有子节点，并对该节点注册了子节点变更的Wathcher监听
  
  - 确定自己的节点序号在所有子节点中的顺序
  
  - **对于读请求：** 如果没有比自己序号小的子节点，或是所有比自己序号小的子节点都是读请求，那么表明 自己已经成功获取到了共享锁，同时开始执行读取逻辑；如果比自己序号小的子节点中有写请求，那么就需要进入等待；
  **对于写请求：** 如果自己不是序号最小的子节点，那么就需要进入等待。
  
  - 接收到Watcher的通知后，重复步骤1。

#### 释放锁

+ 释放锁的逻辑和排他锁是一致.


### 实现思路

+ zookeeper 可以根据有序节点+watch实现，实现思路：
  - 为每个线程生成一个有序的临时节点，为确保有序性，在排序一次全部节点，获取全部节点，每个线程判断自己是否最小，如果是的话，获得锁，执行操作，操作完删除自身节点。如果不是第一个的节点则监听它的前一个节点，当它的前一个节点被删除时，则它会获得锁，以此类推。

+ 由于自己实现麻烦，且apache提供了zk开源客户端Curator包解决此方案。Curator框架在zookeeper原生API接口上进行了包装，解决了很多ZooKeeper客户端非常底层的细节开发。提供ZooKeeper各种应用场景(recipe， 比如：分布式锁服务、集群领导选举、共享计数器、缓存机制、分布式队列等)的抽象封装，实现了Fluent风格的API接口,是最好用，最流行的zookeeper的客户端。

### 代码片段

+ 引入依赖
````xml
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-recipes</artifactId>
    <version>4.0.1</version>
    <exclusions>
        <exclusion>
            <groupId>org.apache.zookeeper</groupId>
            <artifactId>zookeeper</artifactId>
        </exclusion>
    </exclusions>
</dependency>

<!-- curator中有zookeeper依赖，排除掉，引用版本和下载的客户端版本一致的jar -->
<dependency>
    <groupId>org.apache.zookeeper</groupId>
    <artifactId>zookeeper</artifactId>
    <version>3.4.14</version>
</dependency>
````

+ DistributedRedisLock 类

````java
public class DistributedRedisLock {
    public static Logger log = LoggerFactory.getLogger(DistributedRedisLock.class);
    /**
     * 可重入排它锁
     **/
    private InterProcessMutex interProcessMutex;
    /**
     * 竞争资源标志
     **/
    private String lockName;
    /**
     * 根节点
     **/
    private String root = "/distributed/lock/";
    private static CuratorFramework curatorFramework;
    /**
     * 多ZK_URL 逗号分隔
     **/
    private static String ZK_URL = "127.0.0.1:2181";

    static {
        curatorFramework = CuratorFrameworkFactory.newClient(ZK_URL, new ExponentialBackoffRetry(3000, 3));
        curatorFramework.start();
    }

    /**
     * 实例化
     *
     * @param lockName
     */
    public DistributedRedisLock(String lockName) {
        try {
            this.lockName = lockName;
            interProcessMutex = new InterProcessMutex(curatorFramework, root + lockName);
        } catch (Exception e) {
            log.error("initial InterProcessMutex exception=" + e);
        }
    }


    /**
     * 获取锁
     */
    public boolean acquire() {
        int flag = 0;
        try {
            //重试2次，每次最大等待2s，也就是最大等待4s
            while (!interProcessMutex.acquire(2, TimeUnit.SECONDS)) {
                flag++;
                if (flag > 1) {  //重试两次
                    break;
                }
            }
        } catch (Exception e) {
            log.error("distributed lock acquire exception=" + e);
        }
        if (flag > 1) {
            log.debug("Thread:" + Thread.currentThread().getId() + " acquire distributed lock  busy");
            return Boolean.FALSE;
        } else {
            log.debug("Thread:" + Thread.currentThread().getId() + " acquire distributed lock  success");
            return Boolean.TRUE;
        }
    }

    /**
     * 释放锁
     */
    public void release() {
        try {
            if (interProcessMutex != null && interProcessMutex.isAcquiredInThisProcess()) {
                interProcessMutex.release();
                curatorFramework.delete().inBackground().forPath(root + lockName);
                log.debug("Thread:" + Thread.currentThread().getId() + " release distributed lock  success");
            }
        } catch (Exception e) {
            log.debug("Thread:" + Thread.currentThread().getId() + " release distributed lock  exception=" + e);
        }
    }
}
````


+ ZkLockTemplate 类和之前类似

````java
public class ZkLockTemplateImpl implements ZkLockTemplate {
    private Logger LOG = LoggerFactory.getLogger(ZkLockTemplateImpl.class);

    @Override
    public <T> T execute(String lockName, CallBack<T> callBack) {
        DistributedRedisLock lock = new DistributedRedisLock(lockName);
        boolean acquire = false;
        try {
             acquire = lock.acquire();
            if (acquire){
                LOG.debug("ZkLockTemplateImpl,获取到锁");
                return callBack.invoke();
            }
            LOG.info("ZkLockTemplateImpl,未获取到锁");
            throw new AppException("1011", lockName + "业务正在处理中");
        } finally {
            if (acquire) {
                lock.release();
            }
        }
    }
}
````

### 测试

+ 先来一个不加分布式锁的模拟
````java
public class DemoTest {

    public static void say(CountDownLatch down) {
        try {
            down.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss|SSS");
        String orderNo = sdf.format(new Date());
        System.out.println("生成的订单号是：" + orderNo);
    }

    public static void main(String[] args) {
        CountDownLatch down = new CountDownLatch(1);
        for (int i = 0; i < 10; i++) {
            new Thread(()-> {
                DemoTest.say(down);
            }).start();
        }
        down.countDown();
    }
}
````
+ 结果：
````
生成的订单号是：19:39:41|168
生成的订单号是：19:39:41|169
生成的订单号是：19:39:41|168
生成的订单号是：19:39:41|168
生成的订单号是：19:39:41|169
生成的订单号是：19:39:41|168
生成的订单号是：19:39:41|169
生成的订单号是：19:39:41|170
生成的订单号是：19:39:41|170
生成的订单号是：19:39:41|170
````
可以看出时间是会乱的

+ zk分布式锁改造版本
````java
public class DemoTest {

    public static void say(CountDownLatch down) {
        try {
            down.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss|SSS");
        String orderNo = sdf.format(new Date());
        System.out.println("生成的订单号是：" + orderNo);
    }

    public static void main(String[] args) {
        ZkLockTemplate template = new ZkLockTemplateImpl();
        CountDownLatch down = new CountDownLatch(1);
        for (int i = 0; i < 10; i++) {
            new Thread(()-> {
                template.execute("createOrder",()->{
                    DemoTest.say(down);
                    return null;
                });
            }).start();
        }
        down.countDown();
    }
}
````

+ 结果：
````
生成的订单号是：19:42:13|592
生成的订单号是：19:42:13|655
生成的订单号是：19:42:13|670
生成的订单号是：19:42:13|670
生成的订单号是：19:42:13|686
生成的订单号是：19:42:13|702
生成的订单号是：19:42:13|717
生成的订单号是：19:42:13|717
生成的订单号是：19:42:13|733
生成的订单号是：19:42:13|733
````

改造后的打印按照时间顺序打印



