## Lock 和 ReadWriteLock
+ Lock和ReadWriteLock是两大锁的根接口，Lock代表实现类是ReentrantLock（可重入锁），ReadWriteLock（读写锁）的代表实现类是ReentrantReadWriteLock。
+ Lock（ReadWriteLock）和synchronized有一点非常大的不同，采用synchronized不需要用户去手动释放锁，当synchronized方法或者synchronized代码块执行完之后，系统会自动让线程释放对锁的占用；而Lock则必须要用户去手动释放锁，如果没有主动释放锁，就有可能导致出现死锁现象。

### ReentrantLock 重入锁
+ ReentrantLock 也是一种独占锁，读读也互斥

#### 公平锁与非公平锁
+ 公平锁就是队列，先来后到按顺序，非公平锁就是随机

+ ReentrantLock可以指定构造函数中布尔值来得到公平锁或者非公平锁，默认是非公平锁，非公平锁优点是吞吐量比公平锁大
  - new ReentrantLock(true) 公平锁
  - 对于 Synchronized而言，也是一种非公平锁

#### 可重入概念
+ 可重入锁也叫递归锁，指的是同一线程外层函数获得锁以后，内层递归函数仍然能获取该锁的代码。也即是说，**线程可以进入任何一个它已经拥有的锁所同步着的代码块。**
+ ReentrantLock、Synchronized都是可重入锁

::: tip
+ 简单理解就是，获取外层的锁以后，里面不管加多少个锁，都自动获取
:::

### ReentrantReadWriteLock 读写锁
+ 读写锁在读读的情况下，可以被多个线程共享

````java
package com.test;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * 资源类
 **/
class MyCache {
    private volatile Map<String, Object> map = new HashMap<>();
    ReadWriteLock readWriteLock = new ReentrantReadWriteLock();

    /**
     * 写入
     **/
    public void put(String key, Object val) {
        try {
            //加写锁
            readWriteLock.writeLock().lock();
            System.out.println(Thread.currentThread().getName() + "\t正在写入：" + key);
            try { TimeUnit.MILLISECONDS.sleep(300); } catch (InterruptedException e) { e.printStackTrace(); }
            map.put(key, val);
            System.out.println(Thread.currentThread().getName() + "\t写入end:" + key);
        } finally {
            readWriteLock.writeLock().unlock();
        }
    }

    /**
     * 读取
     * @param key
     */
    public void get(String key) {
        try {
            //加读锁
            readWriteLock.readLock().lock();
            System.out.println(Thread.currentThread().getName() + "\t正在读取：" + key);
            try { TimeUnit.MILLISECONDS.sleep(300); } catch (InterruptedException e) { e.printStackTrace(); }
            Object result = map.get(key);
            System.out.println(Thread.currentThread().getName() + "\t读取end:" + result.toString());
        } finally {
            readWriteLock.readLock().unlock();
        }
    }
}

public class LockDemo {
    public static void main(String[] args) {
        MyCache cache = new MyCache();
        //模拟5个线程put写入
        for (int i = 0; i < 5; i++) {
            final int tempInt = i;
            new Thread(() -> {
                cache.put(String.valueOf(tempInt), tempInt + "");
            }, "线程i--" + i).start();
        }


        for (int i = 0; i < 5; i++) {
            final int tempInt = i;
            new Thread(() -> {
                cache.get(String.valueOf(tempInt));
            }, "线程o==" + i).start();
        }
    }
}

````
+ 上面代码加读锁的意义在于，在线程进来的时候，首先判断是否有线程获取了锁，是否有线程获取了锁的判断通过读写锁中通过32位int类型state可以获取，其中低16位表示读锁，高16表示写锁。
- 不加读锁，如果有线程正在写入，读到的数据是不准确的