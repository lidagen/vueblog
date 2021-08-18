## JVM相关问题
### JVM垃圾回收时如何确定是垃圾？什么是GC Roots
+ 引用计数法，判断是否被引用(解决不了循环引用问题)
+ 可达性分析(根搜索路径GC Roots)
  - **基本思路就是通过一系列名为GC Roots的对象为起始点。**往下搜索，如果一个对象和GC Roots没有任何引用链相连时，说明对象不可用。
+ 哪些可以成为GC Roots
  - `虚拟机栈java stack`中引用的对象
  - `方法区Method Area` 中的类静态属性引用的对象
  - `方法区Method Area` 常量引用的对象  
  - `本地方法栈中（native方法）`引用的对象

````java
public class GcRootsDemo {
    private static GcRootsDemo2 t2;//2.方法区类静态属性引用对象
    private static GcRootsDemo3 t3 = new GcRootsDemo3();//3.方法区常量引用的对象

    private byte[] byteArrays = new byte[100 * 1024 * 1024];//4.native对象

    public static void m1() {
        GcRootsDemo t1 = new GcRootsDemo();//1.java stack中引用的对象
        System.gc();
        System.out.println("第一次GC完成");
    }

    public static void main(String[] args) {
        m1();
    }
}
````  

### 如何查看JVM参数默认值（JVM的参数类型）
+ 标配参数
  - -version
  - -help
  - -showversion

+ x参数(了解)
  - -Xint 解释执行
  - -Xcomp 第一次使用就编译成本地代码
  - -Xmixed 混合模式

+ xx参数 `jps -l 找进程号， jinfo查看配置`
  - 布尔类型 （公式：-XX:+某属性 -XX:-某属性 +开启 -关闭）
    + 比如`jps -l`找到一个类进程号，然后 `jinfo -flag PrintGCDetails 进程号`，查看是否开启了开始GC收集PrintGCDetails（可以通过 -XX:+PrintGCDetails 设置）。
    + `jinfo -flag UseSerialGC 进程号`查看是否使用串行GC

  - KV设值类型
    + 假设我们看`元空间MetaSpace`大小，也可以先用布尔参数查询，`jinfo -flag MetaspaceSize 进程号`获取查看。此时我们设置自己想要的大小`-XX:MetaspaceSize=128m`,再次进行查看
    + 同样可以查看设置新生代到老年代的年龄`MaxTenuringThreshold`

  - `jinfo -flags 进程号 ` 可以查询所有的可调整的区域的参数名

````sh
Non-default VM flags: -XX:CICompilerCount=4 -XX:InitialHeapSize=266338304 -XX:MaxHeapSize=4242538496 -XX:MaxNewSize=1414004736 -XX:MinHeapDeltaBytes=524
288 -XX:NewSize=88604672 -XX:OldSize=177733632 -XX:+PrintGCDetails -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseFastUnorderedTimeStamp
s -XX:-UseLargePagesIndividualAllocation -XX:+UseParallelGC //默认的
Command line:  -XX:+PrintGCDetails //人工配置的
````  

+ -Xms -Xmx
   - -Xms 等价于 InitialHeapSize
   - -Xmx 等价于 MaxHeapSize

+ `java -XX:+PrintFlagsInitial `查看JVM初始化参数值
+ `java -XX:+PrintFlagsFinal -version` 打印最终值，如果某个默认值被新值覆盖，显示新值（其中有 `:=` 标记的，说明是被用户或者JVM修改过的参数）
+ `java -XX:+PrintCommandLineFlags -version` 常用的参数配置以及GC的默认垃圾回收器
````sh
-XX:InitialHeapSize=265147264 -XX:MaxHeapSize=4242356224 -XX:+PrintCommandLineFlags -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:-UseLarge
PagesIndividualAllocation -XX:+UseParallelGC //默认垃圾回收器
````
### 常用的JVM参数配置有哪些
+ `-Xms -Xmx`
  - Xms 默认是物理内存的1/64
  - Xmx 默认是物理内存的1/4
+ `-Xss` 等价 -XX:ThreadStackSize,一般默认 512k~1024k
+ `-Xmn` 设置年轻代大小（一般不需要调整） 新生代老年代比例1/3,2/3  
+ `-XX:MetaspaceSize` 元空间，jdk8以后，这个空间不占用heap的内存，大小取决与机器内存
  - 虽然是占用物理内存，但是会有默认值，为了避免元空间OOM，可以把这个参数设置大一点（允许的话 512MB ~ 1G范围）
