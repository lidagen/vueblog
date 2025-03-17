<template><div><h2 id="volatile关键字" tabindex="-1"><a class="header-anchor" href="#volatile关键字"><span>volatile关键字</span></a></h2>
<h3 id="volatile主要作用是保证可见性以及有序性-原子性由锁保证" tabindex="-1"><a class="header-anchor" href="#volatile主要作用是保证可见性以及有序性-原子性由锁保证"><span>volatile主要作用是保证可见性以及有序性 （原子性由锁保证）</span></a></h3>
<h3 id="可见性" tabindex="-1"><a class="header-anchor" href="#可见性"><span>可见性</span></a></h3>
<ul>
<li>
<p>JMM | Java Memory Model</p>
<ul>
<li>java内存模型定义了线程和主线程直接的抽象关系，线程之间的共享变量存储在主内存中，每个线程都有一个私有的本地内存，本地内存存储了共享变量的副本</li>
<li>可能出现的可见性问题，即线程A修改了本地内存未及时刷新到主内存，从而导致其它线程使用的共享变量值不是最新的</li>
</ul>
</li>
<li>
<p>使用 volatile 修饰共享变量后，每个线程要操作变量时会从主内存中将变量拷贝到本地内存作为副本，当线程操作变量副本并写回主内存后，会通过<code v-pre> CPU 总线嗅探机制</code>告知其他线程该变量副本已经失效，需要重新从主内存中读取</p>
</li>
</ul>
<h3 id="有序性" tabindex="-1"><a class="header-anchor" href="#有序性"><span>有序性</span></a></h3>
<ul>
<li>禁止指令重排
<ul>
<li>什么是指令重排：处理器为了提高程序运行效率，可能会对代码进行优化，它可能在不改变执行结果的前提下修改程序中各个语句执行顺序（重排不会影响单线程的执行，但是可能影响并发执行的正确性）</li>
<li>多线程环境下线程交替执行，由于编译器优化，两个线程中使用的变量是否保证一致性是无法确定的，导致结果无法预测</li>
</ul>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//如果线程1 执行a方法先执行了语句2，线程2进来执行b方法时，拿到的a 还是0</span></span>
<span class="line">pubilc <span class="token keyword">class</span> <span class="token class-name">Demo</span><span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">int</span> a <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token keyword">boolean</span> flag <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">a</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">    a <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> <span class="token comment">//语句1</span></span>
<span class="line">    flag <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span> <span class="token comment">//语句2</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">b</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">if</span><span class="token punctuation">(</span>flag<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">      a <span class="token operator">=</span> a <span class="token operator">+</span> <span class="token number">5</span><span class="token punctuation">;</span><span class="token comment">//语句3</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


