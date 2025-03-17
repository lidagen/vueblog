<template><div><h2 id="executor-线程池" tabindex="-1"><a class="header-anchor" href="#executor-线程池"><span>Executor 线程池</span></a></h2>
<ul>
<li>线程池的主要作用是控制运行的线程数量，<strong>处理过程中将任务放入队列</strong>，然后在线程创建后启动这些任务，<strong>如果线程数量超出了设置的核心线程数则其它排队等候</strong></li>
<li>它的主要特点是：<strong>线程复用；控制最大并发数；管理线程</strong></li>
</ul>
<h3 id="executor-与-executors" tabindex="-1"><a class="header-anchor" href="#executor-与-executors"><span>Executor 与 Executors</span></a></h3>
<ul>
<li>Executor 是线程池的接口，主要实现类是ThreadPoolExecutor</li>
<li>Executors 是线程池的工具类，负责创建一些具体类型的线程池</li>
</ul>
<h3 id="executors-下的三个线程池" tabindex="-1"><a class="header-anchor" href="#executors-下的三个线程池"><span>Executors 下的三个线程池</span></a></h3>
<ul>
<li>Executors.newFixedThreadPool(int nThreads)
<ul>
<li>核心和最大线程数都等于设定的值LinkedBlockingQueue</li>
</ul>
</li>
<li>Executors.newSingleThreadExecutor()
<ul>
<li>单线程的线程池，核心最大都是1，队列LinkedBlockingQueue</li>
</ul>
</li>
<li>Executors.newCachedThreadPool()
<ul>
<li>核心数为0，最大线程Integer.MAX_VALUE,队列是 SynchronousQueue</li>
</ul>
</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>Executors 创建线程池方法一般不用，理由如下</p>
<ul>
<li>newFixedThreadPool 、newSingleThreadExecutor队列是LinkedBlockingQueue，队列接近无界，容易引起OOM</li>
<li>newCachedThreadPool、ScheduledThreadPool创建最大线程Integer.MAX_VALUE，可能会创建大量线程导致OOM</li>
</ul>
</div>
<h3 id="threadpoolexecutor-七大参数" tabindex="-1"><a class="header-anchor" href="#threadpoolexecutor-七大参数"><span>ThreadPoolExecutor 七大参数</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line">  <span class="token keyword">public</span> <span class="token class-name">ThreadPoolExecutor</span><span class="token punctuation">(</span><span class="token keyword">int</span> corePoolSize<span class="token punctuation">,</span></span>
<span class="line">                              <span class="token keyword">int</span> maximumPoolSize<span class="token punctuation">,</span></span>
<span class="line">                              <span class="token keyword">long</span> keepAliveTime<span class="token punctuation">,</span></span>
<span class="line">                              <span class="token class-name">TimeUnit</span> unit<span class="token punctuation">,</span></span>
<span class="line">                              <span class="token class-name">BlockingQueue</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Runnable</span><span class="token punctuation">></span></span> workQueue<span class="token punctuation">,</span></span>
<span class="line">                              <span class="token class-name">ThreadFactory</span> threadFactory<span class="token punctuation">,</span></span>
<span class="line">                              <span class="token class-name">RejectedExecutionHandler</span> handler<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>corePoolSize <span class="token operator">&lt;</span> <span class="token number">0</span> <span class="token operator">||</span></span>
<span class="line">            maximumPoolSize <span class="token operator">&lt;=</span> <span class="token number">0</span> <span class="token operator">||</span></span>
<span class="line">            maximumPoolSize <span class="token operator">&lt;</span> corePoolSize <span class="token operator">||</span></span>
<span class="line">            keepAliveTime <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">)</span></span>
<span class="line">            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">IllegalArgumentException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>workQueue <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">||</span> threadFactory <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">||</span> handler <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span></span>
<span class="line">            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">NullPointerException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>acc <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">getSecurityManager</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">?</span></span>
<span class="line">                <span class="token keyword">null</span> <span class="token operator">:</span></span>
<span class="line">                <span class="token class-name">AccessController</span><span class="token punctuation">.</span><span class="token function">getContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>corePoolSize <span class="token operator">=</span> corePoolSize<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>maximumPoolSize <span class="token operator">=</span> maximumPoolSize<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>workQueue <span class="token operator">=</span> workQueue<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>keepAliveTime <span class="token operator">=</span> unit<span class="token punctuation">.</span><span class="token function">toNanos</span><span class="token punctuation">(</span>keepAliveTime<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>threadFactory <span class="token operator">=</span> threadFactory<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>handler <span class="token operator">=</span> handler<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>核心线程数 corePoolSize</li>
<li>最大线程数 maximumPoolSize
<ul>
<li>值必须&gt;=1 且 maximumPoolSize = corePoolSize + 扩展的</li>
</ul>
</li>
<li>存活时间 keepAliveTime
<ul>
<li>当前线程数量超过corePoolSize，且空闲时间达到keepAliveTime，会销毁直到剩下corePoolSize个为止</li>
</ul>
</li>
<li>时间单位 unit</li>
<li>阻塞队列 workQueue</li>
<li>线程工厂 threadFactory
<ul>
<li>一般默认即可</li>
</ul>
</li>
<li>拒绝策略 handler
<ul>
<li>当队列满了且最大线程数也扩展了，进来的线程如何处理的策略</li>
</ul>
</li>
</ul>
<h4 id="线程池工作原理" tabindex="-1"><a class="header-anchor" href="#线程池工作原理"><span>线程池工作原理</span></a></h4>
<ul>
<li>线程进来，进入核心线程数执行，如果核心线程数满了以后，放入阻塞队列中等待，阻塞队列满了以后，扩展最大线程数。</li>
<li>如果最大线程数扩展满了以后，阻塞队列也满了，这时候要执行拒绝策略</li>
<li>如果线程数降下来了，超过keepAliveTime的闲置线程会被回收，直到线程数回到核心线程数</li>
</ul>
<h4 id="四种拒绝策略" tabindex="-1"><a class="header-anchor" href="#四种拒绝策略"><span>四种拒绝策略</span></a></h4>
<ul>
<li>AbortPolicy(默认): 直接抛出RejectedExecutionException异常阻止系统正常运行</li>
<li>CallerRunsPolicy:&quot;调用者运行&quot;一种调节机制，该策略不会抛弃任务，也不会抛出异常，而是将某些任务回退到调用者，从而降低新的任务流量
<ul>
<li>简单理解就是，如果是main线程开启线程池，则做不完的线程回退给main线程让其执行</li>
</ul>
</li>
<li>DiscardOldestPolicy:抛弃队列中等待最久的任务，把当前任务加入队列中常识再次提交当前任务</li>
<li>DiscardPolicy:直接丢弃任务，不予任何处理也不提示异常。</li>
</ul>
<h4 id="线程数如何合理设定" tabindex="-1"><a class="header-anchor" href="#线程数如何合理设定"><span>线程数如何合理设定</span></a></h4>
<ul>
<li>CPU 密集型
<ul>
<li>CPU密集型的任务需要大量运算，而没有阻塞，CPU一直全速运行。</li>
<li>CPU密集型一般任务配置尽可能少的线程数，线程数 = CPU核数+1</li>
</ul>
</li>
<li>IO  密集型
<ul>
<li>IO密集型的任务并不一定一直在执行任务，应配置尽可能的多
<ul>
<li>
<ol>
<li>线程数 = CPU核数 * 2</li>
</ol>
</li>
<li>
<ol start="2">
<li>线程数 = CPU核数/1-阻塞系数 （阻塞系数0.8~0.9之间）</li>
</ol>
</li>
</ul>
</li>
</ul>
</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>Runtime.getRuntime().availableProcessors() //查看核数</p>
</div>
</div></template>


