## 分布式锁二 Redis分布式锁

### 概述
+ redis实现分布式锁类似数据库分布式锁。针对某个资源，保证其访问的互斥性。使用redis实现锁，主要就是讲资源放入redis中，利用其原子性的特性。当其它线程访问资源时，先在redis中看是否存在，如果存在不允许继续操作。

+ redis有两个方法：`setnx()` `expire()`.setnx接收两个参数key，value。如果key存在，则不做任何操作，返回0，若key不存在，则设置成功，返回1。expire 设置过期时间，要注意的是 setnx 命令不能设置 key 的超时时间，只能通过 expire() 来对 key 设置。这两个方法是实现redis分布式锁的重要方法。

+ 加锁：加锁中需要设置过期时间，这两个操作必须是原子性的，否则加锁后没有成功设置过期时间，导致死锁。

+ 解锁：解锁必须是解除自己加上的锁，比如一个A线程执行效率特别慢，导致锁失效后还未执行完，这时B线程拿到了锁，之后A线程执行完毕去解锁，结果把B线程的锁解了。导致后面的C、D、E都可以拿到锁。

### 实现过程
+ 引入redis 并配置，实现参考**代码片段**里的 springboot整合redis

+ 和数据库分布式锁类似，当执行一个流程时，先加锁，如果成功则执行业务代码，完成后解锁.

+ 当加锁失败，说明此时已经存在锁，此处抛AppException异常，可以上游捕获此异常后续处理.

### 代码片段
+ redis锁代码
```` java
@Component
public class RedisLock {
     /**
     * 解锁脚本，原子操作
     */
    private static final String unlockScript =
            "if redis.call(\"get\",KEYS[1]) == ARGV[1]\n"
                    + "then\n"
                    + "    return redis.call(\"del\",KEYS[1])\n"
                    + "else\n"
                    + "    return 0\n"
                    + "end";
    @Autowired
    private StringRedisTemplate redisTemplate;

     /**
       * 功能描述: <br>
       *< 加锁，有阻塞>
       *
       * @param
       * @return
       */
    public String lock(String name, long expire, long timeout){
        long startTime = System.currentTimeMillis();
        String token;
        do{
            token = tryLock(name, expire);
            if(token == null) {
                if((System.currentTimeMillis()-startTime) > (timeout-50)){
                    break;
                }
                try {
                    Thread.sleep(50); //try 50 per sec
                } catch (InterruptedException e) {
                    e.printStackTrace();
                    return null;
                }
            }
        }while(token==null);

        return token;
    }
    /**
     * 加锁，无阻塞
     * @param name
     * @param expire
     * @return
     */
    public String tryLock(String name, long expire) {
        String token = UUID.randomUUID().toString();
        RedisConnectionFactory factory = redisTemplate.getConnectionFactory();
        RedisConnection conn = factory.getConnection();
        try{
            Boolean result = conn.set(name.getBytes(Charset.forName("UTF-8")), token.getBytes(Charset.forName("UTF-8")),
                    Expiration.from(expire, TimeUnit.MILLISECONDS), RedisStringCommands.SetOption.SET_IF_ABSENT);
            if(result!=null && result){
                return token;
            }
        }finally {
            RedisConnectionUtils.releaseConnection(conn, factory);
        }
        return null;
    }
    /**
     * 解锁
     * @param name
     * @param token
     * @return
     */
    public boolean unlock(String name, String token) {
        byte[][] keysAndArgs = new byte[2][];
        keysAndArgs[0] = name.getBytes(Charset.forName("UTF-8"));
        keysAndArgs[1] = token.getBytes(Charset.forName("UTF-8"));
        RedisConnectionFactory factory = redisTemplate.getConnectionFactory();
        RedisConnection conn = factory.getConnection();
        try {
            Long result = (Long)conn.scriptingCommands().eval(unlockScript.getBytes(Charset.forName("UTF-8")), ReturnType.INTEGER, 1, keysAndArgs);
            if(result!=null && result>0){
                return true;
            }
        }finally {
            RedisConnectionUtils.releaseConnection(conn, factory);
        }

        return false;
    }
}
````
+ 封装
````java
//回调接口
public interface CallBack<T> {
    /**
     * 调用
     * @return 结果
     */
    T invoke();
}
````
````java
  /**
     * Redis实体类，封装加锁参数
     * @return 结果
     */
public class RedisLockBean {

    private String name;

    private long expire;

    private long timeout;

    public RedisLockBean(String name, long expire, long timeout) {
        this.name = name;
        this.expire = expire;
        this.timeout = timeout;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getExpire() {
        return expire;
    }

    public void setExpire(long expire) {
        this.expire = expire;
    }

    public long getTimeout() {
        return timeout;
    }

    public void setTimeout(long timeout) {
        this.timeout = timeout;
    }
}
````
````java
/**
* 模板
*/
public interface RedisLockTemplate {
    /**
     * 执行
     * @param callBack 回调
     * @return 执行结果
     */
    <T> T execute(RedisLockBean redisLockBean, CallBack<T> callBack);
}
````
````java
/**
 * 〈〉<br>
 * 模板实现类
 *
 * @author 88395515
 * @date: Created in 15:59 2019/9/9
 * @see [相关类/方法]（可选）
 * @since [产品/模块版本] （可选）
 */
@Component
public class RedisLockTemplateImpl implements RedisLockTemplate {

    private Logger LOG = LoggerFactory.getLogger(RedisLockTemplateImpl.class);

    @Autowired
    RedisLock redisLock;

