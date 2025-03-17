<template><div><h2 id="cas" tabindex="-1"><a class="header-anchor" href="#cas"><span>CAS</span></a></h2>
<h3 id="cas是什么" tabindex="-1"><a class="header-anchor" href="#cas是什么"><span>CAS是什么</span></a></h3>
<ul>
<li>Compare and Swap ，即比较再交换。</li>
<li>CAS是一种无锁算法，CAS有3个操作数，内存值V，旧的预期值A，要修改的新值B。当且仅当预期值A和内存值V相同时，将内存值V修改为B，否则什么都不做。</li>
</ul>
<h3 id="atomicinteger中的-public-final-boolean-compareandset-int-expect-int-update" tabindex="-1"><a class="header-anchor" href="#atomicinteger中的-public-final-boolean-compareandset-int-expect-int-update"><span>AtomicInteger中的   public final boolean compareAndSet(int expect, int update );</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">CASDemo</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token doc-comment comment">/**定义一个AtomicInteger = 5的数字**/</span></span>
<span class="line">        <span class="token class-name">AtomicInteger</span> integer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">AtomicInteger</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token doc-comment comment">/**预期是5，如果是则改为2020**/</span></span>
<span class="line">        <span class="token keyword">boolean</span> a <span class="token operator">=</span> integer<span class="token punctuation">.</span><span class="token function">compareAndSet</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">2020</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>integer<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">boolean</span> b <span class="token operator">=</span> integer<span class="token punctuation">.</span><span class="token function">compareAndSet</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">2021</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>b<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>integer<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">//结果就是a是ture,b是fasle,打印的数字为2020，第二次的比较与交换失败，不符合预期</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="cas原理" tabindex="-1"><a class="header-anchor" href="#cas原理"><span>CAS原理</span></a></h3>
<h4 id="自旋锁" tabindex="-1"><a class="header-anchor" href="#自旋锁"><span>自旋锁</span></a></h4>
<ul>
<li>Unsafe + CAS原理 = 自旋</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">package</span> <span class="token namespace">com<span class="token punctuation">.</span>test</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">TimeUnit</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span>atomic<span class="token punctuation">.</span></span><span class="token class-name">AtomicReference</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">SpinLock</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">//对象初始值null</span></span>
<span class="line">    <span class="token class-name">AtomicReference</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Thread</span><span class="token punctuation">></span></span> threadAtomicReference <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">AtomicReference</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">spinLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">Thread</span> thread <span class="token operator">=</span> <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>thread<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"\t come in"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token operator">!</span>threadAtomicReference<span class="token punctuation">.</span><span class="token function">compareAndSet</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">,</span> thread<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>thread<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"等待"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">spinUnLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">Thread</span> thread <span class="token operator">=</span> <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>thread<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"\t invoked Unlock"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        threadAtomicReference<span class="token punctuation">.</span><span class="token function">compareAndSet</span><span class="token punctuation">(</span>thread<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">SpinLock</span> spinLock <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SpinLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-></span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">                spinLock<span class="token punctuation">.</span><span class="token function">spinLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">MILLISECONDS</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span></span>
<span class="line">                spinLock<span class="token punctuation">.</span><span class="token function">spinUnLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">"aa"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-></span> <span class="token punctuation">{</span></span>
<span class="line">            spinLock<span class="token punctuation">.</span><span class="token function">spinLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            spinLock<span class="token punctuation">.</span><span class="token function">spinUnLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">"bb"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="unsafe类" tabindex="-1"><a class="header-anchor" href="#unsafe类"><span>Unsafe类</span></a></h4>
<ul>
<li>Unsafe是CAS的核心类，由于java无法直接访问底层系统，需要通过本地(native)方法来访问，Unsafe相当于一个后门，基于此类可以直接操作特定内存数据。其方法都是native修饰的。</li>
<li>Unsafe中的valueOffset,表示该变量在内存中的偏移地址，Unsafe就是根据内存偏移地址获取数据的。</li>
<li>变量value用volatile修饰， 保证了多线程内存可见性。</li>
<li>unsafe.getAndAddInt 方法：</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//拿AtomicInteger来理解Unsafe类</span></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line">*假设线程A、B同时执行getAndAddInt方法（跑在不同CPU上）</span>
<span class="line">*1.AtomicInteger里value原始为3，根据JMM模型，线程A、B同时保存一个值为3的副本在各自内存</span>
<span class="line">*2.线程A通过getIntVolatile拿到3的值，这时线程被挂起</span>
<span class="line">*3.线程B则完整执行完getAndAddInt方法，把值改为4</span>
<span class="line">*4.现存A恢复，在执行compareAndSwapInt方法比较，发现手里的3和主内存中的4不一致，本次修改失败，只能再次执行一编</span>
<span class="line">*5.线程A重新获取value值（valatile修饰），线程A看到value为4，则继续执行compareAndSwapInt方法比较，直至成功。</span>
<span class="line">*/</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token function">getAndAddInt</span><span class="token punctuation">(</span><span class="token class-name">Object</span> var1<span class="token punctuation">,</span> <span class="token keyword">long</span> var2<span class="token punctuation">,</span> <span class="token keyword">int</span> var4<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">int</span> var5<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">do</span> <span class="token punctuation">{</span></span>
<span class="line">            var5 <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getIntVolatile</span><span class="token punctuation">(</span>var1<span class="token punctuation">,</span> var2<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">while</span><span class="token punctuation">(</span><span class="token operator">!</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">compareAndSwapInt</span><span class="token punctuation">(</span>var1<span class="token punctuation">,</span> var2<span class="token punctuation">,</span> var5<span class="token punctuation">,</span> var5 <span class="token operator">+</span> var4<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">return</span> var5<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line">*getIntVolatile底层方法，var1原子类AtomicInteger本身，var2是该对象内存中的引用地址</span>
<span class="line">* 方法返回的是当前这个对象在内存中的真实值</span>
<span class="line">**/</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">native</span> <span class="token keyword">int</span> <span class="token function">getIntVolatile</span><span class="token punctuation">(</span><span class="token class-name">Object</span> var1<span class="token punctuation">,</span> <span class="token keyword">long</span> var2<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line">*compareAndSwapInt中var1原子类AtomicInteger本身，var2是该对象内存中的引用地址</span>
<span class="line">* var4是需要变动的数量，var5是通过var1 var2找出内存中的真实值</span>
<span class="line">**/</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token keyword">native</span> <span class="token keyword">boolean</span> <span class="token function">compareAndSwapInt</span><span class="token punctuation">(</span><span class="token class-name">Object</span> var1<span class="token punctuation">,</span> <span class="token keyword">long</span> var2<span class="token punctuation">,</span> <span class="token keyword">int</span> var4<span class="token punctuation">,</span> <span class="token keyword">int</span> var5<span class="token punctuation">)</span><span class="token punctuation">;</span>   </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>AtomicInteger类中getAndIncrement如何原子性自增</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token function">getAndIncrement</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> unsafe<span class="token punctuation">.</span><span class="token function">getAndAddInt</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> valueOffset<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="cas的缺点" tabindex="-1"><a class="header-anchor" href="#cas的缺点"><span>CAS的缺点</span></a></h3>
<ul>
<li>
<p>循环时间长，开销大（</p>
<ul>
<li>getAndAddInt 的do while有可能执行多次，加大CPU开销</li>
</ul>
</li>
<li>
<p>只能保证一个共享变量的原子操作</p>
<ul>
<li>对多个共享变量的操作，循环CAS无法保证原子性，需要加锁解决</li>
</ul>
</li>
<li>
<p>引出来ABA问题？</p>
</li>
</ul>
</div></template>


