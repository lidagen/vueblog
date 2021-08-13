## AQS
+ AbstractQueuedSynchronizer 抽象队列同步器，用来构建锁或者其它同步器组件的**重量级基础框架及整个JUC体系的基石**，通过内置的FIFO队列来完成资源获取线程的排队工作，并通过一个int类型变量state表示持有锁的状态。

### AQS为什么是JUC的基石
+ ReentranLock|CountDownLatch|Semaphore|ReentranReadWirteLock等都与AQS相关
+ 锁与同步器的关系
  - 锁 ： 面向锁的**使用者**，定义了程序员与锁教会的使用层API
  - 同步器：面向锁的**实现者**，简化了锁实现，屏蔽了同步状态管理、阻塞线程排队和通知、唤醒机制等

### AQS源码体系
+ AQS使用一个volatile的int类型成员变量来表示同步状态，通过内置的FIFO队列完成资源获取的排队工作，将每条要去抢占资源的线程封装成一个Node节点实现锁的分配，通过CAS完成对state值的修改。

### 由ReentrantLock解析AQS源码


<img :src="$withBase('/juc/lock.png')" alt="dock">

+ 加锁过程，分为三步
  - 尝试加锁
  - 加锁失败，线程进入队列
  - 线程进入队列，进入阻塞状态

### lock()方法
+ 假设一个场景，三个线程A\B\C获取资源，此时A占用了锁
+ 此时B线程进入lock方法
````java
/**非公平锁实现，CAS判断AQS中state是不是0，即是否被占用
*如果CAS为true,调用AQS的setExclusiveOwnerThread，设置占用窗口的锁
*如果false,调用acquire()方法，由于是B线程进入，走acquire方法
**/
 final void lock() {
    if (compareAndSetState(0, 1))
        setExclusiveOwnerThread(Thread.currentThread());
    else
        acquire(1);
}

```` 

#### acquire() 尝试获取锁
````java
 public final void acquire(int arg) {
    if (!tryAcquire(arg) &&
        acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
        selfInterrupt();
}

/** acquire 【尝试获取锁方法】中的tryAcquire实现，nonfairTryAcquire方法
*tryAcquire是AQS父类定义方法，有公平锁和非公平锁实现，看非公平代码
*先判断当前getState是否是0，即锁是否有占用，按假设此时A线程占用，判断不进入
*判断当前线程是否等于占用窗口的线程，也不进入，总体返回false
* 则取反 !tryAcquire(arg)是true
*   - 如果此时A线程释放了锁，B线程进入nonfairTryAcquire，获取到了c == 0,则设置state =1 ,并设置了占用窗口的线程
   - 还有一种情况，A线程重入，则nonfairTryAcquire走current == getExclusiveOwnerThread()，这种情况下state > 1 
*/
 final boolean nonfairTryAcquire(int acquires) {
    final Thread current = Thread.currentThread();
    int c = getState();
    //A线程放锁
    if (c == 0) {
        if (compareAndSetState(0, acquires)) {
            setExclusiveOwnerThread(current);
            return true;
        }
    }
    //A线程重入
    else if (current == getExclusiveOwnerThread()) {
        int nextc = c + acquires;
        if (nextc < 0) // overflow
            throw new Error("Maximum lock count exceeded");
        setState(nextc);
        return true;
    }
    return false;
}

/**addWaiter 【尝试获取锁未成功，就要使用该方法将其加入同步队列尾部】
*该方法入参Node.EXCLUSIVE，即下一个等候的线程，
*B线程进入由于还没有新建队列，tail为null
*B线程进入enq方法
*/
 private Node addWaiter(Node mode) {
    Node node = new Node(Thread.currentThread(), mode);
    // 尾节点
    Node pred = tail;
    //后续C线程进入不进入此方法
    if (pred != null) {
        node.prev = pred;
        if (compareAndSetTail(pred, node)) {
            pred.next = node;
            return node;
        }
    }
    enq(node);
    return node;
}
/**enq 入队方法
*t == null 初始化一个空Node伪节点，首尾相等
*第二个节点才保持进入的B线程，入队
*C 线程进入了，直接走else方法
*/
 private Node enq(final Node node) {
    for (;;) {
        Node t = tail;
        if (t == null) { 
            //初始化，new 一个空的Node节点
            if (compareAndSetHead(new Node()))
                tail = head;
        } else {
            node.prev = t;
            if (compareAndSetTail(t, node)) {
                t.next = node;
                return t;
            }
        }
    }
}
````

#### acquireQueued() 方法
````java
/** acquireQueued【一旦加入同步队列，就需要使用该方法，自旋阻塞唤醒来不断的尝试获取锁，直到被中断或获取到锁】
*此时入参进入的是B节点
*假设B线程尝试获取锁失败 进入shouldParkAfterFailedAcquire 、parkAndCheckInterrupt方法
*shouldParkAfterFailedAcquire 如果前驱节点的waitStatus是SIGNAL状态，返回true，则会走 parkAndCheckInterrupt方法
*parkAndCheckInterrupt 调用  LockSupport.park(this); B线程被挂起，进入了候客区，等待uppark调用
*/
final boolean acquireQueued(final Node node, int arg) {
    //取消排队标记
    boolean failed = true;
    try {
        boolean interrupted = false;
        //自旋
        for (;;) {
            //p是队列第一个节点，哨兵节点
            final Node p = node.predecessor();
            //p是哨兵节点，再尝试获取锁
            if (p == head && tryAcquire(arg)) {
                setHead(node);
                p.next = null; // help GC
                failed = false;
                return interrupted;
            }
            if (shouldParkAfterFailedAcquire(p, node) &&
                parkAndCheckInterrupt())
                interrupted = true;
        }
    } finally {
        if (failed)
            cancelAcquire(node);
    }
}
````


### unlock()方法
+解锁调用realese方法
````java
public final boolean release(int arg) {
    if (tryRelease(arg)) {
        //获取头节点
        Node h = head;
        if (h != null && h.waitStatus != 0)
            //解锁唤醒其它线程LockSupport.unpark(s.thread);
            unparkSuccessor(h);
        return true;
    }
    return false;
}

/**
*此方法把state设置为0
* setExclusiveOwnerThread = null
* 返回true,表示解锁成功
*/
protected final boolean tryRelease(int releases) {
    //入参releases = 1 ，如果没有重入的话，此时c =0
    int c = getState() - releases;
    //判断当前线程就是拿锁的哪个
    if (Thread.currentThread() != getExclusiveOwnerThread())
        throw new IllegalMonitorStateException();
    boolean free = false;
    if (c == 0) {
        free = true;
        setExclusiveOwnerThread(null);
    }
    setState(c);
    return free;
}
````

