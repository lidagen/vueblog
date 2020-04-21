## 内存和垃圾回收

### jvm整体架构
+ jvm整体架构分为三部分
  + 类装载子系统
  + 运行时数据区
  + 执行引擎

### 类加载子系统

### 运行时数据区
+ 虚拟机运行时数据区分为 **堆、方法区、栈、本地方法栈、程序计数器**
+ **堆、方法区**是线程间共享的，**栈、本地方法栈、程序计数器**是线程私有的

#### 程序计数器
+ 作用：记住下一条jvm指令执行地址
+  特点：
   -  是线程私有的
   -  是不会内存溢出的

#### 虚拟机栈
+ 每个线程运行时所需要的内存，称为虚拟机栈
+ 每个栈由多个栈帧组成，对应着每次方法调用所占用的内存
+ 每个线程只能有一个活动的栈帧，对应着当前正在执行的方法

##### 1.1StackOverflowError
+ 栈内存溢出：
  - 栈内存默认1mb，-Xss指定栈内存大小
  - 栈内存溢出可能情况：
    + 递归调用
    + json转换对象相互引用
##### 1.2线程诊断
+ 案例1 cpu占用过多
````java
public class CpuHigh {
    public static void main(String[] args) {
        new Thread(null, () -> {
            System.out.println("1.....");
            while (true) {
            }
        }, "thread1").start();

        new Thread(null, () -> {
            System.out.println("2......");
            try {
                Thread.sleep(1000000L);
            } catch (InterruptedException e) {

            }
        },"thread2").start();

        new Thread(null, () -> {
            System.out.println("2......");
            try {
                Thread.sleep(1000000L);
            } catch (InterruptedException e) {

            }
        },"thread3").start();

    }
}
````

````sh
#linux服务器中
#top命令查看哪个进程cpu占比过高
top 
# 根据top获取的进程号pid查看对应哪个线程占用过高
ps H -eo pid,tid,%cpu |grep 进程ID
# 用jdk自带工具来查看线程内所有线程
jstack 进程ID
#根据刚才ps 命令获取的十进制线程ID经过十六进制换算，得到结果在jstack显示中的线程中查找占用过高的线程
````
+ 案例2 程序运行很长时间没有结果
  - 死锁会导致程序获取不到结果
  - jstack PID查看，会有Found 1 deadlock.标识

#### 本地方法栈
+ jdk方法中native修饰的方法，由其它语言编写的方法称为本地方法
+ 这些本地方法调用时需要的内存空间，就是本地方法栈

#### 堆
+ 通过new关键字，创建的对象都会使用堆内存
+ 特点
  - 它是线程共享的，堆中的对象都要考虑线程安全问题
  - 有垃圾回收机制

##### 2.1OutOfMemoryError
+ 代码产生的对象，而对象一直被使用无法被回收，内存占用越来越大。或者堆内存设置过小，导致堆内存溢出。

##### 2.2内存诊断
+  jmap工具 `查看堆内存占用情况`
````sh
#jps找到程序的进程ID
jps
#jmap命令查看堆中内存使用情况
jmap -heap 进程ID
````
+ jconsole工具 `图像界面，多功能监测工具，可以连续监测`
+ jvisualvm `图像画面，可以看GC情况、堆内存使用情况`

#### 方法区
+ 所有jvm线程共享区域
+ 存储了跟类结构相关的信息(成员变量、方法数据、成员方法以及构造器、运行时常量池） 
+ jvm启动时，方法区被创建。逻辑上是堆Heap的组成部分
+ 1.8以后的hotSpot,用的是操作系统的内存,也叫元空间

##### 3.1OutOfMemoryError
````sh
# 1.8以前 永久代内存溢出
OutOfMemoryError:  PermGen space
# 1.8以后 元空间内存溢出
OutOfMemoryError: Metaspace
````
+ 场景：spring、mybatis用cglib做aop动态产生了太多Class加载导致

##### 3.2常量池
+ **常量池**，就是一张表，虚拟机根据常量表找到要执行的类名、方法名、参数类型、字面值等信息
+ **运行时常量池**，常量池时*.class文件中的，当该类被加载，它的常量池信息就放入运行时常量池，并把里面的符号地址变为真实地址。

### 执行引擎

### StringTable

### 垃圾回收
#### 垃圾回收概述
#### 垃圾回收相关算法
#### 垃圾回收相关概述
#### 垃圾回收器