+ `-XX:+PrintGCDetails` 收集GC详细日志输出信息


### 强引用、软引用、弱引用、虚引用

<img :src="$withBase('/jvm/reference.png')" alt="dock">

+ `强引用Reference` 默认支持模式

  - 当内存不足，JVM开始GC，对于强引用对象，就算是**出现了OOM也不会对对象进行回收。**
  - 强引用就是我们常见的普通对象引用（Person p = new Person();），只要有强引用指向一个对象，说明对象还活着。一个对象被强引用变量引用时，它处于可达状态，*即使该对象以后永远不会用到，也不会被GC回收。*因此强引用时造成内存泄漏的主要原因之一。
  - 一个普通对象，如果它没有其它引用关系，只要超过了引用作用域或者显式的将引用赋值为null。一般认为它是可以被GC的。
````java
public class StrongReference {
    public static void main(String[] args) {
        Object obj1 =new Object();//定义的默认强引用
        Object obj2 = obj1;//obj2引用赋值，也指向obj1指向的内存地址
        obj1 = null; //obj1指向为null
        System.gc();
        System.out.println(obj2);//不会被垃圾回收
    }
}
````
+ `软引用SoftReference`

  - 软引用是相对强引用弱化了点的引用，需要用java.lang.ref.SoftRerence类实现，可以让内存豁免一些垃圾收集。
  - 对于只有软引用的对象来说
    + 当内存充足时，不会被GC
    + 当内存不足时，会被GC
  - 软引用通常用在内存敏感的数据中，比如高速缓存就用软引用。
````java
public class SoftReferenceDemo {
    /**
     * 内存够用时
     */
    public static void memory_enough() {
        Object obj1 = new Object();
        SoftReference softReference = new SoftReference(obj1);//软引用
        System.out.println(softReference.get());
        obj1 = null; //失效强引用
        System.gc();

        System.out.println(softReference.get() + "==");//内存够用，不GC
    }

    /**
     * 内存不够用时
     * JVM配置小内存,模拟OOM -Xms5m -Xmx5m -XX:+PrintGCDetails
     */
    public static void memory_not_enough() {
        Object obj1 = new Object();
        SoftReference softReference = new SoftReference(obj1);//软引用
        System.out.println(softReference.get());
        obj1 = null; //让引用失效
        try {
            byte[] b = new byte[30 * 1024 * 1024];
        } catch (Throwable e) {
            e.printStackTrace();
        } finally {
            System.out.println("soft->"+softReference.get()); //不够用被回收null
        }
    }

    public static void main(String[] args) {
        memory_enough();
        memory_not_enough();
    }
}
````    
+ `弱引用WeakReference`
  
  - 弱引用需要用java.lang.ref.WeakReference实现，它比软引用生存期短。
  - 对于只有弱引用的对象来说，只要垃圾回收机制运行，不管JVM内存空间是否足够，都会被回收
````java
public class WeakReferenceDemo {
    public static void main(String[] args) {
        Object o1 = new Object();
        WeakReference<Object> weakReference =new WeakReference<>(o1);
        System.out.println(weakReference.get() + "--GC前");

        o1 = null ;//去掉强引用
        System.gc();
        System.out.println(weakReference.get() + "--GC后");//被回收了
    }
}
````  
+ `虚引用PhantomReference`

  - 弱引用需要用java.lang.ref.PhantomReference类来实现。
  - 顾名思义，就是形同虚设，与其它几种不同，虚引用并不会决定对象生命周期
  - **如果一个对象仅持有虚引用，那么它就和没有任何引用一样，在任何时候都可以被GC回收。**它不能单独使用，需要和`引用队列ReferenceQueue`联合使用。
  - PhantomReference.get()方法总是返回null，因此无法访问被引用对象。其意义在于说明一个对象已经进入了finalzation阶段，可以被gc回收，用来实现比finalzation机制更灵活的回收操作
  - 换句话说，设置`虚引用PhantomReference`关联的唯一目的，就是在这个对象被回收器回收时，收到一个系统通知或者后续添加进一步处理。java技术允许使用`finalize()`方法在垃圾回收器将对象从内存中清除出去前做必要的清理工作（相当于AOP中的后置通知）。

