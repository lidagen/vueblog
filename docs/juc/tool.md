### JUC工具包

### CountDownLatch 线程计数器
+ 这个类可以使一个线程等待其他线程执行完毕以后再执行
+ 其通过一个计数器来实现，设置一个计数器初始数量，当其它线程执行完毕，计数器-1，当所有现在执行完计数器= 0 时，等待的线程就可以恢复工作了

````java
public class CountDownLatchDemo {
    public static void main(String[] args) throws Exception{
        CountDownLatch count = new CountDownLatch(6);
        
        for (int i = 1; i <= 6; i++) {
            new Thread(() -> {
                System.out.println("同学： " + Thread.currentThread().getName() + "上晚自习了！");
                //线程做完-1
                count.countDown();
            }, CountryEnum.getEnumName(i)).start();
        }
        //主线程等待其它线程执行结果（await还有个时间参数的方法，设定等待多久）
        count.await();
        System.out.println("班长关门！");
    }
}
````

### CyclicBarrier 循环屏障
+ Cyclic循环，Barrier屏障，当一组线程达到一个屏障点前被阻塞，直到最后一个线程到达屏障才会开门，所有被拦截的线程才会继续干活，线程进入屏障通过CyclicBarrier的await()方法
+ 简单理解就是，需要等待所有龙珠集齐了以后，才可以执行召唤神龙方法（见demo）
````java
public class CyclicBarrierDemo {
    public static void main(String[] args) {
        CyclicBarrier barrier = new CyclicBarrier(7, () -> {
            System.out.println("收集成功，召唤神龙！");
        });
        for (int i = 1; i <= 7; i++) {
            final int tempInt = i;
            new Thread(() -> {
                System.out.println("收集到" + tempInt + "号龙珠");
                try {
                    barrier.await();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    e.printStackTrace();
                }
            }, String.valueOf(i)).start();
        }
    }
}
````
::: tip
CountDownLatch : 一个线程(或者多个)， 等待另外N个线程完成某个事情之后才能执行。   
CyclicBarrier  : N个线程相互等待，任何一个线程没有到达或完成时，所有的线程都必须互相等待。
:::

### Semaphore 信号量
+ 信号量主要两个用处，一个是用于多个资源的互斥使用，另一个用于并发线程数的控制。
+ 信号量的3个资源被6个线程抢，不同的是资源使用完成以后会释放，后续线程可以继续抢占。
````java
package com.test;

import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

/**
 * 模拟6个车抢3个车位
 */
public class SemaphoreDemo {
    public static void main(String[] args) {
        Semaphore semaphore = new Semaphore(3);
        for (int i = 1; i <= 6; i++) {
            final int tempInt = i;
            new Thread(() -> {
                try {
                    //抢占资源
                    semaphore.acquire();
                    System.out.println("车辆:" + tempInt + "抢到车位");
                    TimeUnit.SECONDS.sleep(3);
                    System.out.println("车辆:" + tempInt + "开走了");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }finally {
                    //释放semaphore
                    semaphore.release();
                }
            }, String.valueOf(i)).start();
        }
    }
}
````