    @Override
    public <T> T execute(RedisLockBean redisLockBean, CallBack<T> callBack) {
        String token = null;
        try {
            token = redisLock.lock(redisLockBean.getName(), redisLockBean.getExpire(), redisLockBean.getTimeout());
            if (token != null) {
                LOG.info("RedisLockTemplate,获取到锁");
                return callBack.invoke();
            }
            LOG.error("RedisLockTemplate,未获取到锁");
            throw new AppException(CoreErrorCode.ONE_BY_ONE_EXCEPTION, oneByOne.getDescription() + "业务正在处理中");
        } finally {
            if (token != null) {
                redisLock.unlock(redisLockBean.getName(), token);
            }
        }

    }
}
````

+ 使用
````java
@Autowired
RedisLockTemplate redisLockTemplate;

@RequestMapping(value = "/b")
public ModelAndView b() {
    ModelAndView mv = new ModelAndView("b");
    redisLockTemplate.execute(new RedisLockBean("LOCK_DEMO_B", 1000, 1000),
        new CallBack<Object>() {
            @Override
            public Object invoke() {
                //TODO 业务逻辑代码
                return null;
            }
        });
    return mv;
}
````

### 总结
+ 上述代码，仅对 redis 单实例架构有效，当面对 redis 集群时就无效了。但是一般情况下，我们的 redis 架构多数会做成“主备”模式，然后再通过 redis 哨兵实现主从切换，这种模式下我们的应用服务器直接面向主机，也可看成是单实例，因此上述代码实现也有效。但是当在主机宕机，从机被升级为主机的一瞬间的时候，如果恰好在这一刻，由于 redis 主从复制的异步性，导致从机中数据没有即时同步，那么上述代码依然会无效，导致同一资源有可能会产生两把锁，违背了分布式锁的原则。

+ 当 redis 的架构是单实例模式时，如果存在主备且可以忍受小概率的锁出错，那么就可以直接使用上述代码，当然最严谨的方式还是使用官方的 Redlock 算法实现。其中 Java 包推荐使用 redisson。

## Redisson 改写redis分布式锁
+ Redisson是架设在Redis基础上的一个Java主内存数据网格（In-Memory Data Grid）。在Java实用工具包中常用接口的基础上，为使用者提供了一系列具有分布式特性的常用工具类。
+ Redisson Wiki：`https://github.com/redisson/redisson/wiki`


### jar包依赖
````xml
<dependency>
    <groupId>org.redisson</groupId>
    <artifactId>redisson</artifactId>
    <version>3.5.0</version>
</dependency>
````

### 配置Redisson
````java
public class RedissonManager {
    private static Config config = new Config();
    //声明redisso对象
    private static Redisson redisson = null;
   //实例化redisson
    static{
       /**
         * 单机模式,如果有密码后面setPassword
         */
        config.useSingleServer().setAddress("redis://127.0.0.1:6379");
        /**
         * 哨兵模式
         */
        /*config.useSentinelServers().addSentinelAddress("redis://172.29.3.245:26378","redis://172.29.3.245:26379", "redis://172.29.3.245:26380")
                .setMasterName("mymaster")
                .setPassword("a123456").setDatabase(0);*/
        /**
         * 集群模式
         */
        /*config.useClusterServers().addNodeAddress(
                "redis://172.29.3.245:6375","redis://172.29.3.245:6376", "redis://172.29.3.245:6377",
                "redis://172.29.3.245:6378","redis://172.29.3.245:6379", "redis://172.29.3.245:6380")
                .setPassword("a123456").setScanInterval(5000);*/
       
        //得到redisson对象
        redisson = (Redisson) Redisson.create(config);
    }

 //获取redisson对象的方法
    public static Redisson getRedisson(){
        return redisson;
    }
}
````
### 锁的获取和释放
````java
public class DistributedRedisLock {
    private static Logger LOG = LoggerFactory.getLogger(DistributedRedisLock.class);
   //从配置类中获取redisson对象
    private static Redisson redisson = RedissonManager.getRedisson();
    private static final String LOCK_TITLE = "redisLock_";
   //加锁
    public static boolean acquire(String lockName,int timeout){
        //声明key对象
        String key = LOCK_TITLE + lockName;
        //获取锁对象
        RLock mylock = redisson.getLock(key);
        //加锁，并且设置锁过期时间，防止死锁的产生
       try {
            return mylock.tryLock(time, TimeUnit.MINUTES);
        } catch (InterruptedException e) {
            LOG.error("======lock,e:{}======" + Thread.currentThread().getName(),e);
            return Boolean.FALSE;
        }
    }
  //锁的释放
    public static void release(String lockName){
        //必须是和加锁时的同一个key
        String key = LOCK_TITLE + lockName;
        //获取所对象
        RLock mylock = redisson.getLock(key);
        //释放锁（解锁）
        mylock.unlock();
        LOG.info("======unlock======"+Thread.currentThread().getName());
    }
}
````

### 改写 `RedisLockTemplateImpl`
````java
@Component
public class RedisLockTemplateImpl implements RedisLockTemplate {

    private static Logger LOG = LoggerFactory.getLogger(RedisLockTemplateImpl.class);

    @Autowired
    RedisLock redisLock;

    @Override
    public <T> T execute(RedisLockBean redisLockBean, CallBack<T> callBack) {
         boolean acquire = false;
        try {
            acquire = DistributedRedisLock.acquire(redisLockBean.getName(), redisLockBean.getTimeout());
            if (acquire){
                LOG.info("RedisLockTemplate,获取到锁");
                return callBack.invoke();
            }
            LOG.error("RedisLockTemplate,未获取到锁");
            throw new AppException(CoreErrorCode.ONE_BY_ONE_EXCEPTION, oneByOne.getDescription() + "业务正在处理中");
        } finally {
            if(acquire){
                DistributedRedisLock.release(redisLockBean.getName());
            }  
        }
    }
}
````