+ `引用队列ReferenceQueue`
````java
/**
* 引用可以单独使用，也可以配合ReferenceQueue使用
* 如果使用了ReferenceQueue，当GC是否对象内存时，会将其加入到ReferenceQueue中
* 程序发现某个软引用、弱引用、虚引用已经被加入到队列中，意味着其指向的堆heap内存对象被回收，通过这种方式，JVM允许我们在对象被回收后做一些我们想做的事
*/
public class ReferenceQueueDemo {
    public static void main(String[] args) {
        Object o1 =new Object();
        ReferenceQueue<Object> queue =new ReferenceQueue<>();
        PhantomReference<Object> weakReference =new PhantomReference<>(o1,queue);

        System.out.println(o1);//有值
        System.out.println(weakReference.get());//get为空，如果换成软引用就有值
        System.out.println(queue.poll());//null

        System.out.println("----------------------------");
        o1 =null;
        System.gc();
        System.out.println(o1);//null
        System.out.println(weakReference.get());//null
        System.out.println(queue.poll());//有值,gc后把值放入队列
    }
}
````

+ 软引用SoftReference 弱引用WeakReference使用场景

  - 假如我们有一个应用需要读取大量图片
    + 如果每次加载会严重影响性能
    + 如果一次性加载到内存又可能内存溢出
  - 此时软引用可以解决这个问题，设计思路用一个HashMap保存图片路径和相应图片对象关联的软引用之间映射关系，内存不足时，JVM会回收占用的空间
````java 
Map<String,SoftReference<Bitmap>> imageCache = new HashMap<String,SoftReference<Bitmap>>();
````
+ WeakHashMap 是“弱键”实现的哈希表。它这个“弱键”的目的就是：实现对“键值对”的动态回收。当“弱键”不再被使用到时，GC会回收它，WeakReference也会将“弱键”对应的键值对删除。

````java
public class WeakHashMapDemo {
    public static void main(String[] args) {
        WeakHashMap<Integer, String> weakHashMap = new WeakHashMap();
        Integer k = new Integer(1);
        String v = "val1";
        weakHashMap.put(k, v);
        System.out.println(weakHashMap);

        k = null;//k失效以后
        System.gc();
        System.out.println(weakHashMap);//map内容被移除
    }
}
````

### OOM的认识
+ StackOverflowError

  - 栈内存空间溢出（简单就是递归调用）
+ OutOfMemoryError:Java heap space
  
  - 堆空间内存溢出，调整-Xms -Xmx
+ OutOfMemoryError:GC overhead limit exceeded

  - 超过gc最高警戒，大部分资源都用来做gc回收了（超过98%资源都用来gc,但是回收不到2%heap内存），但是还是内存溢出
  - 简单理解就是大量的new对象，导致回收不过来`（List<Integer> 循环添加 Integer对象）`
+ OutOfMemoryError:Direct buffer memory
  
  - 写NIO程序经常使用ByteBuffer来读取写入数据，它可以使用native函数库直接使用堆heap外内存（本地内存），然后通过一个存储在java堆heap里面的DirectByteBuffer对象作为内存的引用进行操作`ByteBuffer.allocteDirect()`。如果只使用本地内存而堆内存使用很少，那JVM则不执行GC，ByteBuffer对象不会被回收，此时本地内存满了，再次尝试分配本地内存就会抛此异常。
+ OutOfMemoryError:ubable to create new native thread

  - 应用创建了太多线程，超出系统承载能力;或者你的服务器不允许创建这么多线程（linux默认单个进程可创建的线程数是1024个）；
  - 解决办法就是：降低应用创建的线程数，分析是否需要这么多线程，将线程数降低；对于确实需要创建很多线程的且超过linux默认个数的，可以修改linux配置，扩大linux限制
+ OutOfMemoryError:Metaspace

  - 使用`java -XX:+PrintFlagsInitial`命令看MetaspaceSize初始化值
  - 元空间内存不足，可以尝试调整 `-XX:MetaspaceSize=1024m`
  

