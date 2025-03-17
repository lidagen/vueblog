<template><div><h2 id="gc-分代收集算法" tabindex="-1"><a class="header-anchor" href="#gc-分代收集算法"><span>GC 分代收集算法</span></a></h2>
<img :src="$withBase('/jvm/sf.png')" alt="dock">
<ul>
<li>JVM在进行GC时，并非每次都对三个（对于jdk8来说是两个）区域（Young、Old、Prem）一起回收的，大部分回收是指新生代。</li>
<li>因此GC分为两种GC，一种是普通GC（minor GC）,一种是全局GC（major GC或 Full GC）</li>
</ul>
<h3 id="minor-gc-和-full-gc区别" tabindex="-1"><a class="header-anchor" href="#minor-gc-和-full-gc区别"><span>Minor GC 和 Full GC区别</span></a></h3>
<ul>
<li>Minor GC :直针对新生代区域的GC，因为一般java对象存活率不高，所以Minor GC频率非常频繁，一般回收速度较快</li>
<li>Full GC ：指发生在老年代的垃圾回收动作，出现了Full GC,通常会伴随至少一次的Minor GC(但不是绝对)。Full GC的速度一般比Minor GC满10倍以上。</li>
</ul>
<h3 id="引用计数法" tabindex="-1"><a class="header-anchor" href="#引用计数法"><span>引用计数法</span></a></h3>
<ul>
<li>一个对象可能有多个地方引用，如果有引用就+1,没有就-1，当引用 =0的时候，证明没有被引用，会被回收。</li>
<li>优点：速度快，效率高</li>
<li>缺点：
<ul>
<li>每次对对象赋值都要维护一个计数器，且计数器也有一定消耗</li>
<li>较难处理循环引用问题（类似死锁）</li>
</ul>
</li>
<li>JVM实现一般不采用这种方式</li>
</ul>
<h3 id="复制算法-copying" tabindex="-1"><a class="header-anchor" href="#复制算法-copying"><span>复制算法 Copying</span></a></h3>
<ul>
<li>Minor GC使用的就是<code v-pre>复制算法Copying</code></li>
<li>为什么：
<ul>
<li>Minor GC会把Eden区所有活着的对象放到Survivor区，如果放不下就会放入Old Gen，也即一旦收集后，Eden区就会变成空的。</li>
<li>当一个对象在Eden区出生后，经过依次MinorGC后还存活，并且能够被另一块Survivor容纳，则使用<strong>复制算法</strong>将这些存活的对象复制到另一个Survivor区（to区），然后清理所使用过的Eden区和Survivor区（from区），并将这些存活对象年龄+1，以后梅熬过依次MinorGC的对象，年龄都会+1，当对象年龄到达一个阈值（默认15，通过-XX:MaxtenuingThreshold设置）。这些对象会进入老年代Old Gen</li>
<li>复制算法基本思想就是把内存分为两块（Survivor0、Survivor1），每次只使用一块，当一块内存用完后，就将活得复制另一块中。<strong>复制算法不产生内存碎片</strong>（复制过去的数据在内存中是连续的）</li>
<li>因为Eden区对象一般存活率较低，所以Eden占用新生代80%空间，而Survivor0、Survivor1分别10%，因为一旦放生GC，绝大部分的对象都会被清除，少数会到Survivor区。</li>
</ul>
</li>
<li>劣势：
<ul>
<li>浪费了Survivor区的一半内存空间</li>
<li>如果对象存活率很高，我们会将对象都复制一遍，并将引用的地址重置一遍。复制算法在存活率较高情况下（大量static），花费时间较多。复制算法想要高效，起码对象存活率要非常低才行。</li>
</ul>
</li>
</ul>
<h3 id="标记清除-mark-sweep" tabindex="-1"><a class="header-anchor" href="#标记清除-mark-sweep"><span>标记清除 Mark-Sweep</span></a></h3>
<ul>
<li>Full GC一般由<code v-pre>标记清除 Mark-Sweep</code> 和<code v-pre>标记压缩 Mark-Compact</code>混合实现</li>
<li>原理</li>
</ul>
<ul>
<li>算法分为标记、清除两个阶段，先标记出要回收的对象，然后统一回收这些对象</li>
<li>优点： 节约空间</li>
<li>缺点： 1耗时（需要两次扫描）；2会产生内存碎片（清除内存数据，会造成空闲内存不连续）</li>
</ul>
<h3 id="标记压缩-mark-compact" tabindex="-1"><a class="header-anchor" href="#标记压缩-mark-compact"><span>标记压缩 Mark-Compact</span></a></h3>
<ul>
<li>标记压缩，标记存活的对象，通过把存活的对象都往内存的一端移动，然后清除边界以外的内存数据。</li>
<li><code v-pre>标记压缩 Mark-Compact</code>是对<code v-pre>标记清除 Mark-Sweep</code>缺点2的优化，把不连续的内存空间进行压缩整理，但是同时耗时也是最长的（需要标记 + 整理两步）</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<ul>
<li>Full GC因为是两种算法的结合，所以实质是 <code v-pre>标记Mark - 清除Sweep - 压缩Compact</code> 的结合</li>
<li>原理：Full GC进行多次的<code v-pre>Mark-Sweep</code>以后，会进行<code v-pre>Mark-Compact</code></li>
</ul>
</div>
<h3 id="算法总结" tabindex="-1"><a class="header-anchor" href="#算法总结"><span>算法总结</span></a></h3>
<ul>
<li>内存效率：复制算法 &gt; 标记清除 &gt; 标记压缩</li>
<li>内存整齐度：复制算法 = 标记压缩 &gt; 标记清除</li>
<li>内存利用率：标记压缩 = 标记清除 &gt; 复制算法</li>
</ul>
</div></template>


