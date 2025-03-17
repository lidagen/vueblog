<template><div><h2 id="设计模式之单例模式——singleton" tabindex="-1"><a class="header-anchor" href="#设计模式之单例模式——singleton"><span>设计模式之单例模式——Singleton</span></a></h2>
<h3 id="定义" tabindex="-1"><a class="header-anchor" href="#定义"><span>定义</span></a></h3>
<p>确保一个类只有一个实例，并提供一个全局访问方法</p>
<h3 id="单例模式创建方法" tabindex="-1"><a class="header-anchor" href="#单例模式创建方法"><span>单例模式创建方法</span></a></h3>
<ul>
<li>私有化构造器</li>
<li>提供一个静态方法获取实例</li>
</ul>
<h3 id="单例模式实现" tabindex="-1"><a class="header-anchor" href="#单例模式实现"><span>单例模式实现</span></a></h3>
<h4 id="经典的单例模式" tabindex="-1"><a class="header-anchor" href="#经典的单例模式"><span>经典的单例模式</span></a></h4>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">SimpleSingleton</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 静态成员变量</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">SimpleSingleton</span> singleton<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 私有化构造器</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">SimpleSingleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">    静态方法获取实例</span>
<span class="line">    */</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">SimpleSingleton</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">null</span> <span class="token operator">==</span> singleton<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            singleton <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SimpleSingleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token keyword">return</span> singleton<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>此模式是<strong>延迟</strong>实例化对象，在需要获取对象的时候，调用<code v-pre>getInstance()</code>方法来实例化。是通常称为的懒汉式，但此方法还不是最优解。想象一下，在多线程环境中，线程A和线程B同时进入<code v-pre>getInstance()</code>发现singleton为空，这时候有可能创建多个singleton导致JVM中存在不止一个对象。</p>
</li>
<li>
<p>这时候我们自然想到了<code v-pre>synchronized</code>关键字来解决多线程并发导致的问题。</p>
</li>
</ul>
<h4 id="线程安全的单例模式" tabindex="-1"><a class="header-anchor" href="#线程安全的单例模式"><span>线程安全的单例模式</span></a></h4>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">SimpleSingleton</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 静态成员变量</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">SimpleSingleton</span> singleton<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 私有化构造器</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">SimpleSingleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">    加了synchronized关键字的静态方法获取实例</span>
<span class="line">    */</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">synchronized</span> <span class="token class-name">SimpleSingleton</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">null</span> <span class="token operator">==</span> singleton<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            singleton <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SimpleSingleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token keyword">return</span> singleton<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>再想想这种方式的缺点是什么？其实只有第一次实例化对象的时候需要同步，之后的每次调用此方法，synchronized都是个累赘。同步一个方法可能造成程序执行效率下降100倍，如果<code v-pre>getInstance()</code>会频繁调用，那这个方式值得重新考虑。</p>
</li>
<li>
<p>我们考虑<strong>急切</strong>创建实例，而不是<strong>延迟</strong>实例化的做法，即通常所称的饿汉式单例方法。</p>
</li>
</ul>
<h4 id="饿汉式创建单例" tabindex="-1"><a class="header-anchor" href="#饿汉式创建单例"><span>饿汉式创建单例</span></a></h4>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">SimpleSingleton</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * jvm加载初始化此实例</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">SimpleSingleton</span> singleton <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SimpleSingleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 私有化构造器</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">SimpleSingleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">synchronized</span> <span class="token class-name">SimpleSingleton</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> singleton<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>利用这种方法，可以在JVM加载时，立刻创建此实例，这就保证了在任何线程在获取singleton静态变量前，一定先创建此实例。</p>
</li>
<li>
<p>这种方式也有它的缺点，就是不管是否使用该实例，都会初始化，如果此实例开销过大，不必要的创建此实例会造成资源的浪费。</p>
</li>
</ul>
<h4 id="双重检查加锁创建单例" tabindex="-1"><a class="header-anchor" href="#双重检查加锁创建单例"><span><strong>双重检查加锁</strong>创建单例</span></a></h4>
<ul>
<li>在进行双重检查加锁前，先来个错误的示例:</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**错误示例</span>
<span class="line">public class SimpleSingleton <span class="token punctuation">{</span></span>
<span class="line">  </span>
<span class="line">    private static SimpleSingleton singleton;</span>
<span class="line"></span>
<span class="line">    private SimpleSingleton() <span class="token punctuation">{</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    public static synchronized SimpleSingleton getInstance() <span class="token punctuation">{</span></span>
<span class="line">        if (null == singleton)<span class="token punctuation">{</span></span>
<span class="line">            synchronized (SimpleSingleton.class)<span class="token punctuation">{</span></span>
<span class="line">                if (null == singleton)<span class="token punctuation">{</span></span>
<span class="line">                    singleton = new SimpleSingleton();//error</span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        return singleton;</span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span>**/</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning">
<p class="hint-container-title">Warning</p>
<p>错误事例的隐患：
上面代码error部分，实际上可以分解为3步：
1.分配内存空间
2.初始化对象
3.将对象指向刚分配的内存空间</p>
<p>但是有些编译器为了性能问题，可能将第二步和第三步重排序，结果变成了：
1.分配内存空间
2.将对象指向刚分配的内存空间
3.初始化对象</p>
<p>考虑指令重排的情况下，两个线程会发生如下调用：
TIME | Thread A |  Thread B |</p>
<ul>
<li>| :-: | :-: | :-: | -:
T1 | 检查到<code v-pre>singleton</code>为空 |  |
T2 | 获取锁 |  |
T3 | 再次检查到<code v-pre>singleton</code>为空 |  |
T4 | 为<code v-pre>singleton</code>分配内存空间 |  |
T5 | 将<code v-pre>singleton</code>指向内存空间 |  |
T6 |  | 检查到<code v-pre>singleton</code>不为空 |
T7 |  | 访问<code v-pre>singleton</code>（此时对象还未完成初始化） |
T8 | 初始化<code v-pre>singleton</code> |  |</li>
</ul>
<ul>
<li>在这种情况下，T7时刻线程B对singleton的访问，访问的是一个初始化未完成的对象。</li>
<li>使用了volatile关键字后，重排序被禁止，所有的写（write）操作都将发生在读（read）操作之前。</li>
</ul>
</div>
<p><strong>正确的双重检查加锁：</strong></p>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">SimpleSingleton</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * volatile 修饰变量</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">volatile</span> <span class="token keyword">static</span> <span class="token class-name">SimpleSingleton</span> singleton<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 私有化构造器</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">SimpleSingleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">synchronized</span> <span class="token class-name">SimpleSingleton</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">null</span> <span class="token operator">==</span> singleton<span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token comment">//1</span></span>
<span class="line">            <span class="token keyword">synchronized</span> <span class="token punctuation">(</span><span class="token class-name">SimpleSingleton</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">                <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">null</span> <span class="token operator">==</span> singleton<span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token comment">//2.</span></span>
<span class="line">                    singleton <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SimpleSingleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token keyword">return</span> singleton<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>双重检查锁（double checked locking）运行的逻辑：线程A和线程B同时进入了步骤1，这时候线程A获取了锁，创建了对象。线程B等待之后获取锁，进入步骤2,发现实例已不为null,返回。</p>
</li>
<li>
<p>volatile 关键字确保singleton被初始化成SimpleSingleton实例时，多个线程正确的处理singleton变量。（保持内存可见性和防止指令重排序）</p>
</li>
</ul>
<h3 id="单例模式和静态类的对比" tabindex="-1"><a class="header-anchor" href="#单例模式和静态类的对比"><span>单例模式和静态类的对比</span></a></h3>
<p>单例模式和静态类都能确保JVM中只存在一个对象，那他们的区别是什么。</p>
<ul>
<li>首先单例模式会提供给你一个全局唯一的对象，静态类只是提供给你很多静态方法，这些方法不用创建对象，通过类就可以直接调用</li>
<li>如果是一个非常重的对象，单例模式可以懒加载，静态类就无法做到</li>
</ul>
</div></template>


