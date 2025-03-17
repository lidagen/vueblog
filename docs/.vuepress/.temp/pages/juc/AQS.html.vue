<template><div><h2 id="aqs" tabindex="-1"><a class="header-anchor" href="#aqs"><span>AQS</span></a></h2>
<ul>
<li>AbstractQueuedSynchronizer 抽象队列同步器，用来构建锁或者其它同步器组件的<strong>重量级基础框架及整个JUC体系的基石</strong>，通过内置的FIFO队列来完成资源获取线程的排队工作，并通过一个int类型变量state表示持有锁的状态。</li>
</ul>
<h3 id="aqs为什么是juc的基石" tabindex="-1"><a class="header-anchor" href="#aqs为什么是juc的基石"><span>AQS为什么是JUC的基石</span></a></h3>
<ul>
<li>ReentranLock|CountDownLatch|Semaphore|ReentranReadWirteLock等都与AQS相关</li>
<li>锁与同步器的关系
<ul>
<li>锁 ： 面向锁的<strong>使用者</strong>，定义了程序员与锁教会的使用层API</li>
<li>同步器：面向锁的<strong>实现者</strong>，简化了锁实现，屏蔽了同步状态管理、阻塞线程排队和通知、唤醒机制等</li>
</ul>
</li>
</ul>
<h3 id="aqs源码体系" tabindex="-1"><a class="header-anchor" href="#aqs源码体系"><span>AQS源码体系</span></a></h3>
<ul>
<li>AQS使用一个volatile的int类型成员变量来表示同步状态，通过内置的FIFO队列完成资源获取的排队工作，将每条要去抢占资源的线程封装成一个Node节点实现锁的分配，通过CAS完成对state值的修改。</li>
</ul>
<h3 id="由reentrantlock解析aqs源码" tabindex="-1"><a class="header-anchor" href="#由reentrantlock解析aqs源码"><span>由ReentrantLock解析AQS源码</span></a></h3>
<img :src="$withBase('/juc/lock.png')" alt="dock">
<ul>
<li>加锁过程，分为三步
<ul>
<li>尝试加锁</li>
<li>加锁失败，线程进入队列</li>
<li>线程进入队列，进入阻塞状态</li>
</ul>
</li>
</ul>
<h3 id="lock-方法" tabindex="-1"><a class="header-anchor" href="#lock-方法"><span>lock()方法</span></a></h3>
<ul>
<li>假设一个场景，三个线程A\B\C获取资源，此时A占用了锁</li>
<li>此时B线程进入lock方法</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**非公平锁实现，CAS判断AQS中state是不是0，即是否被占用</span>
<span class="line">*如果CAS为true,调用AQS的setExclusiveOwnerThread，设置占用窗口的锁</span>
<span class="line">*如果false,调用acquire()方法，由于是B线程进入，走acquire方法</span>
<span class="line">**/</span></span>
<span class="line"> <span class="token keyword">final</span> <span class="token keyword">void</span> <span class="token function">lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">compareAndSetState</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token function">setExclusiveOwnerThread</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">else</span></span>
<span class="line">        <span class="token function">acquire</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="acquire-尝试获取锁" tabindex="-1"><a class="header-anchor" href="#acquire-尝试获取锁"><span>acquire() 尝试获取锁</span></a></h4>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"> <span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token keyword">void</span> <span class="token function">acquire</span><span class="token punctuation">(</span><span class="token keyword">int</span> arg<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">tryAcquire</span><span class="token punctuation">(</span>arg<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">        <span class="token function">acquireQueued</span><span class="token punctuation">(</span><span class="token function">addWaiter</span><span class="token punctuation">(</span><span class="token class-name">Node</span><span class="token punctuation">.</span><span class="token constant">EXCLUSIVE</span><span class="token punctuation">)</span><span class="token punctuation">,</span> arg<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token function">selfInterrupt</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token doc-comment comment">/** acquire 【尝试获取锁方法】中的tryAcquire实现，nonfairTryAcquire方法</span>
<span class="line">*tryAcquire是AQS父类定义方法，有公平锁和非公平锁实现，看非公平代码</span>
<span class="line">*先判断当前getState是否是0，即锁是否有占用，按假设此时A线程占用，判断不进入</span>
<span class="line">*判断当前线程是否等于占用窗口的线程，也不进入，总体返回false</span>
<span class="line">* 则取反 !tryAcquire(arg)是true</span>
<span class="line">*   - 如果此时A线程释放了锁，B线程进入nonfairTryAcquire，获取到了c == 0,则设置state =1 ,并设置了占用窗口的线程</span>
<span class="line">   - 还有一种情况，A线程重入，则nonfairTryAcquire走current == getExclusiveOwnerThread()，这种情况下state > 1 </span>
<span class="line">*/</span></span>
<span class="line"> <span class="token keyword">final</span> <span class="token keyword">boolean</span> <span class="token function">nonfairTryAcquire</span><span class="token punctuation">(</span><span class="token keyword">int</span> acquires<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">final</span> <span class="token class-name">Thread</span> current <span class="token operator">=</span> <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">int</span> c <span class="token operator">=</span> <span class="token function">getState</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">//A线程放锁</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>c <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">compareAndSetState</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> acquires<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token function">setExclusiveOwnerThread</span><span class="token punctuation">(</span>current<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token comment">//A线程重入</span></span>
<span class="line">    <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>current <span class="token operator">==</span> <span class="token function">getExclusiveOwnerThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">int</span> nextc <span class="token operator">=</span> c <span class="token operator">+</span> acquires<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>nextc <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token comment">// overflow</span></span>
<span class="line">            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">"Maximum lock count exceeded"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token function">setState</span><span class="token punctuation">(</span>nextc<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token doc-comment comment">/**addWaiter 【尝试获取锁未成功，就要使用该方法将其加入同步队列尾部】</span>
<span class="line">*该方法入参Node.EXCLUSIVE，即下一个等候的线程，</span>
<span class="line">*B线程进入由于还没有新建队列，tail为null</span>
<span class="line">*B线程进入enq方法</span>
<span class="line">*/</span></span>
<span class="line"> <span class="token keyword">private</span> <span class="token class-name">Node</span> <span class="token function">addWaiter</span><span class="token punctuation">(</span><span class="token class-name">Node</span> mode<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token class-name">Node</span> node <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Node</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> mode<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">// 尾节点</span></span>
<span class="line">    <span class="token class-name">Node</span> pred <span class="token operator">=</span> tail<span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">//后续C线程进入不进入此方法</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>pred <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        node<span class="token punctuation">.</span>prev <span class="token operator">=</span> pred<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">compareAndSetTail</span><span class="token punctuation">(</span>pred<span class="token punctuation">,</span> node<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            pred<span class="token punctuation">.</span>next <span class="token operator">=</span> node<span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">return</span> node<span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token function">enq</span><span class="token punctuation">(</span>node<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> node<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"><span class="token doc-comment comment">/**enq 入队方法</span>
<span class="line">*t == null 初始化一个空Node伪节点，首尾相等</span>
<span class="line">*第二个节点才保持进入的B线程，入队</span>
<span class="line">*C 线程进入了，直接走else方法</span>
<span class="line">*/</span></span>
<span class="line"> <span class="token keyword">private</span> <span class="token class-name">Node</span> <span class="token function">enq</span><span class="token punctuation">(</span><span class="token keyword">final</span> <span class="token class-name">Node</span> node<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token punctuation">;</span><span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">Node</span> t <span class="token operator">=</span> tail<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>t <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> </span>
<span class="line">            <span class="token comment">//初始化，new 一个空的Node节点</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">compareAndSetHead</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Node</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">                tail <span class="token operator">=</span> head<span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">            node<span class="token punctuation">.</span>prev <span class="token operator">=</span> t<span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">compareAndSetTail</span><span class="token punctuation">(</span>t<span class="token punctuation">,</span> node<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                t<span class="token punctuation">.</span>next <span class="token operator">=</span> node<span class="token punctuation">;</span></span>
<span class="line">                <span class="token keyword">return</span> t<span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="acquirequeued-方法" tabindex="-1"><a class="header-anchor" href="#acquirequeued-方法"><span>acquireQueued() 方法</span></a></h4>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/** acquireQueued【一旦加入同步队列，就需要使用该方法，自旋阻塞唤醒来不断的尝试获取锁，直到被中断或获取到锁】</span>
<span class="line">*此时入参进入的是B节点</span>
<span class="line">*假设B线程尝试获取锁失败 进入shouldParkAfterFailedAcquire 、parkAndCheckInterrupt方法</span>
<span class="line">*shouldParkAfterFailedAcquire 如果前驱节点的waitStatus是SIGNAL状态，返回true，则会走 parkAndCheckInterrupt方法</span>
<span class="line">*parkAndCheckInterrupt 调用  LockSupport.park(this); B线程被挂起，进入了候客区，等待uppark调用</span>
<span class="line">*/</span></span>
<span class="line"><span class="token keyword">final</span> <span class="token keyword">boolean</span> <span class="token function">acquireQueued</span><span class="token punctuation">(</span><span class="token keyword">final</span> <span class="token class-name">Node</span> node<span class="token punctuation">,</span> <span class="token keyword">int</span> arg<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">//取消排队标记</span></span>
<span class="line">    <span class="token keyword">boolean</span> failed <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">boolean</span> interrupted <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">//自旋</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token punctuation">;</span><span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token comment">//p是队列第一个节点，哨兵节点</span></span>
<span class="line">            <span class="token keyword">final</span> <span class="token class-name">Node</span> p <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token function">predecessor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token comment">//p是哨兵节点，再尝试获取锁</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>p <span class="token operator">==</span> head <span class="token operator">&amp;&amp;</span> <span class="token function">tryAcquire</span><span class="token punctuation">(</span>arg<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token function">setHead</span><span class="token punctuation">(</span>node<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                p<span class="token punctuation">.</span>next <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// help GC</span></span>
<span class="line">                failed <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token keyword">return</span> interrupted<span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">shouldParkAfterFailedAcquire</span><span class="token punctuation">(</span>p<span class="token punctuation">,</span> node<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">                <span class="token function">parkAndCheckInterrupt</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">                interrupted <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>failed<span class="token punctuation">)</span></span>
<span class="line">            <span class="token function">cancelAcquire</span><span class="token punctuation">(</span>node<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="unlock-方法" tabindex="-1"><a class="header-anchor" href="#unlock-方法"><span>unlock()方法</span></a></h3>
<p>+解锁调用realese方法</p>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token keyword">boolean</span> <span class="token function">release</span><span class="token punctuation">(</span><span class="token keyword">int</span> arg<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">tryRelease</span><span class="token punctuation">(</span>arg<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">//获取头节点</span></span>
<span class="line">        <span class="token class-name">Node</span> h <span class="token operator">=</span> head<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>h <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> h<span class="token punctuation">.</span>waitStatus <span class="token operator">!=</span> <span class="token number">0</span><span class="token punctuation">)</span></span>
<span class="line">            <span class="token comment">//解锁唤醒其它线程LockSupport.unpark(s.thread);</span></span>
<span class="line">            <span class="token function">unparkSuccessor</span><span class="token punctuation">(</span>h<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line">*此方法把state设置为0</span>
<span class="line">* setExclusiveOwnerThread = null</span>
<span class="line">* 返回true,表示解锁成功</span>
<span class="line">*/</span></span>
<span class="line"><span class="token keyword">protected</span> <span class="token keyword">final</span> <span class="token keyword">boolean</span> <span class="token function">tryRelease</span><span class="token punctuation">(</span><span class="token keyword">int</span> releases<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">//入参releases = 1 ，如果没有重入的话，此时c =0</span></span>
<span class="line">    <span class="token keyword">int</span> c <span class="token operator">=</span> <span class="token function">getState</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-</span> releases<span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">//判断当前线程就是拿锁的哪个</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token function">getExclusiveOwnerThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">IllegalMonitorStateException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">boolean</span> free <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>c <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        free <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token function">setExclusiveOwnerThread</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token function">setState</span><span class="token punctuation">(</span>c<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> free<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


