## 线程安全的集合类

### 写时复制 CopyOnWriteArrayList
+ 多线程下，普通的List不满足线程安全的需要，可能会抛出`ConcurrentModificationException`异常，通常情况下有三种解决方案
  - Vector 线程安全的集合（效率低）
  - Collections.synchronizedList(new ArrayList<>()) 工具类
  - CopyOnWriteArrayList JUC下的线程安全类

+ CopyOnWriteArrayList核心思想是读写分离
  - 在做写时加锁，不直接往当前容器Object[]添加，而是对容器进行copy +1,把新元素放入copy的新容器中，添加完元素原容器的引用指向新的容器。而其读是无锁的，性能高。
  - 缺点是：每次写入都有copy一份容器，数据量大时，对内存压力较大。2 可能无法保持实时性，Vector读写都加锁，而CopyOnWriteArrayList读写作用在新老容器上，并发时可能读不到最新数据

+ CopyOnWriteArrayList Add()方法
````java
    public boolean add(E e) {
        final ReentrantLock lock = this.lock;
        //上锁
        lock.lock();
        try {
            //获取原有数组
            Object[] elements = getArray();
            int len = elements.length;
            //复制一份+1
            Object[] newElements = Arrays.copyOf(elements, len + 1);
            newElements[len] = e;
            //设置新的array为+1的
            setArray(newElements);
            return true;
        } finally {
            lock.unlock();
        }
    }
````

### ConcurrentHashMap 
+ 线程安全的map同样可以使用
  - HashTable 读写都用synchronized，效率低下
  - ConcurrentHashMap 使用了锁分离技术，多个锁控制对hash表的不同部分进行的修改
+ ConcurrentHashMap 中对map进行了分段Segment，每个Segment本身相当一个HashMap对象，**同一Segment只有写写互斥，读读是不互斥的，不同Segment不互斥**

