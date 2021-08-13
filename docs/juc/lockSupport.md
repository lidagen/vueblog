## LockSupport 
+ LockSupport是用来创建锁和其它同步类的基本线程阻塞原语。简单来说，**就是对原有锁支持，使线程等待唤醒机制（wait/notify）的改良加强版。**
+ LockSupport中的park()和unpark(thread)作用分别是阻塞线程和解除线程阻塞。

### 三种让线程等待唤醒的方法
+ Object中的wait()、notify()
+ JUC包中的Condition类的await()、signal()
+ **LockSupport类可以阻塞当前线程以及唤醒指定被阻塞的线程**

### wait()、notify()限制 / await()、signal()限制

#### wait()、notify()
+ 这两个方法不能脱离synchronized存在
+ wait、notify方法使用上有顺序，如果线程先执行了notify方法，则wait一直会等待，无法被唤醒 
#### await()、signal()
+ 这两个方法不能脱离Lock存在
+ await()、signal()方法使用上有顺序，如果线程先执行了signal方法，则await一直会等待，无法被唤醒 

### LockSupport方法介绍
+ LockSupport类使用了一个名为Permit（许可）的概念了阻塞和唤醒线程的功能，每个线程都有一个permit,permit只有两个值1和0,默认是0
+ 可以把permit看作一个信号量Semaplehore，但与Semaphore不同的是，许可的累加上限是1
+

#### API
+ pack()
  -  permit默认是0，如果一开始调用`park()`方法，当前线程就会被阻塞，直到别的线程将当前线程permit设置为1,park方法会被唤醒，然后再将将permit再次设置为0返回
+ unpack(thread)
  - 调用`unpack(thread)`方法后，会将thread线程的许可permit设置为1（注意多次调用unpack方法不会累加permit）,会自动唤醒thread线程  

#### 代码演示
````java
/**
* 无锁 并且pack和unpack没有顺序上的要求
*
*/
public class LockSupportDemo {

    public static void main(String[] args) throws InterruptedException {
        Thread a = new Thread(() -> {
            
            System.out.println(Thread.currentThread().getName() + "\t ---come in");
            try { TimeUnit.SECONDS.sleep(2); } catch (InterruptedException e) { e.printStackTrace(); }
            LockSupport.park();
            System.out.println(Thread.currentThread().getName() + "\t ---被唤醒");
        });
        a.start();

       
        Thread b = new Thread(() -> {
            LockSupport.unpark(a);
            System.out.println(Thread.currentThread().getName() + "\t 通知了");
        });
        b.start();
    }
}
`````
