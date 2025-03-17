<template><div><h2 id="垃圾回收器" tabindex="-1"><a class="header-anchor" href="#垃圾回收器"><span>垃圾回收器</span></a></h2>
<h3 id="gc垃圾回收算法和垃圾回收器的关系" tabindex="-1"><a class="header-anchor" href="#gc垃圾回收算法和垃圾回收器的关系"><span>**GC垃圾回收算法和垃圾回收器的关系？</span></a></h3>
<ul>
<li>垃圾回收算法（计数、复制、标清、标整）是内存回收方法论，垃圾回收器是堆方法论的落地实现</li>
<li>目前还没有完美的垃圾回收器，只是对于不同场合，进行分代收集</li>
<li>四种主要类型的垃圾回收器
<ul>
<li><code v-pre>Serial 串行</code>：它为单线程环境设计并且只使用一个线程进行垃圾回收，会暂停所有用户线程。不合适服务器环境。</li>
<li><code v-pre>Parallel 并行</code>：多个垃圾收集器并行工作，此时用户线程也是暂停的，适应科学计算、大数据处理等弱交互场景。</li>
<li><code v-pre>CMS 并发</code>：用户线程和垃圾回收线程同时执行（不一定并行，也可能交替执行），不需要停顿用户线程，适应对响应时间有要求的场景。</li>
<li><code v-pre>G1</code></li>
</ul>
</li>
</ul>
<h3 id="怎么查看生产上垃圾回收器是哪个-生产上如何配置垃圾回收器的" tabindex="-1"><a class="header-anchor" href="#怎么查看生产上垃圾回收器是哪个-生产上如何配置垃圾回收器的"><span>**怎么查看生产上垃圾回收器是哪个？生产上如何配置垃圾回收器的</span></a></h3>
<ul>
<li><code v-pre>java -XX:+PrintCommandLineFlags -version</code>查看默认垃圾回收器
<ul>
<li>默认Parallel</li>
</ul>
</li>
<li>配置垃圾回收器有哪些</li>
</ul>
<hr>
<h4 id="垃圾回收器图" tabindex="-1"><a class="header-anchor" href="#垃圾回收器图"><span>垃圾回收器图</span></a></h4>
<ul>
<li>
<p><code v-pre>Serial</code> <code v-pre>Parallel</code> <code v-pre>ParNew</code>是运行在新生代的垃圾回收器</p>
</li>
<li>
<p><code v-pre>Serial MSC</code> <code v-pre>Parallel Old</code> <code v-pre>CMS</code>是运行在老年代的垃圾回收器</p>
</li>
<li>
<p>确定了新生代的垃圾回收器，系统会自动选择匹配的老年代垃圾回收器</p>
</li>
<li>
<p>G1回收器是跨越新生代、老年代的垃圾回收器</p>
</li>
<li>
<p>X号的表示被废弃的组合
<img :src="$withBase('/jvm/gcq1.png')" alt="dock"></p>
<ul>
<li>UseSerialGC</li>
<li>UseParallelGC</li>
<li>UseConcMarkSweepGC  (CMS 是缩写)</li>
<li>UseParNewGC (只在新生代使用并行垃圾回收器)</li>
<li>UseParallelOldGC (只在老年代使用并行垃圾回收器)</li>
<li>UseG1GC</li>
</ul>
</li>
<li>
<p>如何选择垃圾回收器</p>
<ul>
<li>预先参数说明（PrintGCDetails 看的参数对应）
<ul>
<li>DefNew -&gt; Default New Generation</li>
<li>Tenured -&gt; old</li>
<li>ParNew -&gt; Parallel New Generation</li>
<li>PSYoungGen -&gt; Parallel Scavenge</li>
<li>ParOldGen -&gt; Parallel Old Generation</li>
</ul>
</li>
<li>Server/Client模式 （只需掌握Server模式，Client模式基本不用）
<ul>
<li>32位win系统，默认Client模式</li>
<li>32位其它系统，2G内存同时2个CPU以上Server模式，低于该配置Client模式</li>
<li>64位都是Server模式</li>
</ul>
</li>
</ul>
</li>
</ul>
<h4 id="新生代收集器" tabindex="-1"><a class="header-anchor" href="#新生代收集器"><span>新生代收集器</span></a></h4>
<h5 id="_1-serial串行收集器" tabindex="-1"><a class="header-anchor" href="#_1-serial串行收集器"><span>1.Serial串行收集器</span></a></h5>
<ul>
<li>Serial串行收集器 是最稳定最高效的收集器，缺点是会暂停用户线程，对于单核CPU，没有线程交互使用此收集器可以获取最高的垃圾回收效率。
<ul>
<li>因此Serial垃圾回收器是java虚拟机运行在Client模式下的新生代垃圾回收器</li>
<li>开启 <code v-pre>-XX:+UseSerialGC</code>,开启后默认使用 <strong>Serial + Serial old</strong>收集器组合
<ul>
<li>表示新生代老年代都使用串行垃圾回收器，新生代复制算法，老年代标记-整理算法</li>
</ul>
</li>
</ul>
</li>
</ul>
<h5 id="_2-parnew-并行收集器" tabindex="-1"><a class="header-anchor" href="#_2-parnew-并行收集器"><span>2.ParNew 并行收集器</span></a></h5>
<ul>
<li>ParNew并行收集器 其实就是Serial的并行多线程版本，最常见的应用场景是配合老年代的GMS GC工作。它是很多java虚拟机运行在Server模式下的默认垃圾回收器
<ul>
<li>开启<code v-pre>-XX:+UseParNewGC</code>,开启后会使用<strong>ParNew + Serial old</strong>收集器组合
<ul>
<li>表示新生代老年代都使用串行垃圾回收器，<strong>新生代并行复制算法，老年代标记-整理算法</strong></li>
</ul>
</li>
</ul>
</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<ul>
<li>但是ParNew + Tenured（ParNew + Serial old）这样搭配已经不推荐</li>
<li>这个组合新生代回收时并行，老年代回收时串行</li>
</ul>
</div>
<h5 id="_3-parallelscavenge收集器" tabindex="-1"><a class="header-anchor" href="#_3-parallelscavenge收集器"><span>3.ParallelScavenge收集器</span></a></h5>
<ul>
<li>
<p>ParallelScavenge收集器 是一个类似ParNew,也是一个新生代垃圾收集器，新生代老年代都是串行化。</p>
<ul>
<li>开启<code v-pre>-XX:+UseParallelGC</code>或<code v-pre>-XX:+UseParallelOldGC</code>可相互激活（二选一都可），不配置系统默认就是这个</li>
</ul>
</li>
<li>
<p>它关注重点是：</p>
<ul>
<li>可控的吞吐量(Thoughput=运行用户代码时间/(运行用户代码时间+垃圾回收时间)，即比如运行运行100分钟，垃圾回收1分钟。吞吐量就是99%)。高吞吐量意味着高效利用CPU时间，它多用于在后台运算而不需要太多交互的任务。（比如job？）</li>
<li>自适应调节策略也是ParallelScavenge收集器与ParNew收集器的一个重要区别。（自适应调节策略：虚拟机会根据当前系统运行情况收集性能监控信息，动态调整这些参数提供最适合的停顿时间（-XX:MaxGCPauseMillis）或最大吞吐量）</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<ul>
<li>-XX:ParallelGCThreads=数字N，可配置GC线程个数
<ul>
<li>CPU &gt; 8 N= 5/8</li>
<li>CPU &lt; 8 N = 实际数</li>
</ul>
</li>
</ul>
</div>
<h4 id="老年代收集器" tabindex="-1"><a class="header-anchor" href="#老年代收集器"><span>老年代收集器</span></a></h4>
<h5 id="_4-parallelold收集器" tabindex="-1"><a class="header-anchor" href="#_4-parallelold收集器"><span>4.ParallelOld收集器</span></a></h5>
<ul>
<li>ParallelOld收集器是ParallelScavenge收集器的老年代版本，使用<strong>多线程标记-整理算法</strong></li>
<li>jdk8以后可以考虑Parallel Scavenge + Parallel Old搭配（ParallelOld是jdk6以后提供，jdk6之前默认 ParallelScavenge + Serial Old搭配）
<ul>
<li>开启<code v-pre>-XX:+UseParallelOldGC</code></li>
</ul>
</li>
</ul>
<h5 id="_5-cms-concmarksweep-并发标记清除收集器" tabindex="-1"><a class="header-anchor" href="#_5-cms-concmarksweep-并发标记清除收集器"><span>5.CMS（ConcMarkSweep）并发标记清除收集器</span></a></h5>
<ul>
<li>CMS收集器是一种 <strong>获取最短回收停顿时间为目标的收集器。</strong> 适应互联网或者B/S系统服务器，这类应用重视服务响应速度，希望系统停顿时间最短。</li>
<li>CMS非常适合堆内存大，CPU核数多的服务端应用，也是G1出现前的首选收集器。</li>
<li>用户线程和GC线程并发
<ul>
<li>开启<code v-pre>-XX:+UseConcMarkSweepGC</code>，开启后新生代默认使用ParNew。</li>
<li>开启后，收集器组合是 <code v-pre>ParNew(新生代) + CMS（老年代）+Serial old（老年代）</code> 的组合，Serial Old是作为CMS出错后的后备收集器。</li>
</ul>
</li>
<li>CMS运行的4步过程
<ul>
<li>初始标记 ：只是标记一下GC Roots能直接关联的对象，速度很快，仍然需要暂停所有工作线程</li>
<li>并发标记 ：进行GC Roots跟踪过程，和用户线程一起工作，不需要暂停工作线程。主要标记过程，标记全部对象</li>
<li>重新标记 : 为了修正并发标记过程中，因用户程序运行产生的一小部分对象变动。仍然需要暂停所有工作线程</li>
<li>并发清除 ：清除了GC Roots不可达对象，和用户线程一起工作，不需要暂停工作线程。</li>
</ul>
</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<ul>
<li>由于耗时最长的 <strong>并发标记 + 并发清除</strong>都是和用户线程一起工作，所以总体可以看作CMS垃圾回收和用户线程是并发执行。</li>
<li>优点：并发收集低停顿</li>
<li>缺点：1.并发堆CPU压力比较大（由于CMS必须要在老年代堆内存用尽之前完成垃圾回收，否则CMS回收失败时，会触发Serial Old进行GC，从而造成较大停顿）2.采用标记清除算法会产生大量空间碎片</li>
<li>由于标记清除无法处理空间碎片，老年代空间迟早会被耗尽，最后不得不通过担保机制Serial Old来对内存压缩。CMS也提供了参数-XX:CMSFullGCsBeForeCompaction(默认0，即每次都进行内存整理)来指定多少次CMS收集以后，进行一次压缩的Full GC</li>
</ul>
</div>
<h5 id="_6-serialold收集器" tabindex="-1"><a class="header-anchor" href="#_6-serialold收集器"><span>6.SerialOld收集器</span></a></h5>
<ul>
<li>Serial Old垃圾收集器是Serial的老年代版本，同样是单线程收集器，使用的是<strong>标记-整理算法</strong>，也是client默认的老年代收集器
<ul>
<li>作为CMS收集器的后备老年代收集器（实际JDK8+已经淘汰掉了，不主动配置此收集器）</li>
</ul>
</li>
</ul>
</li>
</ul>
<h4 id="组合选择" tabindex="-1"><a class="header-anchor" href="#组合选择"><span>组合选择</span></a></h4>
<ul>
<li>单CPU小内存
<ul>
<li><code v-pre>-XX:+UseSerialGC</code></li>
</ul>
</li>
<li>多CPU，需要大吞吐量，接受小停顿
<ul>
<li><code v-pre>-XX:+UseParllelGC</code> 或 <code v-pre>-XX:+UseParllelOldGC</code></li>
</ul>
</li>
<li>多CPU，追求低停顿，快速响应
<ul>
<li><code v-pre>-XX:+UseConcMarkSweepGC</code> <code v-pre>-XX:+ParNewGC</code></li>
</ul>
</li>
</ul>
<p>参数 | 新生代收集器 |  新生代算法 | 老年代收集器 | 老年代算法</p>
<ul>
<li>| :-: | :-: | :-: | -:
<code v-pre>-XX:+UseSerialGC</code> | Serial | 复制 | Serial Old | 标整
<code v-pre>-XX:+UseParNewGC</code> | ParNew | 复制 | Serial Old | 标整
<code v-pre>-XX:+UseParallelGC</code>  <code v-pre>-XX:+UseParallelOldGC</code> | Parallel[Scavenge] | 复制 | Parallel Old | 标整
<code v-pre>-XX:+UseConcMarkSweepGC</code> |ParNew | 复制 | CMS + Serial Old | 标清
<code v-pre>-XX:+UseG1GC</code> |G1整体使用标记-整理算法 | 局部使用复制算法，不会产生内存碎片 |  |</li>
</ul>
<h3 id="g1垃圾回收器" tabindex="-1"><a class="header-anchor" href="#g1垃圾回收器"><span>**G1垃圾回收器</span></a></h3>
<ul>
<li>G1收集器是一款面向服务端应用的收集器，它像CMS一样，能与应用程序线程并发执行。</li>
<li>G1目标是取代CMS，相比CMS，以下表现更出色
<ul>
<li>G1有整理内存的过程，不会产生内存碎片。</li>
<li>G1的Stop The World(stw)更可控，G1在停顿时间上增加了预测机制，用户可以指定期望停顿时间<code v-pre>-XX:MaxGCPauseMillis=n</code>。</li>
</ul>
</li>
<li>主要改变时Eden Survivor Tenured等区域不是连续的了（以前这三个区域是一块连续的内存），而是变成了一个个大小一样的region,每个region从1m~32m不等。一个region有可能属于Eden，Survivor或者Tenured内存区域<code v-pre>-Xmx32g</code>。</li>
</ul>
<h4 id="g1特点" tabindex="-1"><a class="header-anchor" href="#g1特点"><span>G1特点</span></a></h4>
<ul>
<li>G1重复利用多CPU、多核硬件优势，尽量缩短STW。
<ul>
<li>解释：多CPU可以同时处理多个region</li>
</ul>
</li>
<li>G1整体采用标记-整理算法，局部复制算法，不会有内存碎片</li>
<li>G1讲把Eden、Survivor、Tenured混合再一起了，微观上还是保留了新生代老年代，它们变成了一些region的集合且不需要region是连续的，也就是说还是会采用不同的GC方式来处理不同的region</li>
<li>G1虽然区分新生代老年代，但不是物理上的区别。G1只是逻辑上的分代概念，或者说每个region都可能随G1的运行在不同代之间切换。</li>
</ul>
<h4 id="g1底层原理" tabindex="-1"><a class="header-anchor" href="#g1底层原理"><span>G1底层原理</span></a></h4>
<ul>
<li>
<p>region区域化垃圾收集器</p>
<ul>
<li>最大好处化整为零，避免全内存扫描，只需要按区域region进行扫描</li>
<li>G1不要求堆内存存储在物理上连续，只需要逻辑连续即可。启动时可以通过参数<code v-pre>-XX:G1HeapRegionSize=n</code>来指定分区大小(1~32m，且必须是2的幂)，默认将整个堆分为2048个region(所以最大支持内存为 32m*2048 =64G)</li>
<li>G1仍然属于分代收集器，一些region属于新生代，新生代垃圾收集器仍然会采用暂停所有用户线程的方式，把活着对象转到Surivor的region空间或者Tenured的region空间</li>
<li>一部分Tenured的region，G1收集器通过将对象从一个region复制到另一个region,完成清理工作，意味着这个过程中，G1完成了堆的整理（至少是部分的堆整理），解决了内存碎片问题。</li>
<li>在G1中还存在一个特殊的region区域，叫Humongous(巨大的)区域。如果一个对象占用空间超过的region分区容量50%以上，G1会认为其是大对象**默认分配到Tenured区域。**但它又是一个短期存在的对象，为了避免对垃圾回收器产生负面影响，G1专门划了Humongous区域，存放大对象，如果大对象占用空间超过了一个region,G1会寻找多个连续的region来存放，为了能找到连续的分区，有时候不得不启动Full GC</li>
</ul>
</li>
<li>
<p>回收步骤</p>
<ul>
<li>针对Eden区域回收，Eden区被耗尽会触发回收，主要是小区域收集+形成连续的内存块，避免内存碎片
<ul>
<li>Eden区数据移动到Surivor区，加入Surivor区内存不够，Eden区部分数据会晋升到Tenured区</li>
<li>Surivor区数据移动到新的Surivor区，部分会晋升到Tenured区</li>
<li>最后Eden区收拾干净了，GC结束用户应用程序线程继续</li>
</ul>
</li>
</ul>
</li>
<li>
<p>4步过程</p>
<ul>
<li>初始标记：只标记GC Roots可达的对象</li>
<li>并发标记: 进行GC Roots Tracing过程</li>
<li>最终标记：修正并发标记过程中变动的对象</li>
<li>筛选回收：根据时间来进行最大化回收</li>
</ul>
</li>
</ul>
</div></template>


