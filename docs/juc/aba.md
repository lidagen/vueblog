## ABA问题
### 什么是ABA问题
+ CAS算法有个重要前提是需要取出内存数据与当下比较并交换，那么这个时间差会导致数据的变化
+ 比如线程1从内存V中取出数值A，这时候另一个线程2也从内存V中取出数值A，并且线程2进行数据操作，将A替换成B然后又从内存V中将B变成了A，这时候线程1进行CAS时，内存中仍然是A，然后操作成功

::: tip
尽管线程1操作成功了，但不代表这个过程没有问题（视实际情况而定）
:::

### AtomicReference | AtomicStampedReference 原子引用
+ AtomicReference 可以把自定义的对象包装成原子类
+ AtomicStampedReference 是包含了版本号的原子引用，可以解决ABA问题
````java
package com.test;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import java.util.concurrent.atomic.AtomicStampedReference;

/**
 * 两个线程执行main方法，同时获取count的版本号为1
 * aa执行了ABA 把数据从100改为 101 又改回 100 这时候版本变为3
 * bb线程sleep以后，拿版本号1去对比，发现CAS失败
 */
public class Demo {
    //带版本号的原子引用
    static AtomicStampedReference<Integer> count = new AtomicStampedReference<>(100, 1);

    public static void main(String[] args) {
        new Thread(() -> {
            //版本号
            int stamp = count.getStamp();
            count.compareAndSet(100, 101, stamp, count.getStamp() + 1);
            System.out.println("当前版本号：" + count.getStamp());
            System.out.println(count.getReference());
            count.compareAndSet(101, 100, stamp + 1, count.getStamp() + 1);
            System.out.println("当前版本号：" + count.getStamp());
            System.out.println(count.getReference());
        }, "aa").start();
        new Thread(() -> {
            int stamp = count.getStamp();
            try {
                TimeUnit.SECONDS.sleep(1);
                boolean flag = count.compareAndSet(100, 200, stamp, count.getStamp() + 1);
                boolean flag1 = count.compareAndSet(100, 200, count.getStamp(), count.getStamp() + 1);
                System.out.println(flag + " -- " + count.getReference());
                System.out.println("重新获取数据："+flag1 + " -- " + count.getReference()+",版本号为"+ count.getStamp());

            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }, "bb").start();
    }
}

````
