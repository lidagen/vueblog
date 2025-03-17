<template><div><h2 id="设计模式之观察者模式——observer" tabindex="-1"><a class="header-anchor" href="#设计模式之观察者模式——observer"><span>设计模式之观察者模式——Observer</span></a></h2>
<h3 id="定义" tabindex="-1"><a class="header-anchor" href="#定义"><span>定义</span></a></h3>
<ul>
<li>观察者模式（又被称为发布-订阅（Publish/Subscribe）模式，属于行为型模式的一种，它定义了一种一对多的依赖关系，让多个观察者对象同时监听某一个主题对象。这个主题对象在状态变化时，会通知所有的观察者对象，使他们能够自动更新自己</li>
</ul>
<h3 id="使用场景" tabindex="-1"><a class="header-anchor" href="#使用场景"><span>使用场景</span></a></h3>
<ul>
<li>关联行为场景，需要注意的是，关联行为是可拆分的，而不是“组合”关系。</li>
<li>事件多级触发场景。</li>
<li>跨系统的消息交换场景，如消息队列、事件总线的处理机制。</li>
</ul>
<h3 id="优缺点" tabindex="-1"><a class="header-anchor" href="#优缺点"><span>优缺点</span></a></h3>
<ul>
<li>优点：解除耦合，让耦合的双方都依赖于抽象，从而使得各自的变换都不会影响另一边的变换。</li>
<li>缺点：在应用观察者模式时需要考虑一下开发效率和运行效率的问题，程序中包括一个被观察者、多个观察者，开发、调试等内容会比较复杂，而且在Java中消息的通知一般是顺序执行，那么一个观察者卡顿，会影响整体的执行效率，在这种情况下，一般会采用异步实现。</li>
</ul>
<h3 id="组件" tabindex="-1"><a class="header-anchor" href="#组件"><span>组件</span></a></h3>
<p>观察者模式中有如下角色</p>
<ul>
<li>Subject：抽象主题（抽象被观察者），抽象主题角色把所有观察者对象保存在一个集合里，每个主题都可以有任意数量的观察者，抽象主题提供一个接口，可以增加和删除观察者对象。</li>
<li>ConcreteSubject：具体主题（具体被观察者），该角色将有关状态存入具体观察者对象，在具体主题的内部状态发生改变时，给所有注册过的观察者发送通知。</li>
<li>Observer： 抽象观察者，是观察者者的抽象类，它定义了一个更新接口，使得在得到主题更改通知时更新自己。</li>
<li>ConcrereObserver： 具体观察者，实现抽象观察者定义的更新接口，以便在得到主题更改通知时更新自身的状态。</li>
</ul>
<h3 id="观察者模式的简单实现" tabindex="-1"><a class="header-anchor" href="#观察者模式的简单实现"><span>观察者模式的简单实现</span></a></h3>
<ul>
<li>抽象观察者（Observer）</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">// 定义一个更新方法</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">Observer</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">update</span><span class="token punctuation">(</span><span class="token class-name">String</span> message<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>具体观察者（ConcrereObserver）</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">WeixinUser</span> <span class="token keyword">implements</span> <span class="token class-name">Observer</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// 微信用户名</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> name<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">WeixinUser</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">update</span><span class="token punctuation">(</span><span class="token class-name">String</span> message<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>name <span class="token operator">+</span> <span class="token string">"-"</span> <span class="token operator">+</span> message<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>抽象被观察者（Subject）</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//抽象主题，提供了attach、detach、notify三个方法：</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">Subject</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 增加订阅者</span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">observer</span></span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">attach</span><span class="token punctuation">(</span><span class="token class-name">Observer</span> observer<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 删除订阅者</span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">observer</span></span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">detach</span><span class="token punctuation">(</span><span class="token class-name">Observer</span> observer<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 通知订阅者更新消息</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">notify</span><span class="token punctuation">(</span><span class="token class-name">String</span> message<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>具体被观察者（ConcreteSubject）</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">SubscriptionSubject</span> <span class="token keyword">implements</span> <span class="token class-name">Subject</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">//储存订阅公众号的微信用户</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Observer</span><span class="token punctuation">></span></span> weixinUserlist <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Observer</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">attach</span><span class="token punctuation">(</span><span class="token class-name">Observer</span> observer<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        weixinUserlist<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>observer<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">detach</span><span class="token punctuation">(</span><span class="token class-name">Observer</span> observer<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        weixinUserlist<span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span>observer<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">notify</span><span class="token punctuation">(</span><span class="token class-name">String</span> message<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Observer</span> observer <span class="token operator">:</span> weixinUserlist<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            observer<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>调用</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Client</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">SubscriptionSubject</span> mSubscriptionSubject<span class="token operator">=</span><span class="token keyword">new</span> <span class="token class-name">SubscriptionSubject</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">//创建微信用户</span></span>
<span class="line">        <span class="token class-name">WeixinUser</span> user1<span class="token operator">=</span><span class="token keyword">new</span> <span class="token class-name">WeixinUser</span><span class="token punctuation">(</span><span class="token string">"A"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">WeixinUser</span> user2<span class="token operator">=</span><span class="token keyword">new</span> <span class="token class-name">WeixinUser</span><span class="token punctuation">(</span><span class="token string">"B"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">WeixinUser</span> user3<span class="token operator">=</span><span class="token keyword">new</span> <span class="token class-name">WeixinUser</span><span class="token punctuation">(</span><span class="token string">"C"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">//订阅公众号</span></span>
<span class="line">        mSubscriptionSubject<span class="token punctuation">.</span><span class="token function">attach</span><span class="token punctuation">(</span>user1<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        mSubscriptionSubject<span class="token punctuation">.</span><span class="token function">attach</span><span class="token punctuation">(</span>user2<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        mSubscriptionSubject<span class="token punctuation">.</span><span class="token function">attach</span><span class="token punctuation">(</span>user3<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">//公众号更新发出消息给订阅的微信用户</span></span>
<span class="line">        mSubscriptionSubject<span class="token punctuation">.</span><span class="token function">notify</span><span class="token punctuation">(</span><span class="token string">"数据更新了"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


