<template><div><h2 id="线程安全的集合类" tabindex="-1"><a class="header-anchor" href="#线程安全的集合类"><span>线程安全的集合类</span></a></h2>
<h3 id="写时复制-copyonwritearraylist" tabindex="-1"><a class="header-anchor" href="#写时复制-copyonwritearraylist"><span>写时复制 CopyOnWriteArrayList</span></a></h3>
<ul>
<li>
<p>多线程下，普通的List不满足线程安全的需要，可能会抛出<code v-pre>ConcurrentModificationException</code>异常，通常情况下有三种解决方案</p>
<ul>
<li>Vector 线程安全的集合（效率低）</li>
<li>Collections.synchronizedList(new ArrayList&lt;&gt;()) 工具类</li>
<li>CopyOnWriteArrayList JUC下的线程安全类</li>
</ul>
</li>
<li>
<p>CopyOnWriteArrayList核心思想是读写分离</p>
<ul>
<li>在做写时加锁，不直接往当前容器Object[]添加，而是对容器进行copy +1,把新元素放入copy的新容器中，添加完元素原容器的引用指向新的容器。而其读是无锁的，性能高。</li>
<li>缺点是：每次写入都有copy一份容器，数据量大时，对内存压力较大。2 可能无法保持实时性，Vector读写都加锁，而CopyOnWriteArrayList读写作用在新老容器上，并发时可能读不到最新数据</li>
</ul>
</li>
<li>
<p>CopyOnWriteArrayList Add()方法</p>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line">    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token class-name">E</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">final</span> <span class="token class-name">ReentrantLock</span> lock <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>lock<span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">//上锁</span></span>
<span class="line">        lock<span class="token punctuation">.</span><span class="token function">lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token comment">//获取原有数组</span></span>
<span class="line">            <span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span> elements <span class="token operator">=</span> <span class="token function">getArray</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">int</span> len <span class="token operator">=</span> elements<span class="token punctuation">.</span>length<span class="token punctuation">;</span></span>
<span class="line">            <span class="token comment">//复制一份+1</span></span>
<span class="line">            <span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span> newElements <span class="token operator">=</span> <span class="token class-name">Arrays</span><span class="token punctuation">.</span><span class="token function">copyOf</span><span class="token punctuation">(</span>elements<span class="token punctuation">,</span> len <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            newElements<span class="token punctuation">[</span>len<span class="token punctuation">]</span> <span class="token operator">=</span> e<span class="token punctuation">;</span></span>
<span class="line">            <span class="token comment">//设置新的array为+1的</span></span>
<span class="line">            <span class="token function">setArray</span><span class="token punctuation">(</span>newElements<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span></span>
<span class="line">            lock<span class="token punctuation">.</span><span class="token function">unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="concurrenthashmap" tabindex="-1"><a class="header-anchor" href="#concurrenthashmap"><span>ConcurrentHashMap</span></a></h3>
<ul>
<li>线程安全的map同样可以使用
<ul>
<li>HashTable 读写都用synchronized，效率低下</li>
<li>ConcurrentHashMap 使用了锁分离技术，多个锁控制对hash表的不同部分进行的修改</li>
</ul>
</li>
<li>ConcurrentHashMap 中对map进行了分段Segment，每个Segment本身相当一个HashMap对象，<strong>同一Segment只有写写互斥，读读是不互斥的，不同Segment不互斥</strong></li>
</ul>
</div></template>


