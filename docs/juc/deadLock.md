## 死锁以及问题定位分析
+ 死锁是两个或者以上的进程执行过程中，因争夺资源而造成的互相等待现象，若无外力干涉则无法继续推进下去

### 死锁产生原因
+ 系统资源不足
+ 进程运行推进顺序不合适
+ 资源分配不当

### 死锁代码演示
````java
class LockMethod {
    private String lockA;
    private String lockB;

    LockMethod(String lockA, String lockB) {
        this.lockA = lockA;
        this.lockB = lockB;
    }

    public void LockA() throws InterruptedException {
        //拿到A锁
        synchronized (lockA) {
            System.out.println(Thread.currentThread().getName() + "获取A锁" + lockA);
            TimeUnit.MILLISECONDS.sleep(100);
            synchronized (lockB) {
               //TODO
            }
        }
    }

    public void LockB() throws InterruptedException {
        //拿到B锁
        synchronized (lockB) {
            System.out.println(Thread.currentThread().getName() + "获取B锁" + lockB);
            TimeUnit.MILLISECONDS.sleep(100);
            synchronized (lockA) {
               //TODO
            }
        }
    }
}

public class DeadLock {
    public static void main(String[] args) {
        LockMethod method = new LockMethod("q", "w");
        new Thread(() -> {
            try {
                method.LockA();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }, "线程1").start();
        new Thread(() -> {
            try {
                method.LockB();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }, "线程2").start();
    }
}
````
### 问题分析排查

#### jps jstack
::: tip
+ jps 名字类似 linux的 ps -ef|grep xxx 即 java ps 
+ 如果window系统下jps -l无反应，则可能 %TMP%/hsperfdata_${user}下无写入权限，修改即可（通过环境变量查看%TMP%位置）
::: 

+ 定位到那个类出现问题，用`jps -l` 找进程编号
+ `jstack 进程编号` 打印异常堆栈

