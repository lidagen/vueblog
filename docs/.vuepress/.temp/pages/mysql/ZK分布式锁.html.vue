<template><div><h2 id="分布式锁三-zk分布式锁" tabindex="-1"><a class="header-anchor" href="#分布式锁三-zk分布式锁"><span>分布式锁三 ZK分布式锁</span></a></h2>
<h3 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h3>
<p>基于zookeeper临时有序节点可以实现的分布式锁,大致思想即为：每个客户端对某个方法加锁时，在zookeeper上的与该方法对应的指定节点的目录下，生成一个唯一的瞬时有序节点。 判断是否获取锁的方式很简单，只需要判断有序节点中序号最小的一个。 当释放锁的时候，只需将这个瞬时节点删除即可。</p>
<h3 id="zk排他锁" tabindex="-1"><a class="header-anchor" href="#zk排他锁"><span>ZK排他锁</span></a></h3>
<p>排他锁的核心是如何保证当前有且仅有一个事务获得锁，并且锁被释放后，所有正在等待获取锁的事务都能够被通知到.</p>
<h4 id="获取锁" tabindex="-1"><a class="header-anchor" href="#获取锁"><span>获取锁</span></a></h4>
<ul>
<li>ZooKeeper 是通过创建数据节点（ZNode）来表示一个锁。假设我们有一个<code v-pre>/exclusive_lock</code>临时节点，在需要创建排他锁时，所有的客户端都会试图调用create()接口在<code v-pre>/exclusive_lock</code>下创建一个临时节点<code v-pre>/lock</code>。zk会保证在所有的客户端中，最终只有一个能成功创建，那么就可以认为该客户端获取了锁。同时，所有没有获取到锁的客户端就需要在<code v-pre>/exclusive_lock</code>节点上创建一个Watcher监听，以便随时监听到<code v-pre>/lock</code>节点变更情况。</li>
</ul>
<h4 id="释放锁" tabindex="-1"><a class="header-anchor" href="#释放锁"><span>释放锁</span></a></h4>
<ul>
<li>
<p>在定义锁的时候，我们提到了<code v-pre>/exclusive_lock</code>是一个临时节点，因此在两种情况下，可能释放锁</p>
<ul>
<li>当前获取锁的客户端机器宕机，那么ZooKeeper上的这个临时节点就会被移除</li>
<li>正常执行完业务逻辑后，客户端就会主动将自己创建的临时节点删除</li>
</ul>
</li>
<li>
<p>无论哪种情况移除了<code v-pre>/lock</code>节点，zk都会通知所有在<code v-pre>/exclusive_lock</code>节点上注册了子节点变更Watcher监听的客户端。这些客户端在接收到通知后，再次重新发起分布式锁获取，即重复“获取锁”过程</p>
</li>
</ul>
<h3 id="zk共享锁" tabindex="-1"><a class="header-anchor" href="#zk共享锁"><span>ZK共享锁</span></a></h3>
<p>同排他锁一样，同样是通过ZooKeeper上的数据节点来表示一个锁，是一个类似于/shared_lock/[Hostname]-请求类型-序号的临时顺序节点，如：
/shared_lock/192.168.0.1-R-00000001，那么 这个节点就代表了一个共享锁.(R-读 W-写)</p>
<h4 id="获取锁-1" tabindex="-1"><a class="header-anchor" href="#获取锁-1"><span>获取锁</span></a></h4>
<ul>
<li>在需要获取共享锁时，所有客户端都会到/shared_lock这个节点下面创建一个临时顺序节点，如果当前是读请求，那么就创建例如 /shared_lock/192.168.0.1-R-00000001的节点。如果是写请求，那么就创建例如 /shared_lock/192.168.0.1-W-00000001的节点。</li>
</ul>
<h5 id="判断读写顺序" tabindex="-1"><a class="header-anchor" href="#判断读写顺序"><span>判断读写顺序</span></a></h5>
<ul>
<li>根据共享锁的定义，不同的事务都可以同时对同一个数据对象进行读操作，而更新操作必须在当前没有任何事务读写操作的情况下进行。基于这个原则来通过ZooKeeper的节点来确定分布式读写顺序，大概可以分为如下4个步骤：
<ul>
<li>
<p>创建完节点后，获取/shared_lock节点下的所有子节点，并对该节点注册了子节点变更的Wathcher监听</p>
</li>
<li>
<p>确定自己的节点序号在所有子节点中的顺序</p>
</li>
<li>
<p><strong>对于读请求：</strong> 如果没有比自己序号小的子节点，或是所有比自己序号小的子节点都是读请求，那么表明 自己已经成功获取到了共享锁，同时开始执行读取逻辑；如果比自己序号小的子节点中有写请求，那么就需要进入等待；
<strong>对于写请求：</strong> 如果自己不是序号最小的子节点，那么就需要进入等待。</p>
</li>
<li>
<p>接收到Watcher的通知后，重复步骤1。</p>
</li>
</ul>
</li>
</ul>
<h4 id="释放锁-1" tabindex="-1"><a class="header-anchor" href="#释放锁-1"><span>释放锁</span></a></h4>
<ul>
<li>释放锁的逻辑和排他锁是一致.</li>
</ul>
<h3 id="实现思路" tabindex="-1"><a class="header-anchor" href="#实现思路"><span>实现思路</span></a></h3>
<ul>
<li>
<p>zookeeper 可以根据有序节点+watch实现，实现思路：</p>
<ul>
<li>为每个线程生成一个有序的临时节点，为确保有序性，在排序一次全部节点，获取全部节点，每个线程判断自己是否最小，如果是的话，获得锁，执行操作，操作完删除自身节点。如果不是第一个的节点则监听它的前一个节点，当它的前一个节点被删除时，则它会获得锁，以此类推。</li>
</ul>
</li>
<li>
<p>由于自己实现麻烦，且apache提供了zk开源客户端Curator包解决此方案。Curator框架在zookeeper原生API接口上进行了包装，解决了很多ZooKeeper客户端非常底层的细节开发。提供ZooKeeper各种应用场景(recipe， 比如：分布式锁服务、集群领导选举、共享计数器、缓存机制、分布式队列等)的抽象封装，实现了Fluent风格的API接口,是最好用，最流行的zookeeper的客户端。</p>
</li>
</ul>
<h3 id="代码片段" tabindex="-1"><a class="header-anchor" href="#代码片段"><span>代码片段</span></a></h3>
<ul>
<li>引入依赖</li>
</ul>
<div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.apache.curator<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>curator-recipes<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">></span></span>4.0.1<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>exclusions</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>exclusion</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.apache.zookeeper<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>zookeeper<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>exclusion</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>exclusions</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line"><span class="token comment">&lt;!-- curator中有zookeeper依赖，排除掉，引用版本和下载的客户端版本一致的jar --></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.apache.zookeeper<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>zookeeper<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">></span></span>3.4.14<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>DistributedRedisLock 类</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DistributedRedisLock</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Logger</span> log <span class="token operator">=</span> <span class="token class-name">LoggerFactory</span><span class="token punctuation">.</span><span class="token function">getLogger</span><span class="token punctuation">(</span><span class="token class-name">DistributedRedisLock</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 可重入排它锁</span>
<span class="line">     **/</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">InterProcessMutex</span> interProcessMutex<span class="token punctuation">;</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 竞争资源标志</span>
<span class="line">     **/</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> lockName<span class="token punctuation">;</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 根节点</span>
<span class="line">     **/</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> root <span class="token operator">=</span> <span class="token string">"/distributed/lock/"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">CuratorFramework</span> curatorFramework<span class="token punctuation">;</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 多ZK_URL 逗号分隔</span>
<span class="line">     **/</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">String</span> <span class="token constant">ZK_URL</span> <span class="token operator">=</span> <span class="token string">"127.0.0.1:2181"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">static</span> <span class="token punctuation">{</span></span>
<span class="line">        curatorFramework <span class="token operator">=</span> <span class="token class-name">CuratorFrameworkFactory</span><span class="token punctuation">.</span><span class="token function">newClient</span><span class="token punctuation">(</span><span class="token constant">ZK_URL</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">ExponentialBackoffRetry</span><span class="token punctuation">(</span><span class="token number">3000</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        curatorFramework<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 实例化</span>
<span class="line">     *</span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">lockName</span></span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">DistributedRedisLock</span><span class="token punctuation">(</span><span class="token class-name">String</span> lockName<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">this</span><span class="token punctuation">.</span>lockName <span class="token operator">=</span> lockName<span class="token punctuation">;</span></span>
<span class="line">            interProcessMutex <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">InterProcessMutex</span><span class="token punctuation">(</span>curatorFramework<span class="token punctuation">,</span> root <span class="token operator">+</span> lockName<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Exception</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            log<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">"initial InterProcessMutex exception="</span> <span class="token operator">+</span> e<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 获取锁</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">acquire</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">int</span> flag <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token comment">//重试2次，每次最大等待2s，也就是最大等待4s</span></span>
<span class="line">            <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token operator">!</span>interProcessMutex<span class="token punctuation">.</span><span class="token function">acquire</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">SECONDS</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                flag<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token keyword">if</span> <span class="token punctuation">(</span>flag <span class="token operator">></span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>  <span class="token comment">//重试两次</span></span>
<span class="line">                    <span class="token keyword">break</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Exception</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            log<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">"distributed lock acquire exception="</span> <span class="token operator">+</span> e<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>flag <span class="token operator">></span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            log<span class="token punctuation">.</span><span class="token function">debug</span><span class="token punctuation">(</span><span class="token string">"Thread:"</span> <span class="token operator">+</span> <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getId</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">" acquire distributed lock  busy"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">return</span> <span class="token class-name">Boolean</span><span class="token punctuation">.</span><span class="token constant">FALSE</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">            log<span class="token punctuation">.</span><span class="token function">debug</span><span class="token punctuation">(</span><span class="token string">"Thread:"</span> <span class="token operator">+</span> <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getId</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">" acquire distributed lock  success"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">return</span> <span class="token class-name">Boolean</span><span class="token punctuation">.</span><span class="token constant">TRUE</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 释放锁</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">release</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>interProcessMutex <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> interProcessMutex<span class="token punctuation">.</span><span class="token function">isAcquiredInThisProcess</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                interProcessMutex<span class="token punctuation">.</span><span class="token function">release</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                curatorFramework<span class="token punctuation">.</span><span class="token function">delete</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">inBackground</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forPath</span><span class="token punctuation">(</span>root <span class="token operator">+</span> lockName<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                log<span class="token punctuation">.</span><span class="token function">debug</span><span class="token punctuation">(</span><span class="token string">"Thread:"</span> <span class="token operator">+</span> <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getId</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">" release distributed lock  success"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Exception</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            log<span class="token punctuation">.</span><span class="token function">debug</span><span class="token punctuation">(</span><span class="token string">"Thread:"</span> <span class="token operator">+</span> <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getId</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">" release distributed lock  exception="</span> <span class="token operator">+</span> e<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>ZkLockTemplate 类和之前类似</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ZkLockTemplateImpl</span> <span class="token keyword">implements</span> <span class="token class-name">ZkLockTemplate</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">Logger</span> <span class="token constant">LOG</span> <span class="token operator">=</span> <span class="token class-name">LoggerFactory</span><span class="token punctuation">.</span><span class="token function">getLogger</span><span class="token punctuation">(</span><span class="token class-name">ZkLockTemplateImpl</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span> <span class="token class-name">T</span> <span class="token function">execute</span><span class="token punctuation">(</span><span class="token class-name">String</span> lockName<span class="token punctuation">,</span> <span class="token class-name">CallBack</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span> callBack<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">DistributedRedisLock</span> lock <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">DistributedRedisLock</span><span class="token punctuation">(</span>lockName<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">boolean</span> acquire <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">             acquire <span class="token operator">=</span> lock<span class="token punctuation">.</span><span class="token function">acquire</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>acquire<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">                <span class="token constant">LOG</span><span class="token punctuation">.</span><span class="token function">debug</span><span class="token punctuation">(</span><span class="token string">"ZkLockTemplateImpl,获取到锁"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token keyword">return</span> callBack<span class="token punctuation">.</span><span class="token function">invoke</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">            <span class="token constant">LOG</span><span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">"ZkLockTemplateImpl,未获取到锁"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">AppException</span><span class="token punctuation">(</span><span class="token string">"1011"</span><span class="token punctuation">,</span> lockName <span class="token operator">+</span> <span class="token string">"业务正在处理中"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>acquire<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                lock<span class="token punctuation">.</span><span class="token function">release</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="测试" tabindex="-1"><a class="header-anchor" href="#测试"><span>测试</span></a></h3>
<ul>
<li>先来一个不加分布式锁的模拟</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DemoTest</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">say</span><span class="token punctuation">(</span><span class="token class-name">CountDownLatch</span> down<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">            down<span class="token punctuation">.</span><span class="token function">await</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token class-name">SimpleDateFormat</span> sdf <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SimpleDateFormat</span><span class="token punctuation">(</span><span class="token string">"HH:mm:ss|SSS"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">String</span> orderNo <span class="token operator">=</span> sdf<span class="token punctuation">.</span><span class="token function">format</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"生成的订单号是："</span> <span class="token operator">+</span> orderNo<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">CountDownLatch</span> down <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">CountDownLatch</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">10</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">-></span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token class-name">DemoTest</span><span class="token punctuation">.</span><span class="token function">say</span><span class="token punctuation">(</span>down<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        down<span class="token punctuation">.</span><span class="token function">countDown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>结果：</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">生成的订单号是：19:39:41|168</span>
<span class="line">生成的订单号是：19:39:41|169</span>
<span class="line">生成的订单号是：19:39:41|168</span>
<span class="line">生成的订单号是：19:39:41|168</span>
<span class="line">生成的订单号是：19:39:41|169</span>
<span class="line">生成的订单号是：19:39:41|168</span>
<span class="line">生成的订单号是：19:39:41|169</span>
<span class="line">生成的订单号是：19:39:41|170</span>
<span class="line">生成的订单号是：19:39:41|170</span>
<span class="line">生成的订单号是：19:39:41|170</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看出时间是会乱的</p>
<ul>
<li>zk分布式锁改造版本</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DemoTest</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">say</span><span class="token punctuation">(</span><span class="token class-name">CountDownLatch</span> down<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">            down<span class="token punctuation">.</span><span class="token function">await</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token class-name">SimpleDateFormat</span> sdf <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SimpleDateFormat</span><span class="token punctuation">(</span><span class="token string">"HH:mm:ss|SSS"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">String</span> orderNo <span class="token operator">=</span> sdf<span class="token punctuation">.</span><span class="token function">format</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"生成的订单号是："</span> <span class="token operator">+</span> orderNo<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">ZkLockTemplate</span> template <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ZkLockTemplateImpl</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">CountDownLatch</span> down <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">CountDownLatch</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">10</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">-></span> <span class="token punctuation">{</span></span>
<span class="line">                template<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span><span class="token string">"createOrder"</span><span class="token punctuation">,</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">-></span><span class="token punctuation">{</span></span>
<span class="line">                    <span class="token class-name">DemoTest</span><span class="token punctuation">.</span><span class="token function">say</span><span class="token punctuation">(</span>down<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        down<span class="token punctuation">.</span><span class="token function">countDown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>结果：</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">生成的订单号是：19:42:13|592</span>
<span class="line">生成的订单号是：19:42:13|655</span>
<span class="line">生成的订单号是：19:42:13|670</span>
<span class="line">生成的订单号是：19:42:13|670</span>
<span class="line">生成的订单号是：19:42:13|686</span>
<span class="line">生成的订单号是：19:42:13|702</span>
<span class="line">生成的订单号是：19:42:13|717</span>
<span class="line">生成的订单号是：19:42:13|717</span>
<span class="line">生成的订单号是：19:42:13|733</span>
<span class="line">生成的订单号是：19:42:13|733</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>改造后的打印按照时间顺序打印</p>
</div></template>


