## 垃圾回收器

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
+ G1收集器是一款面向服务端应用的收集器，它像CMS一样，能与应用程序线程并发执行。
+ G1目标是取代CMS，相比CMS，以下表现更出色
  - G1有整理内存的过程，不会产生内存碎片。
  - G1的Stop The World(stw)更可控，G1在停顿时间上增加了预测机制，用户可以指定期望停顿时间`-XX:MaxGCPauseMillis=n`。
+ 主要改变时Eden Survivor Tenured等区域不是连续的了（以前这三个区域是一块连续的内存），而是变成了一个个大小一样的region,每个region从1m~32m不等。一个region有可能属于Eden，Survivor或者Tenured内存区域`-Xmx32g`。

#### G1特点
+ G1重复利用多CPU、多核硬件优势，尽量缩短STW。
  - 解释：多CPU可以同时处理多个region
+ G1整体采用标记-整理算法，局部复制算法，不会有内存碎片
+ G1讲把Eden、Survivor、Tenured混合再一起了，微观上还是保留了新生代老年代，它们变成了一些region的集合且不需要region是连续的，也就是说还是会采用不同的GC方式来处理不同的region
+ G1虽然区分新生代老年代，但不是物理上的区别。G1只是逻辑上的分代概念，或者说每个region都可能随G1的运行在不同代之间切换。  

#### G1底层原理
+ region区域化垃圾收集器

  - 最大好处化整为零，避免全内存扫描，只需要按区域region进行扫描
  - G1不要求堆内存存储在物理上连续，只需要逻辑连续即可。启动时可以通过参数`-XX:G1HeapRegionSize=n`来指定分区大小(1~32m，且必须是2的幂)，默认将整个堆分为2048个region(所以最大支持内存为 32m*2048 =64G) 
  - G1仍然属于分代收集器，一些region属于新生代，新生代垃圾收集器仍然会采用暂停所有用户线程的方式，把活着对象转到Surivor的region空间或者Tenured的region空间
  - 一部分Tenured的region，G1收集器通过将对象从一个region复制到另一个region,完成清理工作，意味着这个过程中，G1完成了堆的整理（至少是部分的堆整理），解决了内存碎片问题。
  - 在G1中还存在一个特殊的region区域，叫Humongous(巨大的)区域。如果一个对象占用空间超过的region分区容量50%以上，G1会认为其是大对象**默认分配到Tenured区域。**但它又是一个短期存在的对象，为了避免对垃圾回收器产生负面影响，G1专门划了Humongous区域，存放大对象，如果大对象占用空间超过了一个region,G1会寻找多个连续的region来存放，为了能找到连续的分区，有时候不得不启动Full GC

+ 回收步骤

  - 针对Eden区域回收，Eden区被耗尽会触发回收，主要是小区域收集+形成连续的内存块，避免内存碎片
    + Eden区数据移动到Surivor区，加入Surivor区内存不够，Eden区部分数据会晋升到Tenured区
    + Surivor区数据移动到新的Surivor区，部分会晋升到Tenured区
    + 最后Eden区收拾干净了，GC结束用户应用程序线程继续

+ 4步过程
  - 初始标记：只标记GC Roots可达的对象
  - 并发标记: 进行GC Roots Tracing过程
  - 最终标记：修正并发标记过程中变动的对象
  - 筛选回收：根据时间来进行最大化回收 