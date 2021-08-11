## BlockingQueue 阻塞队列

+ 当队列是空的，从队列里获取元素操作会被阻塞。如果队列是满的，往队列里面添加元素会被阻塞。
### BlockingQueue接口7个实现类
+ `**ArrayBlockingQueue**` 数组结构的有界阻塞队列
+ `**LinkedBlockingQueue**` 链表结构的有界（默认Integer.MAX_VALUE）阻塞队列（太大，接近无界）
+ `PriorityBlockingQueue` 支持优先级排序的无界阻塞队列
+ `DelayQueue` 优先级队列实现的延迟无界阻塞队列
+ `**SynchronousQueue**` 不存储元素的阻塞队列，即单个元素队列
+ `LinkedTransferQueue` 链表结构组成的无界阻塞队列
+ `LinkedBlockingDeque` 链表结构组成的双向阻塞队列


### BlockingQueue核心方法

#### 抛出异常
+ 插入  add(e)
+ 移除  remove()
+ 检查  element()
::: tip
+ 当阻塞队列满时，再add会抛出IllegalStateException
+ 当阻塞队列空时，再remove会抛出NoSuchElementException
:::

#### 特殊值
+ 插入 offer(e)
+ 移除 poll()
+ 检查 peek()

::: tip
+ 当插入时，返回boolean值判断是否插入成功
+ 当移除时，如果成功，返回移除的值，如果没值返回null
:::

### 阻塞
+ 插入 put(e)
+ 移除 take()
+ 检查 不可用
::: tip
+ 如果队列满了，新put数据线程会一直等待（阻塞）直到put成功或者响应中退出
+ 当队列为空时，消费者试图从队列中take数据线程一直等待直到队列可用
:::

### 超时
+ 插入 offer(e,time,unit)
+ 移除 poll(time,unit)
+ 检查 不可用

::: tip
+ 当队列满或者空时，offer、poll数据会阻塞直到拿到数据或者超过时限退出
:::

### SynchronousQueue 单元素队列演示
````java
public class BlockingQueue {
    public static void main(String[] args) throws InterruptedException {
        SynchronousQueue queue = new SynchronousQueue();
        new Thread(()->{
            try {
                System.out.println(Thread.currentThread().getName() + ": put 1");
                queue.put("a");
                System.out.println(Thread.currentThread().getName() + ": put 2");
                queue.put("b");
                System.out.println(Thread.currentThread().getName() + ": put 3");
                queue.put("c");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        },"AA").start();

        new Thread(()->{
            try {
                TimeUnit.SECONDS.sleep(3);
                System.out.println("take:" + queue.take());
                TimeUnit.SECONDS.sleep(3);
                System.out.println("take:" +queue.take());
                TimeUnit.SECONDS.sleep(3);
                System.out.println("take:" +queue.take());
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        },"BB").start();
    }
}
````

### 阻塞队列的使用场景
+ 生产者消费者模式
+ 线程池
+ 消息中间件

#### 阻塞队列版 生产者消费者模式
````java
class Source {
    private volatile boolean flag = true; //默认开启消费标记
    private AtomicInteger atomicInteger = new AtomicInteger();

    BlockingQueue<String> queue = null;

    public Source(BlockingQueue<String> blockingQueue) {
        this.queue = blockingQueue;
        System.out.println(queue.getClass().getName());
    }


    //生产
    public void producer() throws Exception {
        String data = null;
        boolean retVal;
        while (flag) {
            data = atomicInteger.incrementAndGet() + "";
            retVal = queue.offer(data, 2L, TimeUnit.SECONDS);
            //插入成功
            if (retVal) {
                System.out.println(Thread.currentThread().getName() + "\t插入数据" + data + "成功");
            } else {
                System.out.println(Thread.currentThread().getName() + "\t插入数据" + data + "失败");
            }
            TimeUnit.SECONDS.sleep(1);
        }
        System.out.println("生产停止！");
    }

    //消费
    public void consumer() throws Exception {
        String result;
        while (flag) {
            result = queue.poll(2L, TimeUnit.SECONDS);
            if (null == result || result.equalsIgnoreCase("")) {
                System.out.println("队列超过2S无数据！消费退出！");
                flag = false;
                return;
            }
            System.out.println(Thread.currentThread().getName() + "\t消费队列-->" + result + "成功");
        }
    }
}

public class ProducerConsumer {

    public static void main(String[] args) {
        Source source = new Source(new ArrayBlockingQueue<>(2));
        new Thread(() -> {
            try {
                source.producer();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }, "pord").start();


        new Thread(() -> {
            try {
                source.consumer();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }, "cons").start();
    }
}
````
::: tip
+ 不用阻塞队列，可以用lock condition实现
::: 