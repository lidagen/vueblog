## CAS

### CAS是什么
+ Compare and Swap ，即比较再交换。
+ CAS是一种无锁算法，CAS有3个操作数，内存值V，旧的预期值A，要修改的新值B。当且仅当预期值A和内存值V相同时，将内存值V修改为B，否则什么都不做。

###  AtomicInteger中的   public final boolean compareAndSet(int expect, int update );
````java
public class CASDemo {
    public static void main(String[] args) {
        /**定义一个AtomicInteger = 5的数字**/
        AtomicInteger integer = new AtomicInteger(5);
        /**预期是5，如果是则改为2020**/
        boolean a = integer.compareAndSet(5, 2020);
        System.out.println(a);
        System.out.println(integer);
        boolean b = integer.compareAndSet(5, 2021);
        System.out.println(b);
        System.out.println(integer);
        //结果就是a是ture,b是fasle,打印的数字为2020，第二次的比较与交换失败，不符合预期
    }
}
````

### CAS原理

#### 自旋锁
+ Unsafe + CAS原理 = 自旋


#### Unsafe类   
+ Unsafe是CAS的核心类，由于java无法直接访问底层系统，需要通过本地(native)方法来访问，Unsafe相当于一个后门，基于此类可以直接操作特定内存数据。其方法都是native修饰的。
+ Unsafe中的valueOffset,表示该变量在内存中的偏移地址，Unsafe就是根据内存偏移地址获取数据的。
+ 变量value用volatile修饰， 保证了多线程内存可见性。
+ unsafe.getAndAddInt 方法：
````java
//拿AtomicInteger来理解Unsafe类
/**
*假设线程A、B同时执行getAndAddInt方法（跑在不同CPU上）
*1.AtomicInteger里value原始为3，根据JMM模型，线程A、B同时保存一个值为3的副本在各自内存
*2.线程A通过getIntVolatile拿到3的值，这时线程被挂起
*3.线程B则完整执行完getAndAddInt方法，把值改为4
*4.现存A恢复，在执行compareAndSwapInt方法比较，发现手里的3和主内存中的4不一致，本次修改失败，只能再次执行一编
*5.线程A重新获取value值（valatile修饰），线程A看到value为4，则继续执行compareAndSwapInt方法比较，直至成功。
*/
public final int getAndAddInt(Object var1, long var2, int var4) {
        int var5;
        do {
            var5 = this.getIntVolatile(var1, var2);
        } while(!this.compareAndSwapInt(var1, var2, var5, var5 + var4));

        return var5;
    }
/**
*getIntVolatile底层方法，var1原子类AtomicInteger本身，var2是该对象内存中的引用地址
* 方法返回的是当前这个对象在内存中的真实值
**/
public native int getIntVolatile(Object var1, long var2);
/**
*compareAndSwapInt中var1原子类AtomicInteger本身，var2是该对象内存中的引用地址
* var4是需要变动的数量，var5是通过var1 var2找出内存中的真实值
**/
public final native boolean compareAndSwapInt(Object var1, long var2, int var4, int var5);   
````

+ AtomicInteger类中getAndIncrement如何原子性自增
````java
public final int getAndIncrement() {
        return unsafe.getAndAddInt(this, valueOffset, 1);
    }
````


### CAS的缺点
+ 循环时间长，开销大（
  - getAndAddInt 的do while有可能执行多次，加大CPU开销

+ 只能保证一个共享变量的原子操作
  - 对多个共享变量的操作，循环CAS无法保证原子性，需要加锁解决

+ 引出来ABA问题？
