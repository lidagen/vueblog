<template><div><h2 id="jvm相关问题" tabindex="-1"><a class="header-anchor" href="#jvm相关问题"><span>JVM相关问题</span></a></h2>
<h3 id="jvm垃圾回收时如何确定是垃圾-什么是gc-roots" tabindex="-1"><a class="header-anchor" href="#jvm垃圾回收时如何确定是垃圾-什么是gc-roots"><span>JVM垃圾回收时如何确定是垃圾？什么是GC Roots</span></a></h3>
<ul>
<li>引用计数法，判断是否被引用(解决不了循环引用问题)</li>
<li>可达性分析(根搜索路径GC Roots)
<ul>
<li>**基本思路就是通过一系列名为GC Roots的对象为起始点。**往下搜索，如果一个对象和GC Roots没有任何引用链相连时，说明对象不可用。</li>
</ul>
</li>
<li>哪些可以成为GC Roots
<ul>
<li><code v-pre>虚拟机栈java stack</code>中引用的对象</li>
<li><code v-pre>方法区Method Area</code> 中的类静态属性引用的对象</li>
<li><code v-pre>方法区Method Area</code> 常量引用的对象</li>
<li><code v-pre>本地方法栈中（native方法）</code>引用的对象</li>
</ul>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">GcRootsDemo</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">GcRootsDemo2</span> t2<span class="token punctuation">;</span><span class="token comment">//2.方法区类静态属性引用对象</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">GcRootsDemo3</span> t3 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">GcRootsDemo3</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//3.方法区常量引用的对象</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span> byteArrays <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token number">100</span> <span class="token operator">*</span> <span class="token number">1024</span> <span class="token operator">*</span> <span class="token number">1024</span><span class="token punctuation">]</span><span class="token punctuation">;</span><span class="token comment">//4.native对象</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">m1</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">GcRootsDemo</span> t1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">GcRootsDemo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//1.java stack中引用的对象</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">gc</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"第一次GC完成"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">m1</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="如何查看jvm参数默认值-jvm的参数类型" tabindex="-1"><a class="header-anchor" href="#如何查看jvm参数默认值-jvm的参数类型"><span>如何查看JVM参数默认值（JVM的参数类型）</span></a></h3>
<ul>
<li>
<p>标配参数</p>
<ul>
<li>-version</li>
<li>-help</li>
<li>-showversion</li>
</ul>
</li>
<li>
<p>x参数(了解)</p>
<ul>
<li>-Xint 解释执行</li>
<li>-Xcomp 第一次使用就编译成本地代码</li>
<li>-Xmixed 混合模式</li>
</ul>
</li>
<li>
<p>xx参数 <code v-pre>jps -l 找进程号， jinfo查看配置</code></p>
<ul>
<li>
<p>布尔类型 （公式：-XX:+某属性 -XX:-某属性 +开启 -关闭）</p>
<ul>
<li>比如<code v-pre>jps -l</code>找到一个类进程号，然后 <code v-pre>jinfo -flag PrintGCDetails 进程号</code>，查看是否开启了开始GC收集PrintGCDetails（可以通过 -XX:+PrintGCDetails 设置）。</li>
<li><code v-pre>jinfo -flag UseSerialGC 进程号</code>查看是否使用串行GC</li>
</ul>
</li>
<li>
<p>KV设值类型</p>
<ul>
<li>假设我们看<code v-pre>元空间MetaSpace</code>大小，也可以先用布尔参数查询，<code v-pre>jinfo -flag MetaspaceSize 进程号</code>获取查看。此时我们设置自己想要的大小<code v-pre>-XX:MetaspaceSize=128m</code>,再次进行查看</li>
<li>同样可以查看设置新生代到老年代的年龄<code v-pre>MaxTenuringThreshold</code></li>
</ul>
</li>
<li>
<p><code v-pre>jinfo -flags 进程号 </code> 可以查询所有的可调整的区域的参数名</p>
</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">Non-default VM flags: <span class="token parameter variable">-XX:CICompilerCount</span><span class="token operator">=</span><span class="token number">4</span> <span class="token parameter variable">-XX:InitialHeapSize</span><span class="token operator">=</span><span class="token number">266338304</span> <span class="token parameter variable">-XX:MaxHeapSize</span><span class="token operator">=</span><span class="token number">4242538496</span> <span class="token parameter variable">-XX:MaxNewSize</span><span class="token operator">=</span><span class="token number">1414004736</span> <span class="token parameter variable">-XX:MinHeapDeltaBytes</span><span class="token operator">=</span><span class="token number">524</span></span>
<span class="line"><span class="token number">288</span> <span class="token parameter variable">-XX:NewSize</span><span class="token operator">=</span><span class="token number">88604672</span> <span class="token parameter variable">-XX:OldSize</span><span class="token operator">=</span><span class="token number">177733632</span> <span class="token parameter variable">-XX:+PrintGCDetails</span> <span class="token parameter variable">-XX:+UseCompressedClassPointers</span> <span class="token parameter variable">-XX:+UseCompressedOops</span> <span class="token parameter variable">-XX:+UseFastUnorderedTimeStamp</span></span>
<span class="line">s <span class="token parameter variable">-XX:-UseLargePagesIndividualAllocation</span> <span class="token parameter variable">-XX:+UseParallelGC</span> //默认的</span>
<span class="line">Command line:  <span class="token parameter variable">-XX:+PrintGCDetails</span> //人工配置的</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>-Xms -Xmx</p>
<ul>
<li>-Xms 等价于 InitialHeapSize</li>
<li>-Xmx 等价于 MaxHeapSize</li>
</ul>
</li>
<li>
<p><code v-pre>java -XX:+PrintFlagsInitial </code>查看JVM初始化参数值</p>
</li>
<li>
<p><code v-pre>java -XX:+PrintFlagsFinal -version</code> 打印最终值，如果某个默认值被新值覆盖，显示新值（其中有 <code v-pre>:=</code> 标记的，说明是被用户或者JVM修改过的参数）</p>
</li>
<li>
<p><code v-pre>java -XX:+PrintCommandLineFlags -version</code> 常用的参数配置以及GC的默认垃圾回收器</p>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token parameter variable">-XX:InitialHeapSize</span><span class="token operator">=</span><span class="token number">265147264</span> <span class="token parameter variable">-XX:MaxHeapSize</span><span class="token operator">=</span><span class="token number">4242356224</span> <span class="token parameter variable">-XX:+PrintCommandLineFlags</span> <span class="token parameter variable">-XX:+UseCompressedClassPointers</span> <span class="token parameter variable">-XX:+UseCompressedOops</span> <span class="token parameter variable">-XX:-UseLarge</span></span>
<span class="line">PagesIndividualAllocation <span class="token parameter variable">-XX:+UseParallelGC</span> //默认垃圾回收器</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="常用的jvm参数配置有哪些" tabindex="-1"><a class="header-anchor" href="#常用的jvm参数配置有哪些"><span>常用的JVM参数配置有哪些</span></a></h3>
<ul>
<li><code v-pre>-Xms -Xmx</code>
<ul>
<li>Xms 默认是物理内存的1/64</li>
<li>Xmx 默认是物理内存的1/4</li>
</ul>
</li>
<li><code v-pre>-Xss</code> 等价 -XX:ThreadStackSize,一般默认 512k~1024k</li>
<li><code v-pre>-Xmn</code> 设置年轻代大小（一般不需要调整） 新生代老年代比例1/3,2/3</li>
<li><code v-pre>-XX:MetaspaceSize</code> 元空间，jdk8以后，这个空间不占用heap的内存，大小取决与机器内存
<ul>
<li>虽然是占用物理内存，但是会有默认值，为了避免元空间OOM，可以把这个参数设置大一点（允许的话 512MB ~ 1G范围）</li>
</ul>
</li>
<li><code v-pre>-XX:+PrintGCDetails</code> 收集GC详细日志输出信息</li>
</ul>
<h3 id="强引用、软引用、弱引用、虚引用" tabindex="-1"><a class="header-anchor" href="#强引用、软引用、弱引用、虚引用"><span>强引用、软引用、弱引用、虚引用</span></a></h3>
<img :src="$withBase('/jvm/reference.png')" alt="dock">
<ul>
<li>
<p><code v-pre>强引用Reference</code> 默认支持模式</p>
<ul>
<li>当内存不足，JVM开始GC，对于强引用对象，就算是<strong>出现了OOM也不会对对象进行回收。</strong></li>
<li>强引用就是我们常见的普通对象引用（Person p = new Person();），只要有强引用指向一个对象，说明对象还活着。一个对象被强引用变量引用时，它处于可达状态，*即使该对象以后永远不会用到，也不会被GC回收。*因此强引用时造成内存泄漏的主要原因之一。</li>
<li>一个普通对象，如果它没有其它引用关系，只要超过了引用作用域或者显式的将引用赋值为null。一般认为它是可以被GC的。</li>
</ul>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">StrongReference</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">Object</span> obj1 <span class="token operator">=</span><span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//定义的默认强引用</span></span>
<span class="line">        <span class="token class-name">Object</span> obj2 <span class="token operator">=</span> obj1<span class="token punctuation">;</span><span class="token comment">//obj2引用赋值，也指向obj1指向的内存地址</span></span>
<span class="line">        obj1 <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">//obj1指向为null</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">gc</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>obj2<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//不会被垃圾回收</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p><code v-pre>软引用SoftReference</code></p>
<ul>
<li>软引用是相对强引用弱化了点的引用，需要用java.lang.ref.SoftRerence类实现，可以让内存豁免一些垃圾收集。</li>
<li>对于只有软引用的对象来说
<ul>
<li>当内存充足时，不会被GC</li>
<li>当内存不足时，会被GC</li>
</ul>
</li>
<li>软引用通常用在内存敏感的数据中，比如高速缓存就用软引用。</li>
</ul>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">SoftReferenceDemo</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 内存够用时</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">memory_enough</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">Object</span> obj1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">SoftReference</span> softReference <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SoftReference</span><span class="token punctuation">(</span>obj1<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//软引用</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>softReference<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        obj1 <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">//失效强引用</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">gc</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>softReference<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"=="</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//内存够用，不GC</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 内存不够用时</span>
<span class="line">     * JVM配置小内存,模拟OOM -Xms5m -Xmx5m -XX:+PrintGCDetails</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">memory_not_enough</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">Object</span> obj1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">SoftReference</span> softReference <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SoftReference</span><span class="token punctuation">(</span>obj1<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//软引用</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>softReference<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        obj1 <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">//让引用失效</span></span>
<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span> b <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token number">30</span> <span class="token operator">*</span> <span class="token number">1024</span> <span class="token operator">*</span> <span class="token number">1024</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Throwable</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"soft->"</span><span class="token operator">+</span>softReference<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//不够用被回收null</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">memory_enough</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token function">memory_not_enough</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p><code v-pre>弱引用WeakReference</code></p>
<ul>
<li>弱引用需要用java.lang.ref.WeakReference实现，它比软引用生存期短。</li>
<li>对于只有弱引用的对象来说，只要垃圾回收机制运行，不管JVM内存空间是否足够，都会被回收</li>
</ul>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">WeakReferenceDemo</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">Object</span> o1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">WeakReference</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Object</span><span class="token punctuation">></span></span> weakReference <span class="token operator">=</span><span class="token keyword">new</span> <span class="token class-name">WeakReference</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span>o1<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>weakReference<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"--GC前"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        o1 <span class="token operator">=</span> <span class="token keyword">null</span> <span class="token punctuation">;</span><span class="token comment">//去掉强引用</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">gc</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>weakReference<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"--GC后"</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//被回收了</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p><code v-pre>虚引用PhantomReference</code></p>
<ul>
<li>弱引用需要用java.lang.ref.PhantomReference类来实现。</li>
<li>顾名思义，就是形同虚设，与其它几种不同，虚引用并不会决定对象生命周期</li>
<li>**如果一个对象仅持有虚引用，那么它就和没有任何引用一样，在任何时候都可以被GC回收。**它不能单独使用，需要和<code v-pre>引用队列ReferenceQueue</code>联合使用。</li>
<li>PhantomReference.get()方法总是返回null，因此无法访问被引用对象。其意义在于说明一个对象已经进入了finalzation阶段，可以被gc回收，用来实现比finalzation机制更灵活的回收操作</li>
<li>换句话说，设置<code v-pre>虚引用PhantomReference</code>关联的唯一目的，就是在这个对象被回收器回收时，收到一个系统通知或者后续添加进一步处理。java技术允许使用<code v-pre>finalize()</code>方法在垃圾回收器将对象从内存中清除出去前做必要的清理工作（相当于AOP中的后置通知）。</li>
</ul>
</li>
<li>
<p><code v-pre>引用队列ReferenceQueue</code></p>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**</span>
<span class="line">* 引用可以单独使用，也可以配合ReferenceQueue使用</span>
<span class="line">* 如果使用了ReferenceQueue，当GC是否对象内存时，会将其加入到ReferenceQueue中</span>
<span class="line">* 程序发现某个软引用、弱引用、虚引用已经被加入到队列中，意味着其指向的堆heap内存对象被回收，通过这种方式，JVM允许我们在对象被回收后做一些我们想做的事</span>
<span class="line">*/</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ReferenceQueueDemo</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">Object</span> o1 <span class="token operator">=</span><span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">ReferenceQueue</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Object</span><span class="token punctuation">></span></span> queue <span class="token operator">=</span><span class="token keyword">new</span> <span class="token class-name">ReferenceQueue</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">PhantomReference</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Object</span><span class="token punctuation">></span></span> weakReference <span class="token operator">=</span><span class="token keyword">new</span> <span class="token class-name">PhantomReference</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span>o1<span class="token punctuation">,</span>queue<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>o1<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//有值</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>weakReference<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//get为空，如果换成软引用就有值</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>queue<span class="token punctuation">.</span><span class="token function">poll</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//null</span></span>
<span class="line"></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"----------------------------"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        o1 <span class="token operator">=</span><span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">gc</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>o1<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//null</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>weakReference<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//null</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>queue<span class="token punctuation">.</span><span class="token function">poll</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//有值,gc后把值放入队列</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>软引用SoftReference 弱引用WeakReference使用场景</p>
<ul>
<li>假如我们有一个应用需要读取大量图片
<ul>
<li>如果每次加载会严重影响性能</li>
<li>如果一次性加载到内存又可能内存溢出</li>
</ul>
</li>
<li>此时软引用可以解决这个问题，设计思路用一个HashMap保存图片路径和相应图片对象关联的软引用之间映射关系，内存不足时，JVM会回收占用的空间</li>
</ul>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span><span class="token class-name">SoftReference</span><span class="token punctuation">&lt;</span><span class="token class-name">Bitmap</span><span class="token punctuation">></span><span class="token punctuation">></span></span> imageCache <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span><span class="token class-name">SoftReference</span><span class="token punctuation">&lt;</span><span class="token class-name">Bitmap</span><span class="token punctuation">></span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>WeakHashMap 是“弱键”实现的哈希表。它这个“弱键”的目的就是：实现对“键值对”的动态回收。当“弱键”不再被使用到时，GC会回收它，WeakReference也会将“弱键”对应的键值对删除。</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">WeakHashMapDemo</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">WeakHashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">></span></span> weakHashMap <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">WeakHashMap</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">Integer</span> k <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Integer</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">String</span> v <span class="token operator">=</span> <span class="token string">"val1"</span><span class="token punctuation">;</span></span>
<span class="line">        weakHashMap<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span>k<span class="token punctuation">,</span> v<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>weakHashMap<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        k <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span><span class="token comment">//k失效以后</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">gc</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>weakHashMap<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//map内容被移除</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="oom的认识" tabindex="-1"><a class="header-anchor" href="#oom的认识"><span>OOM的认识</span></a></h3>
<ul>
<li>
<p>StackOverflowError</p>
<ul>
<li>栈内存空间溢出（简单就是递归调用）</li>
</ul>
</li>
<li>
<p>OutOfMemoryError:Java heap space</p>
<ul>
<li>堆空间内存溢出，调整-Xms -Xmx</li>
</ul>
</li>
<li>
<p>OutOfMemoryError:GC overhead limit exceeded</p>
<ul>
<li>超过gc最高警戒，大部分资源都用来做gc回收了（超过98%资源都用来gc,但是回收不到2%heap内存），但是还是内存溢出</li>
<li>简单理解就是大量的new对象，导致回收不过来<code v-pre>（List&lt;Integer&gt; 循环添加 Integer对象）</code></li>
</ul>
</li>
<li>
<p>OutOfMemoryError:Direct buffer memory</p>
<ul>
<li>写NIO程序经常使用ByteBuffer来读取写入数据，它可以使用native函数库直接使用堆heap外内存（本地内存），然后通过一个存储在java堆heap里面的DirectByteBuffer对象作为内存的引用进行操作<code v-pre>ByteBuffer.allocteDirect()</code>。如果只使用本地内存而堆内存使用很少，那JVM则不执行GC，ByteBuffer对象不会被回收，此时本地内存满了，再次尝试分配本地内存就会抛此异常。</li>
</ul>
</li>
<li>
<p>OutOfMemoryError:ubable to create new native thread</p>
<ul>
<li>应用创建了太多线程，超出系统承载能力;或者你的服务器不允许创建这么多线程（linux默认单个进程可创建的线程数是1024个）；</li>
<li>解决办法就是：降低应用创建的线程数，分析是否需要这么多线程，将线程数降低；对于确实需要创建很多线程的且超过linux默认个数的，可以修改linux配置，扩大linux限制</li>
</ul>
</li>
<li>
<p>OutOfMemoryError:Metaspace</p>
<ul>
<li>使用<code v-pre>java -XX:+PrintFlagsInitial</code>命令看MetaspaceSize初始化值</li>
<li>元空间内存不足，可以尝试调整 <code v-pre>-XX:MetaspaceSize=1024m</code></li>
</ul>
</li>
</ul>
<h3 id="生产环境服务器变慢的诊断思路、以及如何性能评估" tabindex="-1"><a class="header-anchor" href="#生产环境服务器变慢的诊断思路、以及如何性能评估"><span>生产环境服务器变慢的诊断思路、以及如何性能评估</span></a></h3>
<h4 id="linux-命令" tabindex="-1"><a class="header-anchor" href="#linux-命令"><span>Linux 命令</span></a></h4>
<ul>
<li>整机:<code v-pre>top</code>  查看cpu和内存占用情况
<ul>
<li>查看右上角系统负载load average三个值（分别代表系统1分钟5分钟15分钟评价负载值）：如果三个数相加除3乘100% &gt; 60%,说明负载较高</li>
<li><code v-pre>uptime</code>是精简版</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token punctuation">[</span>root@iZbp1f96jelc5vbwqq8habZ ~<span class="token punctuation">]</span><span class="token comment"># top </span></span>
<span class="line"><span class="token function">top</span> - <span class="token number">15</span>:33:29 up <span class="token number">175</span> days, <span class="token number">7</span> min,  <span class="token number">1</span> user,  load average: <span class="token number">0.03</span>, <span class="token number">0.08</span>, <span class="token number">0.03</span></span>
<span class="line">Tasks: <span class="token number">127</span> total,   <span class="token number">3</span> running, <span class="token number">124</span> sleeping,   <span class="token number">0</span> stopped,   <span class="token number">0</span> zombie</span>
<span class="line">%Cpu<span class="token punctuation">(</span>s<span class="token punctuation">)</span>:  <span class="token number">1.4</span> us,  <span class="token number">0.7</span> sy,  <span class="token number">0.0</span> ni, <span class="token number">97.3</span> id,  <span class="token number">0.0</span> wa,  <span class="token number">0.7</span> hi,  <span class="token number">0.0</span> si,  <span class="token number">0.0</span> st</span>
<span class="line">MiB Mem <span class="token builtin class-name">:</span>   <span class="token number">1827.0</span> total,     <span class="token number">98.1</span> free,   <span class="token number">1555.5</span> used,    <span class="token number">173.5</span> buff/cache</span>
<span class="line">MiB Swap:      <span class="token number">0.0</span> total,      <span class="token number">0.0</span> free,      <span class="token number">0.0</span> used.    <span class="token number">114.4</span> avail Mem </span>
<span class="line"></span>
<span class="line">    PID <span class="token environment constant">USER</span>      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND                                                                                            </span>
<span class="line"><span class="token number">2528486</span> root      <span class="token number">10</span> <span class="token parameter variable">-10</span>  <span class="token number">172348</span>  <span class="token number">14048</span>   <span class="token number">2320</span> S   <span class="token number">1.0</span>   <span class="token number">0.8</span> <span class="token number">269</span>:14.93 AliYunDun                                                                                          </span>
<span class="line">   <span class="token number">1806</span> root      <span class="token number">20</span>   <span class="token number">0</span> <span class="token number">2461016</span> <span class="token number">162656</span>      <span class="token number">0</span> S   <span class="token number">0.3</span>   <span class="token number">8.7</span> <span class="token number">170</span>:27.97 <span class="token function">java</span>                                                                                               </span>
<span class="line">  <span class="token number">43823</span> mysql     <span class="token number">20</span>   <span class="token number">0</span> <span class="token number">1355804</span> <span class="token number">393768</span>      <span class="token number">0</span> S   <span class="token number">0.3</span>  <span class="token number">21.0</span>   <span class="token number">1043</span>:15 mysqld                                                                                             </span>
<span class="line"> <span class="token number">176259</span> rabbitmq  <span class="token number">20</span>   <span class="token number">0</span> <span class="token number">1728248</span>  <span class="token number">82408</span>    <span class="token number">528</span> S   <span class="token number">0.3</span>   <span class="token number">4.4</span> <span class="token number">549</span>:16.42 beam.smp                                                                                           </span>
<span class="line"><span class="token number">3593818</span> root      <span class="token number">20</span>   <span class="token number">0</span>   <span class="token number">67436</span>   <span class="token number">3056</span>   <span class="token number">2260</span> R   <span class="token number">0.3</span>   <span class="token number">0.2</span>   <span class="token number">0</span>:00.46 <span class="token function">top</span>                                                                                                </span>
<span class="line">      <span class="token number">1</span> root      <span class="token number">20</span>   <span class="token number">0</span>  <span class="token number">244704</span>   <span class="token number">4952</span>   <span class="token number">1928</span> S   <span class="token number">0.0</span>   <span class="token number">0.3</span>   <span class="token number">5</span>:29.53 systemd                                                                                            </span>
<span class="line">      <span class="token number">2</span> root      <span class="token number">20</span>   <span class="token number">0</span>       <span class="token number">0</span>      <span class="token number">0</span>      <span class="token number">0</span> S   <span class="token number">0.0</span>   <span class="token number">0.0</span>   <span class="token number">0</span>:02.26 kthreadd                                                                                           </span>
<span class="line">      <span class="token number">3</span> root       <span class="token number">0</span> <span class="token parameter variable">-20</span>       <span class="token number">0</span>      <span class="token number">0</span>      <span class="token number">0</span> I   <span class="token number">0.0</span>   <span class="token number">0.0</span>   <span class="token number">0</span>:00.00 rcu_gp                                                                                             </span>
<span class="line">      <span class="token number">4</span> root       <span class="token number">0</span> <span class="token parameter variable">-20</span>       <span class="token number">0</span>      <span class="token number">0</span>      <span class="token number">0</span> I   <span class="token number">0.0</span>   <span class="token number">0.0</span>   <span class="token number">0</span>:00.00 rcu_par_gp                                                                                         </span>
<span class="line">      <span class="token number">6</span> root       <span class="token number">0</span> <span class="token parameter variable">-20</span>       <span class="token number">0</span>      <span class="token number">0</span>      <span class="token number">0</span> I   <span class="token number">0.0</span>   <span class="token number">0.0</span>   <span class="token number">0</span>:00.00 kworker/0:0H-kblockd                                                                               </span>
<span class="line">      <span class="token number">8</span> root       <span class="token number">0</span> <span class="token parameter variable">-20</span>       <span class="token number">0</span>      <span class="token number">0</span>      <span class="token number">0</span> I   <span class="token number">0.0</span>   <span class="token number">0.0</span>   <span class="token number">0</span>:00.00 mm_percpu_wq                                                                                       </span>
<span class="line">      <span class="token number">9</span> root      <span class="token number">20</span>   <span class="token number">0</span>       <span class="token number">0</span>      <span class="token number">0</span>      <span class="token number">0</span> S   <span class="token number">0.0</span>   <span class="token number">0.0</span>   <span class="token number">2</span>:05.13 ksoftirqd/0                                                                                        </span>
<span class="line">     <span class="token number">10</span> root      <span class="token number">20</span>   <span class="token number">0</span>       <span class="token number">0</span>      <span class="token number">0</span>      <span class="token number">0</span> R   <span class="token number">0.0</span>   <span class="token number">0.0</span>  <span class="token number">14</span>:30.61 rcu_sched                                                                                          </span>
<span class="line">     <span class="token number">11</span> root      rt   <span class="token number">0</span>       <span class="token number">0</span>      <span class="token number">0</span>      <span class="token number">0</span> S   <span class="token number">0.0</span>   <span class="token number">0.0</span>   <span class="token number">0</span>:00.00 migration/0                                                                                        </span>
<span class="line">     <span class="token number">12</span> root      rt   <span class="token number">0</span>       <span class="token number">0</span>      <span class="token number">0</span>      <span class="token number">0</span> S   <span class="token number">0.0</span>   <span class="token number">0.0</span>   <span class="token number">0</span>:00.99 watchdog/0                                                                                         </span>
<span class="line">     <span class="token number">13</span> root      <span class="token number">20</span>   <span class="token number">0</span>       <span class="token number">0</span>      <span class="token number">0</span>      <span class="token number">0</span> S   <span class="token number">0.0</span>   <span class="token number">0.0</span>   <span class="token number">0</span>:00.00 cpuhp/0                                                                                            </span>
<span class="line">     <span class="token number">15</span> root      <span class="token number">20</span>   <span class="token number">0</span>       <span class="token number">0</span>      <span class="token number">0</span>      <span class="token number">0</span> S   <span class="token number">0.0</span>   <span class="token number">0.0</span>   <span class="token number">0</span>:00.00 kdevtmpfs                                                                                          </span>
<span class="line">     <span class="token number">16</span> root       <span class="token number">0</span> <span class="token parameter variable">-20</span>       <span class="token number">0</span>      <span class="token number">0</span>      <span class="token number">0</span> I   <span class="token number">0.0</span>   <span class="token number">0.0</span>   <span class="token number">0</span>:00.00 netns                                                                                              </span>
<span class="line">     <span class="token number">17</span> root      <span class="token number">20</span>   <span class="token number">0</span>       <span class="token number">0</span>      <span class="token number">0</span>      <span class="token number">0</span> S   <span class="token number">0.0</span>   <span class="token number">0.0</span>   <span class="token number">0</span>:01.30 kauditd                                                                                            </span>
<span class="line">     <span class="token number">18</span> root      <span class="token number">20</span>   <span class="token number">0</span>       <span class="token number">0</span>      <span class="token number">0</span>      <span class="token number">0</span> S   <span class="token number">0.0</span>   <span class="token number">0.0</span>   <span class="token number">0</span>:09.74 khungtaskd                                                                                         </span>
<span class="line">     <span class="token number">19</span> root      <span class="token number">20</span>   <span class="token number">0</span>       <span class="token number">0</span>      <span class="token number">0</span>      <span class="token number">0</span> S   <span class="token number">0.0</span>   <span class="token number">0.0</span>   <span class="token number">0</span>:00.00 oom_reaper                                                                                         </span>
<span class="line">     <span class="token number">20</span> root       <span class="token number">0</span> <span class="token parameter variable">-20</span>       <span class="token number">0</span>      <span class="token number">0</span>      <span class="token number">0</span> I   <span class="token number">0.0</span>   <span class="token number">0.0</span>   <span class="token number">0</span>:00.00 writeback                                                                                          </span>
<span class="line">     <span class="token number">21</span> root      <span class="token number">20</span>   <span class="token number">0</span>       <span class="token number">0</span>      <span class="token number">0</span>      <span class="token number">0</span> S   <span class="token number">0.0</span>   <span class="token number">0.0</span>   <span class="token number">0</span>:00.00 kcompactd0                                                                                         </span>
<span class="line">     <span class="token number">22</span> root      <span class="token number">25</span>   <span class="token number">5</span>       <span class="token number">0</span>      <span class="token number">0</span>      <span class="token number">0</span> S   <span class="token number">0.0</span>   <span class="token number">0.0</span>   <span class="token number">0</span>:00.00 ksmd                                                                                               </span>
<span class="line">     <span class="token number">23</span> root      <span class="token number">39</span>  <span class="token number">19</span>       <span class="token number">0</span>      <span class="token number">0</span>      <span class="token number">0</span> S   <span class="token number">0.0</span>   <span class="token number">0.0</span>   <span class="token number">2</span>:38.96 khugepaged  </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>CPU:<code v-pre>vmstat</code> 查看cpu（包含不限于）
<ul>
<li>主要看procs和cpu
<ul>
<li>procs中r是运行b是阻塞
<ul>
<li>r 运行和等待cpu时间片的进程数（(7+0+2)/3），原则上1核cpu运行队列要超过2，整个系统运行队列不能超过总核数的2倍，负责代表系统压力大</li>
<li>b 等待资源的进程数，比如等待磁盘IO 网络IO等</li>
</ul>
</li>
<li>cpu
<ul>
<li>us 用户进程消耗cpu时间百分比，us值高，用户进程消耗CPU时间多，如果长期大于50%，优化程序</li>
<li>sy 内核进程消耗cpu时间百分比</li>
<li>us + sy 如果大于80（即80%）说明存在cpu不足</li>
</ul>
</li>
</ul>
</li>
<li>额外查询
<ul>
<li>查所有cpu核信息 <code v-pre>mpstat -P ALL 2</code></li>
<li>查具体进程cpu用量<code v-pre>pidstat -u 1 -p 进程号</code></li>
</ul>
</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token punctuation">[</span>root@iZbp1f96jelc5vbwqq8habZ ~<span class="token punctuation">]</span><span class="token comment"># vmstat -n 2 3 //每两秒采样一次，共计三次</span></span>
<span class="line">procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----</span>
<span class="line"> r  b   swpd   <span class="token function">free</span>   buff  cache   si   so    bi    bo   <span class="token keyword">in</span>   cs us sy <span class="token function">id</span> wa st</span>
<span class="line"> <span class="token number">7</span>  <span class="token number">0</span>      <span class="token number">0</span>  <span class="token number">93436</span>      <span class="token number">0</span> <span class="token number">182224</span>    <span class="token number">0</span>    <span class="token number">0</span>    <span class="token number">29</span>     <span class="token number">8</span>    <span class="token number">2</span>    <span class="token number">2</span>  <span class="token number">2</span>  <span class="token number">2</span> <span class="token number">97</span>  <span class="token number">0</span>  <span class="token number">0</span></span>
<span class="line"> <span class="token number">0</span>  <span class="token number">0</span>      <span class="token number">0</span>  <span class="token number">93376</span>      <span class="token number">0</span> <span class="token number">182224</span>    <span class="token number">0</span>    <span class="token number">0</span>     <span class="token number">0</span>     <span class="token number">0</span>  <span class="token number">640</span> <span class="token number">1663</span>  <span class="token number">2</span>  <span class="token number">2</span> <span class="token number">96</span>  <span class="token number">0</span>  <span class="token number">0</span></span>
<span class="line"> <span class="token number">2</span>  <span class="token number">0</span>      <span class="token number">0</span>  <span class="token number">93376</span>      <span class="token number">0</span> <span class="token number">182228</span>    <span class="token number">0</span>    <span class="token number">0</span>     <span class="token number">0</span>     <span class="token number">9</span>  <span class="token number">675</span> <span class="token number">1705</span>  <span class="token number">2</span>  <span class="token number">2</span> <span class="token number">96</span>  <span class="token number">0</span>  <span class="token number">0</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>内存:<code v-pre>free</code> 应用程序可用的内存数
<ul>
<li>应用程序可用/系统物理内存 &gt; 70% 内存充足</li>
<li>应用程序可用/系统物理内存 &lt; 20% 内存不足</li>
</ul>
<ul>
<li>额外查询 <code v-pre>pidstat -p 进程号 -r 采样间隔秒数</code></li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token punctuation">[</span>root@iZbp1f96jelc5vbwqq8habZ ~<span class="token punctuation">]</span><span class="token comment"># free -m //MB单位显示</span></span>
<span class="line">              total        used        <span class="token function">free</span>      shared  buff/cache   available</span>
<span class="line">Mem:           <span class="token number">1826</span>        <span class="token number">1566</span>          <span class="token number">95</span>          <span class="token number">13</span>         <span class="token number">165</span>         <span class="token number">101</span></span>
<span class="line">Swap:             <span class="token number">0</span>           <span class="token number">0</span>           <span class="token number">0</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>硬盘：<code v-pre>df</code> 查看磁盘剩余</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token punctuation">[</span>root@iZbp1f96jelc5vbwqq8habZ ~<span class="token punctuation">]</span><span class="token comment"># df -h</span></span>
<span class="line">Filesystem      Size  Used Avail Use% Mounted on</span>
<span class="line">devtmpfs        899M     <span class="token number">0</span>  899M   <span class="token number">0</span>% /dev</span>
<span class="line">tmpfs           914M   60K  914M   <span class="token number">1</span>% /dev/shm</span>
<span class="line">tmpfs           914M  652K  913M   <span class="token number">1</span>% /run</span>
<span class="line">tmpfs           914M     <span class="token number">0</span>  914M   <span class="token number">0</span>% /sys/fs/cgroup</span>
<span class="line">/dev/vda1        40G  <span class="token number">7</span>.1G   33G  <span class="token number">18</span>% /</span>
<span class="line">tmpfs           183M     <span class="token number">0</span>  183M   <span class="token number">0</span>% /run/user/0</span>
<span class="line">overlay          40G  <span class="token number">7</span>.1G   33G  <span class="token number">18</span>% /var/lib/docker/overlay2/c35afb1b262c3b56af10b0ca667cbc2429f5dee881494ed34c185b7b80eece5f/merged</span>
<span class="line">shm              64M     <span class="token number">0</span>   64M   <span class="token number">0</span>% /var/lib/docker/containers/88b53c86c3bb7c1a22417ff2776b76ca18f49d102b88145febfaa274a7515f1c/mounts/shm</span>
<span class="line">overlay          40G  <span class="token number">7</span>.1G   33G  <span class="token number">18</span>% /var/lib/docker/overlay2/74673bee00adfa946eba8a2182fdaab921bb44d867885c318d265531db45a25f/merged</span>
<span class="line">shm              64M     <span class="token number">0</span>   64M   <span class="token number">0</span>% /var/lib/docker/containers/d216f33687c30c2412dfba04397b3c25289d7541b077ff6d374b7bda4e4120cb/mounts/shm</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>磁盘IO:<code v-pre>iostat</code>
<ul>
<li>
<p>rkB/s每秒读取数据量kB</p>
</li>
<li>
<p>wkB/s每秒写入数据量kB</p>
</li>
<li>
<p>svctm I/O 请求的平均服务时间，毫秒</p>
</li>
<li>
<p>await I/O 请求的平均等待时间，毫秒</p>
</li>
<li>
<p><strong>util 一秒钟有百分之几的时间用于IO操作，解决100%时，表示磁盘带宽跑满，需要优化程序或者增加磁盘</strong></p>
</li>
<li>
<p>svctm await的值很接近，说明几乎没有IO等待，磁盘性能好，如果await 远高于 svctm，表示IO队列等待过长，需要优化程序或者增加磁盘</p>
</li>
<li>
<p>查看额外 <code v-pre>pidstat -d 采样间隔秒数 -p 进程号</code></p>
</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token punctuation">[</span>root@iZbp1f96jelc5vbwqq8habZ ~<span class="token punctuation">]</span><span class="token comment"># iostat -xdk 2 3</span></span>
<span class="line">Linux <span class="token number">4.18</span>.0-193.28.1.el8_2.x86_64 <span class="token punctuation">(</span>iZbp1f96jelc5vbwqq8habZ<span class="token punctuation">)</span> 	08/19/2021 	_x86_64_	<span class="token punctuation">(</span><span class="token number">1</span> CPU<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">Device            r/s     w/s     rkB/s     wkB/s   rrqm/s   wrqm/s  %rrqm  %wrqm r_await w_await aqu-sz rareq-sz wareq-sz  svctm  %util</span>
<span class="line">vda              <span class="token number">0.80</span>    <span class="token number">0.66</span>     <span class="token number">28.41</span>      <span class="token number">7.51</span>     <span class="token number">0.00</span>     <span class="token number">0.08</span>   <span class="token number">0.13</span>  <span class="token number">10.70</span>    <span class="token number">3.16</span>    <span class="token number">1.84</span>   <span class="token number">0.00</span>    <span class="token number">35.43</span>    <span class="token number">11.32</span>   <span class="token number">0.45</span>   <span class="token number">0.07</span></span>
<span class="line"></span>
<span class="line">Device            r/s     w/s     rkB/s     wkB/s   rrqm/s   wrqm/s  %rrqm  %wrqm r_await w_await aqu-sz rareq-sz wareq-sz  svctm  %util</span>
<span class="line">vda              <span class="token number">0.00</span>    <span class="token number">0.50</span>      <span class="token number">0.00</span>      <span class="token number">5.97</span>     <span class="token number">0.00</span>     <span class="token number">0.00</span>   <span class="token number">0.00</span>   <span class="token number">0.00</span>    <span class="token number">0.00</span>    <span class="token number">1.00</span>   <span class="token number">0.00</span>     <span class="token number">0.00</span>    <span class="token number">12.00</span>   <span class="token number">1.00</span>   <span class="token number">0.05</span></span>
<span class="line"></span>
<span class="line">Device            r/s     w/s     rkB/s     wkB/s   rrqm/s   wrqm/s  %rrqm  %wrqm r_await w_await aqu-sz rareq-sz wareq-sz  svctm  %util</span>
<span class="line">vda              <span class="token number">0.00</span>    <span class="token number">1.00</span>      <span class="token number">0.00</span>     <span class="token number">13.25</span>     <span class="token number">0.00</span>     <span class="token number">0.00</span>   <span class="token number">0.00</span>   <span class="token number">0.00</span>    <span class="token number">0.00</span>    <span class="token number">1.00</span>   <span class="token number">0.00</span>     <span class="token number">0.00</span>    <span class="token number">13.25</span>   <span class="token number">1.00</span>   <span class="token number">0.10</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>网络IO:<code v-pre>ifstat</code>
<ul>
<li>默认本地没有，需要下载ifstat</li>
</ul>
</li>
</ul>
<h3 id="生产环境cpu占用过高的可能原因" tabindex="-1"><a class="header-anchor" href="#生产环境cpu占用过高的可能原因"><span>生产环境CPU占用过高的可能原因</span></a></h3>
<h4 id="需要结合jdk核linux一起排查" tabindex="-1"><a class="header-anchor" href="#需要结合jdk核linux一起排查"><span>需要结合JDK核Linux一起排查</span></a></h4>
<ul>
<li>1.先用top命令找出cpu占用最高的</li>
<li>2.ps -ef java 或者jps进一步定位，得知是一个什么后台程序获取进程号</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token punctuation">[</span>root@iZbp1f96jelc5vbwqq8habZ ~<span class="token punctuation">]</span><span class="token comment"># jps -l</span></span>
<span class="line"><span class="token number">3596983</span> sun.tools.jps.Jps</span>
<span class="line"><span class="token number">1326</span> /usr/lib/jenkins/jenkins.war</span>
<span class="line"><span class="token number">1806</span> gutley-0.0.1-SNAPSHOT.jar</span>
<span class="line"><span class="token number">79582</span> org.apache.rocketmq.namesrv.NamesrvStartup</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token punctuation">[</span>root@iZbp1f96jelc5vbwqq8habZ ~<span class="token punctuation">]</span><span class="token comment"># ps -ef|grep gutley|grep -v grep</span></span>
<span class="line">root        <span class="token number">1806</span>       <span class="token number">1</span>  <span class="token number">0</span> Feb25 ?        02:50:30 <span class="token function">java</span> <span class="token parameter variable">-jar</span> gutley-0.0.1-SNAPSHOT.jar <span class="token parameter variable">--server.port</span><span class="token operator">=</span><span class="token number">80</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>3.<strong>定位到具体线程或者代码</strong></p>
<ul>
<li><code v-pre>ps -mp 1806(jps查到的进程号) -o THREAD,tid,time</code>
<ul>
<li>找到cpu消耗最大的线程号</li>
</ul>
</li>
</ul>
</li>
<li>
<p>4.将需要的线程ID转换成16进制格式（英文小写格式）</p>
<ul>
<li><code v-pre>printf &quot;%x\n&quot; 线程号</code></li>
</ul>
</li>
<li>
<p>5.jstack进程ID|grep tid 16进制格式（英文小写格式）-A60</p>
<ul>
<li><code v-pre>jstack 180（进程号） |grep 717（打印出来的16进制线程ID） -A60 (打印前60行)</code></li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">jstack <span class="token number">1806</span> <span class="token operator">|</span><span class="token function">grep</span> <span class="token number">717</span> <span class="token parameter variable">-A60</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ul>
<h3 id="jdk自带的jmm监控和性能分析工具用法" tabindex="-1"><a class="header-anchor" href="#jdk自带的jmm监控和性能分析工具用法"><span>JDK自带的JMM监控和性能分析工具用法</span></a></h3>
<p>//todo</p>
</div></template>


