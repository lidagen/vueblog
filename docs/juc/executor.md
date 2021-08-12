## Executor 线程池
+ 线程池的主要作用是控制运行的线程数量，**处理过程中将任务放入队列**，然后在线程创建后启动这些任务，**如果线程数量超出了设置的核心线程数则其它排队等候**
+ 它的主要特点是：**线程复用；控制最大并发数；管理线程**

### Executor 与 Executors
+ Executor 是线程池的接口，主要实现类是ThreadPoolExecutor
+ Executors 是线程池的工具类，负责创建一些具体类型的线程池

### Executors 下的三个线程池
+ Executors.newFixedThreadPool(int nThreads)
  - 核心和最大线程数都等于设定的值LinkedBlockingQueue
+ Executors.newSingleThreadExecutor()
  - 单线程的线程池，核心最大都是1，队列LinkedBlockingQueue
+ Executors.newCachedThreadPool()
  - 核心数为0，最大线程Integer.MAX_VALUE,队列是 SynchronousQueue
::: tip
Executors 创建线程池方法一般不用，理由如下
+ newFixedThreadPool 、newSingleThreadExecutor队列是LinkedBlockingQueue，队列接近无界，容易引起OOM
+ newCachedThreadPool、ScheduledThreadPool创建最大线程Integer.MAX_VALUE，可能会创建大量线程导致OOM
:::  

### ThreadPoolExecutor 七大参数
````java
  public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              ThreadFactory threadFactory,
                              RejectedExecutionHandler handler) {
        if (corePoolSize < 0 ||
            maximumPoolSize <= 0 ||
            maximumPoolSize < corePoolSize ||
            keepAliveTime < 0)
            throw new IllegalArgumentException();
        if (workQueue == null || threadFactory == null || handler == null)
            throw new NullPointerException();
        this.acc = System.getSecurityManager() == null ?
                null :
                AccessController.getContext();
        this.corePoolSize = corePoolSize;
        this.maximumPoolSize = maximumPoolSize;
        this.workQueue = workQueue;
        this.keepAliveTime = unit.toNanos(keepAliveTime);
        this.threadFactory = threadFactory;
        this.handler = handler;
    }
````
+ 核心线程数 corePoolSize 
+ 最大线程数 maximumPoolSize
  - 值必须>=1 且 maximumPoolSize = corePoolSize + 扩展的
+ 存活时间 keepAliveTime
  - 当前线程数量超过corePoolSize，且空闲时间达到keepAliveTime，会销毁直到剩下corePoolSize个为止
+ 时间单位 unit
+ 阻塞队列 workQueue
+ 线程工厂 threadFactory
  - 一般默认即可
+ 拒绝策略 handler
  - 当队列满了且最大线程数也扩展了，进来的线程如何处理的策略

#### 线程池工作原理
+ 线程进来，进入核心线程数执行，如果核心线程数满了以后，放入阻塞队列中等待，阻塞队列满了以后，扩展最大线程数。
+ 如果最大线程数扩展满了以后，阻塞队列也满了，这时候要执行拒绝策略
+ 如果线程数降下来了，超过keepAliveTime的闲置线程会被回收，直到线程数回到核心线程数

#### 四种拒绝策略
+ AbortPolicy(默认): 直接抛出RejectedExecutionException异常阻止系统正常运行
+ CallerRunsPolicy:"调用者运行"一种调节机制，该策略不会抛弃任务，也不会抛出异常，而是将某些任务回退到调用者，从而降低新的任务流量 
  - 简单理解就是，如果是main线程开启线程池，则做不完的线程回退给main线程让其执行
+ DiscardOldestPolicy:抛弃队列中等待最久的任务，把当前任务加入队列中常识再次提交当前任务
+ DiscardPolicy:直接丢弃任务，不予任何处理也不提示异常。

#### 线程数如何合理设定
+ CPU 密集型
  - CPU密集型的任务需要大量运算，而没有阻塞，CPU一直全速运行。
  - CPU密集型一般任务配置尽可能少的线程数，线程数 = CPU核数+1
+ IO  密集型
  - IO密集型的任务并不一定一直在执行任务，应配置尽可能的多
    + 1. 线程数 = CPU核数 * 2
    + 2. 线程数 = CPU核数/1-阻塞系数 （阻塞系数0.8~0.9之间）

::: tip
Runtime.getRuntime().availableProcessors() //查看核数
:::