### **GC垃圾回收算法和垃圾回收器的关系？
+ 垃圾回收算法（计数、复制、标清、标整）是内存回收方法论，垃圾回收器是堆方法论的落地实现
+ 目前还没有完美的垃圾回收器，只是对于不同场合，进行分代收集
+ 四种主要的垃圾回收器
  - `Serial 串行`：它为单线程环境设计并且只使用一个线程进行垃圾回收，会暂停所有用户线程。不合适服务器环境。
  - `Parallel 并行`：多个垃圾收集器并行工作，此时用户线程也是暂停的，适应科学计算、大数据处理等弱交互场景。
  - `CMS 并发`：用户线程和垃圾回收线程同时执行（不一定并行，也可能交替执行），不需要停顿用户线程，适应对响应时间有要求的场景。
  - `G1` 

### **怎么查看生产上垃圾回收器是哪个？生产上如何配置垃圾回收器的
+ `java -XX:+PrintCommandLineFlags -version`查看默认垃圾回收器
  - 默认Parallel
+ 配置垃圾回收器有哪些 

----------------------------------------------------------------
#### 垃圾回收器图
+ `Serial` `Parallel` `ParNew`是运行在新生代的垃圾回收器
+ `Serial MSC` `Parallel Old` `CMS`是运行在老年代的垃圾回收器
+ 确定了新生代的垃圾回收器，系统会自动选择匹配的老年代垃圾回收器
+ G1回收器是跨越新生代、老年代的垃圾回收器
+ X号的表示被废弃的组合
<img :src="$withBase('/jvm/gcq1.png')" alt="dock">

  - UseSerialGC
  - UseParallelGC
  - UseConcMarkSweepGC  (CMS 是缩写)
  - UseParNewGC (只在新生代使用并行垃圾回收器)
  - UseParallelOldGC (只在老年代使用并行垃圾回收器)
  - UseG1GC

+ 如何选择垃圾回收器  

  - 预先参数说明（PrintGCDetails 看的参数对应）
    + DefNew -> Default New Generation
    + Tenured -> old
    + ParNew -> Parallel New Generation 
    + PSYoungGen -> Parallel Scavenge 
    + ParOldGen -> Parallel Old Generation
  - Server/Client模式 （只需掌握Server模式，Client模式基本不用）
    + 32位win系统，默认Client模式
    + 32位其它系统，2G内存同时2个CPU以上Server模式，低于该配置Client模式
    + 64位都是Server模式  
#### 新生代收集器    
##### 1.Serial串行收集器
+ Serial串行收集器 是最稳定最高效的收集器，缺点是会暂停用户线程，对于单核CPU，没有线程交互使用此收集器可以获取最高的垃圾回收效率。
    + 因此Serial垃圾回收器是java虚拟机运行在Client模式下的新生代垃圾回收器
    + 开启 `-XX:+UseSerialGC`,开启后默认使用 **Serial + Serial old**收集器组合
      - 表示新生代老年代都使用串行垃圾回收器，新生代复制算法，老年代标记-整理算法

##### 2.ParNew 并行收集器
+ ParNew并行收集器 其实就是Serial的并行多线程版本，最常见的应用场景是配合老年代的GMS GC工作。它是很多java虚拟机运行在Server模式下的默认垃圾回收器
  + 开启`-XX:+UseParNewGC`,开启后会使用**ParNew + Serial old**收集器组合
    - 表示新生代老年代都使用串行垃圾回收器，**新生代并行复制算法，老年代标记-整理算法**
::: tip
+ 但是ParNew + Tenured（ParNew + Serial old）这样搭配已经不推荐
+ 这个组合新生代回收时并行，老年代回收时串行
:::  
##### 3.ParallelScavenge收集器  
+ ParallelScavenge收集器 是一个类似ParNew,也是一个新生代垃圾收集器，新生代老年代都是串行化。
  - 开启`-XX:+UseParallelGC`或`-XX:+UseParallelOldGC`可相互激活（二选一都可），不配置系统默认就是这个
