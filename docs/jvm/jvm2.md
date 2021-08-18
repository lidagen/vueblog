## 堆参数调整 -- 以1.8 + HotSpot为例
### JDK 7
<img :src="$withBase('/jvm/cs1.png')" alt="dock">
--------------------------------------------------------

### JDK 8
<img :src="$withBase('/jvm/cs.png')" alt="dock">

+ jdk8以后永久代被移除，被一个称作元空间的代替。区别在于永久代使用JVM的堆内存，**元空间使用本机的物理内存。**
  - 因此默认情况下，元空间大小仅受本地内存限制，类的元数据放入本地内存，字符串池和类的常量放入java的`堆heap`中,这样可以加载多少类的元数据不再由MaxPermSize控制。

### 堆内存调优参数 
参数 | 说明 |  
- | :-: | :-: | :-: | -:
-Xms | 设置初始分配大小，默认为物理内存的1/64 | 
-Xmx | 设置分配最大内存，默认为物理内存的1/4 |
-XX:+PrintGCDetails | 输出详细的GC处理日志

::: tip
-Xss 是调栈空间
:::

+ 查看参数方法
````java
 public static void main(String[] args) {
    //java虚拟机试图使用最大内存量
    long max = Runtime.getRuntime().maxMemory();
    //java虚拟机中的内存总量
    long total = Runtime.getRuntime().totalMemory();
    //这个是-Xmx参数设置的内存大小
    System.out.println("-Xmx -- MAX_MEMORY= "+(max/(double)1024/1024) + "MB");
    //这个是-Xms参数设置的内存
    System.out.println("-Xm -- TOTAL_MEMORY= "+(total/(double)1024/1024) + "MB");
}
````
### 调整参数
::: tip
-Xmx -Xmx 把两者设置为一致,是为了避免频繁扩容和GC释放堆内存造成的系统开销/压力
::: 

### GC收集日志信息 -XX:+PrintGCDetails
````sh
[GC (Allocation Failure) [PSYoungGen: 1708K->504K(2560K)] 1708K->688K(9728K), 0.0033197 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
[GC (Allocation Failure) [PSYoungGen: 504K->496K(2560K)] 688K->768K(9728K), 0.0004713 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
[Full GC (Allocation Failure) [PSYoungGen: 496K->0K(2560K)] [ParOldGen: 272K->619K(7168K)] 768K->619K(9728K), [Metaspace: 3290K->3290K(1056768K)], 0.0040743 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
[GC (Allocation Failure) [PSYoungGen: 0K->0K(2560K)] 619K->619K(9728K), 0.0001987 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
[Full GC (Allocation Failure) [PSYoungGen: 0K->0K(2560K)] [ParOldGen: 619K->601K(7168K)] 619K->601K(9728K), [Metaspace: 3290K->3290K(1056768K)], 0.0039539 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
Heap
 PSYoungGen      total 2560K, used 56K [0x00000000ffd00000, 0x0000000100000000, 0x0000000100000000)
  eden space 2048K, 2% used [0x00000000ffd00000,0x00000000ffd0e348,0x00000000fff00000)
  from space 512K, 0% used [0x00000000fff00000,0x00000000fff00000,0x00000000fff80000)
  to   space 512K, 0% used [0x00000000fff80000,0x00000000fff80000,0x0000000100000000)
 ParOldGen       total 7168K, used 601K [0x00000000ff600000, 0x00000000ffd00000, 0x00000000ffd00000)
  object space 7168K, 8% used [0x00000000ff600000,0x00000000ff696620,0x00000000ffd00000)
 Metaspace       used 3322K, capacity 4496K, committed 4864K, reserved 1056768K
  class space    used 362K, capacity 388K, committed 512K, reserved 1048576K
````

<img :src="$withBase('/jvm/gcDetails.png')" alt="dock">
