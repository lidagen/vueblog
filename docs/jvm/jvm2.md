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

### GC收集日志信息
//todo