+ 它关注重点是：
  - 可控的吞吐量(Thoughput=运行用户代码时间/(运行用户代码时间+垃圾回收时间)，即比如运行运行100分钟，垃圾回收1分钟。吞吐量就是99%)。高吞吐量意味着高效利用CPU时间，它多用于在后台运算而不需要太多交互的任务。（比如job？）
  - 自适应调节策略也是ParallelScavenge收集器与ParNew收集器的一个重要区别。（自适应调节策略：虚拟机会根据当前系统运行情况收集性能监控信息，动态调整这些参数提供最适合的停顿时间（-XX:MaxGCPauseMillis）或最大吞吐量）
  ::: tip
  + -XX:ParallelGCThreads=数字N，可配置GC线程个数
    - CPU > 8 N= 5/8
    - CPU < 8 N = 实际数
  :::

  #### 老年代收集器

  ##### 4.ParallelOld收集器
  + ParallelOld收集器是ParallelScavenge收集器的老年代版本，使用**多线程标记-整理算法**
  + jdk8以后可以考虑Parallel Scavenge + Parallel Old搭配（ParallelOld是jdk6以后提供，jdk6之前默认 ParallelScavenge + Serial Old搭配）
    - 开启`-XX:+UseParallelOldGC`

  ##### 5.CMS（ConcMarkSweep）并发标记清除收集器
  + CMS收集器是一种 **获取最短回收停顿时间为目标的收集器。** 适应互联网或者B/S系统服务器，这类应用重视服务响应速度，希望系统停顿时间最短。
  + CMS非常适合堆内存大，CPU核数多的服务端应用，也是G1出现前的首选收集器。
  + 用户线程和GC线程并发
    - 开启`-XX:+UseConcMarkSweepGC`，开启后新生代默认使用ParNew。
    - 开启后，收集器组合是 `ParNew(新生代) + CMS（老年代）+Serial old（老年代）` 的组合，Serial Old是作为CMS出错后的后备收集器。
  + CMS运行的4步过程
    - 初始标记 ：只是标记一下GC Roots能直接关联的对象，速度很快，仍然需要暂停所有工作线程
    - 并发标记 ：进行GC Roots跟踪过程，和用户线程一起工作，不需要暂停工作线程。主要标记过程，标记全部对象
    - 重新标记 : 为了修正并发标记过程中，因用户程序运行产生的一小部分对象变动。仍然需要暂停所有工作线程 
    - 并发清除 ：清除了GC Roots不可达对象，和用户线程一起工作，不需要暂停工作线程。 
  ::: tip
  + 由于耗时最长的 **并发标记 + 并发清除**都是和用户线程一起工作，所以总体可以看作CMS垃圾回收和用户线程是并发执行。
  + 优点：并发收集低停顿
  + 缺点：1.并发堆CPU压力比较大（由于CMS必须要在老年代堆内存用尽之前完成垃圾回收，否则CMS回收失败时，会触发Serial Old进行GC，从而造成较大停顿）2.采用标记清除算法会产生大量空间碎片
  + 由于标记清除无法处理空间碎片，老年代空间迟早会被耗尽，最后不得不通过担保机制Serial Old来对内存压缩。CMS也提供了参数-XX:CMSFullGCsBeForeCompaction(默认0，即每次都进行内存整理)来指定多少次CMS收集以后，进行一次压缩的Full GC

  :::  
  ##### 6.SerialOld收集器
  + Serial Old垃圾收集器是Serial的老年代版本，同样是单线程收集器，使用的是**标记-整理算法**，也是client默认的老年代收集器
    - 作为CMS收集器的后备老年代收集器（实际JDK8+已经淘汰掉了，不主动配置此收集器）
#### 组合选择
+ 单CPU小内存
  - `-XX:+UseSerialGC`
+ 多CPU，需要大吞吐量，接受小停顿
  - `-XX:+UseParllelGC` 或 `-XX:+UseParllelOldGC`
+ 多CPU，追求低停顿，快速响应
  - `-XX:+UseConcMarkSweepGC` `-XX:+ParNewGC` 

参数 | 新生代收集器 |  新生代算法 | 老年代收集器 | 老年代算法  
- | :-: | :-: | :-: | -:
`-XX:+UseSerialGC` | Serial | 复制 | Serial Old | 标整
`-XX:+UseParNewGC` | ParNew | 复制 | Serial Old | 标整
`-XX:+UseParallelGC`  `-XX:+UseParallelOldGC` | Parallel[Scavenge] | 复制 | Parallel Old | 标整
`-XX:+UseConcMarkSweepGC` |ParNew | 复制 | CMS + Serial Old | 标清
`-XX:+UseG1GC` |G1整体使用标记-整理算法 | 局部使用复制算法，不会产生内存碎片 |  | 

### **G1垃圾回收器  
+ 
### 生产环境服务器变慢的诊断思路、以及如何性能评估
### 生产环境CPU占用过高的可能原因
### JDK自带的JMM监控和性能分析工具用法

